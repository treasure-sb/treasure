import Header from "@/components/shared/Header";
import LoggedInHeader from "@/components/shared/LoggedInHeader";
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
    <div className="p-6 px-4">
      <div className="relative z-10">
        {user ? <LoggedInHeader user={user} /> : <Header />}
      </div>
      {children}
    </div>
  );
}
