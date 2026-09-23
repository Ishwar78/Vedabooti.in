const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5065";

export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export const getCategoryImageUrl = (img) => {
  if (!img) return "/assets/category-placeholder.jpg";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/uploads/")) {
    return `${API_BASE_URL}${img}`;
  }
  return img;
};

export const getVideoUrl = (src) => {
  if (!src) return "/assets/Video.mp4";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/uploads/")) {
    return `${API_BASE_URL}${src}`;
  }
  return src;
};

async function request(path, options = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token") || localStorage.getItem("token")
      : null;

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
  post: (path, body, options) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request(path, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      ...(options || {}),
    });
  },
  put: (path, body, options) => {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request(path, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
      ...(options || {}),
    });
  },
  delete: (path, options) =>
    request(path, { method: "DELETE", ...(options || {}) }),
};

export default api;
