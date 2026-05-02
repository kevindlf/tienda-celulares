"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { configuracionApi } from "@/lib/api";

export default function WhatsAppButton() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const message = "Hola! Tengo una consulta sobre un producto de la tienda.";
    const pathname = usePathname();
    const esCarrito = pathname === "/carrito";

    useEffect(() => {
        configuracionApi.get().then(res => {
            if (res.data?.telefonoWhatsApp) {
                setPhoneNumber(res.data.telefonoWhatsApp);
            }
        }).catch(err => console.error("Error al cargar config de WhatsApp", err));
    }, []);

    if (!phoneNumber) return null;

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <button
            onClick={handleClick}
            className={`fixed ${esCarrito ? "bottom-[5.5rem]" : "bottom-6"} right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1ebe57] hover:scale-110 transition-all duration-300 flex items-center justify-center group`}
            aria-label="Contactar por WhatsApp"
        >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.938-.001 3.825-3.113 6.938-6.938 6.942z"/>
            </svg>
            
            {/* Tooltip */}
            <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¿Necesitás ayuda?
            </span>
            
            {/* Ping animation effect */}
            <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-30 animate-ping -z-10"></span>
        </button>
    );
}
