interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5
        ${hover ? 'hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
