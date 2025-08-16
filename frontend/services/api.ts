export const fetchData = async () => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/`, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    // @ts-expect-error desc
    throw new Error("Failed to fetch", response.statusText);
  }

  const data = await response.json();

  return data;
};
