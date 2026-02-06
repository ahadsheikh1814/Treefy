import { notFound } from "next/navigation"
import Link from "next/link"
import prisma from "../../lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"

type PageProps = {
    params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params

    const user = await prisma.user.findUnique({
        where: { username },
        include: {
            links: {
                orderBy: { createdAt: "asc" },
            },
        },
    })

    if (!user) {
        notFound()
    }

    const client = await clerkClient()
    const clerkUser = await client.users.getUser(user.clerkId)

    const initial =
        (user.name ?? user.username)?.charAt(0).toUpperCase() ?? "?"

    return (
        <main className="min-h-screen bg-white text-black">
            <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-10 sm:max-w-lg">
                <section className="flex flex-1 flex-col items-center">
                    {/* Avatar + name */}
                    <div className="flex flex-col items-center gap-4">
                        {clerkUser.imageUrl ? (
                            <img
                                src={clerkUser.imageUrl}
                                alt={user.name ?? user.username}
                                className="h-20 w-20 rounded-full object-cover border border-[#E5E5E5]"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFDD00] text-3xl font-bold">
                                {initial}
                            </div>
                        )}
                        <div className="text-center space-y-1">
                            <p className="text-sm font-semibold text-[#6B7280]">
                                @{user.username}
                            </p>
                            {user.name && (
                                <p className="text-lg font-semibold text-black">
                                    {user.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-10 w-full space-y-3">
                        {user.links.length === 0 ? (
                            <p className="text-center text-sm text-[#6B7280]">
                                This creator hasn&apos;t added any links yet.
                            </p>
                        ) : (
                            user.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full rounded-full bg-[#F7F7F7] px-6 py-3 text-center text-sm font-medium text-black border border-[#E5E5E5] hover:bg-[#FFDD00] hover:border-[#FFDD00] transition-colors"
                                >
                                    {link.title}
                                </a>
                            ))
                        )}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-10 text-center text-xs text-[#6B7280]">
                        <Link
                            href="/"
                            className="underline hover:text-black"
                        >
                            Create your own page
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    )
}