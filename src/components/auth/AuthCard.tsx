import type { ReactNode } from 'react'

type AuthCardProps = {
  eyebrow?: string
  title: string
  description: string
  children: ReactNode
}

export default function AuthCard({
  eyebrow = 'Acceso',
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-[#E8E4DE] bg-white p-8 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1A3A2A]">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-[#1C1C1C]">{title}</h1>
        <p className="text-sm leading-6 text-[#6B6B6B]">{description}</p>
      </div>

      <div className="mt-8">{children}</div>
    </section>
  )
}
