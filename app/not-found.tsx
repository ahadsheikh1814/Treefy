import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <section className="flex flex-1 items-center justify-center">
          <div className="card max-w-md w-full text-center space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight">
              404
            </h1>
            <p className="text-sm text-[#6B7280] sm:text-base">
              The page you&apos;re looking for doesn&apos;t exist or may have
              been moved. Try heading back to your dashboard.
            </p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[#FFDD00] px-8 py-4 text-sm font-semibold text-black shadow-sm hover:brightness-95"
              >
                Go home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}