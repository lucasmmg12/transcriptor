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
    const [presentationTemplate, setPresentationTemplate] = useState<'standard' | 'medical'>('standard')

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
                body: JSON.stringify({
                    texto: textoPresentacion,
                    template: presentationTemplate
                })
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

                                        <div className="mb-6 grid grid-cols-2 gap-4">
                                            <div
                                                onClick={() => setPresentationTemplate('standard')}
                                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${presentationTemplate === 'standard'
                                                    ? 'border-purple-500 bg-purple-500/10'
                                                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                                    }`}
                                            >
                                                <h4 className="font-bold text-white mb-1">🎭 Visual Novel</h4>
                                                <p className="text-xs text-gray-400">Presentación artística con slides visuales y narrativa.</p>
                                            </div>

                                            <div
                                                onClick={() => setPresentationTemplate('medical')}
                                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${presentationTemplate === 'medical'
                                                    ? 'border-medical-500 bg-medical-500/10'
                                                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                                    }`}
                                            >
                                                <h4 className="font-bold text-white mb-1">🏥 Formato Médico</h4>
                                                <p className="text-xs text-gray-400">Plan de trabajo formal estilo A4 para instituciones de salud.</p>
                                            </div>
                                        </div>

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
                                ) : presentationTemplate === 'standard' ? (
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
                                            {(presentationData?.slides || []).map((slide: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="slide-page aspect-video relative overflow-hidden shadow-2xl print:shadow-none bg-gray-900 text-white rounded-2xl print:rounded-none"
                                                >
                                                    {/* Background Image with Dark Overlay - Always Present */}
                                                    <div
                                                        className="absolute inset-0 z-0 bg-cover bg-center print:opacity-100" // Ensure background prints
                                                        style={{
                                                            backgroundImage: "url('/fondogrow.png')",
                                                        }}
                                                    />

                                                    {/* Dark overlay for readability - Vary opacity based on slide type */}
                                                    <div className={`absolute inset-0 z-0 mix-blend-multiply ${slide.tipo === 'frase_impacto' ? 'bg-gray-900/95' : 'bg-gray-900/90'
                                                        }`} />

                                                    {/* Decorative Gradients (Subtler) */}
                                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-500/5 to-blue-500/5 z-0"></div>

                                                    {/* Grow Labs Logo - Circular Frame */}
                                                    <div className="absolute top-8 right-8 z-20 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl print:shadow-none print:opacity-100 overflow-hidden p-2">
                                                        <Image src="/logogrow.png" alt="Grow Labs" width={100} height={100} className="object-contain" />
                                                    </div>

                                                    {/* Slide Content Container */}
                                                    <div className="relative z-10 w-full h-full flex flex-col p-12 md:p-16">

                                                        {/* Header: Slide Number & Type (Hidden on Title/Quote slides for clean look) */}
                                                        {slide.tipo !== 'titulo' && slide.tipo !== 'frase_impacto' && (
                                                            <div className="flex justify-between items-start mb-8">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs font-mono uppercase tracking-wider border border-white/10">
                                                                        {index + 1} / {presentationData.slides.length}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Dynamic Content Rendering */}
                                                        <div className="flex-1 flex flex-col justify-center">

                                                            {/* TIPO: TITULO (Portada) */}
                                                            {slide.tipo === 'titulo' && (
                                                                <div className="text-center max-w-5xl mx-auto h-full flex flex-col justify-center">
                                                                    <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-600 mx-auto mb-12 rounded-full"></div>
                                                                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                                                                        {slide.titulo}
                                                                    </h1>
                                                                    {presentationData.subtitulo && (
                                                                        <p className="text-3xl text-gray-300 font-light mb-16 max-w-3xl mx-auto border-b border-gray-700/50 pb-8">
                                                                            {presentationData.subtitulo}
                                                                        </p>
                                                                    )}
                                                                    <div className="flex justify-center gap-12 text-sm text-gray-400">
                                                                        {slide.contenido.map((item: string, i: number) => (
                                                                            <div key={i} className="flex flex-col items-center gap-2">
                                                                                <span className="uppercase tracking-widest font-bold text-green-400">{item}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: FRASE IMPACTO (Quote) */}
                                                            {slide.tipo === 'frase_impacto' && (
                                                                <div className="text-center max-w-6xl mx-auto h-full flex flex-col justify-center relative">
                                                                    <div className="absolute top-0 left-0 text-green-500/20 text-9xl font-serif">“</div>
                                                                    <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-snug mb-8 relative z-10">
                                                                        {slide.contenido}
                                                                    </h2>
                                                                    <div className="w-32 h-1 bg-green-500 mx-auto rounded-full"></div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: SPLIT CONTENT (2 Columnas) */}
                                                            {slide.tipo === 'split_content' && (
                                                                <div className="h-full flex flex-col">
                                                                    <h2 className="text-5xl font-bold text-white mb-12 flex items-center gap-6">
                                                                        <span className="w-16 h-2 bg-green-500"></span>
                                                                        {slide.titulo}
                                                                    </h2>
                                                                    <div className="flex-1 grid grid-cols-2 gap-16 items-center">
                                                                        <div className="space-y-6 text-xl md:text-2xl text-gray-300 leading-relaxed text-justify font-light">
                                                                            {slide.columna_izquierda.map((p: string, i: number) => (
                                                                                <p key={i}>{p}</p>
                                                                            ))}
                                                                        </div>
                                                                        <div className="bg-gray-800/40 p-10 rounded-3xl border border-white/5 h-full flex flex-col justify-center gap-8 backdrop-blur-sm">
                                                                            {slide.columna_derecha.map((item: string, i: number) => (
                                                                                <div key={i} className="flex items-start gap-4">
                                                                                    <div className="w-2 h-2 mt-3 rounded-full bg-blue-400 flex-shrink-0"></div>
                                                                                    <p className="text-2xl font-medium text-white">{item}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: GRID CARDS (Puntos Clave) */}
                                                            {slide.tipo === 'grid_cards' && (
                                                                <div className="h-full flex flex-col">
                                                                    <h2 className="text-5xl font-bold text-white mb-12 flex items-center gap-6">
                                                                        <span className="w-16 h-2 bg-blue-500"></span>
                                                                        {slide.titulo}
                                                                    </h2>
                                                                    <div className="flex-1 grid grid-cols-3 gap-6">
                                                                        {slide.items.slice(0, 6).map((item: any, i: number) => ( // Max 6 items per slide
                                                                            <div key={i} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-8 rounded-2xl border border-white/10 flex flex-col gap-4 hover:border-green-500/30 transition-colors">
                                                                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 font-bold text-xl">
                                                                                    {i + 1}
                                                                                </div>
                                                                                <h3 className="text-2xl font-bold text-white">{item.titulo}</h3>
                                                                                <p className="text-gray-400 text-lg leading-relaxed">{item.texto}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: TEXTO DETALLADO (Standard) */}
                                                            {(slide.tipo === 'texto_detallado' || slide.tipo === 'contenido' || slide.tipo === 'conclusion') && (
                                                                <div className="h-full flex flex-col">
                                                                    <h2 className="text-5xl font-bold text-white mb-12 flex items-center gap-6">
                                                                        <span className="w-3 h-16 bg-gradient-to-b from-green-400 to-blue-500 rounded-lg"></span>
                                                                        {slide.titulo}
                                                                    </h2>
                                                                    <div className="flex-1 space-y-8 pr-12">
                                                                        {slide.contenido.map((point: string, i: number) => (
                                                                            <div key={i} className="flex gap-6 group">
                                                                                {/* Bullet as visual element */}
                                                                                <div className="flex flex-col items-center gap-1 group-hover:gap-2 transition-all">
                                                                                    <div className="w-2 h-2 bg-white/50 rounded-full group-hover:bg-green-400 group-hover:scale-150 transition-all"></div>
                                                                                    <div className="w-0.5 h-full bg-white/10 group-last:hidden"></div>
                                                                                </div>
                                                                                <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed font-light">
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
                                                                    <h2 className="text-4xl font-bold text-white mb-4">
                                                                        {slide.titulo}
                                                                    </h2>
                                                                    <p className="text-xl text-gray-400 mb-12 max-w-3xl">
                                                                        {slide.descripcion}
                                                                    </p>

                                                                    {/* Chart Visualization */}
                                                                    <div className="flex-1 bg-gray-800/40 rounded-3xl p-12 border border-white/5 flex items-end justify-around gap-12 relative shadow-inner">
                                                                        {/* Grid lines background */}
                                                                        <div className="absolute inset-x-12 inset-y-12 flex flex-col justify-between pointer-events-none opacity-10">
                                                                            <div className="w-full h-px bg-white border-t border-dashed"></div>
                                                                            <div className="w-full h-px bg-white border-t border-dashed"></div>
                                                                            <div className="w-full h-px bg-white border-t border-dashed"></div>
                                                                            <div className="w-full h-px bg-white border-t border-dashed"></div>
                                                                            <div className="w-full h-px bg-white border-t border-dashed"></div>
                                                                        </div>

                                                                        {slide.datos_grafico?.valores?.map((valor: number, i: number) => (
                                                                            <div key={i} className="flex flex-col items-center gap-4 w-full h-full justify-end z-10 group">
                                                                                <div
                                                                                    className="w-full bg-gradient-to-t from-green-600/80 to-blue-500/80 rounded-t-2xl relative transition-all group-hover:from-green-500 group-hover:to-blue-400 shadow-[0_0_20px_rgba(0,212,170,0.3)]"
                                                                                    style={{ height: `${valor}%` }}
                                                                                >
                                                                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/20 px-3 py-1 rounded-lg text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-2">
                                                                                        {valor}%
                                                                                    </div>
                                                                                </div>
                                                                                <span className="text-lg font-semibold text-gray-300 uppercase tracking-widest text-center">
                                                                                    {slide.datos_grafico?.etiquetas?.[i] || `Item ${i}`}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* TIPO: DASHBOARD KPI */}
                                                            {slide.tipo === 'dashboard_kpi' && (
                                                                <div className="h-full flex flex-col justify-center">
                                                                    <h2 className="text-5xl font-bold text-white mb-20 text-center">
                                                                        {slide.titulo}
                                                                    </h2>

                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                                                        {slide.kpis?.map((kpi: any, i: number) => (
                                                                            <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl border border-white/10 relative overflow-hidden group hover:scale-105 transition-transform duration-500 shadow-2xl">
                                                                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>

                                                                                <p className="text-gray-400 text-lg font-bold uppercase tracking-widest mb-6 relative z-10">
                                                                                    {kpi.label}
                                                                                </p>
                                                                                <div className="flex items-baseline gap-2 mb-6 relative z-10">
                                                                                    <span className="text-7xl font-black text-white tracking-tighter">
                                                                                        {kpi.valor}
                                                                                    </span>
                                                                                </div>

                                                                                <div className={`relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-bold ${kpi.tendencia === 'up' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                                                                    {kpi.tendencia === 'up' ? (
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                                                                    ) : (
                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                                                    )}
                                                                                    {kpi.tendencia === 'up' ? 'Positivo' : 'Atención'}
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
                                ) : (
                                    <div id="presentation-container" className="bg-white min-h-screen text-gray-800 font-sans">
                                        {/* Botón flotante para imprimir */}
                                        <div className="fixed top-24 right-6 no-print z-50 animate-bounce-in print:hidden">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPresentationData(null)}
                                                    className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition-all border border-gray-600"
                                                >
                                                    ← Volver
                                                </button>
                                                <button onClick={handlePrint} className="bg-medical-800 hover:bg-medical-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-3 transition-all transform hover:scale-105 border border-medical-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Descargar PDF / Imprimir
                                                </button>
                                            </div>
                                        </div>

                                        <div className="page-container w-[297mm] h-[210mm] mx-auto bg-white shadow-2xl grid grid-cols-[85mm_1fr] overflow-hidden relative print:w-full print:h-screen print:shadow-none print:m-0 print:grid">

                                            {/* SIDEBAR IZQUIERDA */}
                                            <aside className="bg-medical-900 text-white p-10 flex flex-col relative overflow-hidden print:bg-medical-900">
                                                {/* Decoración de fondo */}
                                                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-medical-800 opacity-30 blur-3xl"></div>
                                                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-medical-600 opacity-20 blur-3xl"></div>

                                                <div className="relative z-10 flex flex-col h-full">
                                                    {/* LOGO */}
                                                    <div className="mb-12">
                                                        <div className="bg-white rounded-lg p-3 inline-block mb-6 shadow-xl">
                                                            <Image src="/logogrow.png" alt="Logo Grow Labs" width={40} height={40} className="h-10 w-auto object-contain" />
                                                        </div>
                                                        <div className="border-l-4 border-medical-500 pl-4">
                                                            <div className="text-medical-200 text-xs font-bold tracking-widest uppercase mb-1">{presentationData?.subtitulo || 'Propuesta'}</div>
                                                            <h1 className="text-4xl font-bold leading-none text-white tracking-tight text-balance">{presentationData?.titulo || 'PLAN DE TRABAJO'}</h1>
                                                        </div>
                                                    </div>

                                                    {/* INFO CLIENTE */}
                                                    <div className="space-y-8 flex-grow">
                                                        <div>
                                                            <div className="text-medical-400 font-bold text-[10px] uppercase mb-1 tracking-wider">PREPARADO PARA</div>
                                                            <div className="font-semibold text-xl leading-tight text-white mb-1">{presentationData?.cliente?.nombre || 'Cliente'}</div>
                                                            <div className="text-medical-200 text-sm leading-tight">{presentationData?.cliente?.cargo}</div>
                                                            <div className="text-medical-200 text-sm opacity-80">{presentationData?.cliente?.organizacion}</div>
                                                        </div>

                                                        <div className="w-full h-px bg-medical-800"></div>

                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <div className="text-medical-400 font-bold text-[10px] uppercase mb-1 tracking-wider">FECHA</div>
                                                                <div className="text-white text-sm font-medium">{presentationData?.fecha}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-medical-400 font-bold text-[10px] uppercase mb-1 tracking-wider">TOTAL ESTIMADO</div>
                                                                <div className="text-3xl font-bold text-white leading-none">{presentationData?.total_estimado}</div>
                                                                <div className="text-[10px] text-medical-300">{presentationData?.carga_transicion}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* FIRMA */}
                                                    <div className="mt-auto pt-8">
                                                        <div className="font-bold text-lg text-white">{presentationData?.autor?.nombre}</div>
                                                        <div className="text-medical-300 text-sm">{presentationData?.autor?.empresa}</div>
                                                    </div>
                                                </div>
                                            </aside>

                                            {/* CONTENIDO PRINCIPAL */}
                                            <main className="bg-white p-8 flex flex-col h-full overflow-hidden">

                                                {/* Header Objetivo */}
                                                <div className="bg-medical-50 border-l-4 border-medical-600 p-4 rounded-r-lg mb-6 shadow-sm">
                                                    <h2 className="text-medical-900 font-bold text-xs uppercase tracking-wider mb-1">Objetivo General</h2>
                                                    <p className="text-gray-700 text-sm leading-relaxed text-pretty">
                                                        {presentationData?.objetivo_general}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-12 gap-8 h-full min-h-0">

                                                    {/* COLUMNA 1: EJES Y HORAS */}
                                                    <div className="col-span-5 flex flex-col gap-5 min-h-0">

                                                        {/* Tarjeta Ejes */}
                                                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1 overflow-y-auto">
                                                            {presentationData?.ejes?.map((eje: any, i: number) => (
                                                                <div key={i} className={i > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
                                                                    <span className="bg-medical-100 text-medical-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">{eje.titulo}</span>
                                                                    <ul className="mt-3 space-y-2">
                                                                        {eje.items?.map((item: any, idx: number) => (
                                                                            <li key={idx} className="text-xs text-gray-600 flex items-start">
                                                                                <span className="text-medical-500 mr-2 mt-0.5">•</span>
                                                                                <span>
                                                                                    {item.label && <strong className="text-gray-800">{item.label}: </strong>}
                                                                                    {item.texto}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Tabla Horas */}
                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">
                                                            <h3 className="text-medical-800 font-bold text-xs uppercase mb-3 border-b border-gray-200 pb-2">Desglose de Horas</h3>
                                                            <table className="w-full text-xs">
                                                                <tbody>
                                                                    {presentationData?.desglose_horas?.map((item: any, i: number) => (
                                                                        <tr key={i} className="border-b border-gray-200/50 last:border-0">
                                                                            <td className="py-2 text-gray-600">{item.actividad}</td>
                                                                            <td className="py-2 text-right font-bold text-gray-800">{item.horas}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>

                                                    {/* COLUMNA 2: CALENDARIO */}
                                                    <div className="col-span-7 flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                                        <div className="bg-medical-50 px-4 py-3 border-b border-medical-100 flex justify-between items-center">
                                                            <h3 className="font-bold text-medical-800 text-sm tracking-wide">CALENDARIO DE HITOS</h3>
                                                            <span className="text-[10px] text-medical-600 font-medium bg-white px-2 py-0.5 rounded border border-medical-200 shadow-sm">
                                                                {presentationData?.calendario_hitos?.[0]?.dia_numero} - {presentationData?.calendario_hitos?.[presentationData?.calendario_hitos?.length - 1]?.dia_numero}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 overflow-hidden relative p-0">
                                                            {/* Timeline Line */}
                                                            <div className="absolute left-14 top-0 bottom-0 w-px bg-gray-100 z-0"></div>

                                                            <div className="divide-y divide-gray-50 h-full overflow-y-auto">
                                                                {presentationData?.calendario_hitos?.map((hito: any, i: number) => (
                                                                    <div key={i} className={`relative z-10 flex items-center p-3 hover:bg-gray-50 transition-colors ${i % 2 !== 0 ? 'bg-medical-50/30' : ''}`}>
                                                                        <div className="w-14 text-center flex-shrink-0">
                                                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{hito.dia_semana}</div>
                                                                            <div className="text-lg font-bold text-medical-700 leading-none">{hito.dia_numero}</div>
                                                                        </div>
                                                                        <div className="flex-1 pl-4 border-l border-transparent">
                                                                            <div className="flex justify-between items-start">
                                                                                <div className="font-bold text-gray-800 text-xs">{hito.titulo}</div>
                                                                            </div>
                                                                            <div className="text-[10px] text-gray-500 mt-0.5">{hito.descripcion}</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </main>
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
