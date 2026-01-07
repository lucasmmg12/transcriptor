'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { jsPDF } from 'jspdf'

export default function ImageToPdfTool() {
    const [images, setImages] = useState<{ file: File; preview: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files))
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files))
        }
    }

    const handleFiles = (files: File[]) => {
        const validImages = files.filter(file => file.type.startsWith('image/'))

        if (validImages.length === 0) {
            setError('Por favor sube solo archivos de imagen (JPG, PNG, WEBP).')
            return
        }

        const newImages = validImages.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))

        setImages(prev => [...prev, ...newImages])
        setError(null)
    }

    const removeImage = (index: number) => {
        setImages(prev => {
            const newImages = [...prev]
            URL.revokeObjectURL(newImages[index].preview) // Clean up memory
            newImages.splice(index, 1)
            return newImages
        })
    }

    const generatePDF = async () => {
        if (images.length === 0) {
            setError('No hay imágenes para convertir.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const doc = new jsPDF()

            for (let i = 0; i < images.length; i++) {
                if (i > 0) doc.addPage()

                const image = images[i]

                // Load image to get dimensions
                const img = new window.Image()
                img.src = image.preview
                await new Promise((resolve) => {
                    img.onload = resolve
                })

                const pageWidth = doc.internal.pageSize.getWidth()
                const pageHeight = doc.internal.pageSize.getHeight()

                // Calculate dimensions to fit page maintaining aspect ratio
                // with some margin (e.g. 10mm)
                const margin = 10
                const maxWidth = pageWidth - (margin * 2)
                const maxHeight = pageHeight - (margin * 2)

                let imgWidth = img.width
                let imgHeight = img.height

                // Scale down if needed
                const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)

                const finalWidth = imgWidth * ratio;
                const finalHeight = imgHeight * ratio;

                // Center image
                const x = (pageWidth - finalWidth) / 2
                const y = (pageHeight - finalHeight) / 2

                doc.addImage(img, 'JPEG', x, y, finalWidth, finalHeight)
            }

            doc.save('documento.pdf')

        } catch (err: any) {
            console.error(err)
            setError('Error al generar el PDF: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === images.length - 1) return

        setImages(prev => {
            const newImages = [...prev]
            const temp = newImages[index]
            const targetIndex = direction === 'up' ? index - 1 : index + 1
            newImages[index] = newImages[targetIndex]
            newImages[targetIndex] = temp
            return newImages
        })
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-black">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-white/10">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <span className="font-bold text-xl tracking-tight hidden md:inline">GROW LABS</span>
                            </Link>
                            <span className="hidden md:inline text-gray-700">|</span>
                            <span className="text-sm font-medium text-gray-400">Image to PDF</span>
                        </div>
                        <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                            Volver al Inicio
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto animate-fade-in">

                    <div className="text-center mb-12">
                        <div className="inline-block p-4 rounded-full bg-orange-500/10 text-orange-400 mb-6">
                            <i className="fas fa-file-pdf text-3xl"></i>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6">
                            Convertidor <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Imagen a PDF</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Convierte tus fotos del DNI, documentos o imágenes en un único archivo PDF profesional en segundos. Sin subir datos a ningún servidor.
                        </p>
                    </div>

                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">

                        {/* Drag & Drop Zone */}
                        <div
                            className={`mb-8 relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                                    ? 'border-orange-400 bg-orange-400/10 scale-[1.02]'
                                    : 'border-gray-700 hover:border-orange-400/50 hover:bg-white/5'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                id="image-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={loading}
                            />

                            <div className="space-y-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                                    <i className="fas fa-images text-3xl"></i>
                                </div>
                                <div>
                                    <label htmlFor="image-input" className="cursor-pointer">
                                        <span className="text-orange-400 hover:text-orange-300 font-bold text-lg transition-colors underline decoration-2 underline-offset-4">
                                            Selecciona tus imágenes
                                        </span>
                                        <span className="text-gray-300"> o arrástralas aquí</span>
                                    </label>
                                    <p className="text-sm text-gray-500 mt-2 font-mono">
                                        JPG, PNG, WEBP
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image List */}
                        {images.length > 0 && (
                            <div className="space-y-4 mb-8">
                                <h3 className="text-lg font-bold text-white mb-4">Imágenes Seleccionadas ({images.length})</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-xl border border-white/5 group">
                                            <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                                <Image
                                                    src={img.preview}
                                                    alt={`Preview ${index}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm truncate font-medium">{img.file.name}</p>
                                                <p className="text-gray-500 text-xs">{(img.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => moveImage(index, 'up')}
                                                    disabled={index === 0}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-400 flex items-center justify-center transition-colors"
                                                    title="Mover arriba"
                                                >
                                                    <i className="fas fa-arrow-up text-xs"></i>
                                                </button>
                                                <button
                                                    onClick={() => moveImage(index, 'down')}
                                                    disabled={index === images.length - 1}
                                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-gray-400 flex items-center justify-center transition-colors"
                                                    title="Mover abajo"
                                                >
                                                    <i className="fas fa-arrow-down text-xs"></i>
                                                </button>
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <i className="fas fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 animate-head-shake">
                                <i className="fas fa-exclamation-circle text-xl"></i>
                                {error}
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={generatePDF}
                            disabled={loading || images.length === 0}
                            className="w-full py-5 px-8 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white text-xl font-bold rounded-xl shadow-[0_0_20px_rgba(255,100,0,0.3)] transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Generando PDF...</span>
                                </>
                            ) : (
                                <>
                                    <span>Descargar PDF</span>
                                    <i className="fas fa-download"></i>
                                </>
                            )}
                        </button>

                    </div>
                </div>
            </main>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    )
}
