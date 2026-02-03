const API_BASE_URL = 'http://localhost:4000'; 

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  console.log(`📡 API CALL: ${API_BASE_URL}${url}`); // DEBUG
  
  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Erro API ${url}:`, res.status, text.substring(0, 200));
    throw new Error("Erro na API");
  }

  const data = await res.json();
  return data as T;
}
