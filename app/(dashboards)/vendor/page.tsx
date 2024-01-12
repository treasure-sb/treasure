"use client";
import Sales from "./components/Sales";
import Tables from "./components/Tables";
import { useEffect } from "react";
import { useStore } from "./store";

export default function Page() {
  const { setCurrentPage } = useStore();
  useEffect(() => {
    setCurrentPage("dashboard");
  }, []);

  return (
    <main className="dashboard-spacing">
      <h1 className="font-semibold text-3xl">Overview</h1>
      <Sales />
      <Tables />
    </main>
  );
}
