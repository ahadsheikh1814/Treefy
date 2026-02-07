import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#E5E5E5] bg-white/80 backdrop-blur flex items-center justify-between">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <p className="text-sm text-[#6B7280]">
                Treefy | All Your Links.One Smart Tree.
            </p>
        </div>
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4'>
            <p className="text-sm text-[#6B7280]">
                build with ❤️ by <a href="https://ahadsheikh.vercel.app" target='_blank' rel='noopener noreferrer' className='text-black underline'>Ahad Sheikh</a>
            </p>
        </div>
    </footer>
  )
}

export default Footer