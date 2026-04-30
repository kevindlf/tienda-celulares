import type { Metadata } from "next";
import ProductoDetalleClient from "./ProductoDetalleClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "TechPhone";
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/productos/${id}`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return { title: `Producto | ${storeName}` };
        const p = await res.json();
        const precio = p.precio?.toLocaleString("es-AR");
        return {
            title: `${p.nombre} | ${storeName}`,
            description: p.descripcion || `${p.marca} ${p.modelo} — $${precio}`,
            openGraph: {
                title: p.nombre,
                description: p.descripcion || `${p.marca} ${p.modelo} — $${precio}`,
                images: p.imagenes?.[0] ? [{ url: p.imagenes[0], alt: p.nombre }] : [],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: p.nombre,
                images: p.imagenes?.[0] ? [p.imagenes[0]] : [],
            },
        };
    } catch {
        return { title: `Producto | ${storeName}` };
    }
}

export default async function ProductoDetallePage({ params }: Props) {
    const { id } = await params;
    return <ProductoDetalleClient id={Number(id)} />;
}
