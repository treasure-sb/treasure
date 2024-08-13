import NonLoggedHeader from "@/components/shared/header/NonLoggedHeader";
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
    <div className={`pb-6 pt-0 px-4 sm:px-8`}>
      <div className="relative z-50">
        {user ? <LoggedInHeader user={user} /> : <NonLoggedHeader />}
      </div>
      <div className="pt-20 md:pt-28">{children}</div>
    </div>
  );
}
