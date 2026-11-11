import { useState } from 'react'
import { Send, Search, Image as ImageIcon, Smile, MoreVertical, Circle } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  text: string
  time: string
  isMe: boolean
}

interface Conversation {
  id: string
  name: string
  avatarColor: string
  status: 'online' | 'offline' | 'in-game'
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Carro',
    avatarColor: '#fcd34d',
    status: 'in-game',
    lastMessage: 'Hop on The Strongest Battlegrounds, we need a 4th!',
    time: '2m ago',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'c1', text: 'Yo Sky! Are you online?', time: '18:42', isMe: false },
      { id: 'm2', senderId: 'me', text: 'Yeah just checking out the new Novelo update', time: '18:44', isMe: true },
      { id: 'm3', senderId: 'c1', text: 'Hop on The Strongest Battlegrounds, we need a 4th!', time: '18:45', isMe: false },
    ],
  },
  {
    id: 'c2',
    name: 'dev',
    avatarColor: '#18181b',
    status: 'online',
    lastMessage: 'Pushed the changes to main branch. Check it out.',
    time: '1h ago',
    unread: 0,
    messages: [
      { id: 'm4', senderId: 'c2', text: 'Hey, did you test the sword combat mechanics?', time: '17:15', isMe: false },
      { id: 'm5', senderId: 'me', text: 'Yes, hitboxes are much cleaner now', time: '17:20', isMe: true },
      { id: 'm6', senderId: 'c2', text: 'Pushed the changes to main branch. Check it out.', time: '17:30', isMe: false },
    ],
  },
  {
    id: 'c3',
    name: 'Krampus',
    avatarColor: '#9ca3af',
    status: 'online',
    lastMessage: 'Are you trading that Crown of Novelo?',
    time: '3h ago',
    unread: 0,
    messages: [
      { id: 'm7', senderId: 'c3', text: 'Are you trading that Crown of Novelo?', time: '15:10', isMe: false },
    ],
  },
  {
    id: 'c4',
    name: 'Novelo System',
    avatarColor: '#ffffff',
    status: 'offline',
    lastMessage: 'Welcome to Novelo! Enjoy the smooth experience.',
    time: '1d ago',
    unread: 0,
    messages: [
      { id: 'm8', senderId: 'sys', text: 'Welcome to Novelo! Enjoy the smooth experience.', time: 'Yesterday', isMe: false },
    ],
  },
]

export function Messages() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState('c1')
  const [inputText, setInputText] = useState('')
  const [search, setSearch] = useState('')

  const activeConvo = conversations.find((c) => c.id === selectedId) || conversations[0]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessage: inputText.trim(),
            time: 'Just now',
            messages: [...c.messages, newMsg],
          }
        }
        return c
      })
    )
    setInputText('')
  }

  const filteredConvos = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 lg:p-7 max-w-[1700px] h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row rounded-2xl bg-[#111111]/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
        {/* Left Side: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0e0e0e]/90 shrink-0">
          {/* Header & Search */}
          <div className="p-4 flex flex-col gap-3 border-b border-white/[0.08]">
            <h2 className="text-xl font-black text-white tracking-tight">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#161616] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-white/[0.04]">
            {filteredConvos.map((convo) => {
              const isSelected = convo.id === selectedId
              return (
                <button
                  key={convo.id}
                  onClick={() => setSelectedId(convo.id)}
                  className={`w-full p-3.5 flex items-start gap-3 text-left transition-all cursor-pointer border-none ${
                    isSelected
                      ? 'bg-white/[0.08]'
                      : 'bg-transparent hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="size-10 rounded-full border border-white/10 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: convo.avatarColor }}
                    >
                      <div className="size-2 rounded-full bg-black/60" />
                    </div>
                    {convo.status !== 'offline' && (
                      <span
                        className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-[#0e0e0e] ${
                          convo.status === 'in-game' ? 'bg-blue-500' : 'bg-emerald-500'
                        }`}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate">{convo.name}</h4>
                      <span className="text-[10px] text-white/40 shrink-0">{convo.time}</span>
                    </div>
                    <p className="text-[11px] text-white/60 truncate">{convo.lastMessage}</p>
                  </div>

                  {convo.unread > 0 && (
                    <span className="size-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-1">
                      {convo.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col bg-[#0c0c0c]/80 min-w-0">
          {/* Active Chat Header */}
          <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#111111]/50">
            <div className="flex items-center gap-3">
              <div
                className="size-9 rounded-full border border-white/10 flex items-center justify-center shadow-xs"
                style={{ backgroundColor: activeConvo.avatarColor }}
              >
                <div className="size-1.5 rounded-full bg-black/60" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{activeConvo.name}</h3>
                <span className="text-[11px] text-emerald-400 capitalize">
                  {activeConvo.status === 'in-game' ? 'In Experience' : activeConvo.status}
                </span>
              </div>
            </div>

            <button className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer border-none bg-transparent">
              <MoreVertical className="size-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto no-scrollbar flex flex-col gap-3">
            {activeConvo.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] ${
                  msg.isMe ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    msg.isMe
                      ? 'bg-white text-black font-medium rounded-br-xs shadow-md'
                      : 'bg-[#1e1e1e] text-white border border-white/10 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-white/30 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3.5 border-t border-white/10 bg-[#111111]/70 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Message ${activeConvo.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-10 px-4 rounded-xl bg-[#181818] border border-white/10 text-xs md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="size-10 rounded-xl bg-white text-black disabled:bg-white/10 disabled:text-white/30 hover:bg-neutral-200 transition-all flex items-center justify-center cursor-pointer border-none shrink-0 shadow-md"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
