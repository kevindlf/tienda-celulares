import Link from "next/link";
import { Smartphone, Shield, Truck, CreditCard } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen">

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Los mejores celulares
                        <span className="block text-blue-200">al mejor precio</span>
                    </h1>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        iPhone, Samsung, Motorola y más. Envíos a todo el país con Andreani y Correo Argentino.
                    </p>
                    <Link
                        href="/productos"
                        className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg"
                    >
                        Ver productos
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 rounded-2xl bg-gray-50">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
                            <Truck className="text-blue-600" size={28} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Envío a todo el país</h3>
                        <p className="text-gray-500">Andreani y Correo Argentino. Seguí tu pedido en tiempo real.</p>
                    </div>
                    <div className="text-center p-8 rounded-2xl bg-gray-50">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
                            <CreditCard className="text-blue-600" size={28} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Pagá con Mercado Pago</h3>
                        <p className="text-gray-500">Tarjeta, transferencia o efectivo. Hasta 12 cuotas sin interés.</p>
                    </div>
                    <div className="text-center p-8 rounded-2xl bg-gray-50">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-4">
                            <Shield className="text-blue-600" size={28} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Garantía oficial</h3>
                        <p className="text-gray-500">Todos nuestros equipos tienen garantía oficial del fabricante.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto text-center">
                    <Smartphone className="mx-auto text-blue-600 mb-4" size={48} />
                    <h2 className="text-3xl font-bold mb-4">¿Buscás un celular nuevo?</h2>
                    <p className="text-gray-500 mb-8">Tenemos los últimos modelos con stock disponible.</p>
                    <Link
                        href="/productos"
                        className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Ver catálogo completo
                    </Link>
                </div>
            </section>
        </div>
    );
}