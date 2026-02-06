import prisma from "../lib/prisma"

export default async function Home() {
  let users:
    | Array<{
        id: number
        email: string
        name: string | null
        createdAt: Date
        updatedAt: Date
      }> = []
  let error: string | null = null

  try {
    users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (e) {
    console.error("Error fetching users:", e)
    error =
      "Failed to load users. Make sure your DATABASE_URL is configured and the database is accessible."
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users from Database</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : users.length === 0 ? (
        <p>No users yet. Create one using the API at /api/users</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border p-4 rounded">
              <p className="font-semibold">{user.name || "No name"}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

