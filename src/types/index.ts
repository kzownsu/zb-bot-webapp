export interface User {
  discord_id: string
  epic_username: string | null
  elo: number
  wins: number
  losses: number
  matches_played: number
  current_streak: number
  best_streak: number
  linked_at: string | null
  created_at: string
  updated_at: string
}

export interface Match {
  match_id: string
  player1_id: string
  player2_id: string
  map_id: number
  winner_id: string | null
  player1_elo_before: number
  player2_elo_before: number
  player1_elo_change: number
  player2_elo_change: number
  status: 'pending' | 'completed' | 'disputed' | 'cancelled'
  created_at: string
  completed_at: string | null
}

export interface Map {
  map_id: number
  name: string
  code: string
  description: string
  image_url: string | null
  active: boolean
  created_at: string
}

