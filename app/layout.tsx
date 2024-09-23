import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { ThemeProvider } from "@/utils/providers/ThemeProvider";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700", "800", "900"],
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ontreasure.com"),
  title: {
    default: "Treasure",
    template: "%s | Treasure",
  },
  description: "Events for everyone",
  keywords: [
    "treasure",
    "treasure events",
    "card shows near me",
    "collectible shows near me",
    "tcg shows near me",
    "tickets",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme={"light"}
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
