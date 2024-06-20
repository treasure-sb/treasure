import { Suspense } from "react";
import CreateEvent from "./components/CreateEvent";

export default function Page() {
  return (
    <Suspense>
      <CreateEvent />
    </Suspense>
  );
}
