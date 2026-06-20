// app/STRUCTURE.txt - Fakey.Crimey Project File Structure

fakey-crimey/
│
├── app/                              # Next.js 15 app directory
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page (landing)
│   ├── (auth)/                       # Auth route group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (public)/                     # Public pages
│   │   ├── discover/page.tsx         # Discover profiles
│   │   ├── trending/page.tsx         # Trending creators
│   │   └── [username]/               # Public profile route
│   │       └── page.tsx
│   ├── (dashboard)/                  # Protected routes
│   │   ├── editor/page.tsx           # Profile editor
│   │   ├── settings/                 # User settings
│   │   │   ├── profile/page.tsx
│   │   │   ├── account/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   └── integrations/page.tsx
│   │   ├── analytics/page.tsx        # Analytics dashboard
│   │   ├── widgets/page.tsx          # Widget management
│   │   ├── guestbook/page.tsx        # Guestbook viewer
│   │   └── layout.tsx                # Dashboard layout
│   ├── (admin)/                      # Admin routes
│   │   ├── moderation/page.tsx
│   │   ├── users/page.tsx
│   │   ├── reports/page.tsx
│   │   └── layout.tsx
│   ├── api/                          # API routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── profiles/[username]/route.ts
│   │   ├── analytics/track/route.ts
│   │   ├── widgets/route.ts
│   │   ├── social/route.ts
│   │   ├── subscriptions/route.ts
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts
│   │   └── admin/route.ts
│   └── (marketing)/                  # Marketing pages
│       ├── layout.tsx
│       ├── pricing/page.tsx
│       ├── features/page.tsx
│       └── about/page.tsx
│
├── components/
│   ├── profile/
│   │   ├── ProfileLayout.tsx
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileBio.tsx
│   │   ├── ProfileStats.tsx
│   │   └── SocialLinks.tsx
│   ├── editor/
│   │   ├── ThemeBuilder.tsx
│   │   ├── WidgetBuilder.tsx
│   │   ├── EffectsEditor.tsx
│   │   └── PreviewPane.tsx
│   ├── widgets/
│   │   ├── WidgetContainer.tsx
│   │   ├── SpotifyWidget.tsx
│   │   ├── DiscordWidget.tsx
│   │   ├── GuestbookWidget.tsx
│   │   └── AnalyticsWidget.tsx
│   ├── social/
│   │   ├── FollowButton.tsx
│   │   ├── CommentSection.tsx
│   │   ├── LikeButton.tsx
│   │   └── GuestbookEntry.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── OAuthButtons.tsx
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ColorPicker.tsx
│   └── admin/
│       ├── ModeratorDashboard.tsx
│       ├── UserManagement.tsx
│       └── ReportsList.tsx
│
├── lib/
│   ├── auth.ts                       # Auth.js configuration
│   ├── prisma.ts                     # Prisma client
│   ├── middleware.ts                 # Auth middleware
│   ├── utils.ts                      # Utility functions
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProfile.ts
│   │   ├── useAnalytics.ts
│   │   └── useWidgets.ts
│   ├── services/
│   │   ├── profileService.ts
│   │   ├── analyticsService.ts
│   │   ├── widgetService.ts
│   │   ├── aiService.ts
│   │   ├── storageService.ts
│   │   ├── socialService.ts
│   │   ├── subscriptionService.ts
│   │   └── moderationService.ts
│   └── validators/
│       ├── profile.ts
│       ├── widget.ts
│       ├── auth.ts
│       └── social.ts
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Test data seeding
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── svg/
│
├── styles/
│   ├── globals.css
│   ├── animations.css
│   └── themes.css
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
│
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── deploy.yml
│       └── lint.yml
│
├── .env.example
├── .env.local (gitignored)
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── package.json
├── pnpm-lock.yaml
├── README.md
└── IMPLEMENTATION_ROADMAP.md


// ============================================================================
// app/layout.tsx - Root Layout with Providers
// ============================================================================

import type { Metadata } from 'next'
import { Providers } from '@/lib/providers'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Fakey.Crimey - Create Your Premium Profile',
  description: 'Build an impressive personal profile with widgets, themes, analytics, and more',
  metadataBase: new URL('https://fakey.crimey'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}


// ============================================================================
// app/page.tsx - Home/Landing Page
// ============================================================================

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-purple-900 via-black to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Premium Profile Awaits
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Create a stunning personal page with customizable themes, widgets, analytics, and social features
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Advanced Customization"
              description="8 themes, custom colors, animations, effects, and more"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Drag & Drop Widgets"
              description="Add Spotify, Discord, GitHub, YouTube, and 20+ more integrations"
            />
            {/* Add more features */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-purple-900/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to stand out?
          </h2>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Create Your Profile Now
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="text-purple-500 mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}


// ============================================================================
// app/(public)/[username]/page.tsx - Public Profile Page
// ============================================================================

import { notFound } from 'next/navigation'
import ProfileLayout from '@/components/profile/ProfileLayout'
import { profileService } from '@/lib/services/profileService'

export async function generateMetadata({ params }: any) {
  const profile = await profileService.getPublicProfile(params.username)
  
  if (!profile) {
    return { title: 'Profile not found' }
  }

  return {
    title: `${profile.profile?.displayName || profile.username} - Fakey.Crimey`,
    description: profile.profile?.bio || 'Check out my profile on Fakey.Crimey',
    openGraph: {
      title: profile.profile?.displayName || profile.username,
      description: profile.profile?.bio,
      images: [
        {
          url: profile.profile?.banner || '/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  return <ProfileLayout username={params.username} />
}


// ============================================================================
// app/(dashboard)/editor/page.tsx - Profile Editor
// ============================================================================

'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import ThemeBuilder from '@/components/editor/ThemeBuilder'
import WidgetBuilder from '@/components/editor/WidgetBuilder'
import PreviewPane from '@/components/editor/PreviewPane'

export default function EditorPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })

  const [activeTab, setActiveTab] = useState('theme')
  const [theme, setTheme] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveTheme = async (themeData: any) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profiles/' + session?.user?.username + '/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData),
      })

      if (response.ok) {
        setTheme(themeData)
        // Show success toast
      }
    } catch (error) {
      console.error('Failed to save theme:', error)
      // Show error toast
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-8 min-h-screen">
      {/* Editor Panel */}
      <div className="col-span-1 bg-gray-900 p-6 border-r border-gray-800 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Profile Editor</h1>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'theme'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Theme
          </button>
          <button
            onClick={() => setActiveTab('widgets')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'widgets'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Widgets
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'effects'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Effects
          </button>
        </div>

        {activeTab === 'theme' && (
          <ThemeBuilder onSave={handleSaveTheme} isLoading={isSaving} onThemeChange={setTheme} />
        )}
        {activeTab === 'widgets' && <WidgetBuilder />}
      </div>

      {/* Preview Pane */}
      <div className="col-span-2 bg-black p-6">
        <h2 className="text-xl font-bold text-white mb-4">Live Preview</h2>
        <PreviewPane theme={theme} />
      </div>
    </div>
  )
}


// ============================================================================
// lib/providers.tsx - Context Providers
// ============================================================================

'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {/* Add more providers as needed */}
      {children}
    </SessionProvider>
  )
}


// ============================================================================
// lib/middleware.ts - Route Protection
// ============================================================================

import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/editor')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || !session.user.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/editor/:path*', '/settings/:path*', '/admin/:path*'],
}


// ============================================================================
// Key npm scripts to add to package.json
// ============================================================================

{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "db:seed": "node prisma/seed.ts",
    "test": "jest",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:storage": "node scripts/test-storage.js",
    "test:ai": "node scripts/test-ai.js"
  }
}
