// lib/auth.ts - Fakey.Crimey Authentication Configuration
// Production-ready Auth.js setup with OAuth and custom providers

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Discord from "next-auth/providers/discord"
import Google from "next-auth/providers/google"
import Spotify from "next-auth/providers/spotify"
import Twitch from "next-auth/providers/twitch"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/onboarding",
  },

  events: {
    async signIn({ user, account }) {
      // Log sign in activity
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })
      }
    },
    async signOut() {
      // Handle sign out cleanup
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user is banned
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (existingUser?.isBanned) {
        return false
      }

      // Generate username from email if needed
      if (!user.username) {
        let username = user.email!.split("@")[0]
        let isUnique = false
        let counter = 1

        while (!isUnique) {
          const existing = await prisma.user.findUnique({
            where: { username },
          })
          if (!existing) {
            isUnique = true
          } else {
            username = `${user.email!.split("@")[0]}${counter}`
            counter++
          }
        }

        user.username = username
      }

      return true
    },

    async redirect({ url, baseUrl }) {
      // Only allow redirects to relative URLs or same domain
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.isAdmin = user.isAdmin
        token.isModerator = user.isModerator
      }

      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.isModerator = token.isModerator as boolean
      }
      return session
    },
  },

  providers: [
    // Email + Password
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        if (user.isBanned) {
          throw new Error("Your account has been suspended")
        }

        const passwordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.isAdmin,
          isModerator: user.isModerator,
        }
      },
    }),

    // OAuth Providers
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    Discord({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username || profile.global_name,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : null,
          username: profile.username?.toLowerCase(),
        }
      },
    }),

    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    Spotify({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    Twitch({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
})
