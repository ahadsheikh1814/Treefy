import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET(_request: NextRequest) {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { clerkId, email, username, name } = body as {
      clerkId?: string
      email?: string
      username?: string
      name?: string | null
    }

    if (!clerkId || !email || !username) {
      return NextResponse.json(
        { error: "clerkId, email, and username are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        username,
        name: name ?? null,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}