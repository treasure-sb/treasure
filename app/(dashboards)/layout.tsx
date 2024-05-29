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
        <div className="md:px-8 md:py-8 max-h-[calc(100vh)] md:overflow-scroll scrollbar-hidden flex-grow">
          {children}
        </div>
      </div>
    </>
  );
}
