"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, Smartphone, Package, Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { configuracionApi } from "@/lib/api";

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { usuario, isAuthenticated, isAdmin, logout } = useAuth();
    const { cantidadTotal } = useCart();
    
    const [config, setConfig] = useState({
        nombreTienda: "TechPhone",
        mensajeCabecera: ""
    });

    useEffect(() => {
        configuracionApi.get().then(res => {
            if (res.data) {
                setConfig(prev => ({
                    ...prev,
                    nombreTienda: res.data.nombreTienda || prev.nombreTienda,
                    mensajeCabecera: res.data.mensajeCabecera || ""
                }));
            }
        }).catch(err => console.error("Error al cargar config de Navbar", err));

        // Inicializar dark mode
        const isDark = localStorage.getItem("theme") === "dark" || 
            (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem("theme", "light");
        }
    };

    const cerrarSesion = () => {
        logout();
        window.location.href = "/";
    };

    return (
        <>
        {config.mensajeCabecera && (
            <div className="bg-primary text-white text-center text-sm py-2 px-4 font-medium tracking-wide">
                {config.mensajeCabecera}
            </div>
        )}
        <nav className="bg-nav-bg backdrop-blur-lg shadow-sm border-b border-card-border sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary text-white p-1.5 rounded-xl group-hover:scale-105 transition-transform">
                            <Smartphone size={20} />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-foreground">{config.nombreTienda}</span>
                    </Link>

                    {/* Links desktop */}
                    <div className="hidden md:flex items-center gap-8 font-medium">
                        <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
                            Inicio
                        </Link>
                        <Link href="/productos" className="text-foreground/80 hover:text-primary transition-colors">
                            Catálogo
                        </Link>
                        {isAuthenticated && !isAdmin && (
                            <Link href="/mis-pedidos" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
                                <Package size={16} />
                                Pedidos
                            </Link>
                        )}
                        {isAdmin && (
                            <Link href="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="hidden md:flex items-center gap-5">
                        <button onClick={toggleTheme} className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-accent">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        
                        <Link href="/carrito" className="relative p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-accent">
                            <ShoppingCart size={22} />
                            {cantidadTotal > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                    {cantidadTotal > 9 ? "9+" : cantidadTotal}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-card-border">
                                <span className="text-sm font-medium text-foreground">Hola, {usuario?.nombre}</span>
                                <button
                                    onClick={cerrarSesion}
                                    className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2 rounded-full hover:bg-primary-hover hover:scale-105 shadow-md shadow-primary/20 transition-all text-sm"
                            >
                                <User size={16} />
                                Ingresar
                            </Link>
                        )}
                    </div>

                    {/* Menú mobile */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button onClick={toggleTheme} className="p-2 text-foreground/80">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link href="/carrito" className="relative p-2 text-foreground/80">
                            <ShoppingCart size={22} />
                            {cantidadTotal > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cantidadTotal}
                                </span>
                            )}
                        </Link>
                        <button
                            className="p-2 text-foreground"
                            onClick={() => setMenuAbierto(!menuAbierto)}
                        >
                            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Menú mobile abierto */}
                {menuAbierto && (
                    <div className="md:hidden border-t border-card-border py-4 flex flex-col gap-4 font-medium">
                        <Link href="/" className="text-foreground hover:text-primary px-2" onClick={() => setMenuAbierto(false)}>Inicio</Link>
                        <Link href="/productos" className="text-foreground hover:text-primary px-2" onClick={() => setMenuAbierto(false)}>Catálogo</Link>
                        {isAuthenticated && !isAdmin && (
                            <Link href="/mis-pedidos" className="text-foreground hover:text-primary px-2" onClick={() => setMenuAbierto(false)}>Mis pedidos</Link>
                        )}
                        {isAdmin && (
                            <Link href="/dashboard" className="text-foreground hover:text-primary px-2" onClick={() => setMenuAbierto(false)}>Dashboard</Link>
                        )}
                        {isAuthenticated ? (
                            <button onClick={cerrarSesion} className="text-red-500 text-left px-2">Cerrar sesión</button>
                        ) : (
                            <Link href="/login" className="text-primary px-2" onClick={() => setMenuAbierto(false)}>Ingresar</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
        </>
    );
}