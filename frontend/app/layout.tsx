import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
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
  icons: {
    icon: "/logo2.png",
  },
  title: {
    default: "Awtad Real Estate | Dubai Luxury Real Estate Agency",
    template: "%s | Awtad Real Estate",
  },
  description:
    "Awtad Real Estate is Dubai's premier luxury real estate agency. Buy, sell, and invest in luxury properties across the UAE with AED 11 Billion in sales.",
  keywords: ["Dubai real estate", "luxury properties", "off-plan", "buy property Dubai", "Awtad Real Estate"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://s.ytimg.com" />
      </head>
      <body className="antialiased min-h-screen flex flex-col" style={{ background: "#0A0E1A" }} suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
      </body>
    </html>
  );
}
