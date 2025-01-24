import { getSession } from "next-auth/react";
import { CLASH_URL } from "@/lib/apiEndPoints";

export async function fetchClashs() {
  try {
    const session = await getSession();
    const token = session?.user?.token || session?.accessToken;

    if (!token) {
      console.error("No token found in session:", session);
      throw new Error("No authentication token");
    }

    const res = await fetch(CLASH_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Fetch error data:", errorData);
      throw new Error("Failed to fetch data");
    }

    const response = await res.json();
    return response?.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function fetchClash(id: number) {
  const res = await fetch(`${CLASH_URL}/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    const errorData = await res.json();
    console.error("Fetch error data:", errorData);
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return null;
}
