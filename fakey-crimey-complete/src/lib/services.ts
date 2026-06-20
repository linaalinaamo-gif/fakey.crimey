// lib/services/README.md - Core Services for Fakey.Crimey
// Production-ready service layer for profiles, AI, storage, and widgets

/*
SERVICE LAYER ARCHITECTURE
===========================

/lib/services/
  ├── profileService.ts      - Profile CRUD, customization
  ├── analyticsService.ts    - Analytics and heatmap tracking
  ├── widgetService.ts       - Widget management and rendering
  ├── aiService.ts           - AI-powered theme/bio generation
  ├── storageService.ts      - Cloudflare R2 file uploads
  ├── socialService.ts       - Following, likes, comments
  ├── subscriptionService.ts - Stripe integration
  └── moderationService.ts   - Content moderation and reporting

IMPLEMENTATION EXAMPLES
=======================
*/

// ============================================================================
// profileService.ts - Profile Management
// ============================================================================

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const profileService = {
  // Get public profile with stats
  async getPublicProfile(username: string) {
    return prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: {
        id: true,
        username: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            bio: true,
            avatar: true,
            banner: true,
            location: true,
            age: true,
            pronouns: true,
            customStatus: true,
            website: true,
            theme: true,
            layout: true,
            backgroundColor: true,
            backgroundImage: true,
            backgroundVideo: true,
            backgroundType: true,
            enableGlow: true,
            enableMouseTrail: true,
            particleType: true,
            animationSpeed: true,
            fontFamily: true,
            textColor: true,
            isVerified: true,
            customDomain: true,
            badges: true,
            totalViews: true,
            customizations: {
              select: {
                primaryColor: true,
                secondaryColor: true,
                accentColor: true,
                customCSS: true,
              },
            },
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            likes: true,
          },
        },
      },
    })
  },

  // Update profile
  async updateProfile(
    userId: string,
    data: Prisma.ProfileUpdateInput
  ) {
    return prisma.profile.update({
      where: { userId },
      data,
    })
  },

  // Get profile with widgets
  async getProfileWithWidgets(username: string) {
    const user = await this.getPublicProfile(username)
    if (!user?.profile) return null

    const widgets = await prisma.widget.findMany({
      where: {
        profile: { userId: user.id },
        isPublic: true,
      },
      orderBy: { position: "asc" },
    })

    return {
      ...user,
      widgets,
    }
  },

  // Update customization
  async updateCustomization(
    profileId: string,
    data: Prisma.CustomizationUpdateInput
  ) {
    return prisma.customization.upsert({
      where: { profileId },
      update: data,
      create: {
        profileId,
        ...data,
      },
    })
  },

  // Get profile customization
  async getCustomization(profileId: string) {
    return prisma.customization.findUnique({
      where: { profileId },
    })
  },
}

// ============================================================================
// aiService.ts - AI-Powered Theme & Bio Generation
// ============================================================================

import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic()

export const aiService = {
  // Generate bio based on context
  async generateBio(context: {
    name?: string
    interests?: string[]
    tone?: string
  }): Promise<string> {
    const prompt = `Generate a creative, concise social media bio (max 150 chars) for someone with the following context:
Name: ${context.name || "Not provided"}
Interests: ${context.interests?.join(", ") || "Not specified"}
Tone: ${context.tone || "Professional yet approachable"}

Return ONLY the bio text, no quotes or explanations.`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    })

    const bioText = message.content[0]
    if (bioText.type === "text") {
      return bioText.text.trim().slice(0, 150)
    }
    return "Creative digital presence"
  },

  // Generate theme based on description
  async generateTheme(description: string): Promise<{
    theme: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundType: string
    suggestions: string[]
  }> {
    const prompt = `Based on this description, generate a cohesive theme for a personal profile page:
"${description}"

Respond with JSON (no markdown):
{
  "theme": "one of: cyberpunk, glassmorphism, minimal, neon, anime, hacker, luxury, gaming",
  "primaryColor": "#hex code",
  "secondaryColor": "#hex code",
  "accentColor": "#hex code",
  "backgroundType": "one of: color, gradient, particles, video",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Ensure colors complement the theme and are vibrant but professional.`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    })

    const responseText = message.content[0]
    if (responseText.type !== "text") {
      throw new Error("Unexpected response type")
    }

    try {
      return JSON.parse(responseText.text)
    } catch {
      // Fallback if parsing fails
      return {
        theme: "glassmorphism",
        primaryColor: "#7f77dd",
        secondaryColor: "#1d9e75",
        accentColor: "#f2a623",
        backgroundType: "gradient",
        suggestions: [
          "Add social links",
          "Enable glow effects",
          "Use glassmorphism widgets",
        ],
      }
    }
  },

  // Generate username suggestions
  async generateUsernameIdeas(context: {
    name?: string
    interests?: string[]
    style?: string
  }): Promise<string[]> {
    const prompt = `Generate 5 creative, unique usernames for someone:
Name: ${context.name || "Not provided"}
Interests: ${context.interests?.join(", ") || "Tech, design, music"}
Style: ${context.style || "Modern, trendy"}

Requirements:
- 4-20 characters
- Alphanumeric and underscores only
- Memorable and brandable
- Different from common usernames

Return as JSON array of strings only: ["username1", "username2", ...]`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    })

    const responseText = message.content[0]
    if (responseText.type !== "text") {
      return []
    }

    try {
      return JSON.parse(responseText.text)
    } catch {
      return ["creative_soul", "digital_nomad", "idea_maker"]
    }
  },
}

// ============================================================================
// storageService.ts - Cloudflare R2 File Uploads
// ============================================================================

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
})

export const storageService = {
  // Upload file to R2
  async uploadFile(
    file: Buffer | Blob,
    filename: string,
    options?: { contentType?: string }
  ): Promise<string> {
    const key = `uploads/${Date.now()}-${filename}`

    const buffer = file instanceof Blob
      ? Buffer.from(await file.arrayBuffer())
      : file

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: options?.contentType || "application/octet-stream",
      })
    )

    return `${process.env.CLOUDFLARE_R2_DOMAIN}/${key}`
  },

  // Delete file from R2
  async deleteFile(filename: string): Promise<void> {
    const key = filename.replace(process.env.CLOUDFLARE_R2_DOMAIN! + "/", "")

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
        Key,
      })
    )
  },

  // Validate image
  validateImage(file: File): {
    valid: boolean
    error?: string
  } {
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

    if (file.size > MAX_SIZE) {
      return { valid: false, error: "File size exceeds 5MB limit" }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: "Invalid file type" }
    }

    return { valid: true }
  },
}

// ============================================================================
// widgetService.ts - Widget Management
// ============================================================================

export const widgetService = {
  // Create widget
  async createWidget(profileId: string, data: {
    type: string
    title?: string
    data?: any
  }) {
    return prisma.widget.create({
      data: {
        profileId,
        ...data,
        position: (await prisma.widget.count({
          where: { profileId },
        })) + 1,
      },
    })
  },

  // Get all widgets for profile
  async getWidgets(profileId: string, publicOnly = false) {
    return prisma.widget.findMany({
      where: {
        profileId,
        ...(publicOnly && { isPublic: true }),
      },
      orderBy: { position: "asc" },
    })
  },

  // Update widget
  async updateWidget(widgetId: string, data: Prisma.WidgetUpdateInput) {
    return prisma.widget.update({
      where: { id: widgetId },
      data,
    })
  },

  // Delete widget
  async deleteWidget(widgetId: string) {
    return prisma.widget.delete({
      where: { id: widgetId },
    })
  },

  // Reorder widgets
  async reorderWidgets(widgetIds: string[]) {
    const updates = widgetIds.map((id, index) =>
      prisma.widget.update({
        where: { id },
        data: { position: index },
      })
    )
    return prisma.$transaction(updates)
  },

  // Widget type validation
  validateWidget(type: string): boolean {
    const VALID_TYPES = [
      "spotify",
      "youtube",
      "discord",
      "steam",
      "github",
      "twitch",
      "roblox",
      "calendar",
      "countdown",
      "visitor_counter",
      "guestbook",
      "weather",
      "quote",
    ]
    return VALID_TYPES.includes(type)
  },
}

// ============================================================================
// socialService.ts - Social Features (Follow, Like, Comments)
// ============================================================================

export const socialService = {
  // Follow user
  async followUser(followerId: string, followingId: string) {
    return prisma.follow.create({
      data: { followerId, followingId },
    })
  },

  // Unfollow user
  async unfollowUser(followerId: string, followingId: string) {
    return prisma.follow.deleteMany({
      where: { followerId, followingId },
    })
  },

  // Check if following
  async isFollowing(followerId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    })
    return !!follow
  },

  // Like profile
  async likeProfile(userId: string, profileId: string) {
    return prisma.like.create({
      data: { userId, profileId },
    })
  },

  // Unlike profile
  async unlikeProfile(userId: string, profileId: string) {
    return prisma.like.deleteMany({
      where: { userId, profileId },
    })
  },

  // Create comment
  async createComment(userId: string, profileId: string, content: string) {
    return prisma.comment.create({
      data: { userId, profileId, content },
    })
  },

  // Get comments for profile
  async getComments(profileId: string, limit = 50, skip = 0) {
    return prisma.comment.findMany({
      where: { profileId },
      include: {
        user: { select: { username: true, avatar: true } },
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    })
  },

  // Add emoji reaction to comment
  async addReaction(userId: string, commentId: string, emoji: string) {
    return prisma.reaction.create({
      data: { userId, commentId, emoji },
    })
  },
}

// ============================================================================
// subscriptionService.ts - Stripe Integration
// ============================================================================

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const subscriptionService = {
  // Create checkout session
  async createCheckoutSession(userId: string, tier: "pro" | "enterprise") {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error("User not found")

    const priceIds = {
      pro: process.env.STRIPE_PRICE_PRO!,
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIds[tier],
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/settings/subscription?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/settings/subscription`,
    })

    return session
  },

  // Sync subscription from Stripe
  async syncSubscription(stripeCustomerId: string) {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
    })

    if (subscriptions.data.length === 0) return null

    const subscription = subscriptions.data[0]
    const product = await stripe.products.retrieve(
      subscription.items.data[0].price.product as string
    )

    return {
      status: subscription.status,
      tier: product.metadata.tier || "free",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  },

  // Update subscription features in DB
  async updateSubscriptionFeatures(userId: string, tier: string) {
    const features = {
      free: {
        customDomain: false,
        advancedAnalytics: false,
        premiumThemes: false,
        customCSS: false,
        unlimitedWidgets: false,
        aiFeatures: false,
      },
      pro: {
        customDomain: true,
        advancedAnalytics: true,
        premiumThemes: true,
        customCSS: true,
        unlimitedWidgets: true,
        aiFeatures: false,
      },
      enterprise: {
        customDomain: true,
        advancedAnalytics: true,
        premiumThemes: true,
        customCSS: true,
        unlimitedWidgets: true,
        aiFeatures: true,
      },
    }

    return prisma.subscription.upsert({
      where: { userId },
      update: features[tier as keyof typeof features],
      create: {
        userId,
        tier,
        ...features[tier as keyof typeof features],
      },
    })
  },
}
