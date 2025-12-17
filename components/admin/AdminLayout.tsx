'use client'

import { ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

interface AdminLayoutProps {
  children: ReactNode
  title: string
  breadcrumb?: { label: string; href?: string }[]
}

export default function AdminLayout({ children, title, breadcrumb }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64">
        <AdminNavbar title={title} breadcrumb={breadcrumb} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
