import Link from "next/link";
import { Clock } from "lucide-react";

export default function CompraPendientePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                    <Clock className="text-yellow-600" size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Pago pendiente</h1>
                <p className="text-gray-500 mb-8">
                    Tu pago está siendo procesado. Esto puede tardar unos minutos. Te notificaremos cuando se confirme.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/mis-pedidos"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Ver mis pedidos
                    </Link>
                    <Link
                        href="/"
                        className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
