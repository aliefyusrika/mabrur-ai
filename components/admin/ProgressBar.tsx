interface ProgressBarProps {
  value: number
  showLabel?: boolean
}

export default function ProgressBar({ value, showLabel = true }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gold-500 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-gray-500 w-8">{value}%</span>}
    </div>
  )
}
