"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UsuarioInfo {
    nombre: string;
    rol: string;
}

interface AuthContextType {
    usuario: UsuarioInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (token: string, usuario: UsuarioInfo) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUsuario = localStorage.getItem("usuario");
        if (storedToken && storedUsuario) {
            setToken(storedToken);
            try {
                setUsuario(JSON.parse(storedUsuario));
            } catch {
                localStorage.removeItem("usuario");
            }
        }
    }, []);

    const login = (newToken: string, newUsuario: UsuarioInfo) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("usuario", JSON.stringify(newUsuario));
        document.cookie = `token=${newToken}; path=/; SameSite=Lax; max-age=86400`;
        setToken(newToken);
        setUsuario(newUsuario);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("carrito");
        document.cookie = "token=; path=/; max-age=0";
        setToken(null);
        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                token,
                isAuthenticated: !!token,
                isAdmin: usuario?.rol === "ADMIN",
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
}
