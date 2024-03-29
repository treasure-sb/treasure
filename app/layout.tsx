import "./globals.css";
import { Raleway, Inter, Lato } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/utils/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: "normal",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  style: "normal",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
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
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-x-hidden w-screen">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
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
