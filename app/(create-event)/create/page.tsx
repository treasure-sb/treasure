import { Suspense } from "react";
import CreateEventForm from "./components/CreateEventForm";

export default function Page() {
  return (
    <Suspense>
      <CreateEventForm />
    </Suspense>
  );
}
