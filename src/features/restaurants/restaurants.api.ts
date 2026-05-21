import { api } from '@/lib/api-client'
import type {
  ApiRestaurantDetailResponse,
  ApiRestaurantListResponse,
} from './api-types'

export async function getRestaurantsApi(params?: {
  page?: number
  limit?: number
  cuisine?: string
}): Promise<ApiRestaurantListResponse> {
  const query = new URLSearchParams()
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.cuisine) query.set('cuisine', params.cuisine)

  const qs = query.toString()
  return api.get<ApiRestaurantListResponse>(
    `/restaurants${qs ? `?${qs}` : ''}`,
  )
}

export async function getRestaurantByIdApi(
  id: string,
): Promise<ApiRestaurantDetailResponse> {
  return api.get<ApiRestaurantDetailResponse>(`/restaurants/${id}`)
}
