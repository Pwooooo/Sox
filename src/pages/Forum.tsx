import { useState, useEffect, useRef } from 'react'
import {
  MessagesSquare,
  Plus,
  ThumbsUp,
  MessageCircle,
  Pin,
  Search,
  Heart,
  Link2,
  MoreHorizontal,
  CornerUpLeft,
  ArrowLeft,
  Check,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { CustomDropdown } from '@/components/CustomDropdown'
import { PlayerModel3D } from '@/components/PlayerModel3D'

interface ForumReply {
  id: string
  author: string
  body: string
  createdAt: number
  likes?: number
  likedByUser?: boolean
  parentReplyId?: string
  replyToAuthor?: string
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

function formatShortTime(ts: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (diffSec < 60) return 'now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays < 30) return `${diffDays}d`
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
  const [replyTarget, setReplyTarget] = useState<{ id?: string; author: string } | null>(null)
  const [expandedReplyIds, setExpandedReplyIds] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)

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
    setActiveThreadId(thread.id)
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

  const handleToggleReplyLike = (threadId: string, replyId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t
        return {
          ...t,
          repliesList: (t.repliesList ?? []).map((r) => {
            if (r.id !== replyId) return r
            const nextLiked = !r.likedByUser
            return {
              ...r,
              likedByUser: nextLiked,
              likes: Math.max(0, (r.likes ?? 0) + (nextLiked ? 1 : -1)),
            }
          }),
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
    setReplyTarget(null)
    setOpenMenuId(null)
  }

  const handleStartReply = (target?: { id?: string; author: string }) => {
    setReplyTarget(target ?? null)
    setTimeout(() => replyInputRef.current?.focus(), 0)
  }

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeThread || !replyText.trim()) return
    const reply: ForumReply = {
      id: `r_${Date.now()}`,
      author: currentUsername,
      body: replyText.trim(),
      createdAt: Date.now(),
      likes: 0,
      likedByUser: false,
      parentReplyId: replyTarget?.id,
      replyToAuthor: replyTarget?.author,
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
    if (replyTarget?.id) {
      setExpandedReplyIds((prev) => ({ ...prev, [replyTarget.id!]: true }))
    }
    setReplyText('')
    setReplyTarget(null)
  }

  const handleDeleteThread = (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId))
    if (activeThreadId === threadId) {
      setActiveThreadId(null)
    }
    setOpenMenuId(null)
  }

  const handleDeleteReply = (threadId: string, replyId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t
        const nextList = (t.repliesList ?? []).filter(
          (r) => r.id !== replyId && r.parentReplyId !== replyId
        )
        return {
          ...t,
          replies: nextList.length,
          repliesList: nextList,
        }
      })
    )
    setOpenMenuId(null)
  }

  const handleCopyPostLink = async (id: string) => {
    const url = `https://playnovelo.vercel.app/forum/${encodeURIComponent(id)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore
    }
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1200)
  }

  const filteredThreads = threads.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.author.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  // Thread Detail View (Discourse-style layout)
  if (activeThread) {
    const allReplies = activeThread.repliesList ?? []
    const topLevelReplies = allReplies.filter((r) => !r.parentReplyId)
    const uniqueUsers = Array.from(
      new Set([activeThread.author, ...allReplies.map((r) => r.author)])
    )

    const renderAvatar = (authorName: string, sizeClass = 'size-10') => {
      const isSelf = authorName.toLowerCase() === currentUsername.toLowerCase()
      return (
        <div
          className={cn(
            'rounded-xl bg-[#111113] border border-white/[0.08] overflow-hidden shrink-0',
            sizeClass
          )}
        >
          <PlayerModel3D
            mode="headshot"
            interactive={false}
            autoRotate={false}
            useSavedColors={isSelf}
            useSavedClothing={isSelf}
            className="w-full h-full"
          />
        </div>
      )
    }

    return (
      <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-5 max-w-[1100px] mx-auto">
        <button
          type="button"
          onClick={() => setActiveThreadId(null)}
          className="self-start flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-0 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to discussions</span>
        </button>

        {/* Thread Title Header Card */}
        <div className="rounded-xl bg-[#141416] border border-white/[0.07] px-5 py-4 flex flex-col gap-2">
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            {activeThread.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-[5px] bg-white/[0.08] text-[11px] font-medium text-white/75">
              {activeThread.category}
            </span>
          </div>
        </div>

        {/* Posts Container */}
        <div className="flex flex-col">
          {/* Original Post */}
          <div className="py-4 px-2 border-b border-white/[0.08] flex gap-3.5">
            {renderAvatar(activeThread.author, 'size-11')}

            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white/85">{activeThread.author}</span>
                <span className="text-[11px] text-white/40">
                  {formatShortTime(activeThread.createdAt)}
                </span>
              </div>

              <p className="text-xs md:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {activeThread.body || activeThread.title}
              </p>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {activeThread.likes > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-white/75 font-medium">
                      <Heart className="size-3.5 fill-rose-500 text-rose-500" />
                      <span>{activeThread.likes}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-white/50 relative">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(activeThread.id)}
                    title="Like"
                    className={cn(
                      'bg-transparent border-none cursor-pointer p-1 transition-colors flex items-center',
                      activeThread.likedByUser ? 'text-rose-400' : 'text-white/50 hover:text-white'
                    )}
                  >
                    <Heart className={cn('size-3.5', activeThread.likedByUser && 'fill-current')} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyPostLink(activeThread.id)}
                    title="Copy link"
                    className="bg-transparent border-none cursor-pointer p-1 text-white/50 hover:text-white transition-colors flex items-center"
                  >
                    {copiedId === activeThread.id ? (
                      <Check className="size-3.5 text-[#02b070]" />
                    ) : (
                      <Link2 className="size-3.5" />
                    )}
                  </button>
                  {activeThread.author.toLowerCase() === currentUsername.toLowerCase() && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(openMenuId === activeThread.id ? null : activeThread.id)
                        }
                        title="More"
                        className="bg-transparent border-none cursor-pointer p-1 text-white/50 hover:text-white transition-colors flex items-center"
                      >
                        <MoreHorizontal className="size-3.5" />
                      </button>
                      {openMenuId === activeThread.id && (
                        <div className="absolute right-0 bottom-7 w-36 rounded-lg bg-[#161618] border border-white/10 p-1 shadow-xl z-20">
                          <button
                            type="button"
                            onClick={() => handleDeleteThread(activeThread.id)}
                            className="w-full h-7 px-2 rounded-md hover:bg-white/[0.08] text-xs text-white/85 flex items-center gap-2 cursor-pointer border-none bg-transparent text-left"
                          >
                            <Trash2 className="size-3.5 text-white/60" />
                            <span>Delete post</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleStartReply()}
                    className="bg-transparent border-none cursor-pointer px-1.5 py-1 text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <CornerUpLeft className="size-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Participant Avatars Strip */}
          <div className="py-3 px-2 border-b border-white/[0.08] flex items-center gap-5">
            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-bold text-white tabular-numbers">
                {activeThread.views}
              </span>
              <span className="text-[10px] text-white/45">views</span>
            </div>
            <div className="flex flex-col items-center leading-tight">
              <span className="text-sm font-bold text-white tabular-numbers">
                {uniqueUsers.length}
              </span>
              <span className="text-[10px] text-white/45">users</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {uniqueUsers.slice(0, 8).map((u) => (
                <div key={u} title={u}>
                  {renderAvatar(u, 'size-7')}
                </div>
              ))}
            </div>
          </div>

          {/* Replies List */}
          {topLevelReplies.map((rep) => {
            const childReplies = allReplies.filter((c) => c.parentReplyId === rep.id)
            const isExpanded = Boolean(expandedReplyIds[rep.id])
            return (
              <div key={rep.id} className="border-b border-white/[0.08]">
                <div className="py-4 px-2 flex gap-3.5">
                  {renderAvatar(rep.author, 'size-10')}

                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white/85">{rep.author}</span>
                      <span className="text-[11px] text-white/40">
                        {formatShortTime(rep.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                      {rep.body}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        {(rep.likes ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-white/75 font-medium">
                            <Heart className="size-3.5 fill-rose-500 text-rose-500" />
                            <span>{rep.likes}</span>
                          </span>
                        )}
                        {childReplies.length > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedReplyIds((prev) => ({
                                ...prev,
                                [rep.id]: !prev[rep.id],
                              }))
                            }
                            className="bg-transparent border-none cursor-pointer p-0 text-xs font-medium text-white/60 hover:text-white flex items-center gap-1"
                          >
                            <span>
                              {childReplies.length}{' '}
                              {childReplies.length === 1 ? 'Reply' : 'Replies'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="size-3.5" />
                            ) : (
                              <ChevronDown className="size-3.5" />
                            )}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-white/50 relative">
                        <button
                          type="button"
                          onClick={() => handleToggleReplyLike(activeThread.id, rep.id)}
                          title="Like"
                          className={cn(
                            'bg-transparent border-none cursor-pointer p-1 transition-colors flex items-center',
                            rep.likedByUser ? 'text-rose-400' : 'text-white/50 hover:text-white'
                          )}
                        >
                          <Heart className={cn('size-3.5', rep.likedByUser && 'fill-current')} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPostLink(`${activeThread.id}-${rep.id}`)}
                          title="Copy link"
                          className="bg-transparent border-none cursor-pointer p-1 text-white/50 hover:text-white transition-colors flex items-center"
                        >
                          {copiedId === `${activeThread.id}-${rep.id}` ? (
                            <Check className="size-3.5 text-[#02b070]" />
                          ) : (
                            <Link2 className="size-3.5" />
                          )}
                        </button>
                        {rep.author.toLowerCase() === currentUsername.toLowerCase() && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(openMenuId === rep.id ? null : rep.id)
                              }
                              title="More"
                              className="bg-transparent border-none cursor-pointer p-1 text-white/50 hover:text-white transition-colors flex items-center"
                            >
                              <MoreHorizontal className="size-3.5" />
                            </button>
                            {openMenuId === rep.id && (
                              <div className="absolute right-0 bottom-7 w-36 rounded-lg bg-[#161618] border border-white/10 p-1 shadow-xl z-20">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReply(activeThread.id, rep.id)}
                                  className="w-full h-7 px-2 rounded-md hover:bg-white/[0.08] text-xs text-white/85 flex items-center gap-2 cursor-pointer border-none bg-transparent text-left"
                                >
                                  <Trash2 className="size-3.5 text-white/60" />
                                  <span>Delete reply</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleStartReply({ id: rep.id, author: rep.author })}
                          className="bg-transparent border-none cursor-pointer px-1.5 py-1 text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <CornerUpLeft className="size-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nested Child Replies */}
                {isExpanded && childReplies.length > 0 && (
                  <div className="pl-12 pr-2 pb-3 flex flex-col gap-2">
                    {childReplies.map((child) => (
                      <div
                        key={child.id}
                        className="p-3 rounded-xl bg-[#141416] border border-white/[0.06] flex gap-3"
                      >
                        {renderAvatar(child.author, 'size-8')}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-white/85">{child.author}</span>
                            <span className="text-[11px] text-white/40">
                              {formatShortTime(child.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-white/85 leading-relaxed whitespace-pre-wrap">
                            {child.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Bottom Reply Composer */}
          <form
            onSubmit={handlePostReply}
            className="mt-4 rounded-xl bg-[#141416] border border-white/[0.08] p-3 flex flex-col gap-2.5"
          >
            {replyTarget && (
              <div className="flex items-center justify-between text-[11px] text-white/60 px-1">
                <span>
                  Replying to <span className="text-white font-semibold">@{replyTarget.author}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyTarget(null)}
                  className="text-white/45 hover:text-white bg-transparent border-none cursor-pointer text-[11px]"
                >
                  Cancel
                </button>
              </div>
            )}
            <textarea
              ref={replyInputRef}
              rows={2}
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-transparent border-none text-xs md:text-sm text-white placeholder:text-white/35 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="h-8 px-3.5 rounded-lg bg-white text-black hover:bg-neutral-200 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Send className="size-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

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
                    <span>{formatShortTime(thread.createdAt)}</span>
                  </div>
                </div>
              </div>

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
