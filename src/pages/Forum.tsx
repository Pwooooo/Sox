import { useState, useEffect } from 'react'
import { MessagesSquare, Plus, ThumbsUp, MessageCircle, Pin, Search, X, Send, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { CustomDropdown } from '@/components/CustomDropdown'

interface ForumReply {
  id: string
  author: string
  body: string
  createdAt: number
}

interface ForumThread {
  id: string
  title: string
  body: string
  author: string
  category: string
  replies: number
  views: number
  likes: number
  likedByUser?: boolean
  isPinned?: boolean
  createdAt: number
  repliesList?: ForumReply[]
}

const FORUM_STORAGE_KEY = 'novelo_forum_threads_v1'
const FORUM_CATEGORIES = ['All', 'Announcements', 'Game Development', 'Trading & Economy', 'Off-Topic']

function loadForumThreads(): ForumThread[] {
  try {
    const raw = localStorage.getItem(FORUM_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ForumThread[]) : []
  } catch {
    return []
  }
}

function saveForumThreads(threads: ForumThread[]): void {
  try {
    localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(threads))
  } catch {
    // ignore
  }
}

function formatRelativeTime(ts: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return new Date(ts).toLocaleDateString()
}

export function Forum() {
  const { user, profile } = useAuth()
  const currentUsername =
    profile?.username || (user?.user_metadata?.username as string) || 'Player'

  const [threads, setThreads] = useState<ForumThread[]>(() => loadForumThreads())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Game Development')
  const [newBody, setNewBody] = useState('')

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    saveForumThreads(threads)
  }, [threads])

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const thread: ForumThread = {
      id: `f_${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      author: currentUsername,
      category: newCategory,
      replies: 0,
      views: 1,
      likes: 0,
      likedByUser: false,
      createdAt: Date.now(),
      repliesList: [],
    }

    setThreads((prev) => [thread, ...prev])
    setNewTitle('')
    setNewBody('')
    setShowModal(false)
  }

  const handleToggleLike = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t
        const nextLiked = !t.likedByUser
        return {
          ...t,
          likedByUser: nextLiked,
          likes: Math.max(0, t.likes + (nextLiked ? 1 : -1)),
        }
      })
    )
  }

  const handleOpenThread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, views: (t.views || 0) + 1 } : t))
    )
    setActiveThreadId(threadId)
    setReplyText('')
  }

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeThread || !replyText.trim()) return
    const reply: ForumReply = {
      id: `r_${Date.now()}`,
      author: currentUsername,
      body: replyText.trim(),
      createdAt: Date.now(),
    }
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              replies: (t.repliesList?.length ?? t.replies) + 1,
              repliesList: [...(t.repliesList ?? []), reply],
            }
          : t
      )
    )
    setReplyText('')
  }

  const handleDeleteThread = (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId))
    if (activeThreadId === threadId) {
      setActiveThreadId(null)
    }
  }

  const filteredThreads = threads.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.author.toLowerCase().includes(search.toLowerCase())
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
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {FORUM_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 h-9 rounded-[10px] text-xs font-semibold shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97]',
                  isActive
                    ? 'bg-white/[0.08] backdrop-blur-sm text-white font-bold shadow-xs'
                    : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.03]'
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>

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
      {filteredThreads.length === 0 ? (
        <div className="rounded-2xl bg-[#101012]/90 border border-white/[0.06] p-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="size-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/40">
            <MessagesSquare className="size-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white/80 m-0">No discussions yet</p>
            <p className="text-xs text-white/45 m-0 mt-1">
              {search || selectedCategory !== 'All'
                ? 'Try clearing your filters or start a new discussion.'
                : 'Start the first discussion with the community.'}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-1 h-9 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Plus className="size-3.5" />
            <span>New Discussion</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleOpenThread(thread.id)}
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
                    <span>{formatRelativeTime(thread.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Engagement Counters */}
              <div className="flex items-center gap-4 text-xs text-white/50 shrink-0">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5" />
                  <span className="tabular-numbers">{thread.replies}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleLike(thread.id)
                  }}
                  className={cn(
                    'flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 text-xs transition-colors',
                    thread.likedByUser ? 'text-white font-semibold' : 'text-white/50 hover:text-white'
                  )}
                >
                  <ThumbsUp className="size-3.5" />
                  <span className="tabular-numbers">{thread.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thread Detail Modal */}
      {activeThread && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveThreadId(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#141414] border border-white/10 p-6 flex flex-col gap-4 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 text-[11px] text-white/70">
                    {activeThread.category}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-white/75">{activeThread.author}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(activeThread.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{activeThread.title}</h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {activeThread.author.toLowerCase() === currentUsername.toLowerCase() && (
                  <button
                    type="button"
                    onClick={() => handleDeleteThread(activeThread.id)}
                    title="Delete discussion"
                    className="size-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center cursor-pointer border-none"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveThreadId(null)}
                  title="Close"
                  className="size-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center cursor-pointer border-none"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {activeThread.body && (
              <p className="text-xs md:text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                {activeThread.body}
              </p>
            )}

            <div className="flex items-center gap-4 border-y border-white/[0.07] py-2.5 text-xs text-white/60">
              <button
                type="button"
                onClick={() => handleToggleLike(activeThread.id)}
                className={cn(
                  'flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 text-xs transition-colors',
                  activeThread.likedByUser ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                )}
              >
                <ThumbsUp className="size-3.5" />
                <span>{activeThread.likes} Likes</span>
              </button>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="size-3.5" />
                <span>{activeThread.replies} Replies</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1 no-scrollbar min-h-[100px]">
              {!activeThread.repliesList || activeThread.repliesList.length === 0 ? (
                <p className="text-xs text-white/40 py-4 text-center">No replies yet.</p>
              ) : (
                activeThread.repliesList.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-xl bg-[#1a1a1d] flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-white/50">
                      <span className="font-bold text-white/80">{rep.author}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(rep.createdAt)}</span>
                    </div>
                    <p className="text-xs text-white/85 leading-relaxed whitespace-pre-wrap">
                      {rep.body}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handlePostReply} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 h-9 px-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="h-9 px-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Send className="size-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

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
              <CustomDropdown
                value={newCategory}
                onChange={setNewCategory}
                options={FORUM_CATEGORIES.filter((c) => c !== 'All').map((c) => ({
                  value: c,
                  label: c,
                }))}
                className="w-full"
                buttonClassName="w-full h-10 px-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-xs text-white justify-between"
                menuClassName="w-full"
              />
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
