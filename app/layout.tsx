import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/shared/Header";
import LoggedInHeader from "@/components/shared/LoggedInHeader";
import { validateUser } from "@/lib/actions/auth";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const lexend = Lexend_Deca({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: "normal",
});

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Treasure",
  description: "Events for everyone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await validateUser();

  return (
    <html lang="en" className={lexend.className}>
      <body className="bg-background text-foreground p-6 px-4 flex flex-col min-h-screen justify-between">
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
