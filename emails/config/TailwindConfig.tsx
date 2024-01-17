import { Tailwind } from "@react-email/components";

export default function TailwindConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              background: "#ffffff",
              foreground: "#09090b",
              primary: {
                DEFAULT: "#71d08c",
                foreground: "#fff1f2",
              },
              secondary: {
                DEFAULT: "#f4f4f5",
                foreground: "#18181b",
              },
              tertiary: {
                DEFAULT: "#eac362",
              },
            },
            borderRadius: {
              lg: "1rem",
              md: "calc(1rem - 2px)",
              sm: "calc(1rem - 4px)",
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  );
}
