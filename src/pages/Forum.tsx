import { useState } from 'react'
import { MessagesSquare, Plus, ThumbsUp, MessageCircle, Pin, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ForumThread {
  id: string
  title: string
  author: string
  category: string
  replies: number
  views: number
  likes: number
  isPinned?: boolean
  time: string
}

const INITIAL_THREADS: ForumThread[] = [
  {
    id: 'f1',
    title: 'Novelo Patch Notes v1.2 - High Refresh Rate & Low Latency Physics',
    author: 'Novelo Team',
    category: 'Announcements',
    replies: 142,
    views: 4520,
    likes: 830,
    isPinned: true,
    time: '2h ago',
  },
  {
    id: 'f2',
    title: 'How to optimize spatial partition for 100-player battle royale',
    author: 'dev',
    category: 'Game Development',
    replies: 28,
    views: 640,
    likes: 95,
    time: '4h ago',
  },
  {
    id: 'f3',
    title: 'Trading Crown of Novelo for Dragon Wings + adds',
    author: 'Krampus',
    category: 'Trading & Economy',
    replies: 15,
    views: 310,
    likes: 12,
    time: '6h ago',
  },
  {
    id: 'f4',
    title: 'What is your favorite custom animation pack so far?',
    author: 'Carro',
    category: 'Off-Topic',
    replies: 53,
    views: 1100,
    likes: 74,
    time: '1d ago',
  },
]

const FORUM_CATEGORIES = ['All', 'Announcements', 'Game Development', 'Trading & Economy', 'Off-Topic']

export function Forum() {
  const [threads, setThreads] = useState(INITIAL_THREADS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Game Development')
  const [newBody, setNewBody] = useState('')

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const thread: ForumThread = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      author: 'Sky',
      category: newCategory,
      replies: 0,
      views: 1,
      likes: 1,
      time: 'Just now',
    }

    setThreads([thread, ...threads])
    setNewTitle('')
    setNewBody('')
    setShowModal(false)
  }

  const filteredThreads = threads.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.author.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Title & New Thread Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Community Forums
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Discuss game design, trade tips, scripting tutorials, and feature suggestions
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-md"
        >
          <Plus className="size-4" />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills (Soft translucent highlight when active, transparent when unselected) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {FORUM_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 h-9 rounded-[10px] text-xs font-semibold shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97]",
                  isActive
                    ? "bg-white/[0.08] backdrop-blur-sm text-white font-bold shadow-xs"
                    : "bg-transparent text-white/50 hover:text-white hover:bg-white/[0.03]"
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex flex-col gap-2.5">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => alert(`Opening discussion: "${thread.title}"`)}
            className="p-4 rounded-2xl bg-[#141414]/90 hover:bg-[#181818] border border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
          >
            {/* Title & Metadata */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {thread.isPinned && (
                <Pin className="size-4 text-amber-400 shrink-0 mt-0.5 fill-amber-400 rotate-45" />
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors truncate">
                  {thread.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="font-semibold text-white/70">{thread.author}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-white/60">
                    {thread.category}
                  </span>
                  <span>•</span>
                  <span>{thread.time}</span>
                </div>
              </div>
            </div>

            {/* Engagement Counters */}
            <div className="flex items-center gap-4 text-xs text-white/50 shrink-0">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="size-3.5" />
                <span className="tabular-numbers">{thread.replies}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="size-3.5" />
                <span className="tabular-numbers">{thread.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Discussion Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowModal(false)}
        >
          <form
            onSubmit={handleCreateThread}
            className="w-full max-w-lg rounded-2xl bg-[#141414] border border-white/10 p-6 flex flex-col gap-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Start a Discussion</h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-10 px-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-xs text-white focus:outline-none cursor-pointer"
              >
                {FORUM_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c} className="bg-[#141414]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Title</label>
              <input
                type="text"
                placeholder="Topic or question title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-10 px-3.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-xs text-white focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/60">Content</label>
              <textarea
                rows={4}
                placeholder="What would you like to discuss? Provide details..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="p-3.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-xs font-bold cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer border-none shadow-md"
              >
                Post Discussion
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
