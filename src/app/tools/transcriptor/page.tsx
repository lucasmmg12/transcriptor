'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type TipoAnalisis = 'entrevista-trabajo' | 'reunion-cliente' | 'resumen-general'

export default function TranscriptorTool() {
    const [audioFile, setAudioFile] = useState<File | null>(null)
    const [tipoAnalisis, setTipoAnalisis] = useState<TipoAnalisis>('resumen-general')
    const [loading, setLoading] = useState(false)
    const [resultado, setResultado] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)

    // Estado para "Audios Largos" (Pegar texto)
    const [showLongAudioInput, setShowLongAudioInput] = useState(false)
    const [textoManual, setTextoManual] = useState('')

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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (validarArchivo(file)) {
                setAudioFile(file)
                setError(null)
            }
        }
    }

    const validarArchivo = (file: File): boolean => {
        const formatosPermitidos = [
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave',
            'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/webm',
            'audio/ogg', 'audio/opus', 'audio/flac', 'audio/x-flac',
            'video/mp4', 'video/mpeg', 'video/webm',
        ]

        const extensionesPermitidas = [
            '.mp3', '.wav', '.m4a', '.mp4',
            '.mpeg', '.mpga', '.webm', '.ogg',
            '.opus', '.flac'
        ]

        const extension = '.' + file.name.split('.').pop()?.toLowerCase()
        const esFormatoValido = formatosPermitidos.includes(file.type) || extensionesPermitidas.includes(extension)

        if (!esFormatoValido) {
            setError('Formato de archivo no válido. Formatos aceptados: MP3, WAV, M4A, OPUS, OGG, FLAC, WebM, MP4.')
            return false
        }

        // Límite de 25MB para Whisper
        const MAX_SIZE_MB = 25
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
        const fileSizeMB = file.size / (1024 * 1024)

        if (file.size > MAX_SIZE_BYTES) {
            setError(`El archivo es demasiado grande (${fileSizeMB.toFixed(2)}MB). El límite máximo es ${MAX_SIZE_MB}MB. Por favor, comprime el audio.`)
            return false
        }

        return true
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && validarArchivo(file)) {
            setAudioFile(file)
            setError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!audioFile) {
            setError('Por favor selecciona un archivo de audio')
            return
        }

        setLoading(true)
        setError(null)
        setResultado(null)

        try {
            const formData = new FormData()
            formData.append('audio', audioFile)
            formData.append('tipo_analisis', tipoAnalisis)

            const response = await fetch('/api/procesar-audio', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar el audio')
            }

            setResultado(data.data)

            // Limpiar input
            setAudioFile(null)
            const fileInput = document.getElementById('audio-input') as HTMLInputElement
            if (fileInput) fileInput.value = ''

        } catch (err: any) {
            setError(err.message || 'Error al procesar el audio')
        } finally {
            setLoading(false)
        }
    }

    const handleTextFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('El archivo de texto es demasiado grande (Máx 10MB)')
                return
            }
            try {
                const text = await file.text()
                setTextoManual(text)
                setError(null)
            } catch (err) {
                console.error(err)
                setError('Error al leer el archivo de texto')
            }
        }
    }

    const handleTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!textoManual.trim()) {
            setError('Por favor ingresa o sube el texto de la transcripción')
            return
        }

        setLoading(true)
        setError(null)
        setResultado(null)

        try {
            const response = await fetch('/api/analizar-texto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texto: textoManual,
                    tipo_analisis: tipoAnalisis,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar el texto')
            }

            setResultado(data.data)

        } catch (err: any) {
            setError(err.message || 'Error al procesar el texto')
        } finally {
            setLoading(false)
        }
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-white/10">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <Image
                                    src="/logogrow.png"
                                    alt="Grow Labs Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-lg"
                                />
                                <span className="font-bold text-xl tracking-tight hidden md:inline">GROW LABS</span>
                            </Link>
                            <span className="hidden md:inline text-gray-700">|</span>
                            <span className="text-sm font-medium text-gray-400">Transcriptor IA</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-12">
                {!resultado ? (
                    <div className="max-w-4xl mx-auto animate-fade-in">

                        <div className="text-center mb-12">
                            <div className="inline-block p-4 rounded-full bg-green-500/10 text-green-400 mb-6">
                                <i className="fas fa-microphone-lines text-3xl"></i>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6">
                                Transcripción y <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Análisis Inteligente</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                Sube tu audio, entrevista o reunión y obtén una transcripción perfecta junto con un análisis ejecutivo generado por GPT-4.
                            </p>
                        </div>

                        {/* Toggle Mode Button */}
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={() => { setShowLongAudioInput(!showLongAudioInput); setError(null); }}
                                className="text-sm text-gray-400 hover:text-white underline decoration-dotted underline-offset-4 transition-colors"
                            >
                                {showLongAudioInput ? "← Volver a subir audio" : "Tengo el texto, quiero solo el análisis →"}
                            </button>
                        </div>

                        <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">

                            {!showLongAudioInput ? (
                                /* AUDIO UPLOAD FORM */
                                <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                                    <div>
                                        <label className="block text-lg font-bold mb-4 text-white">
                                            1. Sube tu Audio
                                        </label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                                                ? 'border-green-400 bg-green-400/10 scale-[1.02]'
                                                : 'border-gray-700 hover:border-green-400/50 hover:bg-white/5'
                                                }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                id="audio-input"
                                                type="file"
                                                accept=".mp3,.wav,.m4a,.mp4,.mpeg,.mpga,.webm,.ogg,.opus,.flac,audio/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                disabled={loading}
                                            />

                                            {audioFile ? (
                                                <div className="flex items-center justify-center gap-4 animate-fade-in">
                                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/20">
                                                        <i className="fas fa-file-audio text-2xl text-white"></i>
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="text-white font-bold text-lg">{audioFile.name}</p>
                                                        <p className="text-gray-400 text-sm font-mono">
                                                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAudioFile(null)}
                                                        className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center text-gray-500">
                                                        <i className="fas fa-cloud-upload-alt text-3xl"></i>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="audio-input" className="cursor-pointer">
                                                            <span className="text-green-400 hover:text-green-300 font-bold text-lg transition-colors underline decoration-2 underline-offset-4">
                                                                Haz clic para subir
                                                            </span>
                                                            <span className="text-gray-300"> o arrastra aquí</span>
                                                        </label>
                                                        <p className="text-sm text-gray-500 mt-2 font-mono">
                                                            MP3, WAV, M4A, OGG (Máx. 25MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="tipo-analisis" className="block text-lg font-bold mb-4 text-white">
                                            2. Selecciona el Tipo de Análisis
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="tipo-analisis"
                                                value={tipoAnalisis}
                                                onChange={(e) => setTipoAnalisis(e.target.value as TipoAnalisis)}
                                                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white text-lg font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
                                                disabled={loading}
                                            >
                                                <option value="resumen-general">📝 Resumen General (Minuta)</option>
                                                <option value="entrevista-trabajo">💼 Entrevista de Trabajo</option>
                                                <option value="reunion-cliente">🤝 Reunión con Cliente</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <i className="fas fa-chevron-down"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 animate-head-shake">
                                            <i className="fas fa-exclamation-circle text-xl"></i>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !audioFile}
                                        className="w-full py-5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black text-xl font-bold rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                <span>Transcribiendo...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Comenzar Proceso</span>
                                                <i className="fas fa-arrow-right"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* TEXT INPUT FORM */
                                <form onSubmit={handleTextSubmit} className="space-y-8 animate-fade-in">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-lg font-bold text-white">
                                                Pega tu Transcripción
                                            </label>
                                            <label htmlFor="text-file-input" className="text-sm text-green-400 hover:text-green-300 cursor-pointer flex items-center gap-2 font-medium">
                                                <i className="fas fa-upload"></i>
                                                Subir .txt
                                            </label>
                                            <input
                                                id="text-file-input"
                                                type="file"
                                                accept=".txt,.md,.json"
                                                onChange={handleTextFileChange}
                                                className="hidden"
                                                disabled={loading}
                                            />
                                        </div>

                                        <textarea
                                            value={textoManual}
                                            onChange={(e) => setTextoManual(e.target.value)}
                                            placeholder="Pega aquí el texto que deseas analizar..."
                                            className="w-full h-64 p-6 bg-gray-900 border border-gray-700 rounded-xl text-white text-base focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none leading-relaxed placeholder-gray-600"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="tipo-analisis-text" className="block text-lg font-bold mb-4 text-white">
                                            Selecciona el Tipo de Análisis
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="tipo-analisis-text"
                                                value={tipoAnalisis}
                                                onChange={(e) => setTipoAnalisis(e.target.value as TipoAnalisis)}
                                                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white text-lg font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
                                                disabled={loading}
                                            >
                                                <option value="resumen-general">📝 Resumen General</option>
                                                <option value="entrevista-trabajo">💼 Entrevista de Trabajo</option>
                                                <option value="reunion-cliente">🤝 Reunión con Cliente</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <i className="fas fa-chevron-down"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                                            <i className="fas fa-exclamation-circle text-xl"></i>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !textoManual.trim()}
                                        className="w-full py-5 px-8 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xl font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Analizando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Analizar Texto</span>
                                                <i className="fas fa-brain"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>
                ) : (
                    /* RESULT VIEW */
                    <div className="max-w-6xl mx-auto animate-slide-in">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                <span className="text-green-400">✅</span> Análisis Completado
                            </h2>
                            <button
                                onClick={() => setResultado(null)}
                                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                            >
                                ← Analizar otro archivo
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Columna Izquierda: Análisis */}
                            <div className="space-y-6">
                                <div className="glass-card p-8 rounded-2xl border border-green-500/20 bg-green-900/5">
                                    <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                                        <i className="fas fa-chart-pie"></i>
                                        Reporte Ejecutivo
                                    </h3>
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <div className="whitespace-pre-wrap leading-relaxed text-gray-200">
                                            {resultado.analisis}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Transcripción Original */}
                            <div className="space-y-6">
                                <div className="glass-card p-8 rounded-2xl border border-white/5 bg-black/40">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                                            <i className="fas fa-quote-left text-gray-500"></i>
                                            Transcripción Original
                                        </h3>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(resultado.transcripcion)}
                                            className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                    <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        <p className="whitespace-pre-wrap text-gray-400 leading-relaxed text-sm font-mono">
                                            {resultado.transcripcion}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    )
}
