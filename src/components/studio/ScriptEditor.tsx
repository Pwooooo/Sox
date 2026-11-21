import { useRef, useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Code2, Box } from 'lucide-react'
import type { NvloInstanceData } from '@engine/index'

interface ScriptEditorProps {
  scriptNode: NvloInstanceData
  onChangeSource: (id: string, nextSource: string) => void
  onRunScript?: (scriptNode: NvloInstanceData) => void
  onSaveProject?: () => void
}

interface CompletionItem {
  label: string
  kind: 'function' | 'keyword' | 'class' | 'service' | 'property'
  signature: string
  description: string
  example?: string
}

const LUAU_COMPLETIONS: CompletionItem[] = [
  {
    label: 'print',
    kind: 'function',
    signature: 'print(...: any): ()',
    description: 'Receives any number of arguments and prints their values to the Output / Diagnostics window.',
    example: 'print("Hello world!", 42)',
  },
  {
    label: 'warn',
    kind: 'function',
    signature: 'warn(...: any): ()',
    description: 'Behaves like print, except the output is formatted as a warning.',
    example: 'warn("Low health!")',
  },
  {
    label: 'error',
    kind: 'function',
    signature: 'error(message: any, level: number?): never',
    description: 'Terminates the last protected function called and outputs message as an error.',
    example: 'error("Invalid state")',
  },
  {
    label: 'pairs',
    kind: 'function',
    signature: 'pairs(t: { [K]: V }): (({ [K]: V }, K?) -> (K?, V), { [K]: V }, nil)',
    description: 'Returns an iterator function and the provided table for use in a for loop.',
    example: 'for k, v in pairs(myTable) do\n  print(k, v)\nend',
  },
  {
    label: 'ipairs',
    kind: 'function',
    signature: 'ipairs(t: { V }): (({ V }, number) -> (number?, V), { V }, number)',
    description: 'Returns an iterator function, the table t, and 0 for iterating array indices.',
    example: 'for i, v in ipairs(items) do\n  print(i, v)\nend',
  },
  {
    label: 'pcall',
    kind: 'function',
    signature: 'pcall(f: (...any) -> ...any, ...: any): (boolean, ...any)',
    description: 'Calls function f with the given arguments in protected mode.',
    example: 'local ok, err = pcall(function()\n  print("safe")\nend)',
  },
  {
    label: 'task.wait',
    kind: 'function',
    signature: 'task.wait(duration: number?): number',
    description: 'Yields the current thread until the specified duration (in seconds) has elapsed.',
    example: 'task.wait(1)\nprint("1 second passed")',
  },
  {
    label: 'task.spawn',
    kind: 'function',
    signature: 'task.spawn(fn: (...any) -> ...any, ...: any): thread',
    description: 'Calls/resumes a function immediately in a separate thread.',
    example: 'task.spawn(function()\n  task.wait(2)\n  print("Async!")\nend)',
  },
  {
    label: 'task.delay',
    kind: 'function',
    signature: 'task.delay(duration: number, fn: (...any) -> ...any, ...: any): thread',
    description: 'Schedules a function to be called after duration seconds.',
    example: 'task.delay(1.5, function()\n  print("Delayed!")\nend)',
  },
  {
    label: 'game',
    kind: 'service',
    signature: 'game: DataModel',
    description: 'The root DataModel representing the running Novelo place.',
    example: 'local ws = game:GetService("Workspace")',
  },
  {
    label: 'workspace',
    kind: 'service',
    signature: 'workspace: Workspace',
    description: 'Shortcut reference to the Workspace service containing 3D world objects.',
    example: 'local part = workspace:FindFirstChild("Part")',
  },
  {
    label: 'script',
    kind: 'property',
    signature: 'script: Script | LocalScript | ModuleScript',
    description: 'Reference to the currently executing script instance.',
    example: 'print(script.Name, script.Parent)',
  },
  {
    label: 'Instance.new',
    kind: 'function',
    signature: 'Instance.new(className: string, parent: Instance?): Instance',
    description: 'Creates a new Instance of the specified class and optionally parents it.',
    example: 'local p = Instance.new("Part", workspace)\np.Position = Vector3.new(0, 10, 0)',
  },
  {
    label: 'Vector3.new',
    kind: 'function',
    signature: 'Vector3.new(x: number?, y: number?, z: number?): Vector3',
    description: 'Creates a new 3D vector with the given X, Y, and Z components.',
    example: 'part.Position = Vector3.new(0, 5, 0)',
  },
  {
    label: 'Color3.fromRGB',
    kind: 'function',
    signature: 'Color3.fromRGB(r: number, g: number, b: number): Color3',
    description: 'Creates a Color3 from 0-255 RGB channel values.',
    example: 'part.Color = Color3.fromRGB(255, 80, 80)',
  },
  {
    label: 'RunService',
    kind: 'service',
    signature: 'game:GetService("RunService"): RunService',
    description: 'Provides per-frame simulation events such as Heartbeat and RenderStepped.',
    example: 'game:GetService("RunService").Heartbeat:Connect(function(dt)\n  -- per frame\nend)',
  },
  {
    label: 'Players',
    kind: 'service',
    signature: 'game:GetService("Players"): Players',
    description: 'Service containing connected player instances.',
    example: 'local Players = game:GetService("Players")\nprint(Players.LocalPlayer.Name)',
  },
  {
    label: 'Part',
    kind: 'class',
    signature: 'class Part : BasePart',
    description: 'A physical 3D primitive block/sphere/wedge/cylinder in Workspace.',
    example: 'local p = Instance.new("Part")\np.Size = Vector3.new(4, 2, 4)',
  },
  {
    label: 'local',
    kind: 'keyword',
    signature: 'keyword local',
    description: 'Declares a lexically scoped local variable or function.',
    example: 'local speed = 16',
  },
  {
    label: 'function',
    kind: 'keyword',
    signature: 'keyword function',
    description: 'Defines a callable Luau function.',
    example: 'local function greet(name)\n  print("Hi " .. name)\nend',
  },
  {
    label: 'for',
    kind: 'keyword',
    signature: 'keyword for',
    description: 'Starts a numeric or generic iterator loop.',
    example: 'for i = 1, 5 do\n  print(i)\nend',
  },
  {
    label: 'while',
    kind: 'keyword',
    signature: 'keyword while',
    description: 'Repeats a block while the condition evaluates to true.',
    example: 'while true do\n  task.wait(1)\nend',
  },
]

const LUAU_KEYWORDS = new Set([
  'local',
  'function',
  'if',
  'then',
  'elseif',
  'else',
  'end',
  'for',
  'in',
  'do',
  'while',
  'repeat',
  'until',
  'return',
  'break',
  'continue',
  'and',
  'or',
  'not',
  'true',
  'false',
  'nil',
])

const LUAU_BUILTINS = new Set([
  'print',
  'warn',
  'error',
  'pairs',
  'ipairs',
  'pcall',
  'tostring',
  'tonumber',
  'type',
  'typeof',
  'require',
  'wait',
  'task',
  'game',
  'workspace',
  'Workspace',
  'script',
  'Instance',
  'Vector3',
  'Color3',
  'RunService',
  'Players',
  'math',
  'string',
  'table',
])

function highlightLuauLine(line: string) {
  const parts: { text: string; cls: string }[] = []
  let i = 0

  while (i < line.length) {
    if (line.startsWith('--', i)) {
      parts.push({ text: line.slice(i), cls: 'text-[#6a9955]' })
      break
    }
    const ch = line[i]
    if (ch === '"' || ch === "'") {
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2
          continue
        }
        if (line[j] === ch) {
          j += 1
          break
        }
        j += 1
      }
      parts.push({ text: line.slice(i, j), cls: 'text-[#ce9178]' })
      i = j
      continue
    }
    if (/\d/.test(ch)) {
      let j = i + 1
      while (j < line.length && /[\d.]/.test(line[j])) j += 1
      parts.push({ text: line.slice(i, j), cls: 'text-[#b5cea8]' })
      i = j
      continue
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j += 1
      const word = line.slice(i, j)
      if (LUAU_KEYWORDS.has(word)) {
        parts.push({ text: word, cls: 'text-[#f472b6] font-semibold' })
      } else if (LUAU_BUILTINS.has(word)) {
        parts.push({ text: word, cls: 'text-[#60a5fa]' })
      } else {
        parts.push({ text: word, cls: 'text-[#e4e4e7]' })
      }
      i = j
      continue
    }
    parts.push({ text: ch, cls: 'text-[#d4d4d4]' })
    i += 1
  }

  return parts
}

export function ScriptEditor({
  scriptNode,
  onChangeSource,
  onSaveProject,
}: ScriptEditorProps) {
  const source = String(scriptNode.properties.Source ?? '')
  const lines = source.split('\n')
  const [cursorLine, setCursorLine] = useState(1)
  const [cursorCol, setCursorCol] = useState(1)
  const [acDismissed, setAcDismissed] = useState(false)
  const [acIndex, setAcIndex] = useState(0)
  const [showExample, setShowExample] = useState(false)

  const gutterRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const syncScroll = () => {
    if (!textareaRef.current) return
    const { scrollTop, scrollLeft } = textareaRef.current
    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop
      preRef.current.scrollLeft = scrollLeft
    }
  }

  const updateCursor = () => {
    const el = textareaRef.current
    if (!el) return
    const before = el.value.slice(0, el.selectionStart)
    const split = before.split('\n')
    setCursorLine(split.length)
    setCursorCol(split[split.length - 1].length + 1)
  }

  // Compute current word prefix before cursor for autocomplete
  const wordMatch = useMemo(() => {
    const el = textareaRef.current
    const pos = el?.selectionStart ?? source.length
    const before = source.slice(0, pos)
    const m = before.match(/([A-Za-z_][A-Za-z0-9_.]*)$/)
    return m ? { prefix: m[1], start: pos - m[1].length, end: pos } : null
  }, [source, cursorLine, cursorCol])

  const suggestions = useMemo(() => {
    if (acDismissed || !wordMatch || wordMatch.prefix.length < 1) return []
    const q = wordMatch.prefix.toLowerCase()
    return LUAU_COMPLETIONS.filter((item) => item.label.toLowerCase().startsWith(q)).slice(0, 8)
  }, [acDismissed, wordMatch])

  const safeAcIndex = Math.min(acIndex, Math.max(0, suggestions.length - 1))
  const activeSuggestion = suggestions[safeAcIndex] || null

  const applyCompletion = (item: CompletionItem) => {
    if (!wordMatch || !textareaRef.current) return
    const next =
      source.slice(0, wordMatch.start) + item.label + source.slice(wordMatch.end)
    onChangeSource(scriptNode.id, next)
    setAcDismissed(true)
    const nextPos = wordMatch.start + item.label.length
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = nextPos
        updateCursor()
      }
    })
  }

  // Approximate caret position for autocomplete popup
  const popupTop = cursorLine * 20 + 12 - (textareaRef.current?.scrollTop ?? 0)
  const popupLeft = Math.min(520, Math.max(54, 48 + (cursorCol - (wordMatch?.prefix.length ?? 0)) * 7.2))

  return (
    <div className="flex-1 bg-[#1b1c20] flex overflow-hidden relative font-mono text-[12px]">
      {/* Line Numbers Gutter */}
      <div
        ref={gutterRef}
        className="w-12 py-2.5 pr-3 bg-[#18191d] border-r border-white/[0.06] text-right text-[11px] leading-[20px] text-white/35 select-none overflow-hidden shrink-0"
      >
        {lines.map((_, idx) => (
          <div
            key={idx}
            className={cursorLine === idx + 1 ? 'text-white/80 font-semibold' : undefined}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {/* Code Area: Highlighted Pre + Transparent Textarea */}
      <div className="flex-1 relative overflow-hidden">
        {/* Active line highlight */}
        <div
          style={{ top: (cursorLine - 1) * 20 + 10 - (textareaRef.current?.scrollTop ?? 0) }}
          className="absolute left-0 right-0 h-[20px] bg-white/[0.04] pointer-events-none"
        />

        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 m-0 py-2.5 px-3 font-mono text-[12px] leading-[20px] whitespace-pre overflow-hidden pointer-events-none"
        >
          {lines.map((line, idx) => (
            <div key={idx} className="min-h-[20px]">
              {line.length === 0
                ? ' '
                : highlightLuauLine(line).map((part, pIdx) => (
                    <span key={pIdx} className={part.cls}>
                      {part.text}
                    </span>
                  ))}
            </div>
          ))}
        </pre>

        <textarea
          ref={textareaRef}
          value={source}
          spellCheck={false}
          onScroll={syncScroll}
          onClick={() => {
            setAcDismissed(true)
            updateCursor()
          }}
          onKeyUp={(e) => {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'Escape') {
              updateCursor()
            }
          }}
          onChange={(e) => {
            setAcDismissed(false)
            setAcIndex(0)
            onChangeSource(scriptNode.id, e.target.value)
            updateCursor()
          }}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (suggestions.length > 0) {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setAcIndex((i) => (i + 1) % suggestions.length)
                return
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setAcIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
                return
              }
              if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault()
                if (activeSuggestion) applyCompletion(activeSuggestion)
                return
              }
              if (e.key === 'Escape') {
                e.preventDefault()
                setAcDismissed(true)
                return
              }
            }

            if (e.key === 'Tab') {
              e.preventDefault()
              const el = e.currentTarget
              const start = el.selectionStart
              const end = el.selectionEnd
              const next = source.slice(0, start) + '  ' + source.slice(end)
              onChangeSource(scriptNode.id, next)
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = start + 2
                updateCursor()
              })
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
              e.preventDefault()
              onSaveProject?.()
            }
          }}
          className="absolute inset-0 w-full h-full py-2.5 px-3 bg-transparent border-none text-transparent caret-white font-mono text-[12px] leading-[20px] resize-none focus:outline-none overflow-auto select-text whitespace-pre"
        />

        {/* Autocomplete + Documentation Popup */}
        {suggestions.length > 0 && activeSuggestion && (
          <div
            style={{ top: Math.max(8, popupTop), left: popupLeft }}
            className="absolute z-40 flex items-start shadow-2xl pointer-events-auto"
          >
            {/* Left: Suggestions List */}
            <div className="w-44 bg-[#18191d] border border-white/15 rounded-l-[4px] py-0.5 flex flex-col">
              {suggestions.map((item, idx) => {
                const isSelected = idx === safeAcIndex
                return (
                  <button
                    key={item.label}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      applyCompletion(item)
                    }}
                    className={`h-[22px] px-2 flex items-center gap-1.5 text-left text-[11px] font-mono border-none cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 text-white'
                        : 'bg-transparent text-white/80 hover:bg-white/[0.07]'
                    }`}
                  >
                    {item.kind === 'class' ? (
                      <Box className="size-3 text-[#60a5fa] shrink-0" />
                    ) : (
                      <Code2 className="size-3 text-[#c084fc] shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Right: Documentation & Example Panel */}
            <div className="w-80 bg-[#18191d] border border-l-0 border-white/15 rounded-r-[4px] p-2.5 flex flex-col gap-1.5 text-[11px] font-sans">
              <div className="font-mono text-[11px] text-white/95 border-b border-white/10 pb-1.5 break-words">
                {activeSuggestion.signature}
              </div>
              <div className="text-white/75 leading-relaxed">
                {activeSuggestion.description}
              </div>
              {activeSuggestion.example && (
                <div className="flex flex-col gap-1 pt-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      setShowExample((v) => !v)
                    }}
                    className="flex items-center gap-1 text-white/80 hover:text-white bg-transparent border-none p-0 cursor-pointer text-[11px] w-fit"
                  >
                    {showExample ? (
                      <ChevronDown className="size-3" />
                    ) : (
                      <ChevronRight className="size-3" />
                    )}
                    <span>Show Code Example</span>
                  </button>
                  {showExample && (
                    <pre className="m-0 p-2 rounded bg-black/40 border border-white/10 font-mono text-[10px] text-white/85 overflow-x-auto">
                      {activeSuggestion.example}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
