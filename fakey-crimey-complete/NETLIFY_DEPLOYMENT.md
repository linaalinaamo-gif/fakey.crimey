# 🚀 Netlify Deployment Guide for Fakey.Crimey

## What Was Wrong?

Your project was missing critical configuration files:
- ❌ `package.json` - npm couldn't find dependencies
- ❌ `next.config.js` - Next.js had no configuration
- ❌ `tsconfig.json` - TypeScript wasn't configured
- ❌ `netlify.toml` - Netlify didn't know how to build your site

**Result:** Netlify couldn't build your project → "Website can't be found" error

---

## ✅ Fixed Files (I Created These)

| File | Purpose |
|------|---------|
| `package.json` | All npm dependencies and build scripts |
| `next.config.js` | Next.js optimization and configuration |
| `tsconfig.json` | TypeScript compiler options |
| `netlify.toml` | Netlify build and deployment config |
| `.gitignore` | Files to exclude from Git |

---

## 🔧 Deployment Steps

### Step 1: Prepare Your Local Project

```bash
# In your project root directory, place these files:
# (I've created them in /mnt/user-data/outputs/)

1. Copy package.json to your project root
2. Copy next.config.js to your project root
3. Copy tsconfig.json to your project root
4. Copy netlify.toml to your project root
5. Copy .gitignore to your project root
```

### Step 2: Install Dependencies Locally

```bash
# Install all npm packages
npm install
# or
pnpm install

# This should complete without errors
```

### Step 3: Test Build Locally

```bash
# Build the project locally first
npm run build

# This should succeed and create a .next folder
```

### Step 4: Push to GitHub

```bash
# Initialize git repo (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Fakey.Crimey setup"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/fakey-crimey.git
git push -u origin main
```

### Step 5: Connect to Netlify

**Option A: From Dashboard (Easy)**

1. Go to [netlify.com](https://netlify.com)
2. Sign up or log in
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your GitHub account
5. Select your `fakey-crimey` repository
6. Netlify will auto-detect settings from `netlify.toml` ✅
7. Click **"Deploy site"**

**Option B: From Command Line (Advanced)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

---

## ⚙️ Environment Variables on Netlify

After deployment, add your environment variables:

1. Go to your Netlify site dashboard
2. Click **"Site settings"** → **"Build & deploy"** → **"Environment"**
3. Add these variables:

```
DATABASE_URL = your_postgres_url
NEXTAUTH_URL = https://your-site.netlify.app
NEXTAUTH_SECRET = your_secret_key
GITHUB_ID = your_github_id
GITHUB_SECRET = your_github_secret
DISCORD_ID = your_discord_id
DISCORD_SECRET = your_discord_secret
STRIPE_SECRET_KEY = your_stripe_key
ANTHROPIC_API_KEY = your_anthropic_key
REDIS_URL = your_redis_url
CLOUDFLARE_ACCESS_KEY_ID = your_cloudflare_key
CLOUDFLARE_SECRET_ACCESS_KEY = your_cloudflare_secret
```

---

## 🔗 What Netlify Will Do

When you deploy, Netlify will:

1. **Install dependencies** → `npm install`
2. **Build the project** → `npm run build`
3. **Generate static files** → Creates `.next` folder
4. **Deploy to CDN** → Makes it live on the internet
5. **Auto-rebuilds** → When you push to GitHub

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at `https://your-site.netlify.app`
- [ ] Home page displays correctly
- [ ] Login/signup buttons work
- [ ] No 404 errors in console
- [ ] Build logs show "✓ Build succeeded"
- [ ] Environment variables are set

---

## 🐛 Troubleshooting

### "Build Failed" Error

Check the build logs:
1. Go to Netlify dashboard
2. Click **"Deploys"** tab
3. Click the failed deploy
4. Scroll to see error message

**Common issues:**

| Error | Fix |
|-------|-----|
| `npm ERR! code E404` | Package not found - check `package.json` |
| `ENOENT: no such file` | Missing file - ensure all files are pushed |
| `DATABASE_URL is required` | Add environment variables in Netlify settings |
| `Module not found` | Delete `node_modules` and reinstall |

### "Website Can't Be Found" (After deployment)

**This means:**
- Build succeeded ✓
- But Next.js isn't configured correctly ✗

**Fix:**
1. Verify `next.config.js` exists in root
2. Verify `netlify.toml` exists in root
3. Trigger a rebuild: Go to Netlify → **Deploys** → **Trigger deploy** → **Deploy site**

### Still Getting Errors?

1. **Check build logs:**
   ```
   Netlify Dashboard → Deploys → Click Deploy → Scroll down → View logs
   ```

2. **Test locally first:**
   ```bash
   npm run build  # Should succeed
   npm run start  # Should run without errors
   ```

3. **Verify all files exist:**
   ```bash
   ls -la package.json next.config.js tsconfig.json netlify.toml
   ```

---

## 🚀 Next: Production Checklist

Once deployed, complete this:

```
Database:
  [ ] PostgreSQL database created (Neon/Supabase)
  [ ] DATABASE_URL set in Netlify environment

Authentication:
  [ ] OAuth providers configured for production domain
  [ ] NEXTAUTH_SECRET is strong and random
  [ ] NEXTAUTH_URL matches your domain

Storage:
  [ ] Cloudflare R2 bucket created
  [ ] R2 credentials set in environment

Payments (if using):
  [ ] Stripe webhook configured
  [ ] STRIPE_SECRET_KEY set in environment

Monitoring:
  [ ] Error tracking enabled (Sentry)
  [ ] Analytics configured (PostHog/GA)
  [ ] Uptime monitoring enabled

Security:
  [ ] SSL/HTTPS enabled (automatic on Netlify)
  [ ] Security headers configured (in netlify.toml)
  [ ] Database backups enabled
  [ ] Rate limiting tested
```

---

## 📊 File Organization

Your project should now look like this:

```
fakey-crimey/
├── .gitignore                 ← NEW
├── .env.local                 (local only, not in git)
├── package.json               ← NEW
├── tsconfig.json              ← NEW
├── netlify.toml               ← NEW (critical for Netlify!)
├── next.config.js             ← NEW
├── prisma/
│   └── schema.prisma
├── src/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── services.ts
│   │   └── prisma.ts
│   ├── app/
│   │   ├── api/              (from api-routes.ts)
│   │   ├── auth/
│   │   ├── profile/
│   │   └── layout.tsx
│   └── components/
│       └── (from components.tsx)
├── README.md
├── SETUP_GUIDE.md
└── IMPLEMENTATION_ROADMAP.md
```

---

## 🎯 Summary

**What was wrong:**
- Missing `netlify.toml` → Netlify didn't know how to build
- Missing `package.json` → No npm dependencies installed
- Missing `next.config.js` → Next.js had no configuration

**What I fixed:**
- Created `package.json` with all dependencies
- Created `next.config.js` with Next.js optimizations
- Created `tsconfig.json` for TypeScript
- Created `netlify.toml` with proper build config
- Created `.gitignore` for clean version control

**What to do now:**
1. Copy these 5 files to your project root
2. Run `npm install` locally
3. Test with `npm run build`
4. Push to GitHub
5. Connect to Netlify

✅ Your site will now build and deploy correctly!

---

## 💬 Need More Help?

- **Netlify Docs:** https://docs.netlify.com/
- **Next.js Docs:** https://nextjs.org/docs
- **Netlify Support:** https://support.netlify.com/
- **Next.js Community:** https://nextjs.org/community

Good luck! 🚀
