import { ApiError } from './api-error'

const API_BASE_URL = '/api/v1'

export interface ApiClientOptions extends RequestInit {
  token?: string
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>
  }

  let errorData: unknown
  let message = response.statusText || 'Request failed'

  try {
    errorData = await response.json()

    if (
      errorData &&
      typeof errorData === 'object' &&
      'message' in errorData &&
      typeof errorData.message === 'string'
    ) {
      message = errorData.message
    }
  } catch {
    errorData = undefined
  }

  throw new ApiError(message, response.status, errorData)
}

function serializeBody(body: RequestInit['body']): RequestInit['body'] {
  if (
    body &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !ArrayBuffer.isView(body) &&
    !(body instanceof ReadableStream)
  ) {
    return JSON.stringify(body)
  }

  return body
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { token, headers, body, ...fetchOptions } = options
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    body: serializeBody(body),
  })

  return parseResponse<T>(response)
}

export const api = {
  get<T>(path: string, token?: string) {
    return apiClient<T>(path, { method: 'GET', token })
  },
  post<T>(path: string, body?: unknown, token?: string) {
    return apiClient<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
      token,
    })
  },
  patch<T>(path: string, body?: unknown, token?: string) {
    return apiClient<T>(path, {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
      token,
    })
  },
  delete<T>(path: string, token?: string) {
    return apiClient<T>(path, { method: 'DELETE', token })
  },
}
