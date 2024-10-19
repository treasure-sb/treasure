import NonLoggedHeader from "@/components/shared/header/NonLoggedHeader";
import LoggedInHeader from "@/components/shared/header/LoggedInHeader";
import { validateUser } from "@/lib/actions/auth";
import ScrollToTop from "@/components/shared/ScrollToTop";
import TreasureEmerald from "@/components/icons/TreasureEmerald";

export default async function EmbeddedCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { user },
  } = await validateUser();

  return (
    <>
      <div className="px-4 sm:px-8">
        <div className="pt-16 md:pt-20">{children}</div>
        <div className="flex gap-2 mt-2 items-center justify-center">
          <h2 className="text-center">powered by </h2>
          <div className="flex -space-x-1 items-center font-bold">
            <TreasureEmerald
              className="block lg:hidden"
              width={12}
              height={12}
            />
            <TreasureEmerald
              className="hidden lg:block"
              width={18}
              height={18}
            />
            <p className="text-xl lg:text-2xl tracking-[-0.1rem] lg:tracking-[-0.14rem]">
              Treasure
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
