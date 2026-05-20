type ManagerStatCardProps = {
  label: string
  value: number | string
}

export default function ManagerStatCard({ label, value }: ManagerStatCardProps) {
  return (
    <article className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[#6B6B6B]">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#1A3A2A]">{value}</p>
    </article>
  )
}
