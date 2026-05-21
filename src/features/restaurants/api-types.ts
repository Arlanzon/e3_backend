export interface ApiRestaurant {
  id: string
  name: string
  slug: string
  cuisineType: string
  address: string
  lat: number | string
  lng: number | string
  ratingAvg: number | string | null
  ratingCount: number
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  photos?: {
    id: string
    url: string
    isPrimary: boolean
    order: number
  }[]
}

export interface ApiRestaurantListResponse {
  success: boolean
  data: ApiRestaurant[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
