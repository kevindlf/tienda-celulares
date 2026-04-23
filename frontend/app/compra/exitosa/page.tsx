import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CompraExitosaPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="text-green-600" size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">¡Compra exitosa!</h1>
                <p className="text-gray-500 mb-8">
                    Tu pago fue procesado correctamente. Te enviaremos un email con los detalles de tu pedido.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/mis-pedidos"
                        className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Ver mis pedidos
                    </Link>
                    <Link
                        href="/productos"
                        className="border border-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}
