let token = localStorage.getItem("ats_token") || "";

export function setAuthToken(nextToken) {
  token = nextToken || "";

  if (token) {
    localStorage.setItem("ats_token", token);
  } else {
    localStorage.removeItem("ats_token");
  }
}

async function request(path, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const url = new URL(path, baseUrl);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const target = import.meta.env.VITE_API_URL ? url.toString() : url.pathname + url.search;
  const response = await fetch(target, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export const api = {
  login: (body) => request("/api/auth/login", { method: "POST", body }),
  me: () => request("/api/auth/me"),
  getJobs: () => request("/api/jobs"),
  createJob: (body) => request("/api/jobs", { method: "POST", body }),
  updateJob: (id, body) => request(`/api/jobs/${id}`, { method: "PATCH", body }),
  getCandidates: (query) => request("/api/candidates", { query }),
  getCandidate: (id) => request(`/api/candidates/${id}`),
  createCandidate: (body) => request("/api/candidates", { method: "POST", body }),
  updateCandidate: (id, body) => request(`/api/candidates/${id}`, { method: "PATCH", body }),
  moveCandidate: (id, stage) => request(`/api/candidates/${id}/stage`, { method: "PATCH", body: { stage } }),
  addNote: (id, body) => request(`/api/candidates/${id}/notes`, { method: "POST", body: { body } }),
  getMetrics: () => request("/api/metrics")
};
