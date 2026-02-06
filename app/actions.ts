"use server"


import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { currentUser } from "@clerk/nextjs/server"
import prisma from "../lib/prisma"

function validateUsername(raw: unknown): string {
  const username = (raw as string | null)?.trim() ?? ""

  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters long.")
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("Username can only contain letters, numbers, and underscores.")
  }

  return username
}

export async function claimUsername(formData: FormData) {
  const authUser = await currentUser()

  if (!authUser) {
    throw new Error("You must be signed in to claim a username.")
  }

  const username = validateUsername(formData.get("username"))

  const primaryEmail =
    authUser.emailAddresses.find((e) => e.id === authUser.primaryEmailAddressId)
      ?.emailAddress ??
    authUser.emailAddresses[0]?.emailAddress

  if (!primaryEmail) {
    throw new Error("No email address found on Clerk user.")
  }

  try {
    await prisma.user.create({
      data: {
        clerkId: authUser.id,
        email: primaryEmail,
        username,
        name: authUser.fullName ?? null,
      },
    })
  } catch (error) {
    // Prisma will throw if username/email/clerkId is not unique (P2002)
    console.error("Error creating user profile:", error)
    throw error
  }

  redirect("/")
}

export async function createLink(formData: FormData) {
  const authUser = await currentUser()
  if (!authUser) {
    throw new Error("You must be signed in to create a link.")
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
  })

  if (!dbUser) {
    throw new Error("No profile found for this user.")
  }

  const title = (formData.get("title") as string | null)?.trim() ?? ""
  const url = (formData.get("url") as string | null)?.trim() ?? ""

  if (!title || !url) {
    throw new Error("Title and URL are required.")
  }

  await prisma.link.create({
    data: {
      title,
      url,
      userId: dbUser.id,
    },
  })

  revalidatePath("/")
}

export async function deleteLink(formData: FormData) {
  const authUser = await currentUser()
  if (!authUser) {
    throw new Error("You must be signed in to delete a link.")
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
  })

  if (!dbUser) {
    throw new Error("No profile found for this user.")
  }

  const rawId = formData.get("linkId") as string | null
  const id = rawId ? Number(rawId) : NaN

  if (!id || Number.isNaN(id)) {
    throw new Error("Invalid link id.")
  }

  // Safer: only delete links that belong to this user
  await prisma.link.deleteMany({
    where: {
      id,
      userId: dbUser.id,
    },
  })

  revalidatePath("/")
}