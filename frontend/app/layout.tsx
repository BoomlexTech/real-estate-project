import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Awtad Real Estate | Dubai Luxury Real Estate Agency",
    template: "%s | Awtad Real Estate",
  },
  description:
    "Awtad Real Estate is Dubai's premier luxury real estate agency. Buy, sell, and invest in luxury properties across the UAE with AED 11 Billion in sales.",
  keywords: ["Dubai real estate", "luxury properties", "off-plan", "buy property Dubai", "Awtad Real Estate"],
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://awtadrealestate.com",
    siteName: "Awtad Real Estate",
    title: "Awtad Real Estate | Dubai Luxury Real Estate Agency",
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col" style={{ background: "#0A0E1A" }} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
