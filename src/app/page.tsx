import Link from 'next/link'
import Leaderboard from '@/components/Leaderboard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎮 Fortnite 1v1 Leaderboard
          </h1>
          <p className="text-gray-300 text-lg">
            Compete, climb the ranks, and become the best!
          </p>
        </header>

        <nav className="flex justify-center gap-4 mb-8">
          <Link
            href="/"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/stats"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Statistics
          </Link>
        </nav>

        <Leaderboard />
      </div>
    </main>
  )
}

