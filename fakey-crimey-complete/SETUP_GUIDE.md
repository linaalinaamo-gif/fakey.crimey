// .env.example - Fakey.Crimey Environment Variables
// Copy this to .env.local and fill in your values

# ============================================================================
# DATABASE
# ============================================================================

# PostgreSQL connection string
# Example: postgresql://user:password@localhost:5432/fakey_crimey
DATABASE_URL="postgresql://..."

# Direct connection string for migrations (if different from main connection)
DATABASE_URL_DIRECT="postgresql://..."

# ============================================================================
# AUTHENTICATION
# ============================================================================

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"

# OAuth Providers
GITHUB_ID="your_github_oauth_app_id"
GITHUB_SECRET="your_github_oauth_app_secret"

DISCORD_ID="your_discord_app_id"
DISCORD_SECRET="your_discord_app_secret"

GOOGLE_ID="your_google_oauth_app_id"
GOOGLE_SECRET="your_google_oauth_app_secret"

SPOTIFY_ID="your_spotify_app_id"
SPOTIFY_SECRET="your_spotify_app_secret"

TWITCH_ID="your_twitch_app_id"
TWITCH_SECRET="your_twitch_app_secret"

# ============================================================================
# STORAGE (Cloudflare R2)
# ============================================================================

CLOUDFLARE_ACCESS_KEY_ID="your_cloudflare_access_key"
CLOUDFLARE_SECRET_ACCESS_KEY="your_cloudflare_secret_key"
CLOUDFLARE_R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
CLOUDFLARE_R2_BUCKET="fakey-crimey-uploads"
CLOUDFLARE_R2_DOMAIN="https://uploads.fakey.crimey"

# ============================================================================
# PAYMENT PROCESSING (Stripe)
# ============================================================================

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Product IDs in Stripe
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_ENTERPRISE="price_..."

# ============================================================================
# AI (Anthropic)
# ============================================================================

ANTHROPIC_API_KEY="sk-ant-..."

# ============================================================================
# CACHE & QUEUE (Redis)
# ============================================================================

REDIS_URL="redis://localhost:6379"
# or for managed Redis (e.g., Upstash):
# REDIS_URL="redis://:password@host:port"

# ============================================================================
# EMAIL (SendGrid or Resend)
# ============================================================================

SENDGRID_API_KEY="SG...."
# or
RESEND_API_KEY="re_..."

# Default sender email
EMAILS_FROM_EMAIL="noreply@fakey.crimey"

# ============================================================================
# MONITORING & ANALYTICS
# ============================================================================

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN="https://key@sentry.io/project-id"
SENTRY_AUTH_TOKEN="sntr_..."

# PostHog (Product Analytics)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Google Analytics
NEXT_PUBLIC_GA_ID="G-..."

# ============================================================================
# FEATURE FLAGS & CONFIGURATION
# ============================================================================

# Feature toggles
NEXT_PUBLIC_ENABLE_AI_FEATURES="true"
NEXT_PUBLIC_ENABLE_CUSTOM_DOMAINS="true"
NEXT_PUBLIC_ENABLE_TEAM_COLLABORATION="false"
NEXT_PUBLIC_BETA_FEATURES="false"

# Site configuration
NEXT_PUBLIC_SITE_URL="https://fakey.crimey"
NEXT_PUBLIC_SITE_NAME="Fakey.Crimey"
NEXT_PUBLIC_SUPPORT_EMAIL="support@fakey.crimey"

# ============================================================================
# EXTERNAL SERVICES
# ============================================================================

# IP Geolocation
MAXMIND_LICENSE_KEY="your_license_key"

# Cloudflare Turnstile (CAPTCHA)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your_site_key"
TURNSTILE_SECRET_KEY="your_secret_key"

# ============================================================================
# DEVELOPMENT
# ============================================================================

NODE_ENV="development"
DEBUG="false"

# ============================================================================
# INTERNAL (Don't share these!)
# ============================================================================

ADMIN_EMAIL="admin@fakey.crimey"
JWT_SECRET="generate with: openssl rand -base64 32"


// SETUP GUIDE - Getting Fakey.Crimey Running Locally
// ====================================================

PREREQUISITES
=============

- Node.js 18+ (nvm recommended)
- PostgreSQL 14+ (local or Neon)
- Git
- pnpm or npm


STEP 1: Clone & Install
========================

```bash
# Clone repository
git clone https://github.com/yourusername/fakey-crimey.git
cd fakey-crimey

# Install dependencies
pnpm install
# or
npm install

# Verify Node version
node --version  # Should be 18+
```


STEP 2: Set Up Database
========================

Option A: Using Neon (Recommended for development)
```bash
# 1. Go to neon.tech and create free account
# 2. Create new project
# 3. Copy connection string
# 4. Add to .env.local:
#    DATABASE_URL="postgresql://user:password@host/database"

# 5. Run migrations
pnpm db:push
```

Option B: Using Local PostgreSQL
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb fakey_crimey

# Create user (optional)
createuser fakey_dev

# Get connection string
# DATABASE_URL="postgresql://localhost:5432/fakey_crimey"

# Run migrations
pnpm db:push
```

Option C: Using Docker
```bash
# Start PostgreSQL container
docker run --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fakey_crimey \
  -p 5432:5432 \
  -d postgres:15

# CONNECTION_STRING="postgresql://postgres:postgres@localhost:5432/fakey_crimey"
```


STEP 3: Configure Authentication
==================================

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
# Copy output to .env.local as NEXTAUTH_SECRET

# For OAuth, set up providers:

1. GitHub OAuth App
   - Go to github.com/settings/developers
   - New OAuth App
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
   - Copy ID and Secret to .env.local

2. Discord Application
   - Go to discord.com/developers/applications
   - New Application
   - OAuth2 > Redirect: http://localhost:3000/api/auth/callback/discord
   - Copy ID and Secret to .env.local

3. Google OAuth
   - Go to console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Authorized redirect: http://localhost:3000/api/auth/callback/google
   - Copy ID and Secret to .env.local

4. Spotify OAuth
   - Go to developer.spotify.com/dashboard
   - Create app
   - Redirect URI: http://localhost:3000/api/auth/callback/spotify
   - Copy ID and Secret to .env.local

5. Twitch OAuth
   - Go to dev.twitch.tv/console/apps
   - Create application
   - OAuth Redirect URL: http://localhost:3000/api/auth/callback/twitch
   - Copy ID and Secret to .env.local
```


STEP 4: Set Up Storage (Cloudflare R2)
=======================================

```bash
# 1. Create Cloudflare account at cloudflare.com
# 2. Go to R2 > Create bucket
# 3. Bucket name: fakey-crimey-uploads
# 4. Create API token:
#    - R2 API Tokens > Create API token
#    - All buckets
#    - Read/Write permissions
# 5. Note: Account ID, Access Key, Secret Key
# 6. Create custom domain for uploads:
#    - R2 settings > Domain
#    - Connect custom domain: uploads.fakey.crimey

# Add to .env.local:
# CLOUDFLARE_ACCESS_KEY_ID="..."
# CLOUDFLARE_SECRET_ACCESS_KEY="..."
# CLOUDFLARE_R2_ENDPOINT="https://account-id.r2.cloudflarestorage.com"
# CLOUDFLARE_R2_BUCKET="fakey-crimey-uploads"
# CLOUDFLARE_R2_DOMAIN="https://uploads.fakey.crimey"

# Test upload
pnpm run test:storage
```


STEP 5: Set Up Redis (For Caching & Queues)
=============================================

Option A: Local Redis
```bash
# macOS
brew install redis
brew services start redis

# Verify
redis-cli ping  # Should return "PONG"

# CONNECTION: redis://localhost:6379
```

Option B: Using Docker
```bash
docker run --name redis -p 6379:6379 -d redis:7
```

Option C: Managed Service (Upstash)
```bash
# 1. Go to upstash.com
# 2. Create Redis database
# 3. Copy connection URL
# REDIS_URL="redis://default:password@host:port"
```

Add to .env.local:
```
REDIS_URL="redis://localhost:6379"
```


STEP 6: Set Up Stripe (Optional for Testing)
==============================================

```bash
# 1. Go to stripe.com and create account
# 2. Go to API keys > Reveal test key
# 3. Copy Publishable and Secret keys
# 4. Create products & prices in Stripe dashboard

# Add to .env.local:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_SECRET_KEY="sk_test_..."

# For webhooks:
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
# stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy webhook signing secret to STRIPE_WEBHOOK_SECRET

# For testing:
# Use test card: 4242 4242 4242 4242
# Any future expiry, any CVC
```


STEP 7: Set Up AI (Anthropic)
==============================

```bash
# 1. Go to console.anthropic.com
# 2. Create API key
# 3. Add to .env.local:
# ANTHROPIC_API_KEY="sk-ant-..."

# Test:
pnpm run test:ai
```


STEP 8: Complete .env.local
=============================

Copy .env.example to .env.local:
```bash
cp .env.example .env.local
```

Fill in all values from steps above.


STEP 9: Run Database Migrations
================================

```bash
# Create and apply migrations
pnpm db:push

# View Prisma Studio (optional)
pnpm db:studio

# Should open at http://localhost:5555
```


STEP 10: Start Development Server
===================================

```bash
# Start Next.js dev server
pnpm dev

# Should output:
# ▲ Next.js 15.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
```

Visit http://localhost:3000


STEP 11: Create Admin User (Optional)
======================================

```bash
# Access Prisma Studio
pnpm db:studio

# Create user manually:
# - id: "admin-001" (or use cuid)
# - email: "admin@fakey.crimey"
# - username: "admin"
# - password: (leave empty for OAuth only, or hash with bcrypt)
# - isAdmin: true
# - isActive: true
```

Or use signup flow and manually update with Prisma Studio.


COMMON COMMANDS
===============

```bash
# Development
pnpm dev              # Start dev server
pnpm db:push          # Update database schema
pnpm db:studio        # Open Prisma UI
pnpm db:reset         # Reset database (dev only)
pnpm db:seed          # Seed test data
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm type-check       # Check TypeScript

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:coverage    # Generate coverage report

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Create migration
pnpm db:studio        # Open database UI
```


TROUBLESHOOTING
===============

1. "Database connection failed"
   - Check DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Run: pnpm db:push

2. "Auth provider not working"
   - Verify OAuth credentials in .env.local
   - Check redirect URIs match exactly
   - Ensure NEXTAUTH_URL is correct for environment

3. "Storage upload fails"
   - Verify R2 credentials
   - Check bucket permissions
   - Test with: pnpm run test:storage

4. "Redis connection error"
   - Ensure Redis is running: redis-cli ping
   - Check REDIS_URL format
   - May run without Redis in dev (will be slower)

5. "Port 3000 already in use"
   - Kill process: lsof -i :3000 then kill -9 PID
   - Or run on different port: pnpm dev --port 3001

6. "Node modules issues"
   - Remove node_modules and lock file:
     rm -rf node_modules pnpm-lock.yaml
   - Reinstall: pnpm install


DEPLOYMENT CHECKLIST
====================

Before deploying to production:

Database:
  [ ] PostgreSQL database created
  [ ] Backups configured
  [ ] Connection pooling set up

Authentication:
  [ ] OAuth providers configured for production URLs
  [ ] NEXTAUTH_SECRET set securely
  [ ] Session timeout configured

Storage:
  [ ] R2 bucket created with correct permissions
  [ ] CDN configured
  [ ] Bucket lifecycle policies

Payments:
  [ ] Stripe account verified
  [ ] Products & prices created
  [ ] Webhook secret configured
  [ ] Tax rates configured (if applicable)

AI:
  [ ] Anthropic API key set
  [ ] Rate limits/budget configured
  [ ] Error handling tested

Monitoring:
  [ ] Sentry project created
  [ ] PostHog configured
  [ ] Google Analytics set up
  [ ] Uptime monitoring enabled

Email:
  [ ] SendGrid/Resend account created
  [ ] Email templates configured
  [ ] Sender domain verified

Security:
  [ ] SSL certificate installed
  [ ] CORS configured correctly
  [ ] Rate limiting enabled
  [ ] CSP headers set

Performance:
  [ ] Database indexes created
  [ ] Caching strategy implemented
  [ ] Images optimized
  [ ] Code splitting verified

Documentation:
  [ ] README updated
  [ ] API docs completed
  [ ] Deployment guide created
  [ ] Status page set up


NEXT STEPS AFTER SETUP
======================

1. Familiarize yourself with codebase structure
2. Review IMPLEMENTATION_ROADMAP.md
3. Start Phase 1 tasks (foundation)
4. Set up GitHub/GitLab for version control
5. Configure CI/CD pipeline (GitHub Actions, etc.)
6. Create project tracking (Linear, Jira, etc.)
7. Set up Slack notifications
8. Plan weekly development sprints


RESOURCES
=========

Documentation:
- https://nextjs.org/docs
- https://www.prisma.io/docs
- https://next-auth.js.org
- https://framer.com/motion
- https://stripe.com/docs
- https://www.anthropic.com/docs

Community:
- Next.js Discord: https://discord.gg/nextjs
- Prisma Community: https://discord.gg/prisma
- Stripe Community: https://stripe.com/community

Support:
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Email: support@fakey.crimey

Questions or issues? Create a GitHub issue or reach out!
