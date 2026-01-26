const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  console.log("API Fetching:", `${API_BASE_URL}${url}`, options);
  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Erro na API");
  }

  return data as T;
}