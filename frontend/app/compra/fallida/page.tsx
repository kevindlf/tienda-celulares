import Link from "next/link";
import { XCircle, RotateCcw } from "lucide-react";

export default function CompraFallidaPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 overflow-x-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-500/5 blur-3xl pointer-events-none"></div>

            <div className="text-center max-w-md relative">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-red-500/10 border border-red-500/30 rounded-full mb-6 sm:mb-8">
                    <XCircle className="text-red-500" size={44} />
                </div>
                <p className="text-xs font-black text-red-500 uppercase tracking-[0.25em] mb-2">Pago rechazado</p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4 leading-tight">No pudimos procesar tu pago</h1>
                <p className="text-foreground/60 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed">
                    Verificá los datos de tu tarjeta o probá con otro medio de pago. Tu carrito sigue intacto.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/carrito"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-7 py-4 rounded-full hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all min-h-[52px]"
                    >
                        <RotateCcw size={18} />
                        Reintentar
                    </Link>
                    <Link
                        href="/productos"
                        className="inline-flex items-center justify-center bg-card-bg border border-card-border text-foreground font-semibold px-7 py-4 rounded-full hover:border-primary/40 transition-all min-h-[52px]"
                    >
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
}
