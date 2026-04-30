"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone, ArrowRight, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function RegistroPage() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmarPassword: "",
    });
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmarPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setCargando(true);
        try {
            await authApi.registro({
                nombre: form.nombre,
                email: form.email,
                password: form.password,
            });
            window.location.href = "/login";
        } catch {
            setError("Error al registrarse. El email puede estar en uso.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 overflow-x-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative">

                <div className="text-center mb-8 sm:mb-10">
                    <Link href="/" className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl mb-5 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Smartphone className="text-white" size={28} />
                    </Link>
                    <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground leading-tight">Creá tu cuenta</h1>
                    <p className="text-foreground/50 mt-2 text-sm sm:text-base">Es rápido y gratuito</p>
                </div>

                <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-card-border p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleRegistro} className="flex flex-col gap-4 sm:gap-5">

                        {error && (
                            <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="nombre" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Nombre completo</label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                autoComplete="name"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                                required
                                className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                inputMode="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                                className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                                className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmarPassword" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Confirmar contraseña</label>
                            <input
                                id="confirmarPassword"
                                type="password"
                                name="confirmarPassword"
                                autoComplete="new-password"
                                value={form.confirmarPassword}
                                onChange={handleChange}
                                placeholder="Repetí la contraseña"
                                required
                                className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center gap-2 mt-2"
                        >
                            {cargando ? "Creando cuenta..." : (
                                <>
                                    Crear cuenta
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-foreground/60 mt-6 sm:mt-8">
                        ¿Ya tenés cuenta?{" "}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Ingresá
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
