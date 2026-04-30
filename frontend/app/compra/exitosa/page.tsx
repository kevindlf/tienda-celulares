import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CompraExitosaPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 overflow-x-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

            <div className="text-center max-w-md relative">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 border border-primary/30 rounded-full mb-6 sm:mb-8">
                    <CheckCircle className="text-primary" size={44} />
                </div>
                <p className="text-xs font-black text-primary uppercase tracking-[0.25em] mb-2">Pago confirmado</p>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-3 sm:mb-4 leading-tight">¡Compra exitosa!</h1>
                <p className="text-foreground/60 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed">
                    Tu pago fue procesado correctamente. Te enviamos un email con los detalles de tu pedido.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/mis-pedidos"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-7 py-4 rounded-full hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 transition-all min-h-[52px]"
                    >
                        Ver mis pedidos
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href="/productos"
                        className="inline-flex items-center justify-center bg-card-bg border border-card-border text-foreground font-semibold px-7 py-4 rounded-full hover:border-primary/40 transition-all min-h-[52px]"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    );
}
