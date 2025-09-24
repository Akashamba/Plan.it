import { authClient } from "@/lib/auth-client";

const apiFetch = async <T>(endpoint: string, token?: string): Promise<T> => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

// wrapper for unauthenticated requests
export const publicFetchData = <T>(endpoint: string) => apiFetch<T>(endpoint);

// wrapper for authenticated requests
export const authedFetchData = async <T>(endpoint: string) => {
  const { data: session } = await authClient.getSession();
  if (!session) throw new Error("No session token available");
  return apiFetch<T>(endpoint, session.session.token);
};
