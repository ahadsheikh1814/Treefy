import { currentUser } from "@clerk/nextjs/server"
import prisma from "../lib/prisma"
import { claimUsername, createLink, deleteLink } from "./actions"
import Link from "next/link"
import { CopyButton } from "./components/copybutton"
import { ExternalLink, Trash2, Link as LinkIcon } from "lucide-react"

export default async function Home() {
  const authUser = await currentUser()

  // 1. Logged out → Landing page with "Sign In" button
  if (!authUser) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
          <section className="flex flex-1 flex-col justify-center">
            <div className="space-y-6 text-center sm:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Support my work
                <br />
                with a coffee.
              </h1>
              <p className="mx-auto max-w-xl text-sm text-[#6B7280] sm:mx-0 sm:text-base">
                A small tip helps me spend more time building things you love.
                No subscriptions, just simple one‑time support.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <a
                  href="/sign-in"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFDD00] px-8 py-4 text-sm font-semibold text-black shadow-sm hover:brightness-95"
                >
                  Sign in to support
                </a>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-[#E5E5E5] bg-white px-8 py-4 text-sm font-medium text-black hover:bg-[#F7F7F7]"
                >
                  Learn more
                </button>
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 sm:p-8">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFDD00] text-lg">
                    ☕
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="text-sm font-semibold">Tiny tips, big impact</p>
                    <p className="text-xs text-[#6B7280] sm:text-sm">
                      Every coffee keeps this project alive and growing.
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium">
                  <span className="rounded-full bg-[#F7F7F7] px-3 py-1">
                    ☕ x 3
                  </span>
                  <span className="text-[#6B7280]">$9.00</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }

  // 2. Logged in – check if user has a DB profile
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
    include: {
      links: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  // 2a. No DB profile → Claim Username form
  if (!dbUser) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
          <section className="flex flex-1 items-center">
            <div className="w-full space-y-8">
              <div className="space-y-3 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Claim your username
                </h1>
                <p className="max-w-xl text-sm text-[#6B7280] sm:text-base">
                  Choose a unique username so people can find and support you
                  easily.
                </p>
              </div>

              <div className="rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 sm:p-8">
                <form action={claimUsername} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-black"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      minLength={3}
                      required
                      pattern="^[a-zA-Z0-9_]+$"
                      className="w-full rounded-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="your_username"
                    />
                    <p className="text-xs text-[#6B7280]">
                      At least 3 characters. Letters, numbers, and underscores
                      only.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#FFDD00] px-8 py-4 text-sm font-semibold text-black shadow-sm hover:brightness-95 sm:w-auto"
                  >
                    Save and continue
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    )
  }

  // 3. Has DB profile → Dashboard
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <section className="flex flex-1 flex-col justify-center gap-8">
          <div className=" flex justify-between items-center">
            <div className="space-y-4 text-center sm:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Hey,{" "}
                <Link
                  href={`/${dbUser.username}`}
                  className="inline-flex items-center gap-1 underline"
                >
                  @{dbUser.username}
                  <ExternalLink size={18} />
                </Link>
              </h1>
              <p className="max-w-xl text-sm text-[#6B7280] sm:text-base">
                Manage the links your supporters will see on your page.
              </p>
            </div>
            <div className="cursor-pointer">
              <CopyButton url={`https://your-domain.com/${dbUser.username}`} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Add Link form */}
            <div className="rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-3">Add a new link</h2>
              <form action={createLink} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-black"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    required
                    className="w-full rounded-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="My portfolio"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="url"
                    className="text-sm font-medium text-black"
                  >
                    URL
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    required
                    className="w-full rounded-full border border-[#E5E5E5] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.com"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFDD00] px-8 py-4 text-sm font-semibold text-black shadow-sm hover:brightness-95"
                >
                  Add link
                </button>
              </form>
            </div>

            {/* Existing links list */}
            <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-3">Your links</h2>

              {dbUser.links.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <LinkIcon size={18} />
                  You haven&apos;t added any links yet. Start by adding your most
                  important link.
                </p>
              ) : (
                <ul className="space-y-3">
                  {dbUser.links.map((link) => (
                    <li
                      key={link.id}
                      className="flex items-center justify-between rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{link.title}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-xs text-[#6B7280] underline"
                        >
                          {link.url}
                        </a>
                      </div>
                      <form action={deleteLink} className="ml-4">
                        <input
                          type="hidden"
                          name="linkId"
                          value={link.id}
                        />
                        <button
                          type="submit"
                          aria-label="Delete link"
                          className="inline-flex items-center justify-center rounded-full border border-[#E5E5E5] bg-white px-3 py-2 text-xs text-black hover:bg-[#F7F7F7]"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}