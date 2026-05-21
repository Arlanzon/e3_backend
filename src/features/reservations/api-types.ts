export interface ApiReservationRestaurant {
  name: string
  timezone: string
}

export interface ApiReservation {
  id: string
  userId: string
  restaurantId: string
  date: string
  time: string
  numPersons: number
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'EXPIRED'
  notes: string | null
  rejectionReason?: string | null
  confirmedAt?: string | null
  rejectedAt?: string | null
  cancelledAt?: string | null
  completedAt?: string | null
  expiredAt?: string | null
  createdAt: string
  updatedAt?: string
  restaurant?: ApiReservationRestaurant
}

export interface CreateReservationBody {
  restaurantId: string
  date: string
  time: string
  numPersons: number
  notes?: string
}

export interface ApiCreateReservationResponse {
  success: boolean
  data: ApiReservation
}

export interface ApiReservationListResponse {
  success: boolean
  data: ApiReservation[]
  meta: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
