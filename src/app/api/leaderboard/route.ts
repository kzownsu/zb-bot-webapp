import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { User } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // For PostgreSQL, use $1, $2 instead of ?, ?
    const dbType = process.env.DB_TYPE || 'postgresql'
    
    // Query to fetch leaderboard data
    // Adjust the table name and column names based on your database schema
    // Common table names: users, user, players, player
    const tableName = process.env.DB_TABLE_NAME || 'users'
    // Quote table name for PostgreSQL (handles case sensitivity and special characters)
    const quotedTableName = dbType === 'postgresql' || dbType === 'postgres' 
      ? `"${tableName}"` 
      : tableName
    let sql = `
      SELECT 
        discord_id,
        epic_username,
        elo,
        wins,
        losses,
        matches_played,
        current_streak,
        best_streak,
        linked_at,
        created_at,
        updated_at
      FROM ${quotedTableName}
      WHERE matches_played >= 5
      ORDER BY elo DESC, wins DESC
      LIMIT ? OFFSET ?
    `
    
    let finalSql = sql
    let params: any[] = [limit, offset]

    if (dbType === 'postgresql' || dbType === 'postgres') {
      let paramIndex = 1
      finalSql = sql.replace(/\?/g, () => `$${paramIndex++}`)
    }

    const rows = await query(finalSql, params)

    // Map database rows to User type
    const leaderboard: User[] = rows.map((row: any) => ({
      discord_id: row.discord_id || row.discord_id,
      epic_username: row.epic_username,
      elo: Number(row.elo) || 1000,
      wins: Number(row.wins) || 0,
      losses: Number(row.losses) || 0,
      matches_played: Number(row.matches_played) || 0,
      current_streak: Number(row.current_streak) || 0,
      best_streak: Number(row.best_streak) || 0,
      linked_at: row.linked_at ? new Date(row.linked_at).toISOString() : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }))

    return NextResponse.json(leaderboard, { status: 200 })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Error details:', { message: errorMessage, stack: errorStack })
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard', 
        details: errorMessage,
        // Only include stack in development
        ...(process.env.NODE_ENV === 'development' && errorStack ? { stack: errorStack } : {})
      },
      { status: 500 }
    )
  }
}
