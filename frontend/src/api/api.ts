const API_BASE = "http://localhost:8080";

export const api = async (
  url: string,
  method: string = "GET",
  body?: any
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_BASE + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};
