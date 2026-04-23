import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CompraFallidaPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <XCircle className="text-red-600" size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">El pago no se pudo procesar</h1>
                <p className="text-gray-500 mb-8">
                    Hubo un problema con tu pago. Verificá los datos de tu tarjeta o intentá con otro medio de pago.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/carrito"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Reintentar
                    </Link>
                    <Link
                        href="/productos"
                        className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Volver a productos
                    </Link>
                </div>
            </div>
        </div>
    );
}
