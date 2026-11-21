export interface GameDetailData {
  id: string
  name: string
  creator: string
  isVerified?: boolean
  thumbnail: string
  aspect?: '16/9' | '1/1'
  likePercent: number
  players: string
  likesCount?: string
  dislikesCount?: string
  favoritesCount?: string
  visitsCount?: string
  createdDate?: string
  updatedDate?: string
  serverSize?: number
  genre?: string
  subgenre?: string
  maturity?: string
  maturityDetail?: string
  description?: string
  controls?: string[]
}

export const RECOMMENDED_GAMES: GameDetailData[] = []

export const CONTINUE_GAMES: GameDetailData[] = []
