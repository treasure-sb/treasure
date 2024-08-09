import InitializeStripe from "./components/InitializeStripe";

export default function Page() {
  const origin = "http://localhost:3000/pricing/checkout/success";
  return <InitializeStripe origin={origin} />;
}
