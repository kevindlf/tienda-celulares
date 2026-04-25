"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productosApi, catalogoApi } from "@/lib/api";
import { Producto } from "@/types";
import { ShoppingCart, Search, Smartphone, Filter, X, SlidersHorizontal, ChevronDown, Headphones } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

// Componente interno que usa useSearchParams
function ProductosContent() {
    const searchParams = useSearchParams();
    const tipoInicial = searchParams.get("tipo") || "TODOS";

    const [productos, setProductos] = useState<Producto[]>([]);
    const [filtrados, setFiltrados] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [marcasDisponibles, setMarcasDisponibles] = useState<string[]>([]);

    // Estados de filtros
    const [busqueda, setBusqueda] = useState("");
    const [filtroTipo, setFiltroTipo] = useState(tipoInicial); // "TODOS", "CELULAR", "ACCESORIO"
    const [filtroMarca, setFiltroMarca] = useState("TODAS");
    const [filtroCondicion, setFiltroCondicion] = useState("TODAS"); // "TODAS", "NUEVO", "USADO"
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [orden, setOrden] = useState("recientes"); // "recientes", "precio_asc", "precio_desc"
    const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);

    const { agregar } = useCart();
    const { showToast } = useToast();

    // Cargar datos
    useEffect(() => {
        Promise.all([
            productosApi.getAll(),
            catalogoApi.marcas()
        ]).then(([resProductos, resMarcas]) => {
            const activos = resProductos.data.filter((p: Producto) => p.activo);
            setProductos(activos);
            setFiltrados(activos);
            setMarcasDisponibles(resMarcas.data);
            setCargando(false);
        }).catch(err => {
            console.error("Error cargando productos", err);
            setCargando(false);
        });
    }, []);

    // Aplicar filtros
    useEffect(() => {
        let resultado = [...productos];

        // 1. Tipo
        if (filtroTipo !== "TODOS") {
            resultado = resultado.filter(p => p.tipoProducto === filtroTipo);
        }

        // 2. Búsqueda
        if (busqueda) {
            const query = busqueda.toLowerCase();
            resultado = resultado.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                p.marca.toLowerCase().includes(query) ||
                (p.categoria && p.categoria.toLowerCase().includes(query))
            );
        }

        // 3. Marca
        if (filtroMarca !== "TODAS") {
            resultado = resultado.filter(p => p.marca === filtroMarca);
        }

        // 4. Condición
        if (filtroCondicion !== "TODAS") {
            resultado = resultado.filter(p => p.condicion === filtroCondicion);
        }

        // 5. Precio
        const min = parseFloat(precioMin);
        const max = parseFloat(precioMax);
        if (!isNaN(min)) resultado = resultado.filter(p => p.precio >= min);
        if (!isNaN(max)) resultado = resultado.filter(p => p.precio <= max);

        // 6. Ordenamiento
        resultado.sort((a, b) => {
            if (orden === "precio_asc") return a.precio - b.precio;
            if (orden === "precio_desc") return b.precio - a.precio;
            // "recientes" (por ID descendente)
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
        e.preventDefault(); // Para no navegar al link del producto
        agregar(producto);
        showToast(`${producto.nombre} agregado al carrito`, "success");
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center animate-pulse">
                    <Smartphone className="mx-auto text-blue-600 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Cargando catálogo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header de la tienda */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Catálogo de Productos</h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar celulares, fundas, marcas..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => setMostrarFiltrosMobile(!mostrarFiltrosMobile)}
                                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-gray-100 px-4 py-3 rounded-xl font-medium text-gray-700"
                            >
                                <SlidersHorizontal size={18} /> Filtros
                            </button>
                            <div className="relative hidden lg:block">
                                <select 
                                    value={orden} 
                                    onChange={(e) => setOrden(e.target.value)}
                                    className="appearance-none bg-gray-100 border-none px-6 py-3 pr-10 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="recientes">Más recientes</option>
                                    <option value="precio_asc">Menor precio</option>
                                    <option value="precio_desc">Mayor precio</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Sidebar Filtros */}
                <aside className={`lg:w-64 flex-shrink-0 ${mostrarFiltrosMobile ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Filter size={18} /> Filtros
                            </h2>
                            <button onClick={limpiarFiltros} className="text-xs text-blue-600 font-medium hover:underline">
                                Limpiar
                            </button>
                        </div>

                        {/* Ordenar en Mobile */}
                        <div className="mb-6 lg:hidden">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Ordenar por</label>
                            <select 
                                value={orden} 
                                onChange={(e) => setOrden(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="recientes">Más recientes</option>
                                <option value="precio_asc">Menor precio</option>
                                <option value="precio_desc">Mayor precio</option>
                            </select>
                        </div>

                        {/* Categoría */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Categoría</label>
                            <div className="flex flex-col gap-2">
                                {["TODOS", "CELULAR", "ACCESORIO"].map(tipo => (
                                    <label key={tipo} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            className="hidden" 
                                            name="filtroTipo" 
                                            checked={filtroTipo === tipo} 
                                            onChange={() => setFiltroTipo(tipo)} 
                                        />
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filtroTipo === tipo ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                            {filtroTipo === tipo && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                        </div>
                                        <span className={`text-sm ${filtroTipo === tipo ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            {tipo === "TODOS" ? "Todos los productos" : tipo === "CELULAR" ? "Celulares" : "Accesorios"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Marca */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Marca</label>
                            <select 
                                value={filtroMarca} 
                                onChange={(e) => setFiltroMarca(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TODAS">Todas las marcas</option>
                                {marcasDisponibles.map(m => <option key={m} value={m}>{m}</option>)}
                                <option value="Genérico">Genérico (Accesorios)</option>
                            </select>
                        </div>

                        {/* Condición */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Condición</label>
                            <div className="flex gap-2">
                                {["TODAS", "NUEVO", "USADO"].map(cond => (
                                    <button
                                        key={cond}
                                        onClick={() => setFiltroCondicion(cond)}
                                        className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${filtroCondicion === cond ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        {cond === "TODAS" ? "Cualquiera" : cond === "NUEVO" ? "Nuevos" : "Usados"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Precio</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={precioMin}
                                    onChange={(e) => setPrecioMin(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={precioMax}
                                    onChange={(e) => setPrecioMax(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Grid de Productos */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
                        <p>Mostrando <span className="font-semibold text-gray-900">{filtrados.length}</span> productos</p>
                    </div>

                    {filtrados.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No encontramos nada</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">No hay productos que coincidan con los filtros seleccionados. Probá cambiando las opciones o buscando con otras palabras.</p>
                            <button onClick={limpiarFiltros} className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtrados.map(producto => (
                                <Link href={`/productos/${producto.id}`} key={producto.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-blue-100 transition-all">
                                    <div className="relative aspect-square w-full rounded-xl bg-gray-50 mb-5 overflow-hidden flex items-center justify-center p-6">
                                        {/* Etiquetas */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            {producto.condicion === 'USADO' && (
                                                <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                                                    USADO
                                                </span>
                                            )}
                                            {producto.tipoProducto === 'ACCESORIO' && (
                                                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                                                    ACCESORIO
                                                </span>
                                            )}
                                        </div>
                                        
                                        {producto.imagenes && producto.imagenes.length > 0 ? (
                                            <img
                                                src={producto.imagenes[0]}
                                                alt={producto.nombre}
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : producto.tipoProducto === 'CELULAR' ? (
                                            <Smartphone className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <Headphones className="w-16 h-16 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{producto.marca}</p>
                                        <h3 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{producto.nombre}</h3>
                                        
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                                            {producto.tipoProducto === 'CELULAR' ? (
                                                <>
                                                    {producto.ram && `${producto.ram}GB RAM`}
                                                    {producto.almacenamiento && ` · ${producto.almacenamiento}GB`}
                                                    {producto.color && ` · ${producto.color}`}
                                                </>
                                            ) : (
                                                <>{producto.categoria || 'Accesorio'}</>
                                            )}
                                        </p>

                                        <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                                            <div>
                                                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                                    ${producto.precio.toLocaleString("es-AR")}
                                                </p>
                                                <p className={`text-[11px] font-medium mt-1 ${producto.stock < 5 ? (producto.stock === 0 ? "text-red-500" : "text-orange-500") : "text-green-600"}`}>
                                                    {producto.stock === 0 ? "Agotado" : producto.stock < 5 ? `¡Últimas ${producto.stock} unidades!` : "Stock disponible"}
                                                </p>
                                            </div>
                                            
                                            <button
                                                onClick={(e) => agregarAlCarrito(producto, e)}
                                                disabled={producto.stock === 0}
                                                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-blue-50 disabled:hover:text-blue-600 disabled:cursor-not-allowed group/btn"
                                            >
                                                <ShoppingCart size={18} className="group-active/btn:scale-75 transition-transform" />
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

// Wrapper con Suspense para que Next.js no tire error en el build por usar useSearchParams
export default function ProductosPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center animate-pulse">
                    <Smartphone className="mx-auto text-blue-600 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Cargando catálogo...</p>
                </div>
            </div>
        }>
            <ProductosContent />
        </Suspense>
    );
}