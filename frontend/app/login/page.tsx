"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Smartphone } from "lucide-react";
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

            if (data.rol === "ADMIN") {
                router.push("/dashboard");
            } else {
                router.push("/");
            }
        } catch {
            setError("Email o contraseña incorrectos");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                        <Smartphone className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">TechPhone</h1>
                    <p className="text-gray-500 mt-1">Ingresá a tu cuenta</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cargando ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿No tenés cuenta?{" "}
                        <Link href="/registro" className="text-blue-600 hover:underline font-medium">
                            Registrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}