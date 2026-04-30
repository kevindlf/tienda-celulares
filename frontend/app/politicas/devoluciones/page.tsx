import Link from "next/link";

const TIENDA = process.env.NEXT_PUBLIC_STORE_NAME || "la tienda";

export const metadata = {
    title: `Política de Devoluciones | ${TIENDA}`,
    description: "Conocé nuestra política de devoluciones y el derecho de retracto según la Ley 24.240.",
};

export default function DevolucionesPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-[var(--foreground)]/50 mb-8">
                    <Link href="/" className="hover:text-[var(--primary)] transition-colors">Inicio</Link>
                    <span>/</span>
                    <span>Políticas</span>
                    <span>/</span>
                    <span className="text-[var(--foreground)]">Devoluciones</span>
                </nav>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Política de Devoluciones</h1>
                    <p className="text-[var(--foreground)]/50 text-sm mb-4">Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}</p>

                    {/* Banner Ley 24.240 */}
                    <div className="bg-[var(--accent)] border border-[var(--primary)]/20 rounded-xl p-4 mb-10 flex items-start gap-3">
                        <span className="text-[var(--primary)] text-xl mt-0.5">⚖️</span>
                        <p className="text-[var(--foreground)]/80 text-sm leading-relaxed">
                            <strong className="text-[var(--foreground)]">Ley de Defensa del Consumidor N° 24.240 — Art. 34:</strong> Tenés derecho a revocar tu compra dentro de los <strong>10 días corridos</strong> desde que recibiste el producto, sin necesidad de dar explicaciones y sin penalidad alguna.
                        </p>
                    </div>

                    <div className="space-y-8 text-[var(--foreground)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">1. Derecho de retracto (10 días)</h2>
                            <p className="mb-3">Si compraste a través del sitio web y recibiste el producto, tenés 10 días corridos desde la recepción para arrepentirte de la compra, sin costo alguno. Este derecho está amparado por el Art. 34 de la Ley 24.240 de Defensa del Consumidor.</p>
                            <p>Para ejercerlo, el producto debe estar en su estado original, sin uso evidente ni daños adicionales.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">2. Procedimiento para solicitar una devolución</h2>
                            <ol className="list-decimal list-inside space-y-3 pl-2">
                                <li>Contactanos por WhatsApp o email con tu número de pedido e indicando el motivo de la devolución.</li>
                                <li>Te confirmaremos la recepción de tu solicitud dentro de las 24 horas hábiles.</li>
                                <li>Enviás el producto en su embalaje original (o embalaje adecuado que lo proteja) a la dirección que te indicaremos. El costo del envío de devolución está a cargo del comprador, salvo que el producto presente un defecto de fábrica.</li>
                                <li>Una vez que recibimos y verificamos el estado del producto, procesamos el reembolso.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">3. Reembolsos</h2>
                            <p className="mb-3">El reembolso se realiza por el mismo medio de pago que utilizaste:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Mercado Pago:</strong> 5 a 10 días hábiles para que el importe se refleje en tu cuenta.</li>
                            </ul>
                            <p className="mt-3">El monto reembolsado es el total abonado por el producto. Los costos de envío originales no se reembolsan, excepto en casos de error de {TIENDA} o defecto de fábrica.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">4. Productos con garantía (defecto de fábrica)</h2>
                            <p className="mb-3">Si tu producto presenta un defecto de fabricación dentro del período de garantía:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Equipos nuevos:</strong> 12 meses desde la compra.</li>
                                <li><strong>Equipos usados:</strong> 90 días desde la compra.</li>
                            </ul>
                            <p className="mt-3">En estos casos, cubrimos el costo del envío de devolución y te ofrecemos reposición del producto o reembolso total según disponibilidad.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">5. Excepciones — productos que no aplican a devolución</h2>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Productos con daños evidentes causados por el comprador (golpes, líquido, quemaduras).</li>
                                <li>Productos con el IMEI o número de serie alterado.</li>
                                <li>Productos con software modificado (rooteo, jailbreak) posterior a la entrega.</li>
                                <li>Accesorios de uso higiénico (auriculares, fundas con uso visible) fuera del período de retracto.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">6. Contacto para devoluciones</h2>
                            <p>Podés iniciar una devolución contactándonos por WhatsApp directamente desde el sitio. Nuestro horario de atención es de Lunes a Viernes de 9:00 a 13:00 y de 17:00 a 21:00, y Sábados de 9:30 a 13:30.</p>
                        </section>
                    </div>
                </div>

                <div className="mt-6 flex gap-4 text-sm">
                    <Link href="/politicas/terminos" className="text-[var(--primary)] hover:underline font-medium">Términos y Condiciones</Link>
                    <span className="text-[var(--foreground)]/30">|</span>
                    <Link href="/politicas/privacidad" className="text-[var(--primary)] hover:underline font-medium">Política de Privacidad</Link>
                </div>
            </div>
        </div>
    );
}
