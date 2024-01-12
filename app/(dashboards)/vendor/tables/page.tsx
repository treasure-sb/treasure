"use client";

import { useEffect } from "react";
import { useStore } from "../store";

export default function Page() {
  const { setCurrentPage } = useStore();
  useEffect(() => {
    setCurrentPage("tables");
  }, []);

  return (
    <main className="dashboard-spacing">
      <h1 className="font-semibold text-3xl mb-6">My Tables</h1>
    </main>
  );
}
