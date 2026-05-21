export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miercoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sabado',
  SUNDAY: 'Domingo',
}

export interface Restaurant {
  id: string
  name: string
  slug: string
  description: string | null
  cuisineType: string
  address: string
  lat: number
  lng: number
  phone: string | null
  capacity: number
  reservationCapacityFactor: number
  reservationDurationMin: number
  minAdvanceHours: number
  maxAdvanceDays: number
  timezone: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ratingAvg: number | null
  ratingCount: number
  createdAt: string
  photos?: RestaurantPhoto[]
  businessHours?: BusinessHour[]
}

export interface RestaurantPhoto {
  id: string
  url: string
  isPrimary: boolean
  order: number
}

export interface BusinessHour {
  id: string
  dayOfWeek: DayOfWeek
  openTime: string
  closeTime: string
  isClosed: boolean
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string | null
  status: 'VISIBLE' | 'PENDING_MODERATION' | 'HIDDEN'
  editableUntil: string
  createdAt: string
  response?: ReviewResponse | null
}

export interface ReviewResponse {
  id: string
  content: string
  createdAt: string
  isEdited: boolean
}

export interface ListRestaurantsResponse {
  success: boolean
  data: Restaurant[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
