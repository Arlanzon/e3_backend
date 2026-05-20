export type Restaurant = {
  id: string
  name: string
  category: string
  location: string
  rating: number
  priceRange: '$' | '$$' | '$$$'
  description: string
}

export type NavItem = {
  label: string
  href: string
}
