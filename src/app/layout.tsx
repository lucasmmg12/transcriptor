import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/experience/SmoothScroll'

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Grow Labs | Software empresarial a medida',
    description: 'Diseñamos software empresarial a medida para ordenar procesos, centralizar información, automatizar tareas y mejorar el control operativo.',
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
            <body className={inter.className}>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
            </body>
        </html>
    )
}

