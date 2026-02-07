"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";

/* ------------------ helpers ------------------ */

function validateUsername(raw: unknown): string {
  const username = (raw as string | null)?.trim() ?? "";

  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters long.");
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("Username can only contain letters, numbers, and underscores.");
  }

  return username.toLowerCase();
}

function validateUrl(raw: unknown): string {
  const url = (raw as string | null)?.trim() ?? "";
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error("Invalid URL.");
  }
}

/* ------------------ claim username ------------------ */

export async function claimUsername(formData: FormData) {
  const authUser = await currentUser();
  if (!authUser) throw new Error("You must be signed in.");

  const username = validateUsername(formData.get("username"));

  const primaryEmail =
    authUser.emailAddresses.find(
      (e) => e.id === authUser.primaryEmailAddressId
    )?.emailAddress ?? authUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) throw new Error("No email found.");

  // prevent duplicate profile
  const existing = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
  });

  if (existing) {
    redirect("/");
  }

  // check username already taken
  const usernameTaken = await prisma.user.findUnique({
    where: { username },
  });

  if (usernameTaken) {
    throw new Error("Username already taken.");
  }

  try {
    await prisma.user.create({
      data: {
        clerkId: authUser.id,
        email: primaryEmail,
        username,
        name: authUser.fullName ?? null,
      },
    });
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create profile.");
  }

  redirect("/");
}

/* ------------------ create link ------------------ */

export async function createLink(formData: FormData) {
  const authUser = await currentUser();
  if (!authUser) throw new Error("Not signed in.");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
  });

  if (!dbUser) throw new Error("Profile not found.");

  const title = (formData.get("title") as string)?.trim();
  const url = validateUrl(formData.get("url"));

  if (!title) throw new Error("Title required.");

  await prisma.link.create({
    data: {
      title,
      url,
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
}

/* ------------------ delete link ------------------ */

export async function deleteLink(formData: FormData) {
  const authUser = await currentUser();
  if (!authUser) throw new Error("Not signed in.");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: authUser.id },
  });

  if (!dbUser) throw new Error("Profile not found.");

  const id = Number(formData.get("linkId"));
  if (Number.isNaN(id)) throw new Error("Invalid link id.");

  await prisma.link.deleteMany({
    where: {
      id,
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
}
