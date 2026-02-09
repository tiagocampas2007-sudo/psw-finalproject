const API_BASE_URL = 'http://localhost:4000'; 

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  console.log(`📡 CHAMADA API: ${API_BASE_URL}${url}`);
  
  // 🔥 VERIFICA SE É AUTENTICAÇÃO (NÃO USA TOKEN)
  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
  
  // 🔥 VERIFICA TOKEN APENAS para endpoints protegidos
  const token = !isAuthEndpoint && typeof window !== 'undefined' 
    ? localStorage.getItem('token') || sessionStorage.getItem('token')
    : null;

  console.log('🔑 TOKEN LOCALSTORAGE:', token ? `${token.slice(0,30)}...` : '❌ NENHUM TOKEN!');

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // ✅ SÓ ENVIA TOKEN para endpoints PROTEGIDOS
  if (token && !isAuthEndpoint) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log('📤 HEADERS ENVIADOS:', headers);

  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: "include",  // Para cookies de sessão
    headers,
    ...options,
  });

  console.log('📥 RESPONSE STATUS:', res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Erro API ${url}:`, res.status, `"${text}"`);
    throw new Error(`Erro API ${res.status}`);
  }

  return res.json();
}
