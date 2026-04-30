"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Smartphone, ArrowRight, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { AuthResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError("");

        try {
            const res = await authApi.login(email, password);
            const data: AuthResponse = res.data;
            login(data.token, { nombre: data.nombre, rol: data.rol });
            showToast(`¡Bienvenido, ${data.nombre}!`, "success");
            router.push(data.rol === "ADMIN" ? "/dashboard" : "/");
        } catch {
            setError("Email o contraseña incorrectos");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:py-16 overflow-x-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md relative">

                {/* Logo */}
                <div className="text-center mb-8 sm:mb-10">
                    <Link href="/" className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl mb-5 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Smartphone className="text-white" size={28} />
                    </Link>
                    <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground leading-tight">Bienvenido</h1>
                    <p className="text-foreground/50 mt-2 text-sm sm:text-base">Ingresá a tu cuenta</p>
                </div>

                <div className="bg-card-bg rounded-2xl sm:rounded-3xl border border-card-border p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">

                        {error && (
                            <div role="alert" className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5">
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-xs font-black text-foreground/60 uppercase tracking-wider">Email</label>
                            <input
                                id="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="border border-card-border rounded-xl px-4 py-3.5 text-base text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[52px]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center gap-2 mt-2"
                        >
                            {cargando ? "Ingresando..." : (
                                <>
                                    Ingresar
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-foreground/60 mt-6 sm:mt-8">
                        ¿No tenés cuenta?{" "}
                        <Link href="/registro" className="text-primary font-bold hover:underline">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
