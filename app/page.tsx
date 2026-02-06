import { currentUser } from "@clerk/nextjs/server"
import prisma from "../lib/prisma"
import { claimUsername } from "./actions"

export default async function Home() {
  const authUser = await currentUser()

  // 1. Logged out → Landing page with "Sign In" button
  if (!authUser) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-gray-600">
            Sign in to claim your username and access your dashboard.
          </p>
          <a
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Sign In
          </a>
        </div>
      </main>
    )
  }

  // 2. Logged in – check if user has a DB profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
  })

  // 2a. No DB profile → Claim Username form
  if (!dbUser) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <h1 className="text-2xl font-bold">Claim your username</h1>
          <p className="text-gray-600">
            Choose a unique username to finish setting up your account.
          </p>

          <form action={claimUsername} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                minLength={3}
                required
                pattern="^[a-zA-Z0-9_]+$"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="your_username"
              />
              <p className="text-xs text-gray-500">
                At least 3 characters. Letters, numbers, and underscores only.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
            >
              Claim Username
            </button>
          </form>
        </div>
      </main>
    )
  }

  // 3. Has DB profile → Dashboard
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Signed in as <span className="font-semibold">@{dbUser.username}</span>{" "}
          ({dbUser.email})
        </p>

        <div className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-2">Your links</h2>
          <p className="text-sm text-gray-500">
            You can list and manage your Linktree-style links here later.
          </p>
        </div>
      </div>
    </main>
  )
}