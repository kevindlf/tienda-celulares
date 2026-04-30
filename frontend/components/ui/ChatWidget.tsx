"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { chatApi } from "@/lib/api";

type Mensaje = {
    role: "user" | "model";
    text: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [historial, setHistorial] = useState<Mensaje[]>([
        { role: "model", text: "¡Hola! Soy el asistente virtual de la tienda. ¿En qué te puedo ayudar hoy? 👋" }
    ]);
    const [cargando, setCargando] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [historial, isOpen]);

    const enviarMensaje = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mensaje.trim()) return;

        const nuevoMensaje: Mensaje = { role: "user", text: mensaje };
        const nuevoHistorial = [...historial, nuevoMensaje];
        setHistorial(nuevoHistorial);
        setMensaje("");
        setCargando(true);

        try {
            const historialAnterior = historial.filter((_, i) => i > 0);
            const res = await chatApi.enviarMensaje(nuevoMensaje.text, historialAnterior);
            if (res.data?.respuesta) {
                setHistorial([...nuevoHistorial, { role: "model", text: res.data.respuesta }]);
            }
        } catch {
            setHistorial([...nuevoHistorial, { role: "model", text: "Lo siento, tuve un problema al conectarme. Por favor, intenta de nuevo." }]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed bottom-[5.5rem] right-6 z-50 flex flex-col items-end">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="animate-chat-open w-80 sm:w-96 rounded-2xl shadow-2xl border border-card-border overflow-hidden mb-3 flex flex-col h-[500px] max-h-[78vh] bg-card-bg">

                    {/* Header */}
                    <div className="bg-primary p-4 flex items-center justify-between text-white flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/15 rounded-full flex items-center justify-center ring-2 ring-white/20">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-none">Asistente Virtual</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block animate-pulse" />
                                    <p className="text-white/80 text-xs">En línea ahora</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                            aria-label="Cerrar chat"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
                        {historial.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`flex gap-2 max-w-[82%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                        msg.role === "user"
                                            ? "bg-primary/15 text-primary"
                                            : "bg-accent text-primary"
                                    }`}>
                                        {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                                    </div>
                                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                                        msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-sm"
                                            : "bg-card-bg border border-card-border text-foreground rounded-tl-sm shadow-sm"
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {cargando && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 flex-row">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-accent text-primary">
                                        <Bot size={12} />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card-bg border border-card-border shadow-sm flex gap-1 items-center">
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-card-bg border-t border-card-border flex-shrink-0">
                        <form onSubmit={enviarMensaje} className="flex gap-2">
                            <input
                                type="text"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribí tu consulta..."
                                className="flex-1 bg-background border border-card-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-foreground placeholder:text-foreground/40"
                                disabled={cargando}
                            />
                            <button
                                type="submit"
                                disabled={!mensaje.trim() || cargando}
                                className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                                aria-label="Enviar mensaje"
                            >
                                {cargando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </form>
                        <p className="text-center text-foreground/30 text-[10px] mt-2">Respuestas generadas por IA · puede cometer errores</p>
                    </div>
                </div>
            )}

            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover hover:scale-105 transition-all duration-200 flex items-center justify-center group relative"
                aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente virtual"}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}

                {/* Tooltip */}
                {!isOpen && (
                    <span className="absolute right-full mr-3 bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                        Asistente IA
                    </span>
                )}

                {/* Punto de notificación (solo cuando cerrado) */}
                {!isOpen && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Sparkles size={6} className="text-white" />
                    </span>
                )}
            </button>

        </div>
    );
}
