import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Grow Labs - Sistema Operativo Inteligente',
    description: 'Automatización + Inteligencia Artificial + Gestión del Conocimiento para empresas. Potencia tus operaciones con Grow Labs.',
    icons: {
        icon: '/logogrow.png',
        apple: '/logogrow.png',
    },
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
