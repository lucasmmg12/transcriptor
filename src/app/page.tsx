'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
    // Estado para FAQ y ROI Calculator (simple visual toggle)
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-sans text-white selection:bg-green-500 selection:text-black scroll-smooth">

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
                        <Link href="#solutions" className="hover:text-grow transition-colors">Soluciones</Link>
                        <Link href="#roi" className="hover:text-grow transition-colors">ROI</Link>
                        <Link href="#cv-maker" className="hover:text-grow transition-colors">Herramientas</Link>
                        <Link href="#faq" className="hover:text-grow transition-colors">FAQ</Link>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/cv-maker" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all group">
                            <span>CV Maker Gratis</span>
                            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform text-grow"></i>
                        </Link>
                        <a href="https://wa.me/5492645438114" target="_blank" className="flex items-center justify-center w-10 h-10 rounded-full bg-grow hover:scale-105 transition-transform text-black">
                            <i className="fab fa-whatsapp text-xl"></i>
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest animate-fade-in-up">
                        Business Intelligence & AI
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
                        El Sistema Operativo <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Inteligente para tu Empresa.</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Automatización + Inteligencia Artificial + Gestión del Conocimiento. Elimina la fricción operativa y maximiza tus ingresos con tecnología de clase mundial.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="px-8 py-4 bg-grow hover:bg-green-400 text-black font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] flex items-center gap-2 w-full md:w-auto justify-center">
                            <span>Agendar Diagnóstico Gratuito</span>
                            <i className="fas fa-calendar-check"></i>
                        </a>
                        <Link href="#solutions" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 w-full md:w-auto justify-center backdrop-blur-sm">
                            <span>Ver Soluciones</span>
                            <i className="fas fa-arrow-down text-gray-400"></i>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                        {[
                            { label: "Reducción de Errores", value: "85%" },
                            { label: "Más Rápido", value: "10x" },
                            { label: "Disponibilidad", value: "24/7" },
                            { label: "Crecimiento", value: "+245%" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decoración de fondo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-grow/10 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none"></div>
            </section>

            {/* MISION / VISION SECTION */}
            <section className="py-20 bg-black border-y border-white/5">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-sm font-bold text-grow uppercase tracking-widest mb-4">Quiénes Somos</h2>
                    <h3 className="text-3xl md:text-4xl font-bold mb-8">Expertos en Tecnología para la Realidad Empresarial de LATAM</h3>
                    <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                        Grow Labs nace de la experiencia directa en la complejidad operativa de las empresas en Latinoamérica. Entendemos profundamente los desafíos de burocracia, ineficiencia y falta de datos claros. Nuestra misión es transformar esa fricción en eficiencia mediante tecnología de punta.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 bg-grow/20 rounded-lg flex items-center justify-center mb-4 text-grow"><i className="fas fa-rocket"></i></div>
                            <h4 className="font-bold text-white mb-2">Misión</h4>
                            <p className="text-sm text-gray-400">Eliminar la fricción operativa para que los equipos se enfoquen en lo que realmente importa: el crecimiento.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400"><i className="fas fa-brain"></i></div>
                            <h4 className="font-bold text-white mb-2">Visión</h4>
                            <p className="text-sm text-gray-400">Ser el cerebro digital que impulsa las operaciones de empresas líderes en toda Latinoamérica.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400"><i className="fas fa-gem"></i></div>
                            <h4 className="font-bold text-white mb-2">Valores</h4>
                            <p className="text-sm text-gray-400">Precisión Operativa • Adaptación Local • Innovación Transparente</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUCIONES (GRID) */}
            <section id="solutions" className="py-24 px-6 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Tecnología que <span className="text-grow">Transforma Operaciones</span></h2>
                        <p className="text-gray-400">Soluciones modulares diseñadas para escalar con tu negocio.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: Automatizacion */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-green-500/10 rounded-xl text-grow text-2xl"><i className="fas fa-cogs"></i></div>
                                <a href="https://wa.me/5492645438114" target="_blank" className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Ver Detalle &rarr;</a>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Módulos de Automatización</h3>
                            <p className="text-gray-400 mb-6">Elimina tareas repetitivas y propensas a errores. Automatizamos procesos administrativos complejos para liberar a tu equipo.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex gap-2"><i className="fas fa-check text-grow"></i> Reducción del 90% en tiempo de gestión</li>
                                <li className="flex gap-2"><i className="fas fa-check text-grow"></i> Eliminación de errores humanos</li>
                                <li className="flex gap-2"><i className="fas fa-check text-grow"></i> Integración con tus sistemas actuales</li>
                            </ul>
                        </div>

                        {/* Card 2: RAG Institucional */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 text-2xl"><i className="fas fa-database"></i></div>
                                <a href="https://wa.me/5492645438114" target="_blank" className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Ver Detalle &rarr;</a>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">RAG Institucional (IA)</h3>
                            <p className="text-gray-400 mb-6">Tu base de conocimiento institucional potenciada por IA. Convierte manuales y procesos en respuestas instantáneas.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex gap-2"><i className="fas fa-check text-blue-400"></i> Búsqueda en toda tu documentación</li>
                                <li className="flex gap-2"><i className="fas fa-check text-blue-400"></i> Respuestas contextualizadas y citadas</li>
                                <li className="flex gap-2"><i className="fas fa-check text-blue-400"></i> Onboarding de empleados acelerado</li>
                            </ul>
                        </div>

                        {/* Card 3: Aplicaciones Digitales */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 text-2xl"><i className="fas fa-mobile-alt"></i></div>
                                <a href="https://wa.me/5492645438114" target="_blank" className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Ver Detalle &rarr;</a>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Aplicaciones Digitales</h3>
                            <p className="text-gray-400 mb-6">Suite completa de aplicaciones para conectar clientes, colaboradores y administración.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex gap-2"><i className="fas fa-check text-purple-400"></i> <strong className="text-white">Portal de Clientes:</strong> Autogestión y fidelización.</li>
                                <li className="flex gap-2"><i className="fas fa-check text-purple-400"></i> <strong className="text-white">Gestor de Proyectos:</strong> Trazabilidad total.</li>
                                <li className="flex gap-2"><i className="fas fa-check text-purple-400"></i> <strong className="text-white">Asistente de Reuniones:</strong> Transcripción y minutas con IA.</li>
                            </ul>
                        </div>

                        {/* Card 4: Chatbot IA */}
                        <div className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 text-2xl"><i className="fas fa-comments"></i></div>
                                <a href="https://wa.me/5492645438114" target="_blank" className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Ver Detalle &rarr;</a>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Chatbot WhatsApp IA</h3>
                            <p className="text-gray-400 mb-6">Atiende a tus clientes 24/7 con inteligencia real, no menús frustrantes. Vende, agenda y resuelve dudas.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex gap-2"><i className="fas fa-check text-yellow-400"></i> Atención personalizada 24/7</li>
                                <li className="flex gap-2"><i className="fas fa-check text-yellow-400"></i> Sin árboles de decisión rígidos</li>
                                <li className="flex gap-2"><i className="fas fa-check text-yellow-400"></i> Gestión de turnos y ventas</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEMAS / COMPARACION */}
            <section className="py-20 bg-black/40 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col md:flex-row gap-16">
                        {/* Problemas */}
                        <div className="w-full md:w-1/2">
                            <h3 className="text-3xl font-bold mb-8">¿Tu empresa está perdiendo dinero sin saberlo?</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 text-xl"><i className="fas fa-times"></i></div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Oportunidades Perdidas</h4>
                                        <p className="text-gray-400 text-sm">El 15-30% de los leads se pierden por falta de seguimiento o respuesta lenta.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 text-xl"><i className="fas fa-chart-down"></i></div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Ineficiencias Operativas</h4>
                                        <p className="text-gray-400 text-sm">Tu equipo dedica horas a tareas repetitivas en lugar de estrategia.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0 text-xl"><i className="fas fa-user-clock"></i></div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Clientes Frustrados</h4>
                                        <p className="text-gray-400 text-sm">Tiempos de espera largos generan mala experiencia y churn.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comparacion */}
                        <div className="w-full md:w-1/2 bg-gray-900/50 rounded-2xl p-8 border border-white/5">
                            <h3 className="text-xl font-bold mb-6 text-center">Por qué Grow Labs es diferente</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-sm font-bold text-gray-500 border-b border-white/10 pb-2">
                                    <span></span>
                                    <span className="text-grow text-center">Grow Labs</span>
                                    <span className="text-center">Tradicional</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                    <span className="text-gray-300">Implementación</span>
                                    <span className="text-center font-bold text-white bg-green-900/20 py-1 rounded">30 días</span>
                                    <span className="text-center text-gray-500">6-12 meses</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                    <span className="text-gray-300">Tecnología</span>
                                    <span className="text-center font-bold text-white bg-green-900/20 py-1 rounded">IA Gen.</span>
                                    <span className="text-center text-gray-500">Software Legacy</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                    <span className="text-gray-300">Soporte</span>
                                    <span className="text-center font-bold text-white bg-green-900/20 py-1 rounded">24/7 VIP</span>
                                    <span className="text-center text-gray-500">Tickets Lentos</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm items-center">
                                    <span className="text-gray-300">ROI</span>
                                    <span className="text-center font-bold text-white bg-green-900/20 py-1 rounded">Mes 1</span>
                                    <span className="text-center text-gray-500">Incerto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI, DATA & TECH SECTION (La que ya teniamos, readaptada) */}
            <section id="data" className="py-20 bg-black backdrop-blur-sm relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">

                        {/* Texto BI */}
                        <div className="w-full md:w-1/2 text-left">
                            <span className="text-grow font-bold tracking-widest text-xs uppercase mb-2 block">Inteligencia de Negocios</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                El Poder de los <span className="text-grow neon-text">Datos</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                No tomes decisiones a ciegas. Transformamos tus datos dispersos en tableros de control ejecutivos para predicción de ventas y detección de ineficiencias.
                            </p>
                            <a href="https://wa.me/5492645438114" target="_blank" className="text-grow font-bold hover:underline decoration-green-500/30 underline-offset-8">Hablar con un experto &rarr;</a>
                        </div>

                        {/* SVG Line Chart (Manteniendo el componente visual que creamos) */}
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

            {/* ROI SECTION SIMPLE */}
            <section id="roi" className="py-20 bg-grow text-black">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">Resultados Garantizados</h2>
                    <p className="text-xl font-medium max-w-2xl mx-auto mb-12 opacity-80">
                        Si no ves resultados medibles en los primeros 90 días, te devolvemos el 100% de tu inversión. Sin preguntas.
                    </p>
                    <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="inline-block px-10 py-5 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform shadow-2xl">
                        Agendar Auditoría Gratuita
                    </a>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="py-20 px-6 bg-black">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: "¿Cuánto tiempo toma la implementación?", a: "La implementación completa toma entre 15-30 días dependiendo del tamaño de tu empresa. Comenzarás a ver resultados desde la primera semana." },
                            { q: "¿Es compatible con mi software actual?", a: "Sí, Grow Labs se integra perfectamente con CRMs, ERPs y sistemas legacy a través de APIs o RPA. No necesitas cambiar tu infraestructura." },
                            { q: "¿Cómo garantizan la seguridad de los datos?", a: "Utilizamos encriptación de nivel bancario y cumplimos con normativas internacionales de protección de datos." },
                            { q: "¿Qué pasa si no funciona para mi industria?", a: "Ofrecemos una garantía de 90 días. Si no ves resultados, te devolvemos el 100% de la inversión." }
                        ].map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-xl overflow-hidden cursor-pointer bg-white/5" onClick={() => toggleFaq(i)}>
                                <div className="p-6 flex justify-between items-center text-lg font-bold">
                                    {faq.q}
                                    <i className={`fas fa-chevron-down transition-transform ${openFaq === i ? 'rotate-180' : ''}`}></i>
                                </div>
                                {openFaq === i && (
                                    <div className="px-6 pb-6 text-gray-400 border-t border-white/5 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CV MAKER PROMO SECTION (LEAD MAGNET) */}
            <section id="cv-maker" className="py-24 px-6 relative border-t border-white/10">
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
                                    Potencia tu <br />
                                    <span className="text-grow">Marca Personal</span>
                                </h2>
                                <p className="text-gray-400 mb-8 text-lg">
                                    Grow Labs no solo potencia empresas, también talentos. Usa nuestro editor de CV premium totalmente gratis.
                                </p>

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
                                            "La tecnología es el gran diferenciador. Con <span className="text-grow font-bold">Grow Labs</span>, llevo mi carrera y mi empresa al siguiente nivel." 🚀
                                        </p>
                                        <div className="text-xs text-gray-500 font-medium">Hace 2 horas • <span className="text-blue-400">#Innovation #Tech</span></div>
                                    </div>

                                    {/* Success Badge */}
                                    <div className="absolute -top-6 -right-6 bg-grow text-black font-bold px-6 py-3 rounded-xl shadow-[0_10px_20px_rgba(0,255,136,0.3)] animate-bounce flex items-center gap-2">
                                        <i className="fas fa-check-circle text-xl"></i>
                                        <span>Líder</span>
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

                    <div className="flex justify-center gap-8 mb-12 flex-wrap">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Inicio</a>
                        <a href="#solutions" className="text-gray-500 hover:text-white transition-colors">Soluciones</a>
                        <a href="#cv-maker" className="text-gray-500 hover:text-white transition-colors">CV Maker</a>
                        <a href="https://wa.me/5492645438114" target="_blank" className="text-gray-500 hover:text-white transition-colors">Contacto</a>
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
