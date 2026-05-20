type SearchBarProps = {
  placeholder?: string
}

export function SearchBar({ placeholder = 'Buscar restaurantes' }: SearchBarProps) {
  return (
    <label className="block">
      <span className="sr-only">{placeholder}</span>
      <input
        className="w-full rounded-md border border-zinc-300 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
        placeholder={placeholder}
        type="search"
      />
    </label>
  )
}
