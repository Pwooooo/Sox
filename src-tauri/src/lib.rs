use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};
use std::sync::Mutex;
use tauri::{Emitter, Manager, State};

struct CursorLockState {
    locked: AtomicBool,
    raw_dx: AtomicI32,
    raw_dy: AtomicI32,
    init_once: Mutex<bool>,
}

struct LaunchDeepLinkState(Mutex<Option<String>>);

#[tauri::command]
fn get_launch_deep_link(state: State<LaunchDeepLinkState>) -> Option<String> {
    state.0.lock().ok().and_then(|mut g| g.take())
}

#[cfg(target_os = "windows")]
fn register_novelo_protocol() {
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;
    let Ok(exe_path) = std::env::current_exe() else {
        return;
    };
    let exe_str = exe_path.to_string_lossy();
    let cmd_value = format!("\"{}\" \"%1\"", exe_str);
    let _ = std::process::Command::new("reg")
        .args([
            "add",
            "HKCU\\Software\\Classes\\novelo",
            "/ve",
            "/t",
            "REG_SZ",
            "/d",
            "URL:Novelo Protocol",
            "/f",
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .status();
    let _ = std::process::Command::new("reg")
        .args([
            "add",
            "HKCU\\Software\\Classes\\novelo",
            "/v",
            "URL Protocol",
            "/t",
            "REG_SZ",
            "/d",
            "",
            "/f",
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .status();
    let _ = std::process::Command::new("reg")
        .args([
            "add",
            "HKCU\\Software\\Classes\\novelo\\shell\\open\\command",
            "/ve",
            "/t",
            "REG_SZ",
            "/d",
            &cmd_value,
            "/f",
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .status();
}

#[cfg(target_os = "windows")]
mod win32 {
    use std::ffi::c_void;
    use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};

    #[repr(C)]
    #[derive(Default)]
    pub struct POINT {
        pub x: i32,
        pub y: i32,
    }

    #[repr(C)]
    #[derive(Default)]
    pub struct RECT {
        pub left: i32,
        pub top: i32,
        pub right: i32,
        pub bottom: i32,
    }

    #[repr(C)]
    pub struct WNDCLASSW {
        pub style: u32,
        pub lpfn_wnd_proc: extern "system" fn(isize, u32, usize, isize) -> isize,
        pub cb_cls_extra: i32,
        pub cb_wnd_extra: i32,
        pub h_instance: isize,
        pub h_icon: isize,
        pub h_cursor: isize,
        pub hbr_background: isize,
        pub lpsz_menu_name: *const u16,
        pub lpsz_class_name: *const u16,
    }

    #[repr(C)]
    #[derive(Default)]
    pub struct MSG {
        pub hwnd: isize,
        pub message: u32,
        pub w_param: usize,
        pub l_param: isize,
        pub time: u32,
        pub pt: POINT,
    }

    #[repr(C)]
    pub struct RAWINPUTDEVICE {
        pub us_usage_page: u16,
        pub us_usage: u16,
        pub dw_flags: u32,
        pub hwnd_target: isize,
    }

    #[repr(C)]
    #[derive(Default)]
    pub struct RAWINPUTHEADER {
        pub dw_type: u32,
        pub dw_size: u32,
        pub h_device: isize,
        pub w_param: usize,
    }

    #[repr(C)]
    #[derive(Default)]
    pub struct RAWMOUSE {
        pub us_flags: u16,
        pub us_button_flags: u16,
        pub us_button_data: u16,
        pub ul_raw_buttons: u32,
        pub l_last_x: i32,
        pub l_last_y: i32,
        pub ul_extra_information: u32,
    }

    #[repr(C)]
    #[derive(Default)]
    pub struct RAWINPUT {
        pub header: RAWINPUTHEADER,
        pub mouse: RAWMOUSE,
    }

    pub const WM_INPUT: u32 = 0x00FF;
    pub const RID_INPUT: u32 = 0x10000003;
    pub const RIDEV_INPUTSINK: u32 = 0x00000100;
    pub const RIM_TYPEMOUSE: u32 = 0;
    pub const MOUSE_MOVE_ABSOLUTE: u16 = 0x01;
    pub const HWND_MESSAGE: isize = -3;

    #[link(name = "user32")]
    unsafe extern "system" {
        pub fn GetCursorPos(lp_point: *mut POINT) -> i32;
        pub fn ClipCursor(lp_rect: *const RECT) -> i32;
        pub fn RegisterClassW(wc: *const WNDCLASSW) -> u16;
        pub fn CreateWindowExW(
            ex_style: u32,
            class_name: *const u16,
            window_name: *const u16,
            style: u32,
            x: i32,
            y: i32,
            w: i32,
            h: i32,
            parent: isize,
            menu: isize,
            instance: isize,
            param: *mut c_void,
        ) -> isize;
        pub fn DefWindowProcW(hwnd: isize, msg: u32, wp: usize, lp: isize) -> isize;
        pub fn GetMessageW(msg: *mut MSG, hwnd: isize, min: u32, max: u32) -> i32;
        pub fn TranslateMessage(msg: *const MSG) -> i32;
        pub fn DispatchMessageW(msg: *const MSG) -> isize;
        pub fn RegisterRawInputDevices(devs: *const RAWINPUTDEVICE, num: u32, size: u32) -> i32;
        pub fn GetRawInputData(
            h_raw_input: isize,
            ui_command: u32,
            p_data: *mut c_void,
            pcb_size: *mut u32,
            cb_size_header: u32,
        ) -> u32;
    }

    static mut LOCKED_PTR: *const AtomicBool = std::ptr::null();
    static mut DX_PTR: *const AtomicI32 = std::ptr::null();
    static mut DY_PTR: *const AtomicI32 = std::ptr::null();

    extern "system" fn raw_wnd_proc(hwnd: isize, msg: u32, wp: usize, lp: isize) -> isize {
        unsafe {
            if msg == WM_INPUT && !LOCKED_PTR.is_null() && (*LOCKED_PTR).load(Ordering::Relaxed) {
                let mut size: u32 = std::mem::size_of::<RAWINPUT>() as u32;
                let mut raw = RAWINPUT::default();
                let res = GetRawInputData(
                    lp,
                    RID_INPUT,
                    &mut raw as *mut RAWINPUT as *mut c_void,
                    &mut size,
                    std::mem::size_of::<RAWINPUTHEADER>() as u32,
                );
                if res != u32::MAX
                    && raw.header.dw_type == RIM_TYPEMOUSE
                    && (raw.mouse.us_flags & MOUSE_MOVE_ABSOLUTE) == 0
                {
                    (*DX_PTR).fetch_add(raw.mouse.l_last_x, Ordering::Relaxed);
                    (*DY_PTR).fetch_add(raw.mouse.l_last_y, Ordering::Relaxed);
                }
            }
            DefWindowProcW(hwnd, msg, wp, lp)
        }
    }

    pub fn start_raw_input_thread(
        locked: &'static AtomicBool,
        dx: &'static AtomicI32,
        dy: &'static AtomicI32,
    ) {
        unsafe {
            LOCKED_PTR = locked as *const AtomicBool;
            DX_PTR = dx as *const AtomicI32;
            DY_PTR = dy as *const AtomicI32;
        }
        std::thread::spawn(|| unsafe {
            let class_name: Vec<u16> = "NoveloRawMouse\0".encode_utf16().collect();
            let wc = WNDCLASSW {
                style: 0,
                lpfn_wnd_proc: raw_wnd_proc,
                cb_cls_extra: 0,
                cb_wnd_extra: 0,
                h_instance: 0,
                h_icon: 0,
                h_cursor: 0,
                hbr_background: 0,
                lpsz_menu_name: std::ptr::null(),
                lpsz_class_name: class_name.as_ptr(),
            };
            RegisterClassW(&wc);
            let hwnd = CreateWindowExW(
                0,
                class_name.as_ptr(),
                class_name.as_ptr(),
                0,
                0,
                0,
                0,
                0,
                HWND_MESSAGE,
                0,
                0,
                std::ptr::null_mut(),
            );
            if hwnd == 0 {
                return;
            }
            let rid = RAWINPUTDEVICE {
                us_usage_page: 0x01,
                us_usage: 0x02,
                dw_flags: RIDEV_INPUTSINK,
                hwnd_target: hwnd,
            };
            RegisterRawInputDevices(&rid, 1, std::mem::size_of::<RAWINPUTDEVICE>() as u32);
            let mut msg = MSG::default();
            while GetMessageW(&mut msg, 0, 0, 0) > 0 {
                TranslateMessage(&msg);
                DispatchMessageW(&msg);
            }
        });
    }

    pub fn clip_to_current_pos() -> bool {
        let mut pt = POINT::default();
        unsafe {
            if GetCursorPos(&mut pt) != 0 {
                let r = RECT {
                    left: pt.x,
                    top: pt.y,
                    right: pt.x + 1,
                    bottom: pt.y + 1,
                };
                return ClipCursor(&r) != 0;
            }
        }
        false
    }

    pub fn unclip() {
        unsafe {
            ClipCursor(std::ptr::null());
        }
    }
}

#[tauri::command]
fn begin_cursor_lock(state: State<'_, CursorLockState>) -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        let mut init = state.init_once.lock().map_err(|e| e.to_string())?;
        if !*init {
            *init = true;
            let locked_ref: &'static AtomicBool = unsafe { &*(&state.locked as *const AtomicBool) };
            let dx_ref: &'static AtomicI32 = unsafe { &*(&state.raw_dx as *const AtomicI32) };
            let dy_ref: &'static AtomicI32 = unsafe { &*(&state.raw_dy as *const AtomicI32) };
            win32::start_raw_input_thread(locked_ref, dx_ref, dy_ref);
        }
        state.raw_dx.store(0, Ordering::Relaxed);
        state.raw_dy.store(0, Ordering::Relaxed);
        state.locked.store(true, Ordering::Relaxed);
        return Ok(win32::clip_to_current_pos());
    }
    #[cfg(not(target_os = "windows"))]
    Ok(false)
}

#[tauri::command]
fn poll_cursor_delta(state: State<'_, CursorLockState>) -> Result<(i32, i32), String> {
    let dx = state.raw_dx.swap(0, Ordering::Relaxed);
    let dy = state.raw_dy.swap(0, Ordering::Relaxed);
    Ok((dx, dy))
}

#[tauri::command]
fn end_cursor_lock(state: State<'_, CursorLockState>) -> Result<(), String> {
    state.locked.store(false, Ordering::Relaxed);
    state.raw_dx.store(0, Ordering::Relaxed);
    state.raw_dy.store(0, Ordering::Relaxed);
    #[cfg(target_os = "windows")]
    win32::unclip();
    Ok(())
}

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("rundll32")
            .args(["url.dll,FileProtocolHandler", &url])
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = url;
    }
    Ok(())
}

fn studio_projects_path() -> std::path::PathBuf {
    let base = std::env::var_os("APPDATA")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(std::env::temp_dir);
    base.join("Novelo").join("studio_projects.json")
}

#[tauri::command]
fn save_studio_projects(json: String) -> Result<(), String> {
    let path = studio_projects_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    std::fs::write(&path, json).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_studio_projects() -> Result<String, String> {
    let path = studio_projects_path();
    if !path.exists() {
        return Ok("[]".to_string());
    }
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

fn shared_avatar_path() -> std::path::PathBuf {
    let base = std::env::var_os("APPDATA")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(std::env::temp_dir);
    base.join("Novelo").join("shared_avatar.json")
}

#[tauri::command]
fn save_shared_avatar(json: String) -> Result<(), String> {
    let path = shared_avatar_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    std::fs::write(&path, json).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_shared_avatar() -> Result<String, String> {
    let path = shared_avatar_path();
    if !path.exists() {
        return Ok("{}".to_string());
    }
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let initial_deep_link = std::env::args()
        .skip(1)
        .find(|a| a.starts_with("novelo://"));

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            if let Some(deep_link) = args.into_iter().find(|a| a.starts_with("novelo://")) {
                let _ = app.emit("novelo-deep-link", deep_link);
            }
        }))
        .manage(CursorLockState {
            locked: AtomicBool::new(false),
            raw_dx: AtomicI32::new(0),
            raw_dy: AtomicI32::new(0),
            init_once: Mutex::new(false),
        })
        .manage(LaunchDeepLinkState(Mutex::new(initial_deep_link)))
        .invoke_handler(tauri::generate_handler![
            begin_cursor_lock,
            poll_cursor_delta,
            end_cursor_lock,
            open_external_url,
            save_studio_projects,
            load_studio_projects,
            save_shared_avatar,
            load_shared_avatar,
            get_launch_deep_link
        ])
        .setup(|app| {
            #[cfg(target_os = "windows")]
            {
                if app.package_info().name == "NoveloPlayer" {
                    register_novelo_protocol();
                }
            }
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            if let Some(window) = app.get_webview_window("main") {
                let icon = tauri::include_image!("icons/icon.png");
                let _ = window.set_icon(icon);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
