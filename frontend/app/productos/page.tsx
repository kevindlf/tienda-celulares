"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productosApi, catalogoApi } from "@/lib/api";
import { Producto } from "@/types";
import { ShoppingCart, Search, Smartphone, Filter, SlidersHorizontal, ChevronDown, Headphones, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

function ProductosContent() {
    const searchParams = useSearchParams();
    const tipoInicial = searchParams.get("tipo") || "TODOS";
    const condicionInicial = searchParams.get("condicion") || "TODAS";

    const [productos, setProductos] = useState<Producto[]>([]);
    const [filtrados, setFiltrados] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);

    const [busqueda, setBusqueda] = useState("");
    const [filtroTipo, setFiltroTipo] = useState(tipoInicial);
    const [filtroMarca, setFiltroMarca] = useState("TODAS");
    const [filtroCondicion, setFiltroCondicion] = useState(condicionInicial);
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [orden, setOrden] = useState("recientes");
    const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);

    const { agregar } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        Promise.all([productosApi.getAll(), catalogoApi.marcas()])
            .then(([resProductos, resMarcas]) => {
                const activos = resProductos.data.filter((p: Producto) => p.activo);
                setProductos(activos);
                setFiltrados(activos);
                setMarcasDisponibles(resMarcas.data);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando productos", err);
                setCargando(false);
            });
    }, []);

    useEffect(() => {
        let resultado = [...productos];
        if (filtroTipo !== "TODOS") resultado = resultado.filter(p => p.tipoProducto === filtroTipo);
        if (busqueda) {
            const q = busqueda.toLowerCase();
            resultado = resultado.filter(p =>
                p.nombre.toLowerCase().includes(q) ||
                p.marca.toLowerCase().includes(q) ||
                (p.categoria && p.categoria.toLowerCase().includes(q))
            );
        }
        if (filtroMarca !== "TODAS") resultado = resultado.filter(p => p.marca === filtroMarca);
        if (filtroCondicion !== "TODAS") resultado = resultado.filter(p => p.condicion === filtroCondicion);
        const min = parseFloat(precioMin);
        const max = parseFloat(precioMax);
        if (!isNaN(min)) resultado = resultado.filter(p => p.precio >= min);
        if (!isNaN(max)) resultado = resultado.filter(p => p.precio <= max);
        resultado.sort((a, b) => {
            if (orden === "precio_asc") return a.precio - b.precio;
            if (orden === "precio_desc") return b.precio - a.precio;
            return b.id - a.id;
        });
        setFiltrados(resultado);
    }, [productos, busqueda, filtroTipo, filtroMarca, filtroCondicion, precioMin, precioMax, orden]);

    const limpiarFiltros = () => {
        setBusqueda("");
        setFiltroTipo("TODOS");
        setFiltroMarca("TODAS");
        setFiltroCondicion("TODAS");
        setPrecioMin("");
        setPrecioMax("");
        setOrden("recientes");
    };

    const agregarAlCarrito = (producto: Producto, e: React.MouseEvent) => {
        e.preventDefault();
        agregar(producto);
        showToast(`${producto.nombre} agregado al carrito`, "success");
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center animate-pulse">
                    <Smartphone className="mx-auto text-primary mb-4" size={48} />
                    <p className="text-foreground/50 font-medium">Cargando catálogo…</p>
                </div>
            </div>
        );
    }

    const FiltrosContent = () => (
        <>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className="font-display font-black text-foreground flex items-center gap-2 text-base">
                    <Filter size={16} /> Filtros
                </h2>
                <button onClick={limpiarFiltros} className="text-xs text-primary font-bold hover:underline min-h-[36px] px-2">
                    Limpiar
                </button>
            </div>

            <div className="mb-5 lg:hidden">
                <label className="block text-xs font-black text-foreground/50 uppercase tracking-wider mb-2">Ordenar por</label>
                <div className="relative">
                    <select
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                        className="w-full appearance-none bg-background border border-card-border px-4 py-3 pr-10 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:border-primary"
                    >
                        <option value="recientes">Más recientes</option>
                        <option value="precio_asc">Menor precio</option>
                        <option value="precio_desc">Mayor precio</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" size={16} />
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-black text-foreground/50 uppercase tracking-wider mb-3">Categoría</label>
                <div className="flex flex-col gap-1.5">
                    {["TODOS", "CELULAR", "ACCESORIO"].map(tipo => (
                        <label key={tipo} className="flex items-center gap-3 cursor-pointer group min-h-[36px]">
                            <input type="radio" className="hidden" name="filtroTipo" checked={filtroTipo === tipo} onChange={() => setFiltroTipo(tipo)} />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${filtroTipo === tipo ? "border-primary bg-primary" : "border-card-border group-hover:border-primary/50"}`}>
                                {filtroTipo === tipo && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <span className={`text-sm ${filtroTipo === tipo ? "text-foreground font-semibold" : "text-foreground/70"}`}>
                                {tipo === "TODOS" ? "Todos" : tipo === "CELULAR" ? "Celulares" : "Accesorios"}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-black text-foreground/50 uppercase tracking-wider mb-3">Marca</label>
                <div className="relative">
                    <select
                        value={filtroMarca}
                        onChange={(e) => setFiltroMarca(e.target.value)}
                        className="w-full appearance-none bg-background border border-card-border px-4 py-2.5 pr-10 rounded-xl text-sm font-medium text-foreground focus:outline-none focus:border-primary"
                    >
                        <option value="TODAS">Todas las marcas</option>
                        {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
                        <option value="Genérico">Genérico</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" size={16} />
                </div>
            </div>

            <div className="mb-5">
                <label className="block text-xs font-black text-foreground/50 uppercase tracking-wider mb-3">Condición</label>
                <div className="grid grid-cols-3 gap-1.5">
                    {["TODAS", "NUEVO", "USADO"].map(cond => (
                        <button
                            key={cond}
                            onClick={() => setFiltroCondicion(cond)}
                            className={`py-2 px-1 text-xs font-bold rounded-lg border transition-colors min-h-[40px] ${filtroCondicion === cond ? "bg-foreground border-foreground text-background" : "bg-background border-card-border text-foreground/60 hover:border-foreground/40"}`}
                        >
                            {cond === "TODAS" ? "Todas" : cond === "NUEVO" ? "Nuevos" : "Usados"}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-black text-foreground/50 uppercase tracking-wider mb-3">Precio (ARS)</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Mín"
                        value={precioMin}
                        onChange={(e) => setPrecioMin(e.target.value)}
                        className="w-full bg-background border border-card-border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                    <span className="text-foreground/30">–</span>
                    <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Máx"
                        value={precioMax}
                        onChange={(e) => setPrecioMax(e.target.value)}
                        className="w-full bg-background border border-card-border px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
            {/* Header sticky con búsqueda */}
            <div className="bg-card-bg border-b border-card-border sticky top-16 z-30 backdrop-blur-md bg-card-bg/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3 sm:mb-4">
                        <div>
                            <p className="text-[10px] sm:text-xs font-black text-primary/60 uppercase tracking-[0.25em] mb-1.5">Catálogo</p>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-foreground leading-tight">
                                Encontrá tu <span className="text-primary">próximo</span> equipo
                            </h1>
                        </div>
                        <p className="text-sm text-foreground/50 font-medium">
                            <span className="font-bold text-foreground">{filtrados.length}</span> {filtrados.length === 1 ? "producto" : "productos"}
                        </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                            <input
                                type="search"
                                placeholder="Buscar marca, modelo…"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-card-border rounded-full text-sm sm:text-base text-foreground bg-background focus:outline-none focus:border-primary transition-all min-h-[48px]"
                            />
                        </div>
                        <button
                            onClick={() => setMostrarFiltrosMobile(true)}
                            className="lg:hidden flex items-center justify-center gap-2 bg-foreground text-background px-4 sm:px-5 py-3 rounded-full font-semibold text-sm min-h-[48px] min-w-[48px] active:scale-95 transition-transform"
                            aria-label="Abrir filtros"
                        >
                            <SlidersHorizontal size={18} />
                            <span className="hidden sm:inline">Filtros</span>
                        </button>
                        <div className="relative hidden lg:block">
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="appearance-none bg-background border border-card-border px-5 py-3 pr-10 rounded-full text-sm font-semibold text-foreground focus:outline-none focus:border-primary cursor-pointer min-h-[48px]"
                            >
                                <option value="recientes">Más recientes</option>
                                <option value="precio_asc">Menor precio</option>
                                <option value="precio_desc">Mayor precio</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">

                {/* Sidebar Filtros — Desktop */}
                <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                    <div className="bg-card-bg rounded-2xl border border-card-border p-6 sticky top-40">
                        <FiltrosContent />
                    </div>
                </aside>

                {/* Drawer Filtros — Mobile */}
                {mostrarFiltrosMobile && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMostrarFiltrosMobile(false)}></div>
                        <div className="absolute inset-x-0 bottom-0 bg-card-bg rounded-t-3xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-display font-black text-xl text-foreground">Filtrar productos</h2>
                                <button
                                    onClick={() => setMostrarFiltrosMobile(false)}
                                    className="w-10 h-10 rounded-full bg-background border border-card-border flex items-center justify-center"
                                    aria-label="Cerrar"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <FiltrosContent />
                            <button
                                onClick={() => setMostrarFiltrosMobile(false)}
                                className="w-full bg-primary text-white font-bold py-4 rounded-full mt-6 hover:bg-primary-hover transition-colors min-h-[52px]"
                            >
                                Ver {filtrados.length} {filtrados.length === 1 ? "producto" : "productos"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Grid de productos */}
                <div className="flex-1">
                    {filtrados.length === 0 ? (
                        <div className="bg-card-bg rounded-2xl border border-card-border p-8 sm:p-12 text-center flex flex-col items-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-card-border">
                                <Search className="text-foreground/40" size={22} />
                            </div>
                            <h3 className="text-lg sm:text-xl font-display font-black text-foreground mb-2">No encontramos nada</h3>
                            <p className="text-foreground/60 text-sm max-w-sm mx-auto mb-6">No hay productos que coincidan con tus filtros. Probá con otras opciones.</p>
                            <button onClick={limpiarFiltros} className="bg-foreground text-background px-6 py-3 rounded-full font-bold text-sm hover:bg-foreground/90 transition-colors min-h-[44px]">
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                            {filtrados.map(producto => (
                                <Link
                                    href={`/productos/${producto.id}`}
                                    key={producto.id}
                                    className="group flex flex-col bg-card-bg border border-card-border rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="relative aspect-square bg-background flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 z-10">
                                            {producto.condicion === "USADO" && (
                                                <span className="bg-foreground text-background text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                                                    Reacond.
                                                </span>
                                            )}
                                            {producto.tipoProducto === "ACCESORIO" && (
                                                <span className="bg-primary text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                                                    Accesorio
                                                </span>
                                            )}
                                        </div>
                                        {producto.imagenes && producto.imagenes.length > 0 ? (
                                            <img
                                                src={producto.imagenes[0]}
                                                alt={producto.nombre}
                                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : producto.tipoProducto === "CELULAR" ? (
                                            <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 text-card-border" />
                                        ) : (
                                            <Headphones className="w-12 h-12 sm:w-16 sm:h-16 text-card-border" />
                                        )}
                                    </div>

                                    <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1">
                                        <p className="text-[9px] sm:text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-1">{producto.marca}</p>
                                        <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">{producto.nombre}</h3>

                                        <p className="text-xs text-foreground/50 mb-3 line-clamp-1 hidden sm:block">
                                            {producto.tipoProducto === "CELULAR" ? (
                                                <>
                                                    {producto.ram && `${producto.ram}GB RAM`}
                                                    {producto.almacenamiento && ` · ${producto.almacenamiento}GB`}
                                                </>
                                            ) : (
                                                <>{producto.categoria || "Accesorio"}</>
                                            )}
                                        </p>

                                        <div className="mt-auto flex items-end justify-between gap-2 pt-2 sm:pt-3 border-t border-card-border">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm sm:text-base lg:text-lg font-black text-foreground tracking-tight tabular-nums leading-tight">
                                                    ${producto.precio.toLocaleString("es-AR")}
                                                </p>
                                                <p className={`text-[10px] sm:text-[11px] font-semibold mt-0.5 ${producto.stock === 0 ? "text-red-500" : producto.stock < 5 ? "text-orange-500" : "text-primary"}`}>
                                                    {producto.stock === 0 ? "Agotado" : producto.stock < 5 ? `¡Últimas ${producto.stock}!` : "En stock"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => agregarAlCarrito(producto, e)}
                                                disabled={producto.stock === 0}
                                                aria-label={`Agregar ${producto.nombre} al carrito`}
                                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white active:scale-90 transition-all disabled:opacity-40 disabled:hover:bg-primary/10 disabled:hover:text-primary disabled:cursor-not-allowed flex-shrink-0"
                                            >
                                                <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProductosPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center animate-pulse">
                    <Smartphone className="mx-auto text-primary mb-4" size={48} />
                    <p className="text-foreground/50 font-medium">Cargando catálogo…</p>
                </div>
            </div>
        }>
            <ProductosContent />
        </Suspense>
    );
}
