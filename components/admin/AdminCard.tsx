import { ReactNode } from 'react'

interface AdminCardProps {
  children: ReactNode
  title?: string
  action?: ReactNode
  className?: string
  noPadding?: boolean
}

export default function AdminCard({ children, title, action, className = '', noPadding }: AdminCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">{title}</h2>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
    </div>
  )
}
