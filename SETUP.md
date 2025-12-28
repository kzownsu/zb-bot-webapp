# Setup Guide - Live Preview with Database

This guide will help you set up a live preview of your site with database connectivity.

## Prerequisites

- Node.js 18+ installed
- Database (PostgreSQL, MySQL, or SQLite) with your leaderboard data
- Database connection string

## Step 1: Install Dependencies

First, install all required packages including the database drivers:

```bash
npm install
```

This will install:
- Next.js and React dependencies
- Database drivers (pg for PostgreSQL, mysql2 for MySQL, better-sqlite3 for SQLite)

## Step 2: Configure Database Connection

Create a `.env.local` file in the root directory of your project:

```bash
# For Windows PowerShell
New-Item -Path .env.local -ItemType File

# For Git Bash / Linux / Mac
touch .env.local
```

Add your database configuration to `.env.local`:

### For PostgreSQL:
```env
DB_TYPE=postgresql
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DB_SSL=false
```

### For MySQL:
```env
DB_TYPE=mysql
DATABASE_URL=mysql://username:password@localhost:3306/database_name
```

### For SQLite:
```env
DB_TYPE=sqlite
DATABASE_URL=./database.db
```

**Important Notes:**
- Replace `username`, `password`, `localhost`, `5432` (or `3306` for MySQL), and `database_name` with your actual database credentials
- For PostgreSQL on cloud services (like Railway, Supabase, etc.), you may need to set `DB_SSL=true`
- The `.env.local` file is already in `.gitignore` and won't be committed to git

## Step 3: Verify Database Schema

Make sure your database has a `users` table with the following columns:
- `discord_id` (string/primary key)
- `epic_username` (string, nullable)
- `elo` (number)
- `wins` (number)
- `losses` (number)
- `matches_played` (number)
- `current_streak` (number)
- `best_streak` (number)
- `linked_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

If your table or column names are different, you'll need to update the SQL query in `src/app/api/leaderboard/route.ts`.

## Step 4: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The server will start on **http://localhost:3000**

## Step 5: View Your Site

Open your browser and navigate to:
```
http://localhost:3000
```

You should see:
- The leaderboard page with data from your database
- Live reloading when you make code changes
- Real-time data fetching from your database

## Troubleshooting

### Database Connection Errors

1. **Check your connection string:**
   - Verify the format matches the examples above
   - Ensure your database server is running
   - Check that the database name, username, and password are correct

2. **For PostgreSQL SSL issues:**
   - If connecting to a cloud database, set `DB_SSL=true` in `.env.local`
   - For local PostgreSQL, `DB_SSL=false` is usually fine

2. **Check database permissions:**
   - Ensure your database user has SELECT permissions on the `users` table

### Leaderboard Not Showing Data

1. **Check if you have data:**
   - The leaderboard only shows users with `matches_played >= 5`
   - Verify you have users in your database that meet this criteria

2. **Check the browser console:**
   - Open DevTools (F12) → Console tab
   - Look for any error messages

3. **Check the server logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for database query errors

### Table/Column Name Mismatches

If your database schema is different, update the SQL query in:
- `src/app/api/leaderboard/route.ts` (line ~15-30)

Adjust the table name and column names to match your schema.

## Next Steps

- The development server supports hot-reloading, so changes to your code will automatically refresh
- You can now develop and test your leaderboard with real database data
- For production deployment, see `DEPLOYMENT.md`

## Available Scripts

- `npm run dev` - Start development server (with hot-reload)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

