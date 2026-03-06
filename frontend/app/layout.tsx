import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-KQ96GGVTF0"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KQ96GGVTF0');
        `}
      </Script>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
