"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
    imagenes: string[];
    onChange: (imagenes: string[]) => void;
    maxImages?: number;
}

export default function ImageUploader({ imagenes, onChange, maxImages = 5 }: ImageUploaderProps) {
    const [subiendo, setSubiendo] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const subirImagen = async (file: File) => {
        if (!cloudName || !uploadPreset) {
            console.error("Cloudinary no configurado");
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            return data.secure_url as string;
        } catch (err) {
            console.error("Error subiendo imagen:", err);
            return null;
        }
    };

    const handleFiles = async (files: FileList | null) => {
        if (!files) return;
        if (imagenes.length + files.length > maxImages) {
            return;
        }

        setSubiendo(true);
        const nuevasUrls: string[] = [];

        for (const file of Array.from(files)) {
            const url = await subirImagen(file);
            if (url) nuevasUrls.push(url);
        }

        onChange([...imagenes, ...nuevasUrls]);
        setSubiendo(false);
    };

    const eliminarImagen = (index: number) => {
        onChange(imagenes.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">
                Imágenes <span className="text-gray-400">({imagenes.length}/{maxImages})</span>
            </label>

            {/* Preview de imágenes existentes */}
            {imagenes.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                    {imagenes.map((url, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                            <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => eliminarImagen(i)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Zona de upload */}
            {imagenes.length < maxImages && (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                >
                    {subiendo ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Subiendo...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Upload className="text-blue-600" size={20} />
                            </div>
                            <p className="text-sm text-gray-600">
                                Arrastrá o hacé click para subir
                            </p>
                            <p className="text-xs text-gray-400">
                                JPG, PNG, WebP. Máximo {maxImages} imágenes.
                            </p>
                        </div>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />
                </div>
            )}

            {/* Si Cloudinary no está configurado */}
            {(!cloudName || !uploadPreset) && (
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <ImageIcon size={16} className="text-yellow-600" />
                    <p className="text-xs text-yellow-700">
                        Cloudinary no configurado. Agregá NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local
                    </p>
                </div>
            )}
        </div>
    );
}
