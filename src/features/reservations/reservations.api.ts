import { api } from '@/lib/api-client'
import type {
  ApiReservation,
  CreateReservationBody,
  ApiCreateReservationResponse,
  ApiReservationListResponse,
} from './api-types'

export async function createReservationApi(
  body: CreateReservationBody,
  token: string,
): Promise<ApiCreateReservationResponse> {
  return api.post<ApiCreateReservationResponse>(
    '/reservations',
    body,
    token,
  )
}

export async function getMyReservationsApi(
  token: string,
  params?: {
    status?: string
    page?: number
    limit?: number
  },
): Promise<ApiReservationListResponse> {
  const query = new URLSearchParams()
  if (params?.status) query.set('status', params.status)
  if (params?.page) query.set('page', String(params.page))
  if (params?.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return api.get<ApiReservationListResponse>(
    `/reservations${qs ? `?${qs}` : ''}`,
    token,
  )
}

export async function cancelReservationApi(
  id: string,
  token: string,
): Promise<{ success: boolean; data: ApiReservation }> {
  return api.patch<{ success: boolean; data: ApiReservation }>(
    `/reservations/${id}/cancel`,
    {},
    token,
  )
}
