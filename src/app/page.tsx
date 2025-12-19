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
        const MAX_SIZE_MB = 10
        const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
        const fileSizeMB = file.size / (1024 * 1024)

        if (file.size > MAX_SIZE_BYTES) {
            setError(`El archivo es demasiado grande (${fileSizeMB.toFixed(2)}MB). El límite es ${MAX_SIZE_MB}MB (~10 minutos de audio) debido a restricciones de tiempo de Vercel. Para archivos más grandes, contacta con Grow Labs.`)
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
                        <form onSubmit={handleSubmit} className="space-y-8">
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
                                                    MP3, WAV, M4A, OPUS, OGG, FLAC, WebM (máx. 10MB / ~10 min)
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
