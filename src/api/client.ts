const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function apiClient<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data as T;
}