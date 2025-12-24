'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="font-sans text-white selection:bg-green-500 selection:text-black">

            {/* HEADER / NAVIGATION */}
            <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-black/50 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative overflow-hidden rounded-lg border border-white/10">
                            <Image src="/logogrow.png" alt="Grow Labs Logo" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">GROW LABS</span>
                    </div>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                        <Link href="#services" className="hover:text-grow transition-colors">Servicios</Link>
                        <Link href="#data" className="hover:text-grow transition-colors">Data Analytics</Link>
                        <Link href="#cv-maker" className="hover:text-grow transition-colors">CV Maker</Link>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/cv-maker" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all group">
                            <span>Herramientas Gratuitas</span>
                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform text-grow"></i>
                        </Link>
                        <a href="https://instagram.com/growsanjuan" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 hover:scale-105 transition-transform">
                            <i className="fab fa-instagram text-white text-lg"></i>
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest animate-fade-in-up">
                        Technology & Innovation
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                        Transformamos el Futuro <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">de tu Empresa.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Grow Labs es una startup tecnológica dedicada a crear soluciones digitales de alto impacto. Desde analítica de datos hasta desarrollo a medida.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <a href="https://api.whatsapp.com/send/?phone=5492645043642" className="px-8 py-4 bg-grow hover:bg-green-400 text-black font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center gap-2 w-full md:w-auto justify-center">
                            <span>Agendar Consultoría</span>
                            <i className="fas fa-calendar-check"></i>
                        </a>
                        <Link href="/cv-maker" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 w-full md:w-auto justify-center backdrop-blur-sm">
                            <span>Ir al CV Maker</span>
                            <i className="fas fa-external-link-alt text-gray-400"></i>
                        </Link>
                    </div>
                </div>

                {/* Decoración de fondo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-grow/10 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none"></div>
            </section>

            {/* SERVICES VISUAL SECTION (DATA ANALYTICS) */}
            <section id="data" className="py-20 bg-black/40 border-y border-white/5 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">

                        {/* Texto Servicio */}
                        <div className="w-full md:w-1/2 text-left">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                El Poder de los <span className="text-grow neon-text">Datos</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                No tomes decisiones a ciegas. En Grow Labs implementamos sistemas de Business Intelligence que transforman números en estrategias ganadoras.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {['Optimización de Procesos', 'Predicción de Ventas', 'Dashboards en Tiempo Real'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-2 h-2 bg-grow rounded-full shadow-[0_0_10px_#00ff88]"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a href="#" className="text-grow font-bold hover:underline decoration-green-500/30 underline-offset-8">Ver casos de éxito &rarr;</a>
                        </div>

                        {/* SVG Line Chart */}
                        <div className="w-full md:w-1/2">
                            <div className="glass-card p-8 rounded-2xl relative group overflow-hidden">
                                <div className="flex justify-between items-end mb-8 relative z-10">
                                    <div>
                                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Crecimiento Promedio</p>
                                        <h3 className="text-4xl font-bold text-white">+145%</h3>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2 h-2 rounded-full bg-grow animate-pulse shadow-[0_0_8px_#00ff88]"></div>
                                        <span className="text-xs text-grow font-bold tracking-widest">LIVE</span>
                                    </div>
                                </div>

                                {/* SVG Line Chart */}
                                <div className="relative h-48 w-full">
                                    <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                                        {/* Definición del Gradiente */}
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
                                            </linearGradient>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Área bajo la curva (Relleno) */}
                                        <path
                                            d="M0,150 C50,140 80,100 120,110 C160,120 200,60 250,70 C300,80 350,20 400,30 V200 H0 Z"
                                            fill="url(#chartGradient)"
                                            className="opacity-50"
                                        />

                                        {/* Línea del gráfico (Trazo) - Animada */}
                                        <path
                                            d="M0,150 C50,140 80,100 120,110 C160,120 200,60 250,70 C300,80 350,20 400,30"
                                            fill="none"
                                            stroke="#00ff88"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            filter="url(#glow)"
                                            className="drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                                        >
                                            <animate
                                                attributeName="stroke-dasharray"
                                                from="0, 1000"
                                                to="1000, 0"
                                                dur="2.5s"
                                                fill="freeze"
                                                calcMode="spline"
                                                keyTimes="0;1"
                                                keySplines="0.4 0 0.2 1"
                                            />
                                        </path>

                                        {/* Puntos Interactivos (Simulados) */}
                                        {[
                                            { x: 120, y: 110 }, { x: 250, y: 70 }, { x: 400, y: 30 }
                                        ].map((point, i) => (
                                            <circle
                                                key={i}
                                                cx={point.x}
                                                cy={point.y}
                                                r="4"
                                                fill="#000"
                                                stroke="#00ff88"
                                                strokeWidth="2"
                                                className="transition-all duration-300 hover:r-6 cursor-pointer"
                                            />
                                        ))}

                                    </svg>
                                </div>

                                <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono relative z-10 border-t border-white/5 pt-4">
                                    <span>ENE</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* CV MAKER PROMO SECTION */}
            <section id="cv-maker" className="py-24 px-6 relative">
                <div className="container mx-auto max-w-6xl">
                    <div className="glass-card rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden border-grow/20">

                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-900/20 z-0"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">

                            <div className="w-full md:w-1/2">
                                <span className="inline-block py-1 px-3 rounded-lg bg-white/10 text-white text-xs font-bold mb-4 border border-white/20">
                                    🎁 HERRAMIENTA GRATUITA
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Tu Carrera Merece un <br />
                                    <span className="text-grow">Upgrade Profesional</span>
                                </h2>
                                <p className="text-gray-400 mb-8 text-lg">
                                    Hemos creado el editor de CV más avanzado y gratuito del mercado. Sin marcas de agua molestas, sin costos ocultos. Solo te pedimos que nos sigas.
                                </p>

                                {/* Insight Stat */}
                                <div className="mb-10 p-6 rounded-xl bg-black/40 border border-white/5 flex items-start gap-4">
                                    <div className="bg-green-500/20 p-3 rounded-lg text-grow">
                                        <i className="fas fa-chart-line text-2xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Sabías que...</h4>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Un CV con diseño profesional aumenta un <span className="text-white font-bold">70%</span> las probabilidades de conseguir una entrevista en los primeros 5 segundos de lectura.
                                        </p>
                                    </div>
                                </div>

                                <Link href="/cv-maker" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                                    <span>Crear mi CV Gratis</span>
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            {/* Visual CV Preview / Social Card */}
                            <div className="w-full md:w-1/2 relative flex justify-center">
                                <div className="relative z-10 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl p-6 w-full max-w-sm rotate-3 hover:rotate-0 transition-transform duration-500">

                                    {/* Header: Profile */}
                                    <div className="flex items-center gap-4 mb-4 border-b border-gray-800 pb-4">
                                        <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600">
                                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-900 relative">
                                                <Image src="/lucas.jpeg" alt="Lucas Marinero" fill className="object-cover" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg leading-tight">Lucas Marinero</h4>
                                            <p className="text-gray-400 text-sm">@lucasmmarinero1</p>
                                        </div>
                                        <i className="fab fa-instagram text-2xl text-white ml-auto opacity-50"></i>
                                    </div>

                                    {/* Post Content */}
                                    <div className="space-y-3">
                                        <p className="text-gray-200 text-base leading-relaxed">
                                            "Asegúrate de destacar entre todos los candidatos usando <span className="text-grow font-bold">tecnología de punta</span>. Tu futuro profesional comienza aquí." 🚀👨‍💻
                                        </p>
                                        <div className="text-xs text-gray-500 font-medium">Hace 2 horas • <span className="text-blue-400">#GrowLabs #TechCareer</span></div>
                                    </div>

                                    {/* Success Badge */}
                                    <div className="absolute -top-6 -right-6 bg-grow text-black font-bold px-6 py-3 rounded-xl shadow-[0_10px_20px_rgba(0,255,136,0.3)] animate-bounce flex items-center gap-2">
                                        <i className="fas fa-check-circle text-xl"></i>
                                        <span>Contratado</span>
                                    </div>
                                </div>

                                {/* Decorative elements behind */}
                                <div className="absolute inset-0 bg-grow/20 blur-[80px] -z-10 rounded-full opacity-60"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-black pt-16 pb-8">
                <div className="container mx-auto px-6 text-center">
                    <Image src="/logogrow.png" alt="Grow Labs" width={60} height={60} className="mx-auto mb-6 opacity-80" />
                    <h3 className="text-2xl font-bold mb-8">Grow Labs</h3>

                    <div className="flex justify-center gap-8 mb-12">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Inicio</a>
                        <a href="#services" className="text-gray-500 hover:text-white transition-colors">Servicios</a>
                        <a href="/cv-maker" className="text-gray-500 hover:text-white transition-colors">Herramientas</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Contacto</a>
                    </div>

                    <div className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Grow Labs Technology. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* External CSS for Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
