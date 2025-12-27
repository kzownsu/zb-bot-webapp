'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { User, Match } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function PlayerProfile() {
  const params = useParams()
  const playerId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (playerId) {
      fetchPlayerData()
    }
  }, [playerId])

  const fetchPlayerData = async () => {
    try {
      setLoading(true)
      const [userRes, matchesRes] = await Promise.all([
        fetch(`${API_URL}/api/users/${playerId}`),
        fetch(`${API_URL}/api/users/${playerId}/matches?limit=20`)
      ])

      if (!userRes.ok || !matchesRes.ok) {
        throw new Error('Failed to fetch player data')
      }

      const userData = await userRes.json()
      const matchesData = await matchesRes.json()

      setUser(userData)
      setMatches(matchesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching player data:', err)
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white text-xl">Loading player profile...</div>
        </div>
      </main>
    )
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
            <p>Error: {error || 'Player not found'}</p>
            <Link href="/" className="mt-2 inline-block text-blue-400 hover:underline">
              ← Back to Leaderboard
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const tier = getRankTier(user.elo)
  const winRate = user.matches_played > 0
    ? ((user.wins / user.matches_played) * 100).toFixed(1)
    : '0.0'

  // Prepare ELO progression data
  const eloProgression = matches
    .reverse()
    .map((match, index) => {
      const isWinner = match.winner_id === user.discord_id
      const eloChange = match.player1_id === user.discord_id
        ? match.player1_elo_change
        : match.player2_elo_change
      const eloBefore = match.player1_id === user.discord_id
        ? match.player1_elo_before
        : match.player2_elo_before
      
      return {
        match: index + 1,
        elo: eloBefore + eloChange,
        change: eloChange,
        result: isWinner ? 'Win' : 'Loss'
      }
    })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Back to Leaderboard
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.epic_username || `User ${user.discord_id}`}
              </h1>
              <p className="text-gray-400">Discord ID: {user.discord_id}</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${tier.color}`}>
                {tier.emoji} {tier.name}
              </div>
              <div className="text-2xl text-white mt-2">{user.elo} ELO</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Matches Played</div>
              <div className="text-2xl font-bold text-white">{user.matches_played}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Wins</div>
              <div className="text-2xl font-bold text-green-400">{user.wins}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Losses</div>
              <div className="text-2xl font-bold text-red-400">{user.losses}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Win Rate</div>
              <div className="text-2xl font-bold text-white">{winRate}%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Current Streak</div>
              <div className={`text-2xl font-bold ${user.current_streak > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                {user.current_streak > 0 ? '🔥' : ''} {user.current_streak}
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Best Streak</div>
              <div className="text-2xl font-bold text-yellow-400">⭐ {user.best_streak}</div>
            </div>
          </div>

          {user.epic_username && (
            <div className="mt-6">
              <a
                href={`https://tracker.gg/fortnite/profile/epic/${user.epic_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View TRN Profile →
              </a>
            </div>
          )}
        </div>

        {eloProgression.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">ELO Progression</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eloProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="match" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="elo" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Matches</h2>
          {matches.length === 0 ? (
            <p className="text-gray-400">No matches found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Opponent</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Result</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">ELO Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {matches.map((match) => {
                    const isWinner = match.winner_id === user.discord_id
                    const eloChange = match.player1_id === user.discord_id
                      ? match.player1_elo_change
                      : match.player2_elo_change
                    const opponentId = match.player1_id === user.discord_id
                      ? match.player2_id
                      : match.player1_id

                    return (
                      <tr key={match.match_id} className="hover:bg-gray-700/30">
                        <td className="px-4 py-2 text-gray-300">
                          {new Date(match.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <Link
                            href={`/player/${opponentId}`}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            {opponentId}
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          <span className={isWinner ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                            {isWinner ? 'Win' : 'Loss'}
                          </span>
                        </td>
                        <td className={`px-4 py-2 font-semibold ${eloChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {eloChange >= 0 ? '+' : ''}{eloChange}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

