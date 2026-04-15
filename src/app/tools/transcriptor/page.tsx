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

    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            {/* Elemento de Fondo de Cuadrícula */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <nav className="container mx-auto px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 relative z-50">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                    <Image src="/logogrow.png" alt="Grow Labs Logo" fill className="object-cover" />
                                </div>
                                <span className="font-bold text-lg tracking-tight hidden md:inline text-gray-900">Grow Labs</span>
                            </Link>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span className="text-sm font-medium text-gray-500">Transcriptor IA</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-gray-500 hover:text-green-600 text-sm font-medium transition-colors">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 container mx-auto px-4 md:px-6 pt-32 pb-12">
                {!resultado ? (
                    <div className="max-w-4xl mx-auto animate-fade-in">

                        <div className="text-center mb-10 md:mb-12">
                            <div className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-6 border border-green-100 shadow-sm">
                                <i className="fas fa-microphone-lines text-3xl"></i>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
                                Transcripción y <br className="hidden md:block" />
                                <span className="text-green-600">Análisis Inteligente</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Sube tu audio, entrevista o reunión y obtén una transcripción perfecta junto con un análisis ejecutivo generado por IA.
                            </p>
                        </div>

                        {/* Toggle Mode Button */}
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={() => { setShowLongAudioInput(!showLongAudioInput); setError(null); }}
                                className="text-sm md:text-base text-gray-500 font-medium hover:text-green-600 transition-colors flex items-center gap-2"
                            >
                                {showLongAudioInput 
                                    ? <><i className="fas fa-arrow-left"></i> Volver a subir audio</>
                                    : <>Tengo el texto, quiero solo el análisis <i className="fas fa-arrow-right"></i></>
                                }
                            </button>
                        </div>

                        <div className="bg-white p-6 md:p-12 rounded-3xl border border-gray-200 shadow-sm">

                            {!showLongAudioInput ? (
                                /* AUDIO UPLOAD FORM */
                                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div>
                                        <label className="block text-base md:text-lg font-bold mb-4 text-gray-900">
                                            1. Sube tu Audio
                                        </label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 ${dragActive
                                                ? 'border-green-400 bg-green-50 scale-[1.02]'
                                                : 'border-gray-300 hover:border-green-400 bg-gray-50'
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
                                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-green-100 flexitems-center justify-center border border-green-200 flex flex-col justify-center shrink-0">
                                                        <i className="fas fa-file-audio text-xl md:text-2xl text-green-600"></i>
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <p className="text-gray-900 font-bold text-sm md:text-lg truncate">{audioFile.name}</p>
                                                        <p className="text-gray-500 text-xs md:text-sm font-mono mt-1">
                                                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAudioFile(null)}
                                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors shrink-0"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400">
                                                        <i className="fas fa-cloud-upload-alt text-2xl md:text-3xl"></i>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="audio-input" className="cursor-pointer">
                                                            <span className="text-green-600 hover:text-green-700 font-bold text-base md:text-lg transition-colors underline decoration-2 underline-offset-4">
                                                                Haz clic para subir
                                                            </span>
                                                            <span className="text-gray-500"> o arrastra aquí</span>
                                                        </label>
                                                        <p className="text-xs md:text-sm text-gray-400 mt-2 font-mono">
                                                            MP3, WAV, M4A, OGG (Máx. 25MB)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="tipo-analisis" className="block text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900">
                                            2. Selecciona el Tipo de Análisis
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="tipo-analisis"
                                                value={tipoAnalisis}
                                                onChange={(e) => setTipoAnalisis(e.target.value as TipoAnalisis)}
                                                className="w-full px-4 py-3 md:px-6 md:py-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base md:text-lg font-medium focus:ring-2 focus:ring-green-400 focus:border-green-400 appearance-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                                disabled={loading}
                                            >
                                                <option value="resumen-general">📝 Resumen General (Minuta)</option>
                                                <option value="entrevista-trabajo">💼 Entrevista de Trabajo</option>
                                                <option value="reunion-cliente">🤝 Reunión con Cliente</option>
                                            </select>
                                            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <i className="fas fa-chevron-down"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 animate-head-shake text-sm md:text-base">
                                            <i className="fas fa-exclamation-circle text-lg md:text-xl"></i>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !audioFile}
                                        className="w-full py-4 md:py-5 px-6 md:px-8 bg-green-600 hover:bg-green-700 text-white text-lg md:text-xl font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                                <form onSubmit={handleTextSubmit} className="space-y-6 md:space-y-8 animate-fade-in">
                                    <div>
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                                            <label className="block text-base md:text-lg font-bold text-gray-900">
                                                Pega tu Transcripción
                                            </label>
                                            <label htmlFor="text-file-input" className="text-sm text-green-600 hover:text-green-700 cursor-pointer flex items-center gap-2 font-medium bg-green-50 px-3 py-1.5 rounded-full border border-green-100 w-fit">
                                                <i className="fas fa-upload"></i>
                                                Subir archivo .txt
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
                                            className="w-full h-48 md:h-64 p-4 md:p-6 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm md:text-base focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all resize-none leading-relaxed placeholder-gray-400 shadow-sm"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="tipo-analisis-text" className="block text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-900">
                                            Selecciona el Tipo de Análisis
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="tipo-analisis-text"
                                                value={tipoAnalisis}
                                                onChange={(e) => setTipoAnalisis(e.target.value as TipoAnalisis)}
                                                className="w-full px-4 py-3 md:px-6 md:py-4 bg-white border border-gray-300 rounded-xl text-gray-900 text-base md:text-lg font-medium focus:ring-2 focus:ring-green-400 focus:border-green-400 appearance-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                                disabled={loading}
                                            >
                                                <option value="resumen-general">📝 Resumen General</option>
                                                <option value="entrevista-trabajo">💼 Entrevista de Trabajo</option>
                                                <option value="reunion-cliente">🤝 Reunión con Cliente</option>
                                            </select>
                                            <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <i className="fas fa-chevron-down"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 text-sm md:text-base">
                                            <i className="fas fa-exclamation-circle text-lg md:text-xl"></i>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !textoManual.trim()}
                                        className="w-full py-4 md:py-5 px-6 md:px-8 bg-gray-900 hover:bg-black text-white text-lg md:text-xl font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm md:text-base">
                                    <i className="fas fa-check"></i>
                                </span> 
                                Análisis Completado
                            </h2>
                            <button
                                onClick={() => setResultado(null)}
                                className="px-4 py-2 md:px-6 md:py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm text-sm md:text-base"
                            >
                                ← Analizar otro
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {/* Columna Izquierda: Análisis */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <i className="fas fa-chart-pie"></i>
                                        </span>
                                        Reporte Ejecutivo
                                    </h3>
                                    <div className="prose prose-gray prose-sm md:prose-base max-w-none">
                                        <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                                            {resultado.analisis}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Transcripción Original */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <i className="fas fa-quote-left text-gray-400"></i>
                                            Transcripción Original
                                        </h3>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(resultado.transcripcion)}
                                            className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                    <div className="h-[400px] md:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        <p className="whitespace-pre-wrap text-gray-600 leading-relaxed text-xs md:text-sm font-mono bg-white p-4 rounded-xl border border-gray-100">
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
