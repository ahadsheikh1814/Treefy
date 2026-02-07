import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'


const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/80 backdrop-blur">
      <nav className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4'>
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="text-sm sm:text-base">Treefy</span>
        </Link>

        <div className='flex items-center gap-2'>
          {/* Show the sign-in and sign-up buttons when the user is signed out */}
          <SignedOut>
            <SignInButton>
              <button className="inline-flex items-center justify-center rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm
                   font-medium text-black hover:bg-[#F7F7F7] cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="inline-flex items-center justify-center rounded-full bg-[#FFDD00] px-4 py-2 text-sm font-semibold
                   text-black shadow-sm hover:brightness-95 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          {/* Show the user button when the user is signed in */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

    </header>
  )
}

export default Navbar