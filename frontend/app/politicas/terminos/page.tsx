import Link from "next/link";

const TIENDA = process.env.NEXT_PUBLIC_STORE_NAME || "la tienda";

export const metadata = {
    title: `Términos y Condiciones | ${TIENDA}`,
    description: "Términos y condiciones de compra y uso del sitio.",
};

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-[var(--foreground)]/50 mb-8">
                    <Link href="/" className="hover:text-[var(--primary)] transition-colors">Inicio</Link>
                    <span>/</span>
                    <span>Políticas</span>
                    <span>/</span>
                    <span className="text-[var(--foreground)]">Términos y Condiciones</span>
                </nav>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Términos y Condiciones</h1>
                    <p className="text-[var(--foreground)]/50 text-sm mb-10">Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}</p>

                    <div className="space-y-8 text-[var(--foreground)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">1. Aceptación de los términos</h2>
                            <p>Al realizar una compra o navegar por {TIENDA}, aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, te pedimos que no utilices nuestros servicios.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">2. Proceso de compra</h2>
                            <p className="mb-3">Para realizar una compra necesitás crear una cuenta con un email válido. El proceso es el siguiente:</p>
                            <ol className="list-decimal list-inside space-y-2 pl-2">
                                <li>Seleccionás el producto y lo agregás al carrito.</li>
                                <li>Completás tus datos de envío en el checkout.</li>
                                <li>Realizás el pago a través de Mercado Pago (tarjeta, transferencia o efectivo).</li>
                                <li>Recibís confirmación por email al completarse el pago.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">3. Precios y pagos</h2>
                            <p className="mb-3">Todos los precios están expresados en pesos argentinos (ARS) e incluyen IVA. {TIENDA} se reserva el derecho de modificar precios sin previo aviso. El precio válido es el vigente al momento de confirmar la compra.</p>
                            <p>Los pagos se procesan exclusivamente a través de Mercado Pago. No almacenamos datos de tarjetas de crédito ni débito.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">4. Envíos y plazos de entrega</h2>
                            <p className="mb-3">Los envíos se realizan a todo el país. Los plazos estimados son:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Gran Mendoza:</strong> 1 a 3 días hábiles.</li>
                                <li><strong>Resto del país:</strong> 3 a 7 días hábiles.</li>
                            </ul>
                            <p className="mt-3">Los plazos comienzan a contar desde la confirmación del pago, no desde la fecha del pedido.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">5. Garantías</h2>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Equipos nuevos:</strong> 12 meses de garantía del fabricante.</li>
                                <li><strong>Equipos usados:</strong> 90 días de garantía cubierta por {TIENDA}.</li>
                            </ul>
                            <p className="mt-3">La garantía no cubre daños causados por uso inadecuado, golpes, líquidos, o intentos de reparación no autorizados.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">6. Disponibilidad de stock</h2>
                            <p>El stock mostrado en el sitio es en tiempo real. En el caso excepcional de que un producto adquirido quede sin stock, nos comunicaremos dentro de las 24 horas para ofrecer una alternativa o realizar el reembolso completo.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">7. Jurisdicción</h2>
                            <p>Ante cualquier controversia derivada de la compraventa, las partes acuerdan someterse a la jurisdicción de los tribunales ordinarios de la Ciudad de Mendoza, Provincia de Mendoza, República Argentina, renunciando a cualquier otro fuero que pudiere corresponder.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">8. Contacto</h2>
                            <p>Para consultas sobre estos términos, podés contactarnos por WhatsApp o a través del formulario de contacto del sitio.</p>
                        </section>
                    </div>
                </div>

                <div className="mt-6 flex gap-4 text-sm">
                    <Link href="/politicas/devoluciones" className="text-[var(--primary)] hover:underline font-medium">Política de Devoluciones</Link>
                    <span className="text-[var(--foreground)]/30">|</span>
                    <Link href="/politicas/privacidad" className="text-[var(--primary)] hover:underline font-medium">Política de Privacidad</Link>
                </div>
            </div>
        </div>
    );
}
