"use client";
import InitializeStripe from "./components/InitializeStripe";

export default function Page() {
  const origin = window.location.origin;
  return <InitializeStripe origin={origin} />;
}
