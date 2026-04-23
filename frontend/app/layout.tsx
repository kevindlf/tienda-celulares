import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TechPhone Store",
    description: "La mejor tienda de celulares",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={`${geist.className} bg-gray-50 min-h-screen`}>
                <AuthProvider>
                    <CartProvider>
                        <ToastProvider>
                            <Navbar />
                            {children}
                        </ToastProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}