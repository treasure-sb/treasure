import NonLoggedHeader from "@/components/header/NonLoggedHeader";
import LoggedInHeader from "@/components/header/LoggedInHeader";
import { validateUser } from "@/lib/actions/auth";

export default async function EventPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await validateUser();

  return (
    <div className="px-4 sm:px-8 flex flex-col justify-between min-h-screen">
      <div className="pt-10 md:pt-16">{children}</div>
      <div className="relative z-50">
        {user ? (
          <LoggedInHeader user={user} useMotion={false} />
        ) : (
          <NonLoggedHeader useMotion={false} />
        )}
      </div>
    </div>
  );
}
