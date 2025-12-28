// Database connection utility
// Supports PostgreSQL, MySQL, and SQLite

let db: any = null

export async function getDb() {
  if (db) {
    return db
  }

  const dbType = process.env.DB_TYPE || 'postgresql'
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  try {
    if (dbType === 'postgresql' || dbType === 'postgres') {
      // PostgreSQL using pg library
      // @ts-ignore - Dynamic import, package may not be installed if not using PostgreSQL
      const { Pool } = await import('pg')
      const sslConfig = process.env.DB_SSL === 'true' 
        ? { rejectUnauthorized: false } 
        : (process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false })
      db = new Pool({
        connectionString,
        ssl: sslConfig,
      })
      // Test the connection
      try {
        const testClient = await db.connect()
        testClient.release()
        console.log('Database connection successful')
      } catch (testError) {
        console.error('Database connection test failed:', testError)
        throw testError
      }
    } else if (dbType === 'mysql') {
      // MySQL using mysql2 library
      // @ts-ignore - Dynamic import, package may not be installed if not using MySQL
      const mysql = await import('mysql2/promise')
      const { createConnection } = mysql
      db = await createConnection(connectionString)
    } else if (dbType === 'sqlite') {
      // SQLite using better-sqlite3
      // @ts-ignore - Dynamic import, package may not be installed if not using SQLite
      const Database = (await import('better-sqlite3')).default
      db = new Database(connectionString)
    } else {
      throw new Error(`Unsupported database type: ${dbType}. Supported types: postgresql, mysql, sqlite`)
    }

    return db
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export async function query(sql: string, params?: any[]): Promise<any[]> {
  const database = await getDb()
  const dbType = process.env.DB_TYPE || 'postgresql'

  try {
    if (dbType === 'postgresql' || dbType === 'postgres') {
      const result = await database.query(sql, params)
      return result.rows
    } else if (dbType === 'mysql') {
      const [rows] = await database.execute(sql, params)
      return rows
    } else if (dbType === 'sqlite') {
      if (params && params.length > 0) {
        const stmt = database.prepare(sql)
        return stmt.all(...params)
      } else {
        return database.prepare(sql).all()
      }
    }
    return []
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

