import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 text-5xl" aria-hidden="true">
        🍽️
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[#1A3A2A]">{title}</h3>
      {description ? (
        <p className="mb-6 max-w-sm text-sm text-[#6B6B6B]">{description}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  )
}
