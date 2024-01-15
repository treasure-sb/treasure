"use client";
import { useEffect } from "react";
import { useStore } from "./store";

export default function Page() {
  const { setCurrentPage } = useStore();
  useEffect(() => {
    setCurrentPage("dashboard");
  }, []);

  return (
    <>
      <h1 className="font-semibold text-3xl mb-4">Host Overview</h1>
    </>
  );
}
