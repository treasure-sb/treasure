import "./globals.css";
import { Raleway } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { validateUser } from "@/lib/actions/auth";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/shared/Header";
import LoggedInHeader from "@/components/shared/LoggedInHeader";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
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
  const {
    data: { user },
  } = await validateUser();

  return (
    <html lang="en" className={raleway.className}>
      <body className="bg-background text-foreground flex flex-col justify-between">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="p-6 px-4">
              {user ? <LoggedInHeader user={user} /> : <Header />}
              {children}
              <Toaster />
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
