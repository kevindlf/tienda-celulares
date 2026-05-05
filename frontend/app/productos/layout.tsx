import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catálogo",
    description: "Explorá nuestro catálogo de celulares nuevos y reacondicionados. Filtrá por marca, modelo, precio y condición.",
    openGraph: {
        title: "Catálogo de Celulares",
        description: "Explorá nuestro catálogo de celulares nuevos y reacondicionados.",
    },
};

export default function ProductosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
