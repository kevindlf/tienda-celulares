import Link from "next/link";

const TIENDA = process.env.NEXT_PUBLIC_STORE_NAME || "la tienda";

export const metadata = {
    title: `Política de Privacidad | ${TIENDA}`,
    description: "Cómo recopilamos, usamos y protegemos tus datos personales.",
};

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-[var(--foreground)]/50 mb-8">
                    <Link href="/" className="hover:text-[var(--primary)] transition-colors">Inicio</Link>
                    <span>/</span>
                    <span>Políticas</span>
                    <span>/</span>
                    <span className="text-[var(--foreground)]">Privacidad</span>
                </nav>

                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 md:p-12">
                    <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Política de Privacidad</h1>
                    <p className="text-[var(--foreground)]/50 text-sm mb-10">Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}</p>

                    <div className="space-y-8 text-[var(--foreground)]/80 leading-relaxed">

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">1. Qué datos recopilamos</h2>
                            <p className="mb-3">Al registrarte o realizar una compra en {TIENDA}, recopilamos:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Datos de cuenta:</strong> nombre completo, dirección de email, contraseña (almacenada con cifrado BCrypt).</li>
                                <li><strong>Datos de envío:</strong> dirección, ciudad, provincia y teléfono de contacto.</li>
                                <li><strong>Historial de compras:</strong> órdenes, productos adquiridos, montos y estados de entrega.</li>
                            </ul>
                            <p className="mt-3">No recopilamos datos de tarjetas de crédito ni débito. Los pagos son procesados directamente por Mercado Pago.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">2. Cómo usamos tus datos</h2>
                            <p className="mb-3">Usamos tu información exclusivamente para:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Procesar y gestionar tus pedidos.</li>
                                <li>Enviarte confirmaciones y actualizaciones del estado de tu envío por email.</li>
                                <li>Brindar soporte postventa y gestionar garantías o devoluciones.</li>
                                <li>Mejorar nuestros productos y servicios de forma agregada y anónima.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">3. Con quién compartimos tus datos</h2>
                            <p className="mb-3">No vendemos ni compartimos tus datos personales con terceros, excepto en los siguientes casos necesarios para operar:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Mercado Pago:</strong> para procesar el pago de tu pedido. Mercado Pago tiene su propia política de privacidad.</li>
                                <li><strong>Empresa de correo/logística:</strong> nombre y dirección de envío para la entrega del paquete.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">4. Cómo protegemos tus datos</h2>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Toda la comunicación entre tu navegador y nuestros servidores usa HTTPS (cifrado TLS).</li>
                                <li>Las contraseñas se almacenan con hash BCrypt, nunca en texto plano.</li>
                                <li>La base de datos está alojada en Supabase (infraestructura AWS) con acceso restringido.</li>
                                <li>El acceso al panel de administración requiere autenticación con JWT y verificación de rol.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">5. Cookies y almacenamiento local</h2>
                            <p>Utilizamos cookies de sesión y almacenamiento local del navegador para mantener tu sesión iniciada y recordar el contenido de tu carrito. No utilizamos cookies de terceros ni sistemas de seguimiento publicitario.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">6. Tus derechos</h2>
                            <p className="mb-3">Según la Ley 25.326 de Protección de Datos Personales de Argentina, tenés derecho a:</p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong>Acceso:</strong> conocer qué datos tuyos tenemos almacenados.</li>
                                <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
                                <li><strong>Supresión:</strong> solicitar la eliminación de tu cuenta y datos asociados.</li>
                            </ul>
                            <p className="mt-3">Para ejercer estos derechos, contactanos por WhatsApp o al email de la tienda indicando "Solicitud de datos personales" en el asunto.</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">7. Retención de datos</h2>
                            <p>Conservamos tus datos mientras tu cuenta esté activa. Al solicitar la eliminación de tu cuenta, borraremos tus datos personales en un plazo de 30 días, excepto aquellos que debamos conservar por obligaciones legales (como registros de transacciones).</p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-[var(--foreground)] mb-3">8. Cambios en esta política</h2>
                            <p>Podemos actualizar esta política ocasionalmente. Te notificaremos por email ante cambios significativos. La fecha de última actualización siempre se indica al inicio del documento.</p>
                        </section>
                    </div>
                </div>

                <div className="mt-6 flex gap-4 text-sm">
                    <Link href="/politicas/terminos" className="text-[var(--primary)] hover:underline font-medium">Términos y Condiciones</Link>
                    <span className="text-[var(--foreground)]/30">|</span>
                    <Link href="/politicas/devoluciones" className="text-[var(--primary)] hover:underline font-medium">Política de Devoluciones</Link>
                </div>
            </div>
        </div>
    );
}
