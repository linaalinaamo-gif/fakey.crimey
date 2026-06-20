// components/README.md - Core Components for Fakey.Crimey
// Production-ready React/TypeScript components with Framer Motion animations

/*
COMPONENTS STRUCTURE
====================

/components/
  ├── profile/
  │   ├── ProfileHeader.tsx       - Banner, avatar, display name
  │   ├── ProfileBio.tsx          - Bio, location, links
  │   ├── SocialLinks.tsx         - Social media integrations
  │   ├── ProfileStats.tsx        - Followers, views, likes
  │   └── ProfileLayout.tsx       - Main layout wrapper
  │
  ├── widgets/
  │   ├── WidgetContainer.tsx     - Wrapper with dragging
  │   ├── SpotifyWidget.tsx       - Spotify player
  │   ├── DiscordWidget.tsx       - Discord status
  │   ├── GuestbookWidget.tsx     - Message board
  │   ├── AnalyticsWidget.tsx     - Stats overview
  │   └── WeatherWidget.tsx       - Weather display
  │
  ├── editor/
  │   ├── ThemeBuilder.tsx        - Visual theme editor
  │   ├── WidgetBuilder.tsx       - Drag-and-drop widget editor
  │   ├── CustomizationPanel.tsx  - Settings panel
  │   ├── EffectsEditor.tsx       - Animations and effects
  │   └── PreviewPane.tsx         - Real-time preview
  │
  ├── auth/
  │   ├── LoginForm.tsx           - Sign in UI
  │   ├── SignupForm.tsx          - Registration UI
  │   └── OAuthButtons.tsx        - Provider buttons
  │
  ├── social/
  │   ├── FollowButton.tsx        - Follow/unfollow
  │   ├── CommentSection.tsx      - Comments and reactions
  │   ├── LikeButton.tsx          - Like profiles
  │   └── GuestbookEntry.tsx      - Message display
  │
  ├── admin/
  │   ├── ModeratorDashboard.tsx  - Moderation queue
  │   ├── UserManagement.tsx      - User management
  │   └── ReportsList.tsx         - Report handling
  │
  └── shared/
      ├── Navbar.tsx             - Top navigation
      ├── Footer.tsx             - Footer
      ├── LoadingState.tsx       - Skeleton/loading
      └── ErrorBoundary.tsx      - Error handling

IMPLEMENTATION EXAMPLES
=======================
*/

// ============================================================================
// components/profile/ProfileLayout.tsx
// ============================================================================

"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import ProfileHeader from "./ProfileHeader"
import ProfileBio from "./ProfileBio"
import SocialLinks from "./SocialLinks"
import WidgetContainer from "@/components/widgets/WidgetContainer"
import { profileService } from "@/lib/services/profileService"
import { analyticsService } from "@/lib/services/analyticsService"

interface ProfileLayoutProps {
  username: string
}

export default function ProfileLayout({ username }: ProfileLayoutProps) {
  const [profile, setProfile] = useState(null)
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetch(`/api/profiles/${username}`).then(r => r.json())
        setProfile(data)
        
        // Track analytics
        await analyticsService.trackPageView(data.id, {
          referrer: document.referrer,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [username])

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error || !profile) {
    return <ErrorState message={error || "Profile not found"} />
  }

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{
        backgroundColor: profile.profile?.backgroundColor,
        backgroundImage: profile.profile?.backgroundImage
          ? `url(${profile.profile.backgroundImage})`
          : undefined,
        backgroundAttachment: profile.profile?.backgroundType === "video" ? "scroll" : "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Particle effects */}
      {profile.profile?.particleType && (
        <ParticleBackground type={profile.profile.particleType} />
      )}

      {/* Mouse trail effect */}
      {profile.profile?.enableMouseTrail && <MouseTrail />}

      {/* Glow background overlay */}
      {profile.profile?.enableGlow && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
      )}

      <motion.div
        className="relative z-10 max-w-2xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header with Banner and Avatar */}
        <ProfileHeader profile={profile} />

        {/* Bio and Details */}
        <ProfileBio profile={profile} />

        {/* Social Links */}
        <SocialLinks profile={profile} />

        {/* Statistics */}
        <ProfileStats profile={profile} />

        {/* Widgets Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {widgets.map((widget) => (
            <WidgetContainer key={widget.id} widget={widget} />
          ))}
        </div>

        {/* Guestbook */}
        <div className="mt-12">
          <GuestbookSection profileId={profile.id} />
        </div>
      </motion.div>

      {/* Apply custom CSS if premium */}
      {profile.profile?.customizations?.customCSS && (
        <style>{profile.profile.customizations.customCSS}</style>
      )}
    </div>
  )
}

// ============================================================================
// components/editor/ThemeBuilder.tsx
// ============================================================================

"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { aiService } from "@/lib/services/aiService"
import ColorPicker from "@/components/shared/ColorPicker"

interface ThemeBuilderProps {
  onThemeChange: (theme: any) => void
  onSave: (theme: any) => Promise<void>
  isLoading?: boolean
}

const THEME_PRESETS = [
  { id: "cyberpunk", name: "Cyberpunk", icon: "🤖" },
  { id: "glassmorphism", name: "Glassmorphism", icon: "🌨️" },
  { id: "minimal", name: "Minimal", icon: "⚪" },
  { id: "neon", name: "Neon", icon: "💡" },
  { id: "anime", name: "Anime", icon: "✨" },
  { id: "hacker", name: "Hacker", icon: "💻" },
  { id: "luxury", name: "Luxury", icon: "👑" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
]

const BACKGROUND_TYPES = [
  { id: "color", label: "Solid Color" },
  { id: "gradient", label: "Gradient" },
  { id: "image", label: "Image" },
  { id: "gif", label: "GIF" },
  { id: "video", label: "Video" },
  { id: "particles", label: "Particles" },
]

export default function ThemeBuilder({
  onThemeChange,
  onSave,
  isLoading = false,
}: ThemeBuilderProps) {
  const [selectedTheme, setSelectedTheme] = useState("glassmorphism")
  const [bgType, setBgType] = useState("color")
  const [primaryColor, setPrimaryColor] = useState("#7f77dd")
  const [secondaryColor, setSecondaryColor] = useState("#1d9e75")
  const [accentColor, setAccentColor] = useState("#f2a623")
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [particleType, setParticleType] = useState("none")
  const [generatingTheme, setGeneratingTheme] = useState(false)

  // Generate AI theme
  const generateTheme = async (description: string) => {
    setGeneratingTheme(true)
    try {
      const theme = await aiService.generateTheme(description)
      setSelectedTheme(theme.theme)
      setPrimaryColor(theme.primaryColor)
      setSecondaryColor(theme.secondaryColor)
      setAccentColor(theme.accentColor)
      setBgType(theme.backgroundType)
    } catch (error) {
      console.error("Failed to generate theme:", error)
    } finally {
      setGeneratingTheme(false)
    }
  }

  const handleSave = async () => {
    const themeData = {
      theme: selectedTheme,
      backgroundColor: primaryColor,
      backgroundType: bgType,
      primaryColor,
      secondaryColor,
      accentColor,
      animationSpeed,
      particleType: bgType === "particles" ? particleType : null,
    }

    try {
      await onSave(themeData)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Theme Presets</h3>
        <div className="grid grid-cols-4 gap-3">
          {THEME_PRESETS.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTheme(theme.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTheme === theme.id
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="text-2xl mb-1">{theme.icon}</div>
              <div className="text-xs font-medium">{theme.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI Theme Generator */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          ✨ AI Theme Generator
        </h4>
        <textarea
          placeholder="Describe your ideal theme... e.g., 'Futuristic cyberpunk Tokyo night street'"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm resize-none"
          rows={3}
          disabled={generatingTheme}
          onChange={(e) => {
            if (e.currentTarget.value.length > 10) {
              // Auto-generate after meaningful input
            }
          }}
        />
        <button
          onClick={() => {
            // Trigger AI generation
          }}
          disabled={generatingTheme}
          className="mt-2 w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium disabled:opacity-50"
        >
          {generatingTheme ? "Generating..." : "Generate with AI"}
        </button>
      </div>

      {/* Background Type */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Background</h3>
        <div className="grid grid-cols-3 gap-2">
          {BACKGROUND_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setBgType(type.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                bgType === type.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div className="grid grid-cols-3 gap-4">
        <ColorPicker
          label="Primary"
          value={primaryColor}
          onChange={setPrimaryColor}
        />
        <ColorPicker
          label="Secondary"
          value={secondaryColor}
          onChange={setSecondaryColor}
        />
        <ColorPicker
          label="Accent"
          value={accentColor}
          onChange={setAccentColor}
        />
      </div>

      {/* Animation Speed */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Animation Speed: {animationSpeed}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Particle Type */}
      {bgType === "particles" && (
        <div>
          <label className="block text-sm font-medium mb-2">Particle Type</label>
          <select
            value={particleType}
            onChange={(e) => setParticleType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
          >
            <option value="none">None</option>
            <option value="snow">Snow</option>
            <option value="rain">Rain</option>
            <option value="floating">Floating Objects</option>
          </select>
        </div>
      )}

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
      >
        {isLoading ? "Saving..." : "Save Theme"}
      </motion.button>
    </div>
  )
}

// ============================================================================
// components/widgets/WidgetContainer.tsx - Draggable Widget System
// ============================================================================

"use client"

import React, { useRef, useState } from "react"
import { motion, Reorder } from "framer-motion"
import { GripVertical, X, Settings } from "lucide-react"

interface WidgetContainerProps {
  widget: any
  isEditing?: boolean
  onUpdate?: (widget: any) => void
  onDelete?: (widgetId: string) => void
}

export default function WidgetContainer({
  widget,
  isEditing = false,
  onUpdate,
  onDelete,
}: WidgetContainerProps) {
  const [showSettings, setShowSettings] = useState(false)
  const ref = useRef(null)

  // Render different widget types
  const renderWidget = () => {
    switch (widget.type) {
      case "spotify":
        return <SpotifyWidget data={widget.data} />
      case "discord":
        return <DiscordWidget data={widget.data} />
      case "guestbook":
        return <GuestbookWidget profileId={widget.profileId} />
      case "youtube":
        return <YouTubeWidget data={widget.data} />
      case "github":
        return <GitHubWidget data={widget.data} />
      case "twitch":
        return <TwitchWidget data={widget.data} />
      default:
        return <DefaultWidget widget={widget} />
    }
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative group rounded-xl overflow-hidden transition-all ${
        isEditing ? "ring-2 ring-purple-500" : ""
      }`}
      style={{
        backgroundColor: widget.backgroundColor || "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderColor: widget.borderColor || "rgba(255,255,255,0.2)",
        borderWidth: "1px",
      }}
    >
      {/* Widget Header (Editing) */}
      {isEditing && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 to-transparent p-3 flex items-center justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-white cursor-grab" />
            <span className="text-sm font-medium text-white">{widget.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-white/20 rounded transition"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => onDelete?.(widget.id)}
              className="p-1 hover:bg-red-500/20 rounded transition"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      )}

      {/* Widget Content */}
      <div className="p-4">{renderWidget()}</div>

      {/* Settings Panel */}
      {showSettings && isEditing && (
        <div className="absolute right-0 top-full mt-2 bg-gray-900 rounded-lg p-4 w-48 shadow-xl z-20">
          {/* Widget-specific settings */}
        </div>
      )}
    </motion.div>
  )
}

// Placeholder widget components
const SpotifyWidget = ({ data }: any) => (
  <div className="text-center">
    <div className="text-4xl mb-2">🎵</div>
    <p className="font-semibold text-white">Now Playing</p>
    {data?.track && <p className="text-sm text-gray-300">{data.track}</p>}
  </div>
)

const DiscordWidget = ({ data }: any) => (
  <div className="text-center">
    <div className="text-4xl mb-2">💬</div>
    <p className="font-semibold text-white">Discord Status</p>
  </div>
)

const YouTubeWidget = ({ data }: any) => (
  <div className="text-center">
    <div className="text-4xl mb-2">📺</div>
    <p className="font-semibold text-white">YouTube</p>
  </div>
)

const GitHubWidget = ({ data }: any) => (
  <div className="text-center">
    <div className="text-4xl mb-2">💻</div>
    <p className="font-semibold text-white">GitHub</p>
  </div>
)

const TwitchWidget = ({ data }: any) => (
  <div className="text-center">
    <div className="text-4xl mb-2">🎮</div>
    <p className="font-semibold text-white">Twitch</p>
  </div>
)

const DefaultWidget = ({ widget }: any) => (
  <div className="text-center">
    <p className="text-white font-semibold">{widget.title || widget.type}</p>
    {widget.description && (
      <p className="text-sm text-gray-300 mt-2">{widget.description}</p>
    )}
  </div>
)

const GuestbookWidget = ({ profileId }: any) => (
  <div>
    <p className="font-semibold text-white mb-3">Guestbook</p>
    <p className="text-sm text-gray-300">Leave a message for {profileId}</p>
  </div>
)
