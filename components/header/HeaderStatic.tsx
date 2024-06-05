export default function HeaderStatic({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className="overflow-x-hidden py-4 px-4 sm:px-8">
      <div className="max-w-[var(--container-width)] flex justify-between items-center m-auto w-full">
        {children}
      </div>
    </header>
  );
}
