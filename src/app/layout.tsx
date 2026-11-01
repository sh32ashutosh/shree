import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saubhagya Sarees | Luxury Handwoven Indian Ethnic Wear & Bridal Heirlooms",
  description:
    "Discover authentic handloom Kanjivaram silks, Banarasi brocades, and bespoke bridal lehengas crafted by master weavers. Worldwide insured shipping with certified Silk Mark.",
  keywords: [
    "Kanjivaram Silk Saree",
    "Banarasi Brocade",
    "Handloom Sarees",
    "Bridal Lehenga",
    "Silk Mark Certified",
    "Pure Silk",
    "Indian Luxury Ethnic Wear",
  ],
  openGraph: {
    title: "Saubhagya Sarees | Heritage Atelier",
    description:
      "Crafted for every happy occasion. Authentic Indian handlooms, Kanjivarams, and royal bridal couture.",
    url: "https://saubhagyasarees.com",
    siteName: "Saubhagya Sarees",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#1F1916] antialiased selection:bg-[#5E131D] selection:text-[#FAF6F0]">
        <AnnouncementBar />
        <SiteHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FAF6F0",
              color: "#1F1916",
              border: "1px solid #E8DED1",
              fontFamily: "var(--font-jakarta)",
            },
          }}
        />
      </body>
    </html>
  );
}
