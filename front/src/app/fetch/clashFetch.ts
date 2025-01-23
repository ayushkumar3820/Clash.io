import { getSession } from "next-auth/react";
import { CLASH_URL } from "@/lib/apiEndPoints";

export async function fetchClashs() {
  try {
    const session = await getSession();
    
    const res = await fetch(CLASH_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.token}` // Add token from session
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const response = await res.json();
    if (response?.data) {
      return response.data;
    }

    return [];
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
    throw new Error("Failed to fetch data");
  }
  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }
  return null;
}
