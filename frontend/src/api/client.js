const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...opts.headers,
    },
    credentials: "include",
    body: opts.body || undefined,
  });
  
  const data = await res.json();

  if (!res.ok) 
    throw new Error(data.message || "Request failed");

  return data;
}
