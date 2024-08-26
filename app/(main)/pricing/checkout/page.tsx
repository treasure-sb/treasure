"use client";
import InitializeStripe from "./components/InitializeStripe";

export default function Page() {
  const origin = window.location.origin;
  const origin1 = `localhost:3000/pricing/checkout/success`;
  return <InitializeStripe origin={origin} />;
}
