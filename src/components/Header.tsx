'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center group hover:opacity-90 transition-opacity">
            <Logo size="sm" />
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-[13px] text-zinc-600 hover:text-zinc-900 font-medium rounded-md hover:bg-zinc-50"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="ml-2 px-3.5 py-1.5 bg-indigo-600 text-white text-[13px] font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
