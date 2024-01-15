import { useUser } from "../../query";

export default function UpcomingEvents() {
  const user = useUser();

  return (
    <div className="dashboard-section-theme border-[1px] p-6 rounded-3xl my-4 md:my-0 col-span-2">
      <h1 className="text-2xl font-semibold text-left mb-6">Upcoming Events</h1>
    </div>
  );
}
