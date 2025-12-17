'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AdminNavbarProps {
  title: string
  breadcrumb?: { label: string; href?: string }[]
}

export default function AdminNavbar({ title, breadcrumb }: AdminNavbarProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              {breadcrumb.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {item.href ? (
                    <Link href={item.href} className="hover:text-navy-600">{item.label}</Link>
                  ) : (
                    <span className="text-navy-900">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-xl font-semibold text-navy-900">{title}</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
          >
            <div className="w-9 h-9 bg-navy-800 rounded-full flex items-center justify-center text-white font-medium text-sm">
              A
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-navy-900">Admin Travel</p>
              <p className="text-xs text-gray-500">admin@mabrur.ai</p>
            </div>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
