import SignupHeader from "./components/SignupHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 px-4">
      <SignupHeader />
      {children}
    </div>
  );
}
