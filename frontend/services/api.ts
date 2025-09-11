export const fetchData = async (endpoint: string, session?: string) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: session ? `Bearer ${session}` : "",
      },
    }
  );

  if (!response.ok) {
    // @ts-expect-error desc
    throw new Error("Failed to fetch", response.statusText);
  }

  const data = await response.json();

  return data;
};
