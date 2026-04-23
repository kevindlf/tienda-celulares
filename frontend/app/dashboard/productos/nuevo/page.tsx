"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { productosApi } from "../../../../lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NuevoProductoPage() {
    const [form, setForm] = useState({
        nombre: "",
        marca: "",
        modelo: "",
        descripcion: "",
        precio: "",
        stock: "",
        ram: "",
        almacenamiento: "",
        color: "",
        imagenes: [] as string[],
    });
    const [guardando, setGuardando] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            await productosApi.crear({
                ...form,
                precio: Number(form.precio),
                stock: Number(form.stock),
                ram: Number(form.ram),
                almacenamiento: Number(form.almacenamiento),
            });
            router.push("/dashboard");
        } catch {
            alert("Error al crear el producto");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <form onSubmit={handleGuardar} className="flex flex-col gap-5">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Nombre</label>
                                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Marca</label>
                                <input type="text" name="marca" value={form.marca} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Modelo</label>
                                <input type="text" name="modelo" value={form.modelo} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Color</label>
                                <input type="text" name="color" value={form.color} onChange={handleChange}
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Descripción</label>
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                                className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Precio</label>
                                <input type="number" name="precio" value={form.precio} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Stock inicial</label>
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} required
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">RAM (GB)</label>
                                <input type="number" name="ram" value={form.ram} onChange={handleChange}
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Almacenamiento (GB)</label>
                                <input type="number" name="almacenamiento" value={form.almacenamiento} onChange={handleChange}
                                    className="border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Link href="/dashboard"
                                className="flex-1 text-center border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={guardando}
                                className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {guardando ? "Creando..." : "Crear producto"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}