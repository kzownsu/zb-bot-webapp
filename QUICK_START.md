# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Environment File

Create `.env.local` in the project root:

**For PostgreSQL:**
```env
DB_TYPE=postgresql
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DB_SSL=false
```

**For MySQL:**
```env
DB_TYPE=mysql
DATABASE_URL=mysql://username:password@localhost:3306/database_name
```

**For SQLite:**
```env
DB_TYPE=sqlite
DATABASE_URL=./database.db
```

## 3. Run Development Server

```bash
npm run dev
```

## 4. Open Browser

Navigate to: **http://localhost:3000**

The site will automatically reload when you make changes!

---

## Troubleshooting

**Database connection errors?**
- Check your `DATABASE_URL` format
- Ensure your database server is running
- Verify credentials are correct

**No data showing?**
- Leaderboard only shows users with 5+ matches
- Check browser console (F12) for errors
- Check terminal for database query errors

**Need to adjust database schema?**
- Edit `src/app/api/leaderboard/route.ts` to match your table/column names

