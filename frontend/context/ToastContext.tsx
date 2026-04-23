"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const icons = {
        success: <CheckCircle size={18} />,
        error: <AlertCircle size={18} />,
        warning: <AlertTriangle size={18} />,
        info: <Info size={18} />,
    };

    const colors = {
        success: "bg-green-50 border-green-200 text-green-700",
        error: "bg-red-50 border-red-200 text-red-700",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
        info: "bg-blue-50 border-blue-200 text-blue-700",
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-[slideIn_0.3s_ease-out] ${colors[toast.type]}`}
                        style={{
                            animation: "slideIn 0.3s ease-out",
                        }}
                    >
                        {icons[toast.type]}
                        <p className="text-sm font-medium flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast debe usarse dentro de un ToastProvider");
    }
    return context;
}
