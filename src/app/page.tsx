'use client'

import { useState, useEffect } from 'react'
import { AnalisisAudio } from '@/lib/supabase'
import Image from 'next/image'

type TipoAnalisis = 'entrevista-trabajo' | 'reunion-cliente' | 'resumen-general'

export default function Home() {
    const [audioFile, setAudioFile] = useState<File | null>(null)
    const [tipoAnalisis, setTipoAnalisis] = useState<TipoAnalisis>('resumen-general')
    const [loading, setLoading] = useState(false)
    const [resultado, setResultado] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [historial, setHistorial] = useState<AnalisisAudio[]>([])
    const [loadingHistorial, setLoadingHistorial] = useState(true)
    const [dragActive, setDragActive] = useState(false)
    const [activeTab, setActiveTab] = useState<'standard' | 'largos' | 'presentaciones'>('standard')
    const [textoManual, setTextoManual] = useState('')
    const [textoPresentacion, setTextoPresentacion] = useState('')
    const [presentationData, setPresentationData] = useState<any>(null)
    const [loadingPresentation, setLoadingPresentation] = useState(false)

    useEffect(() => {
        cargarHistorial()
    }, [])

    const cargarHistorial = async () => {
        try {
            setLoadingHistorial(true)
            const response = await fetch('/api/historial')
            const data = await response.json()

            if (data.error) {
                console.error('Error al cargar historial:', data.error)
            } else {
                setHistorial(data.data || [])
            }
        } catch (err) {
            console.error('Error al cargar historial:', err)
        } finally {
            setLoadingHistorial(false)
        }
    }

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

        // Límite de 10MB para evitar timeouts en Vercel
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
            await cargarHistorial()

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
            await cargarHistorial()

        } catch (err: any) {
            setError(err.message || 'Error al procesar el texto')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerarPresentacion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!textoPresentacion.trim()) {
            setError('Por favor ingresa el texto para generar la presentación')
            return
        }

        setLoadingPresentation(true)
        setError(null)
        setPresentationData(null)

        try {
            const response = await fetch('/api/generar-presentacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: textoPresentacion })
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMessage = data.details
                    ? `${data.error}: ${data.details}`
                    : (data.error || 'Error al generar la presentación')
                throw new Error(errorMessage)
            }

            setPresentationData(data.data)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Error al generar la presentación')
        } finally {
            setLoadingPresentation(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const obtenerNombreTipoAnalisis = (tipo: string) => {
        const nombres: Record<string, string> = {
            'entrevista-trabajo': 'Entrevista de Trabajo',
            'reunion-cliente': 'Reunión con Cliente',
            'resumen-general': 'Resumen General',
        }
        return nombres[tipo] || tipo
    }

    const obtenerColorTipo = (tipo: string) => {
        const colores: Record<string, string> = {
            'entrevista-trabajo': 'from-purple-500 to-pink-500',
            'reunion-cliente': 'from-blue-500 to-cyan-500',
            'resumen-general': 'from-green-500 to-emerald-500',
        }
        return colores[tipo] || 'from-gray-500 to-gray-600'
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-white/10">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logogrow.png"
                                alt="Grow Labs Logo"
                                width={48}
                                height={48}
                                className="rounded-lg"
                            />
                            <div>
                                <h1 className="text-xl font-bold gradient-text">Grow Labs</h1>
                                <p className="text-sm text-gray-400">Transcriptor IA</p>
                            </div>
                        </div>
                        <a
                            href="https://api.whatsapp.com/send/?phone=5492643229503&text&type=phone_number&app_absent=0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            💬 Contactar
                        </a>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 md:py-24">
                <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
                    <div className="inline-block mb-6">
                        <span className="badge badge-success">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Potenciado por OpenAI
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        Transcripción y Análisis de Audio
                        <span className="block gradient-text mt-2">con Inteligencia Artificial</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Convierte tus archivos de audio en texto y obtén análisis inteligentes en segundos.
                        Compatible con WhatsApp, grabaciones de reuniones y entrevistas.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Transcripción precisa con Whisper
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Análisis con GPT-4
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Compatible con OPUS (WhatsApp)
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <div className="max-w-5xl mx-auto">
                    <div className="glass-strong rounded-3xl p-8 md:p-12 card-hover animate-slide-in">
                        {/* Tabs Navigation */}
                        <div className="flex justify-center mb-10">
                            <div className="bg-gray-800/50 p-1.5 rounded-2xl inline-flex relative flex-wrap justify-center gap-1">
                                <button
                                    onClick={() => { setActiveTab('standard'); setError(null); setResultado(null); setPresentationData(null); }}
                                    className={`relative z-10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'standard'
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Transcriptor
                                </button>
                                <button
                                    onClick={() => { setActiveTab('largos'); setError(null); setResultado(null); setPresentationData(null); }}
                                    className={`relative z-10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'largos'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Audios Largos
                                </button>
                                <button
                                    onClick={() => { setActiveTab('presentaciones'); setError(null); setResultado(null); setPresentationData(null); }}
                                    className={`relative z-10 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'presentaciones'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    Presentaciones
                                </button>
                            </div>
                        </div>

                        {activeTab === 'standard' ? (
                            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                                {/* Upload Area */}
                                <div>
                                    <label className="block text-lg font-semibold mb-4 text-white">
                                        📁 Archivo de Audio
                                    </label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                                            ? 'border-green-400 bg-green-400/10 scale-[1.02]'
                                            : 'border-gray-600 hover:border-green-400/50 hover:bg-white/5'
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
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                    </svg>
                                                </div>
                                                <div className="text-left flex-1">
                                                    <p className="text-white font-semibold text-lg">{audioFile.name}</p>
                                                    <p className="text-gray-400">
                                                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setAudioFile(null)}
                                                    className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <label htmlFor="audio-input" className="cursor-pointer">
                                                        <span className="text-green-400 hover:text-green-300 font-semibold text-lg transition-colors">
                                                            Haz clic para subir
                                                        </span>
                                                        <span className="text-gray-300"> o arrastra y suelta</span>
                                                    </label>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        MP3, WAV, M4A, OPUS, OGG, FLAC, WebM (máx. 25MB)
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Analysis Type Selector */}
                                <div>
                                    <label htmlFor="tipo-analisis" className="block text-lg font-semibold mb-4 text-white">
                                        🎯 Tipo de Análisis
                                    </label>
                                    <select
                                        id="tipo-analisis"
                                        value={tipoAnalisis}
                                        onChange={(e) => setTipoAnalisis(e.target.value as TipoAnalisis)}
                                        className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-xl text-white text-lg font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all cursor-pointer hover:bg-gray-800/80"
                                        disabled={loading}
                                    >
                                        <option value="resumen-general">📝 Resumen General</option>
                                        <option value="entrevista-trabajo">💼 Entrevista de Trabajo</option>
                                        <option value="reunion-cliente">🤝 Reunión con Cliente</option>
                                    </select>

                                    <div className="mt-4 p-5 glass rounded-xl border border-white/10">
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            {tipoAnalisis === 'entrevista-trabajo' && (
                                                <>
                                                    <strong className="text-purple-400">Entrevista de Trabajo:</strong> Analiza el perfil del candidato, identifica fortalezas, debilidades y proporciona una recomendación de contratación.
                                                </>
                                            )}
                                            {tipoAnalisis === 'reunion-cliente' && (
                                                <>
                                                    <strong className="text-blue-400">Reunión con Cliente:</strong> Extrae requerimientos, genera lista de tareas y evalúa el tono y compromiso del cliente.
                                                </>
                                            )}
                                            {tipoAnalisis === 'resumen-general' && (
                                                <>
                                                    <strong className="text-green-400">Resumen General:</strong> Genera un resumen ejecutivo con los puntos clave, temas principales y conclusiones.
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !audioFile}
                                    className="w-full py-5 px-8 btn btn-primary text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="spinner"></div>
                                            <span>Procesando tu audio...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Procesar Audio con IA</span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        ) : activeTab === 'largos' ? (
                            <form onSubmit={handleTextSubmit} className="space-y-8 animate-fade-in">
                                {/* Text Upload/Paste Area */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-lg font-semibold text-white">
                                            📄 Transcripción (Texto)
                                        </label>
                                        <label htmlFor="text-file-input" className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
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
                                        placeholder="Pega aquí la transcripción de tu audio largo para analizarla..."
                                        className="w-full h-64 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none leading-relaxed"
                                        disabled={loading}
                                    />
                                    <p className="text-xs text-gray-500 mt-2 text-right">
                                        {textoManual.length} caracteres
                                    </p>
                                </div>

                                {/* Analysis Type Selector (Reused) */}
                                <div>
                                    <label htmlFor="tipo-analisis-text" className="block text-lg font-semibold mb-4 text-white">
                                        🎯 Tipo de Análisis
                                    </label>
                                    <select
                                        id="tipo-analisis-text"
                                        value={tipoAnalisis}
                                        onChange={(e) => setTipoAnalisis(e.target.value as TipoAnalisis)}
                                        className="w-full px-6 py-4 bg-gray-800/60 border border-gray-700 rounded-xl text-white text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:bg-gray-800/80"
                                        disabled={loading}
                                    >
                                        <option value="resumen-general">📝 Resumen General</option>
                                        <option value="entrevista-trabajo">💼 Entrevista de Trabajo</option>
                                        <option value="reunion-cliente">🤝 Reunión con Cliente</option>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !textoManual.trim()}
                                    className="w-full py-5 px-8 btn btn-secondary text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-0 text-white"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="spinner"></div>
                                            <span>Analizando texto...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            <span>Analizar con GPT-4</span>
                                        </span>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                {!presentationData ? (
                                    <form onSubmit={handleGenerarPresentacion}>
                                        <label className="block text-lg font-semibold mb-4 text-white">
                                            📊 Generador de Presentaciones
                                        </label>
                                        <p className="text-gray-400 mb-4 text-sm">
                                            Pega tu texto o transcripción y generaremos slides profesionales listas para exportar a PDF.
                                        </p>

                                        <textarea
                                            value={textoPresentacion}
                                            onChange={(e) => setTextoPresentacion(e.target.value)}
                                            placeholder="Ingresa el texto para generar la presentación..."
                                            className="w-full h-64 p-6 bg-gray-900/50 border border-gray-700 rounded-2xl text-white text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none leading-relaxed mb-6"
                                            disabled={loadingPresentation}
                                        />

                                        <button
                                            type="submit"
                                            disabled={loadingPresentation || !textoPresentacion.trim()}
                                            className="w-full py-5 px-8 btn btn-secondary text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0 text-white"
                                        >
                                            {loadingPresentation ? (
                                                <span className="flex items-center justify-center gap-3">
                                                    <div className="spinner"></div>
                                                    <span>Diseñando slides...</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>Generar Presentación</span>
                                                </span>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    <div id="presentation-container">
                                        <div className="flex justify-between items-center mb-8 sticky top-0 z-50 glass p-4 rounded-xl print:hidden">
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                {presentationData?.titulo_presentacion}
                                            </h3>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setPresentationData(null)}
                                                    className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    ← Volver
                                                </button>
                                                <button
                                                    onClick={handlePrint}
                                                    className="btn btn-primary from-purple-500 to-pink-500 px-6 py-2 text-sm"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                    Descargar PDF
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-12 print:space-y-0">
                                            {presentationData?.slides?.map((slide: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="slide-page aspect-video relative overflow-hidden shadow-2xl print:shadow-none bg-gray-900 text-white rounded-2xl print:rounded-none"
                                                >
                                                    {/* Background Image with Dark Overlay */}
                                                    <div
                                                        className="absolute inset-0 z-0 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: "url('/fondogrow.png')",
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 z-0 bg-gray-900/90 mix-blend-multiply" /> {/* Dark overlay for readability */}

                                                    {/* Decorative Gradients */}
                                                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>
                                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -ml-32 -mb-32 z-0"></div>

                                                    {/* Grow Labs Logo */}
                                                    <div className="absolute top-8 right-8 z-20 w-32 h-auto opacity-90">
                                                        <Image src="/logogrow.png" alt="Grow Labs" width={120} height={40} className="object-contain" />
                                                    </div>

                                                    {/* Slide Content Container */}
                                                    <div className="relative z-10 w-full h-full flex flex-col p-12 md:p-16">

                                                        {/* Header: Type Badge & Slide Number */}
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-mono uppercase tracking-wider border border-white/10">
                                                                    {index + 1} / {presentationData.slides.length}
                                                                </span>
                                                                {slide.tipo === 'titulo' && (
                                                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                                                                        Portada
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Dynamic Content Rendering */}
                                                        <div className="flex-1 flex flex-col justify-center">

                                                            {/* TIPO: TITULO (Portada) */}
                                                            {slide.tipo === 'titulo' && (
                                                                <div className="text-center max-w-4xl mx-auto">
                                                                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-600 mx-auto mb-8 rounded-full"></div>
                                                                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 mb-6 leading-tight">
                                                                        {slide.titulo}
                                                                    </h1>
                                                                    {presentationData.subtitulo && (
                                                                        <p className="text-2xl text-gray-300 font-light mb-12 border-b border-gray-700/50 pb-8 inline-block">
                                                                            {presentationData.subtitulo}
                                                                        </p>
                                                                    )}
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400 mt-8">
                                                                        {slide.contenido.map((item: string, i: number) => (
                                                                            <div key={i} className="flex flex-col items-center">
                                                                                <div className="w-12 h-1 bg-green-500/20 mb-2"></div>
                                                                                <span className="uppercase tracking-widest font-semibold">{item}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: TEXTO DETALLADO & CONTENIDO y CONCLUSION */}
                                                            {(slide.tipo === 'texto_detallado' || slide.tipo === 'contenido' || slide.tipo === 'conclusion') && (
                                                                <div className="h-full flex flex-col">
                                                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 flex items-center gap-4 border-b border-gray-700 pb-4">
                                                                        <span className="w-3 h-12 bg-green-500 rounded-sm"></span>
                                                                        {slide.titulo}
                                                                    </h2>
                                                                    <div className="flex-1 overflow-visible space-y-6">
                                                                        {slide.contenido.map((point: string, i: number) => (
                                                                            <div key={i} className="flex gap-6 group">
                                                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-600 text-green-400 flex items-center justify-center font-bold text-sm mt-1 group-hover:border-green-400 group-hover:bg-green-500/10 transition-colors">
                                                                                    {i + 1}
                                                                                </span>
                                                                                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light text-justify">
                                                                                    {point}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: GRAFICO */}
                                                            {slide.tipo === 'grafico' && (
                                                                <div className="h-full flex flex-col">
                                                                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                                        {slide.titulo}
                                                                    </h2>
                                                                    <p className="text-gray-400 text-lg mb-8 italic border-l-4 border-blue-500 pl-4">
                                                                        {slide.descripcion}
                                                                    </p>

                                                                    {/* Chart Visualization */}
                                                                    <div className="flex-1 bg-gray-800/40 rounded-xl p-8 border border-white/5 flex items-end justify-around gap-4 relative">
                                                                        {/* Grid lines background */}
                                                                        <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-20">
                                                                            <div className="w-full h-px bg-white"></div>
                                                                            <div className="w-full h-px bg-white"></div>
                                                                            <div className="w-full h-px bg-white"></div>
                                                                            <div className="w-full h-px bg-white"></div>
                                                                            <div className="w-full h-px bg-white"></div>
                                                                        </div>

                                                                        {slide.datos_grafico?.valores?.map((valor: number, i: number) => (
                                                                            <div key={i} className="flex flex-col items-center gap-3 w-full h-full justify-end z-10 group">
                                                                                <div
                                                                                    className="w-full max-w-[80px] bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg relative transition-all group-hover:to-green-300 shadow-lg shadow-green-900/50"
                                                                                    style={{ height: `${valor}%` }}
                                                                                >
                                                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                        {valor}%
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-sm md:text-lg font-medium text-gray-300 uppercase tracking-wider">
                                                                                    {slide.datos_grafico?.etiquetas?.[i] || `Item ${i}`}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div className="mt-4 text-center text-xs text-gray-500 uppercase tracking-widest">
                                                                        {slide.datos_grafico?.leyenda || 'Visualización de Datos Generada por IA'}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: DASHBOARD KPI */}
                                                            {slide.tipo === 'dashboard_kpi' && (
                                                                <div className="h-full flex flex-col justify-center">
                                                                    <div className="flex items-center gap-4 mb-12">
                                                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                                                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                            </svg>
                                                                        </div>
                                                                        <h2 className="text-4xl font-bold">
                                                                            {slide.titulo}
                                                                        </h2>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                                        {slide.kpis?.map((kpi: any, i: number) => (
                                                                            <div key={i} className="bg-gray-800/60 p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                                                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                                                    {/* Icono de fondo decorativo */}
                                                                                    <svg className="w-24 h-24 transform rotate-12" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                                                                    </svg>
                                                                                </div>

                                                                                <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4">
                                                                                    {kpi.label}
                                                                                </p>
                                                                                <div className="flex items-baseline gap-2">
                                                                                    <span className="text-5xl md:text-6xl font-black text-white">
                                                                                        {kpi.valor}
                                                                                    </span>
                                                                                </div>

                                                                                <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${kpi.tendencia === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                                    {kpi.tendencia === 'up' ? '↑ Tendencia Positiva' : '↓ Área de Atención'}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-5 bg-red-500/10 border-2 border-red-500/50 rounded-xl animate-fade-in">
                                <div className="flex items-start gap-3">
                                    <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-300 font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {resultado && (
                            <div className="mt-8 space-y-6 animate-fade-in">
                                <div className="p-6 glass rounded-2xl border-l-4 border-green-400">
                                    <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Transcripción
                                    </h3>
                                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                        {resultado.transcripcion}
                                    </p>
                                </div>

                                <div className="p-6 glass rounded-2xl border-l-4 border-blue-400">
                                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Análisis - {obtenerNombreTipoAnalisis(resultado.tipo_analisis)}
                                    </h3>
                                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                        {resultado.analisis}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setResultado(null)}
                                        className="btn btn-secondary"
                                    >
                                        Cerrar Resultado
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="glass-strong rounded-3xl p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Historial de Análisis
                        </h2>
                        <button
                            onClick={cargarHistorial}
                            disabled={loadingHistorial}
                            className="btn btn-secondary"
                        >
                            <svg className={`w-5 h-5 ${loadingHistorial ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Actualizar</span>
                        </button>
                    </div>

                    {loadingHistorial ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : historial.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-xl font-medium">No hay análisis guardados aún</p>
                            <p className="text-gray-500 mt-2">Sube tu primer archivo de audio para comenzar</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {historial.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass rounded-2xl p-6 card-hover"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className={`badge bg-gradient-to-r ${obtenerColorTipo(item.tipo_analisis)} text-white border-0`}>
                                                    {obtenerNombreTipoAnalisis(item.tipo_analisis)}
                                                </span>
                                                <span className="text-sm text-gray-400">
                                                    {formatearFecha(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <details className="group">
                                        <summary className="cursor-pointer list-none">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-white font-semibold group-hover:text-green-400 transition-colors">
                                                    Ver detalles completos
                                                </h4>
                                                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </summary>

                                        <div className="mt-6 space-y-6 pt-6 border-t border-gray-700">
                                            <div>
                                                <h5 className="text-sm font-bold text-green-400 mb-3">Transcripción:</h5>
                                                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                                                    {item.transcripcion_original}
                                                </p>
                                            </div>

                                            <div>
                                                <h5 className="text-sm font-bold text-blue-400 mb-3">Análisis:</h5>
                                                <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                                                    {item.resultado_analisis}
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="glass border-t border-white/10 mt-20">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logogrow.png"
                                alt="Grow Labs Logo"
                                width={40}
                                height={40}
                                className="rounded-lg"
                            />
                            <div>
                                <p className="text-white font-semibold">Grow Labs Transcriptor</p>
                                <p className="text-sm text-gray-400">Powered by OpenAI Whisper & GPT-4</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <a href="https://api.whatsapp.com/send/?phone=5492643229503" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                                WhatsApp
                            </a>
                            <a href="https://www.instagram.com/growsanjuan/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                                Instagram
                            </a>
                            <a href="https://www.linkedin.com/in/lucas-marinero-182521308/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
                        <p>&copy; 2024 Grow Labs. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
