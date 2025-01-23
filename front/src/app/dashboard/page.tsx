'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchClashs } from "../fetch/clashFetch";
import Navbar from "@/components/base/Navbar";
import AddClash from "@/components/clash/AddClash";
import React from "react";
import ClashCard from "@/components/clash/ClashCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clashes, setClashes] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchClashs().then(data => setClashes(data));
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Navbar />
      <div className="text-end mt-4">
        <AddClash user={session?.user!} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clashes.length > 0 &&
          clashes.map((item, index) => (
            <ClashCard clash={item} key={index} token={session?.user?.token!} />
          ))}
      </div>
    </div>
  );
}
