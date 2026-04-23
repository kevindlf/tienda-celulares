"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone } from "lucide-react";
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                        <Smartphone className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">TechPhone</h1>
                    <p className="text-gray-500 mt-1">Creá tu cuenta</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleRegistro} className="flex flex-col gap-5">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                                required
                               // En cada input agregá text-gray-900
className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                               // En cada input agregá text-gray-900
className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                               // En cada input agregá text-gray-900
className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
                            <input
                                type="password"
                                name="confirmarPassword"
                                value={form.confirmarPassword}
                                onChange={handleChange}
                                placeholder="Repetí la contraseña"
                                required
                                // En cada input agregá text-gray-900
className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            // En cada input agregá text-gray-900
className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {cargando ? "Registrando..." : "Crear cuenta"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿Ya tenés cuenta?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline font-medium">
                            Ingresá
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}