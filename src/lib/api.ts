const API_BASE_URL = '/api/v1'

export async function fetchFromApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error('No se pudo obtener la informacion solicitada')
  }

  return response.json() as Promise<T>
}
