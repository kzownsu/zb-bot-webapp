# Web Dashboard Deployment Guide

This guide covers how to deploy the Fortnite 1v1 Matchmaking Web Dashboard to various hosting platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Hosting Options](#hosting-options)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Netlify](#netlify)
   - [Railway](#railway)
   - [Render](#render)
   - [VPS (Self-Hosted)](#vps-self-hosted)
4. [Post-Deployment](#post-deployment)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Discord bot API server running and accessible
- ✅ API server URL (for environment variables)
- ✅ Git repository set up
- ✅ Account on your chosen hosting platform
- ✅ Node.js 18+ installed locally (for testing)

---

## Environment Variables

The web dashboard requires one environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important Notes:**
- `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser
- Use your Discord bot's API server URL (not localhost in production)
- Must include protocol (`http://` or `https://`)
- No trailing slash

**Example Production URLs:**
```
NEXT_PUBLIC_API_URL=https://your-bot-api.railway.app
NEXT_PUBLIC_API_URL=https://your-bot-api.onrender.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Hosting Options

### Vercel (Recommended)

**Vercel** is the recommended platform for Next.js applications. It offers:
- Automatic deployments from GitHub
- Free tier with generous limits
- Built-in CDN
- Easy custom domain setup

#### Steps:

1. **Sign up at [vercel.com](https://vercel.com)**
   - Use GitHub account for easy integration

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `web-dashboard`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Set Environment Variables**
   - Go to "Environment Variables"
   - Add:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://your-bot-api-url.com
     ```
   - Select "Production", "Preview", and "Development" environments

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a URL like: `https://your-project.vercel.app`

6. **Automatic Deployments**
   - Every push to `main` branch = production deployment
   - Pull requests = preview deployments
   - No action needed after initial setup

---

### Netlify

**Netlify** is another excellent option for Next.js with similar features to Vercel.

#### Steps:

1. **Sign up at [netlify.com](https://netlify.com)**
   - Connect your GitHub account

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

3. **Configure Build Settings**
   - **Base directory:** `web-dashboard`
   - **Build command:** `npm run build`
   - **Publish directory:** `web-dashboard/.next`
   - **Node version:** 18 (or latest)

4. **Set Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add:
     ```
     Key: NEXT_PUBLIC_API_URL
     Value: https://your-bot-api-url.com
     ```
   - Scope: All scopes (Production, Deploy previews, Branch deploys)

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy
   - URL: `https://random-name.netlify.app`

6. **Note for Next.js on Netlify:**
   - Netlify requires a `netlify.toml` file for Next.js
   - Create `web-dashboard/netlify.toml`:
     ```toml
     [build]
       command = "npm run build"
       publish = ".next"

     [[plugins]]
       package = "@netlify/plugin-nextjs"
     ```

---

### Railway

**Railway** can host both your bot and dashboard together.

#### Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Service**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - **Root Directory:** `web-dashboard`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-bot-api.railway.app
   NODE_ENV=production
   ```

5. **Generate Domain**
   - Settings → "Generate Domain"
   - Railway provides a public URL

6. **Deploy**
   - Railway auto-deploys on git push

---

### Render

**Render** offers free tier with automatic deployments.

#### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect GitHub repository

3. **Configure Service**
   - **Name:** `fortnite-dashboard`
   - **Root Directory:** `web-dashboard`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-bot-api.onrender.com
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys automatically

---

### VPS (Self-Hosted)

For full control, deploy on your own server.

#### Steps:

1. **Set Up Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx
   ```

2. **Clone Repository**
   ```bash
   cd /opt
   sudo git clone https://github.com/yourusername/zb-comp-bot.git
   cd zb-comp-bot/web-dashboard
   sudo chown -R $USER:$USER /opt/zb-comp-bot
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Create Environment File**
   ```bash
   nano .env.production
   ```
   ```
   NEXT_PUBLIC_API_URL=https://your-bot-api-url.com
   NODE_ENV=production
   ```

5. **Build Application**
   ```bash
   npm run build
   ```

6. **Set Up PM2**
   ```bash
   nano ecosystem.config.js
   ```
   ```javascript
   module.exports = {
     apps: [{
       name: 'fortnite-dashboard',
       script: 'node_modules/next/dist/bin/next',
       args: 'start',
       cwd: '/opt/zb-comp-bot/web-dashboard',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '500M',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

7. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/fortnite-dashboard
   ```
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   ```bash
   sudo ln -s /etc/nginx/sites-available/fortnite-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Set Up SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Post-Deployment

### 1. Verify Deployment

1. **Check Website:**
   - Open your deployment URL
   - Verify the leaderboard loads
   - Check browser console for errors

2. **Test API Connection:**
   - Open browser DevTools → Network tab
   - Navigate to leaderboard
   - Verify API requests succeed
   - Check for CORS errors

3. **Test Features:**
   - View leaderboard
   - Click on player profiles
   - Verify ELO charts load
   - Check match history

### 2. Verify Environment Variables

**Vercel:**
- Settings → Environment Variables
- Ensure `NEXT_PUBLIC_API_URL` is set correctly

**Netlify:**
- Site settings → Environment variables
- Check variable is set for all scopes

**Other Platforms:**
- Check environment variables in dashboard
- Ensure `NEXT_PUBLIC_` prefix is used

### 3. Test API Connectivity

The dashboard should connect to your Discord bot's API server. Verify:

1. **API Server is Running:**
   ```bash
   curl https://your-bot-api-url.com/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **CORS is Enabled:**
   - API server should allow requests from your dashboard domain
   - Check API server logs for CORS errors

3. **API Endpoints Work:**
   ```bash
   curl https://your-bot-api-url.com/api/leaderboard
   ```
   Should return leaderboard JSON

---

## Custom Domain Setup

### Vercel

1. **Add Domain:**
   - Project → Settings → Domains
   - Add your domain (e.g., `leaderboard.yourdomain.com`)

2. **Configure DNS:**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: leaderboard (or @ for root)
     Value: cname.vercel-dns.com
     ```
   - Or A record (for root domain):
     ```
     Type: A
     Value: 76.76.21.21
     ```

3. **SSL:**
   - Vercel automatically provisions SSL certificates
   - Wait a few minutes for DNS propagation

### Netlify

1. **Add Domain:**
   - Site settings → Domain management
   - Add custom domain

2. **Configure DNS:**
   - Netlify provides DNS records to add
   - Add A or CNAME record as instructed

3. **SSL:**
   - Netlify automatically provisions SSL via Let's Encrypt

### Other Platforms

Follow platform-specific instructions for:
- Adding custom domain
- DNS configuration
- SSL certificate setup

---

## Troubleshooting

### Dashboard Not Loading

1. **Check Build Logs:**
   - Vercel/Netlify: View deployment logs
   - Look for build errors

2. **Verify Build Success:**
   - Check that `npm run build` completes without errors
   - Ensure all dependencies are installed

3. **Check Environment Variables:**
   - Verify `NEXT_PUBLIC_API_URL` is set
   - Ensure it's accessible from browser

### API Connection Errors

1. **CORS Issues:**
   - Check API server allows your dashboard domain
   - Verify CORS middleware is configured

2. **API Server Down:**
   - Check bot API server is running
   - Verify API URL is correct
   - Test API endpoints directly

3. **Network Errors:**
   - Check browser console for specific errors
   - Verify API URL is reachable
   - Check firewall rules

### Leaderboard Not Loading

1. **Check API Response:**
   - Open browser DevTools → Network
   - Check `/api/leaderboard` request
   - Verify response is valid JSON

2. **Check Database:**
   - Ensure Discord bot database has data
   - Verify players have played matches

3. **Check Filters:**
   - Leaderboard only shows players with 5+ matches
   - Ensure players meet criteria

### Player Profiles Not Loading

1. **Check API:**
   - Verify `/api/users/:id` endpoint works
   - Check user exists in database

2. **Check Match History:**
   - Verify `/api/users/:id/matches` returns data
   - Check matches are completed

### Build Failures

1. **Dependency Issues:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors:**
   - Fix any TypeScript errors
   - Ensure all types are properly defined

3. **Memory Issues:**
   - Increase build memory limit (if platform allows)
   - Optimize build process

---

## Performance Optimization

### 1. Enable Caching

**Vercel/Netlify:**
- Automatic caching for static assets
- Configure cache headers in `next.config.js`:
  ```javascript
  module.exports = {
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=60' },
          ],
        },
      ];
    },
  };
  ```

### 2. Image Optimization

- Use Next.js Image component (already implemented)
- Configure image domains in `next.config.js`

### 3. Code Splitting

- Next.js automatically code-splits
- Use dynamic imports for heavy components

---

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use platform secrets management
   - Only expose `NEXT_PUBLIC_` variables needed in browser

2. **API Security:**
   - Use HTTPS for API connections
   - Implement rate limiting on API (if needed)
   - Validate API responses

3. **Content Security Policy:**
   - Configure CSP headers (if needed)
   - Restrict external resource loading

---

## Monitoring

### Analytics

Consider adding:
- **Vercel Analytics:** Built-in analytics
- **Google Analytics:** For user tracking
- **Sentry:** For error tracking

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://pingdom.com)
- [StatusCake](https://www.statuscake.com)

---

## Cost Estimates

**Free Tier Options:**
- Vercel: Free tier (generous limits)
- Netlify: Free tier (100GB bandwidth/month)
- Railway: Free tier (limited hours)
- Render: Free tier (spins down after inactivity)

**Paid Options:**
- Vercel Pro: $20/month (for teams)
- Netlify Pro: $19/month
- VPS: ~$5-12/month (DigitalOcean, Linode)

---

## Updates

### Automatic Updates (Vercel/Netlify)

- Push to `main` branch = automatic deployment
- No action needed

### Manual Updates (VPS)

```bash
cd /opt/zb-comp-bot/web-dashboard
git pull
npm install
npm run build
pm2 restart fortnite-dashboard
```

---

## Support

If you encounter issues:

1. Check deployment logs
2. Review browser console errors
3. Verify API server connectivity
4. Check environment variables
5. Review platform-specific documentation

---

**Last Updated:** December 2024

