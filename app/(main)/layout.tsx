import Header from "@/components/shared/header/Header";
import LoggedInHeader from "@/components/shared/header/LoggedInHeader";
import { validateUser } from "@/lib/actions/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await validateUser();

  return (
    <div className="pb-6 pt-0 px-4">
      <div className="relative z-50">
        {user ? <LoggedInHeader user={user} /> : <Header />}
      </div>
      <div className="pt-24">{children}</div>
    </div>
  );
}
