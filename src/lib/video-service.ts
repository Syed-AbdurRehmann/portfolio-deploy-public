import { categories as fallbackCategories, videos as fallbackVideos, type Video } from "@/data/videos";

interface ApiErrorPayload {
  error?: string;
}

interface VideoListResponse {
  videos?: Video[];
}

interface VideoResponse {
  video?: Video;
}

interface AdminStatusResponse {
  hasAdmin?: boolean;
}

interface LoginResponse {
  token?: string;
  user?: AdminUser;
}

interface AdminSessionResponse {
  user?: AdminUser;
}

export interface AdminUser {
  id: string;
  email: string;
}

export type VideoInput = Omit<Video, "id">;

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const ADMIN_TOKEN_KEY = "portfolio_admin_token";

export const isApiConfigured = true;

const normalizeDriveLink = (link: string) => {
  const input = String(link || "").trim();
  if (!input) {
    return "";
  }

  try {
    const parsed = new URL(input);
    if (parsed.pathname.endsWith("/view")) {
      parsed.pathname = parsed.pathname.replace(/\/view$/, "/preview");
    }
    return parsed.toString();
  } catch {
    return input.replace(/\/view(\?.*)?$/, (_match, query = "") => `/preview${query}`);
  }
};

const mapVideoInput = (input: VideoInput): VideoInput => ({
  title: input.title.trim(),
  googleDriveLink: normalizeDriveLink(input.googleDriveLink.trim()),
  category: input.category,
  isLatest: input.isLatest,
  isVertical: input.isVertical,
  description: input.description?.trim() || "",
});

const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;

const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

const setAdminToken = (token: string) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

const clearAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

const request = async <T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> => {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = getAdminToken();
    if (!token) {
      throw new Error("Admin session not found. Please sign in.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(path), {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const payload = (await response.json().catch(() => ({}))) as T & ApiErrorPayload;

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
};

export const getPublicVideos = async (): Promise<Video[]> => {
  try {
    const payload = await request<VideoListResponse>("/api/videos", { method: "GET" });
    if (Array.isArray(payload.videos)) {
      return payload.videos;
    }
    return [];
  } catch {
    return fallbackVideos;
  }
};

export const getAdminVideos = async (): Promise<Video[]> => {
  const payload = await request<VideoListResponse>("/api/admin/videos", { method: "GET" }, true);
  return payload.videos || [];
};

export const createVideo = async (input: VideoInput): Promise<Video> => {
  const payload = await request<VideoResponse>(
    "/api/admin/videos",
    {
      method: "POST",
      body: JSON.stringify(mapVideoInput(input)),
    },
    true,
  );

  if (!payload.video) {
    throw new Error("Unable to create video.");
  }

  return payload.video;
};

export const updateVideo = async (id: string, input: VideoInput): Promise<Video> => {
  const payload = await request<VideoResponse>(
    `/api/admin/videos/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(mapVideoInput(input)),
    },
    true,
  );

  if (!payload.video) {
    throw new Error("Unable to update video.");
  }

  return payload.video;
};

export const deleteVideo = async (id: string): Promise<void> => {
  await request(`/api/admin/videos/${id}`, { method: "DELETE" }, true);
};

export const getAdminStatus = async (): Promise<{ hasAdmin: boolean }> => {
  try {
    const payload = await request<AdminStatusResponse>("/api/admin/status", { method: "GET" });
    return { hasAdmin: Boolean(payload.hasAdmin) };
  } catch {
    return { hasAdmin: true };
  }
};

export const setupAdmin = async (email: string, password: string, setupKey?: string) => {
  await request(
    "/api/admin/setup",
    {
      method: "POST",
      body: JSON.stringify({ email, password, setupKey }),
    },
    false,
  );
};

export const signInAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const payload = await request<LoginResponse>(
    "/api/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );

  if (!payload.token || !payload.user) {
    throw new Error("Unable to sign in.");
  }

  setAdminToken(payload.token);
  return payload.user;
};

export const signOutAdmin = async () => {
  try {
    await request("/api/admin/logout", { method: "POST" }, true);
  } finally {
    clearAdminToken();
  }
};

export const getAdminSession = async (): Promise<AdminUser | null> => {
  const token = getAdminToken();
  if (!token) {
    return null;
  }

  try {
    const payload = await request<AdminSessionResponse>("/api/admin/me", { method: "GET" }, true);
    if (!payload.user) {
      clearAdminToken();
      return null;
    }
    return payload.user;
  } catch {
    clearAdminToken();
    return null;
  }
};

export const getVideoCategories = (videoList: Video[]): string[] => {
  const dynamic = Array.from(new Set(videoList.map((video) => video.category))).sort((a, b) => a.localeCompare(b));

  if (!dynamic.length) {
    return fallbackCategories;
  }

  return ["All", ...dynamic.filter((category) => category !== "All")];
};
