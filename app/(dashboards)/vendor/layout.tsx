import MobileHeader from "./components/MobileHeader";
import { validateUser } from "@/lib/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await validateUser();

  return (
    <div className="p-6 px-4">
      <MobileHeader user={user} />
      {children}
    </div>
  );
}
