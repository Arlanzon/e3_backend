export interface ApiRestaurant {
  id: string
  name: string
  slug: string
  description?: string | null
  cuisineType: string
  address: string
  lat: number | string
  lng: number | string
  phone?: string | null
  capacity?: number
  reservationCapacityFactor?: number | string
  reservationDurationMin?: number
  minAdvanceHours?: number
  maxAdvanceDays?: number
  timezone?: string
  ratingAvg: number | string | null
  ratingCount: number
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdAt: string
  updatedAt?: string
  photos?: {
    id: string
    url: string
    isPrimary: boolean
    order: number
  }[]
  businessHours?: {
    id: string
    dayOfWeek:
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY'
    isClosed: boolean
    openTime?: string
    closeTime?: string
    openTimeMin?: number
    closeTimeMin?: number
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

export interface ApiRestaurantDetailResponse {
  success: boolean
  data: ApiRestaurant
}
