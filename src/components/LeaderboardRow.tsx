import Link from 'next/link'
import { User } from '@/types'

interface LeaderboardRowProps {
  rank: number
  user: User
  tier: { name: string; emoji: string; color: string }
  winRate: string
}

export default function LeaderboardRow({ rank, user, tier, winRate }: LeaderboardRowProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400 font-bold'
    if (rank === 2) return 'text-gray-300 font-bold'
    if (rank === 3) return 'text-orange-400 font-bold'
    return 'text-gray-400'
  }

  return (
    <tr className="hover:bg-gray-700/30 transition-colors">
      <td className={`px-6 py-4 ${getRankColor(rank)}`}>
        #{rank}
      </td>
      <td className="px-6 py-4">
        <Link
          href={`/player/${user.discord_id}`}
          className="text-blue-400 hover:text-blue-300 hover:underline"
        >
          {user.epic_username || `User ${user.discord_id}`}
        </Link>
        {user.epic_username && (
          <span className="text-gray-500 text-sm ml-2">({user.discord_id})</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`${tier.color} font-semibold`}>
          {tier.emoji} {tier.name}
        </span>
      </td>
      <td className="px-6 py-4 text-white font-semibold">{user.elo}</td>
      <td className="px-6 py-4 text-green-400">{user.wins}</td>
      <td className="px-6 py-4 text-red-400">{user.losses}</td>
      <td className="px-6 py-4 text-gray-300">{winRate}%</td>
      <td className="px-6 py-4">
        <span className={user.current_streak > 0 ? 'text-green-400' : 'text-gray-400'}>
          {user.current_streak > 0 ? '🔥' : ''} {user.current_streak}
        </span>
      </td>
    </tr>
  )
}

