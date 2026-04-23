"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, Smartphone, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { usuario, isAuthenticated, isAdmin, logout } = useAuth();
    const { cantidadTotal } = useCart();

    const cerrarSesion = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Smartphone className="text-blue-600" size={24} />
                        <span className="font-bold text-xl text-gray-900">TechPhone</span>
                    </Link>

                    {/* Links desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Inicio
                        </Link>
                        <Link href="/productos" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Productos
                        </Link>
                        {isAuthenticated && !isAdmin && (
                            <Link href="/mis-pedidos" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                                <Package size={16} />
                                Mis pedidos
                            </Link>
                        )}
                        {isAdmin && (
                            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/carrito" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <ShoppingCart size={22} />
                            {cantidadTotal > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cantidadTotal > 9 ? "9+" : cantidadTotal}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Hola, {usuario?.nombre}</span>
                                <button
                                    onClick={cerrarSesion}
                                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                <User size={16} />
                                Ingresar
                            </Link>
                        )}
                    </div>

                    {/* Menú mobile */}
                    <div className="flex items-center gap-3 md:hidden">
                        <Link href="/carrito" className="relative p-2 text-gray-600">
                            <ShoppingCart size={22} />
                            {cantidadTotal > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cantidadTotal > 9 ? "9+" : cantidadTotal}
                                </span>
                            )}
                        </Link>
                        <button
                            className="p-2"
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Menú mobile abierto */}
                {menuAbierto && (
                    <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4">
                        <Link href="/" className="text-gray-600 hover:text-blue-600" onClick={() => setMenuAbierto(false)}>Inicio</Link>
                        <Link href="/productos" className="text-gray-600 hover:text-blue-600" onClick={() => setMenuAbierto(false)}>Productos</Link>
                        {isAuthenticated && !isAdmin && (
                            <Link href="/mis-pedidos" className="text-gray-600 hover:text-blue-600" onClick={() => setMenuAbierto(false)}>Mis pedidos</Link>
                        )}
                        {isAdmin && (
                            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600" onClick={() => setMenuAbierto(false)}>Dashboard</Link>
                        )}
                        {isAuthenticated ? (
                            <button onClick={cerrarSesion} className="text-red-500 text-left">Cerrar sesión</button>
                        ) : (
                            <Link href="/login" className="text-blue-600" onClick={() => setMenuAbierto(false)}>Ingresar</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}