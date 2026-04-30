import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatWidget from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

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

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_STORE_NAME || "TechPhone Store",
    description: process.env.NEXT_PUBLIC_STORE_DESCRIPTION || "La mejor tienda de celulares",
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
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}