"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { chatApi } from "@/lib/api";

type Mensaje = {
    role: "user" | "model";
    text: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [historial, setHistorial] = useState<Mensaje[]>([
        { role: "model", text: "¡Hola! Soy el asistente virtual de la tienda. ¿En qué te puedo ayudar hoy?" }
    ]);
    const [cargando, setCargando] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
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
            // Mandamos todo el historial menos el mensaje actual que acabamos de agregar para que lo lea como el actual
            // El backend lo concatena. Pero en realidad, le podemos mandar el historial entero y que el backend tome el último como mensaje actual.
            // Para ser exactos con el backend que armamos, mandamos el mensaje y el historial *anterior*.
            const historialAnterior = historial.filter((_, i) => i > 0); // Omitimos el primer mensaje de bienvenida para ahorrar tokens, o lo mandamos
            
            const res = await chatApi.enviarMensaje(nuevoMensaje.text, historialAnterior);
            
            if (res.data && res.data.respuesta) {
                setHistorial([...nuevoHistorial, { role: "model", text: res.data.respuesta }]);
            }
        } catch (error) {
            setHistorial([...nuevoHistorial, { role: "model", text: "Lo siento, tuve un problema al conectarme. Por favor, intenta de nuevo." }]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
            {/* Ventana de Chat */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-4 flex flex-col h-[500px] max-h-[80vh] transition-all animate-fade-in origin-bottom-right">
                    
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asistente Virtual</h3>
                                <p className="text-blue-100 text-xs">Respuestas instantáneas</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {historial.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                        {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {cargando && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[80%] flex-row">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-gray-200 text-gray-600">
                                        <Bot size={12} />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white border border-gray-100 rounded-tl-none shadow-sm flex gap-1">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={enviarMensaje} className="flex gap-2">
                            <input
                                type="text"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribe tu consulta..."
                                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-2 text-sm outline-none transition-all"
                                disabled={cargando}
                            />
                            <button
                                type="submit"
                                disabled={!mensaje.trim() || cargando}
                                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
                            >
                                {cargando ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Botón flotante para abrir chat */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
                    aria-label="Abrir asistente virtual"
                >
                    <MessageSquare size={28} />
                    
                    {/* Tooltip */}
                    <span className="absolute right-full mr-4 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Asistente IA
                    </span>
                    
                    {/* Notification dot */}
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            )}
        </div>
    );
}
