import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Grow Labs Transcriptor - Transcripción y Análisis de Audio con IA',
    description: 'Herramienta profesional de Grow Labs para transcribir y analizar archivos de audio con Inteligencia Artificial. Potenciado por OpenAI Whisper y GPT-4.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
