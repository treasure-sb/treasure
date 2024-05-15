import MobileHeader from "./components/mobile/MobileHeader";
import Sidebar from "./components/desktop/sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MobileHeader />
      <div className="pt-20 p-4 md:p-0 md:flex md:min-h-screen relative">
        <Sidebar />
        <div className="md:mt-4 md:px-8 md:py-4 max-h-[calc(100vh-2rem)] md:overflow-scroll scrollbar-hidden flex-grow">
          {children}
        </div>
      </div>
    </>
  );
}
