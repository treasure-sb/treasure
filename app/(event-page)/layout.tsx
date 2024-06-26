import NonLoggedHeader from "@/components/shared/header/NonLoggedHeader";
import LoggedInHeader from "@/components/shared/header/LoggedInHeader";
import { validateUser } from "@/lib/actions/auth";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default async function EventPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await validateUser();

  return (
    <>
      <ScrollToTop />
      <div className="px-4 sm:px-8">
        <div className="relative z-50">
          {user ? (
            <LoggedInHeader user={user} isEventPage={true} />
          ) : (
            <NonLoggedHeader isEventPage={true} />
          )}
        </div>
        <div className="pt-16 md:pt-20">{children}</div>
      </div>
    </>
  );
}
