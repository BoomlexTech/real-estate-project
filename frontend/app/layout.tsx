import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Real Capital | Dubai Luxury Real Estate Agency",
    template: "%s | Real Capital",
  },
  description:
    "Real Capital is Dubai's premier luxury real estate agency. Buy, sell, and invest in luxury properties across the UAE with AED 11 Billion in sales.",
  keywords: ["Dubai real estate", "luxury properties", "off-plan", "buy property Dubai", "Real Capital"],
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://realcapital.ae",
    siteName: "Real Capital",
    title: "Real Capital | Dubai Luxury Real Estate Agency",
    description:
      "Dubai's premier luxury real estate agency with AED 11 Billion in sales. Find apartments, villas, and off-plan properties.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable}>
      <body className="antialiased min-h-screen flex flex-col" style={{ background: "#1a1f2e" }} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
