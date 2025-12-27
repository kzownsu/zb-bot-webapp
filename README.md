# Fortnite 1v1 Dashboard

A modern web dashboard for viewing Fortnite 1v1 matchmaking leaderboards, player statistics, and match history.

## Features

- 🏆 Interactive leaderboard with pagination
- 📊 Player profile pages with detailed statistics
- 📈 ELO progression charts
- 🎮 Match history tracking
- 🔗 TRN profile links
- 📱 Responsive design

## Prerequisites

- Node.js 18+ and npm
- Discord bot API server running (see discord-bot README)

## Setup

1. **Install dependencies:**
   ```bash
   cd web-dashboard
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This Next.js app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- Any Node.js hosting service

Make sure to set the `NEXT_PUBLIC_API_URL` environment variable to point to your Discord bot's API server.

## Project Structure

```
web-dashboard/
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── package.json
```

## License

MIT

