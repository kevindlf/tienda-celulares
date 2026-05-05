import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatWidget from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { Analytics } from "@vercel/analytics/next";

const syne = Syne({
    subsets: ["latin"],
    weight: ["700", "800"],
    variable: "--font-display",
    display: "swap",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-body",
    display: "swap",
});

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "TechPhone Store";
const STORE_DESC = process.env.NEXT_PUBLIC_STORE_DESCRIPTION || "Celulares nuevos y reacondicionados con garantía. Comprá online con MercadoPago en 3 cuotas sin interés.";
const STORE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tienda-celulares-woad.vercel.app";

export const metadata: Metadata = {
    title: {
        default: STORE_NAME,
        template: `%s | ${STORE_NAME}`,
    },
    description: STORE_DESC,
    metadataBase: new URL(STORE_URL),
    keywords: ["celulares", "smartphones", "iPhone", "Samsung", "Motorola", "accesorios", "MercadoPago", "cuotas sin interés"],
    authors: [{ name: STORE_NAME }],
    robots: { index: true, follow: true },
    openGraph: {
        type: "website",
        locale: "es_AR",
        url: STORE_URL,
        siteName: STORE_NAME,
        title: STORE_NAME,
        description: STORE_DESC,
    },
    twitter: {
        card: "summary_large_image",
        title: STORE_NAME,
        description: STORE_DESC,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={`${syne.variable} ${dmSans.variable}`}>
            <body className="min-h-screen flex flex-col">
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            <Navbar />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <ChatWidget />
                            <WhatsAppButton />
                            <Analytics />
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}