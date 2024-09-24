export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="relative z-10 py-4 px-4 sm:px-8">{children}</div>
    </div>
  );
}
