import { api } from '@/lib/api-client'

export type ApiUserRole =
  | 'CUSTOMER'
  | 'OWNER'
  | 'MANAGER'
  | 'ADMIN'

export interface MeResponse {
  success: boolean
  data: {
    id: string
    name: string
    email: string
    role: ApiUserRole
    active: boolean
    photoUrl: string | null
    createdAt: string
    updatedAt: string
  }
}

export async function getMeApi(token: string): Promise<MeResponse> {
  return api.get<MeResponse>('/users/me', token)
}
