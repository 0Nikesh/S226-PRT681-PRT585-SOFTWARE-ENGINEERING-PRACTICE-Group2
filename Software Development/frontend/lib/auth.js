const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SESSION_KEY = "tripmate_session";

export function getSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function tokenIsCurrent(token) {
  if (!token) {
    return false;
  }

  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const exp = JSON.parse(json).exp;

    if (!exp) {
      return true;
    }

    return exp * 1000 > Date.now() + 5000;
  } catch {
    return false;
  }
}

export function sessionExpired() {
  clearSession();

  if (typeof window === "undefined" || window.location.pathname.startsWith("/login")) {
    return;
  }

  const next = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/login?next=${encodeURIComponent(next)}&expired=1`);
}

export function pathAfterAuth(searchParams) {
  const next = searchParams?.get?.("next") ?? "";

  if (next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }

  return "/profile";
}

function toSession(data) {
  return {
    token: data.token ?? data.Token ?? "",
    userId: data.userId ?? data.UserId ?? "",
    name: data.name ?? data.Name ?? "",
    email: data.email ?? data.Email ?? "",
    phoneNumber: data.phoneNumber ?? data.PhoneNumber ?? "",
    country: data.country ?? data.Country ?? "",
    role: data.role ?? data.Role ?? "User",
  };
}

async function readError(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (Array.isArray(data.errors)) {
    return data.errors.join(" ");
  }

  if (data.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().join(" ");
  }

  if (typeof data.title === "string") {
    return data.title;
  }

  return "Something went wrong. Please try again.";
}

async function postAuth(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return toSession(await response.json());
}

export function login({ email, password }) {
  return postAuth("/api/auth/login", { email, password });
}

export function register({ name, email, phoneNumber, country, password }) {
  return postAuth("/api/auth/register", {
    name,
    email,
    phoneNumber,
    country,
    password,
  });
}

export async function getProfile(token) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Could not reach the server. Check that the API is running.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      sessionExpired();
    }

    throw new Error(await readError(response));
  }

  const data = await response.json();

  return {
    userId: data.userId ?? data.UserId ?? "",
    name: data.name ?? data.Name ?? "",
    email: data.email ?? data.Email ?? "",
    phoneNumber: data.phoneNumber ?? data.PhoneNumber ?? "",
    country: data.country ?? data.Country ?? "",
    role: data.role ?? data.Role ?? "User",
  };
}
