import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ChatWidget from "@/components/ui/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

const geist = Geist({ subsets: ["latin"] });

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
        <html lang="es">
            <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
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