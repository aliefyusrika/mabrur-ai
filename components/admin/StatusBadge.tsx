interface StatusBadgeProps {
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED' | string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { label: string; className: string }> = {
  COMPLETED: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
  IN_PROGRESS: { label: 'Proses', className: 'bg-yellow-100 text-yellow-700' },
  NOT_STARTED: { label: 'Belum', className: 'bg-gray-100 text-gray-600' },
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.NOT_STARTED
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.className} ${sizeClass}`}>
      {config.label}
    </span>
  )
}
