<#
.SYNOPSIS
    Automated build & setup script for Lyra (LLVM IR Obfuscator for Rust) on Windows.
.DESCRIPTION
    Builds Hakai Security's Lyra and obfuscates the Novelo Tauri backend binary.
#>

param(
    [switch]$BuildLyra = $false,
    [switch]$Obfuscate = $false
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir
$LyraDir = Join-Path $RootDir "lyra"

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " Novelo - Lyra Rust Backend Obfuscator " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

if (-not (Test-Path $LyraDir)) {
    Write-Host "[*] Cloning Lyra repository..." -ForegroundColor Yellow
    git clone https://github.com/hakaioffsec/lyra.git $LyraDir
}

$LLVMPrefix = $env:LLVM_SYS_221_PREFIX
if (-not $LLVMPrefix) {
    $LocalLLVM = Join-Path $LyraDir "llvm-project-22\build"
    if (Test-Path $LocalLLVM) {
        $env:LLVM_SYS_221_PREFIX = $LocalLLVM
        $LLVMPrefix = $LocalLLVM
    }
}

if (-not $LLVMPrefix -or -not (Test-Path $LLVMPrefix)) {
    Write-Host "`n[!] LLVM 22 is required to compile Lyra." -ForegroundColor Yellow
    Write-Host "To set up LLVM 22 on Windows:" -ForegroundColor White
    Write-Host "  1. Download: clang+llvm-22.1.4-x86_64-pc-windows-msvc.tar.xz from LLVM Project releases"
    Write-Host "  2. Extract it into: $LyraDir\llvm-project-22\build"
    Write-Host "  3. Create an empty file at: $LyraDir\llvm-project-22\build\lib\xml2s.lib"
    Write-Host "  4. Set: `$env:LLVM_SYS_221_PREFIX = '$LyraDir\llvm-project-22\build'"
    Write-Host "  5. Run: cd lyra; cargo build --release`n"
}

$LyraBin = Join-Path $LyraDir "target\release\lyra.exe"

if (Test-Path $LyraBin) {
    Write-Host "[+] Lyra binaries found at: $LyraBin" -ForegroundColor Green
    
    if ($Obfuscate) {
        Write-Host "[*] Obfuscating NoveloPlayer Rust backend..." -ForegroundColor Cyan
        & $LyraBin --project (Join-Path $RootDir "src-tauri") `
                   --output (Join-Path $RootDir "NoveloApp\NoveloPlayer.exe") `
                   --target "x86_64-pc-windows-msvc" `
                   --string-enc `
                   --shuffle-blocks `
                   --indirect-branch `
                   --mba
        Write-Host "[+] Backend obfuscation completed successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "[-] Lyra binary not yet compiled. Follow the instructions above once LLVM 22 is staged." -ForegroundColor Gray
}
