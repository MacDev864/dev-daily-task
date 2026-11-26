export const useApi = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase || 'http://localhost:3001/api';

  const request = async <T>(endpoint: string, options: any = {}): Promise<T> => {
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    return $fetch<T>(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  };

  return {
    get: <T>(endpoint: string, params?: Record<string, any>) =>
      request<T>(endpoint, { method: 'GET', query: params }),
    post: <T>(endpoint: string, body?: any) =>
      request<T>(endpoint, { method: 'POST', body }),
    patch: <T>(endpoint: string, body?: any) =>
      request<T>(endpoint, { method: 'PATCH', body }),
    delete: <T>(endpoint: string) =>
      request<T>(endpoint, { method: 'DELETE' }),
  };
};
