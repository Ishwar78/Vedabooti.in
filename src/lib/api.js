const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5065";

const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

async function request(path, options = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || localStorage.getItem("token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => "");

  if (!response.ok) {
    let errorMessage = "Request failed";
    if (data && typeof data === "object") {
      errorMessage = data.message || data.error || JSON.stringify(data);
    } else if (typeof data === "string" && data.trim()) {
      errorMessage = data;
    }
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  get: (path, options) => request(path, { method: "GET", ...(options || {}) }),
  post: (path, body, options) =>
    request(path, { method: "POST", body: JSON.stringify(body), ...(options || {}) }),
  put: (path, body, options) =>
    request(path, { method: "PUT", body: JSON.stringify(body), ...(options || {}) }),
  delete: (path, options) =>
    request(path, { method: "DELETE", ...(options || {}) }),
};

export default api;
