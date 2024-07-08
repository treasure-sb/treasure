import { Section } from "@react-email/components";

export default function BodySection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Section
      className={`border-solid border-[1px] rounded-[1rem] border-foreground/20 p-4 w-full text-center mb-6 ${className}`}
    >
      {children}
    </Section>
  );
}
