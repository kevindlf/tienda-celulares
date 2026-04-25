"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { configuracionApi } from "@/lib/api";
import { Settings, Save, Phone, MapPin, Truck, Store, MessageSquare } from "lucide-react";

export default function ConfiguracionPage() {
    const router = useRouter();
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [toast, setToast] = useState<{ msg: string, tipo: 'success' | 'error' } | null>(null);

    const [config, setConfig] = useState({
        nombreTienda: "",
        telefonoWhatsApp: "",
        direccionFisica: "",
        linkInstagram: "",
        montoEnvioGratis: 0,
        mensajeCabecera: "",
    });

    useEffect(() => {
        // Verificar token y admin
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (!token || user.rol !== "ADMIN") {
            router.push("/login");
            return;
        }

        configuracionApi.get()
            .then(res => {
                if (res.data) setConfig(res.data);
                setCargando(false);
            })
            .catch(() => {
                showToast("Error al cargar la configuración", "error");
                setCargando(false);
            });
    }, [router]);

    const showToast = (msg: string, tipo: 'success' | 'error') => {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: name === 'montoEnvioGratis' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await configuracionApi.actualizar(config);
            showToast("Configuración guardada exitosamente", "success");
        } catch (error) {
            showToast("Error al guardar la configuración", "error");
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-400">Cargando configuración...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Toast */}
                {toast && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in ${
                        toast.tipo === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                        {toast.msg}
                    </div>
                )}

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Settings className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Configuración de la Tienda</h1>
                        <p className="text-gray-500 mt-1">Administrá la información visible para tus clientes</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    <div className="p-8 border-b border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Store size={16} className="text-gray-400" />
                                    Nombre de la Tienda
                                </label>
                                <input
                                    type="text"
                                    name="nombreTienda"
                                    value={config.nombreTienda}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ej: Mi Tienda Celulares"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MessageSquare size={16} className="text-gray-400" />
                                    Mensaje de Cabecera (Banner)
                                </label>
                                <input
                                    type="text"
                                    name="mensajeCabecera"
                                    value={config.mensajeCabecera}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ej: ¡Envío gratis a partir de $100.000!"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-b border-gray-100 space-y-6 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Contacto y Redes</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Phone size={16} className="text-green-500" />
                                    Teléfono WhatsApp
                                </label>
                                <input
                                    type="text"
                                    name="telefonoWhatsApp"
                                    value={config.telefonoWhatsApp}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ej: 5492634383534"
                                />
                                <p className="text-xs text-gray-500 mt-1">Sin símbolos, empezando con el código de país (Ej: 549...)</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                    Link de Instagram
                                </label>
                                <input
                                    type="url"
                                    name="linkInstagram"
                                    value={config.linkInstagram}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ej: https://instagram.com/mitienda"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin size={16} className="text-red-500" />
                                    Dirección Física / Ubicación
                                </label>
                                <input
                                    type="text"
                                    name="direccionFisica"
                                    value={config.direccionFisica}
                                    onChange={handleChange}
                                    className="w-full border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ej: Av. San Martín 123, Mendoza"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-b border-gray-100 space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Ventas y Envíos</h2>
                        
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <Truck size={16} className="text-blue-500" />
                                Monto para Envío Gratis ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                    type="number"
                                    name="montoEnvioGratis"
                                    value={config.montoEnvioGratis}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full border-gray-200 rounded-xl pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 flex justify-end">
                        <button
                            type="submit"
                            disabled={guardando}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {guardando ? (
                                "Guardando..."
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
