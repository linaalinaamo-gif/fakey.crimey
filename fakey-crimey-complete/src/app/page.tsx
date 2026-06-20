import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">
          🚀 Fakey.Crimey
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Premium Social Profile Platform
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">✨ Customization</h2>
            <p className="text-gray-600">Design your perfect profile with themes, widgets, and effects</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">📊 Analytics</h2>
            <p className="text-gray-600">Track views, visitors, and engagement with real-time insights</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">🤖 AI Features</h2>
            <p className="text-gray-600">Generate bios, themes, and recommendations with AI</p>
          </div>
        </div>
      </div>
    </main>
  )
}
