'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import LeaderboardRow from './LeaderboardRow'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchLeaderboard()
  }, [page])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const offset = (page - 1) * itemsPerPage
      const response = await fetch(`${API_URL}/api/leaderboard?limit=${itemsPerPage}&offset=${offset}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
      }
      
      const data = await response.json()
      setLeaderboard(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRankTier = (elo: number) => {
    if (elo >= 2000) return { name: 'Master', emoji: '👑', color: 'text-purple-400' }
    if (elo >= 1800) return { name: 'Diamond', emoji: '💎', color: 'text-blue-400' }
    if (elo >= 1600) return { name: 'Platinum', emoji: '🔷', color: 'text-green-400' }
    if (elo >= 1400) return { name: 'Gold', emoji: '🥇', color: 'text-yellow-400' }
    if (elo >= 1200) return { name: 'Silver', emoji: '🥈', color: 'text-gray-300' }
    if (elo >= 1000) return { name: 'Bronze', emoji: '🥉', color: 'text-orange-400' }
    return { name: 'Unranked', emoji: '⚪', color: 'text-gray-500' }
  }

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-white text-xl">Loading leaderboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
        <p>Error: {error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-300">
        <p className="text-xl">No players on the leaderboard yet.</p>
        <p className="mt-2">Be the first to play a match!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Player</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank Tier</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ELO</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Wins</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Losses</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Win Rate</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaderboard.map((user, index) => {
              const rank = (page - 1) * itemsPerPage + index + 1
              const tier = getRankTier(user.elo)
              const winRate = user.matches_played > 0
                ? ((user.wins / user.matches_played) * 100).toFixed(1)
                : '0.0'

              return (
                <LeaderboardRow
                  key={user.discord_id}
                  rank={rank}
                  user={user}
                  tier={tier}
                  winRate={winRate}
                />
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-6 py-4 bg-gray-900/30">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          Previous
        </button>
        <span className="text-gray-300">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={leaderboard.length < itemsPerPage}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  )
}

