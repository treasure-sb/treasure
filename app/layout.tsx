import { Raleway } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { validateUser } from "@/lib/actions/auth";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/shared/Header";
import LoggedInHeader from "@/components/shared/LoggedInHeader";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: "normal",
});

export const metadata = {
  metadataBase: new URL("https://ontreasure.xyz"),
  title: {
    default: "Treasure",
    template: "%s | Treasure",
  },
  description: "Events for everyone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await validateUser();

  return (
    <html lang="en" className={raleway.className}>
      <body className="bg-background text-foreground p-6 px-4 flex flex-col justify-between">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div>
            {user.data.user ? <LoggedInHeader /> : <Header />}
            {children}
            <Toaster />
          </div>
          {/* <Footer /> */}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
