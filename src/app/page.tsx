'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const VERBOS_HERO = ["escala", "potencia", "automatiza", "transforma", "revoluciona"];
const CHARS = "<>-_\\/[]{}—=+*^?#01";

const ScrambleText = ({ text }: { text: string }) => {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        let iteration = 0;
        
        const interval = setInterval(() => {
            setDisplayText((_) => 
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < Math.floor(iteration)) return text[index];
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; 
        }, 35);

        return () => clearInterval(interval);
    }, [text]);

    return <>{displayText}</>;
};

const SOLUTIONS = [
    {
        id: 'crm',
        title: "CRM a Medida",
        description: "El caballito de batalla. Desarrollamos sistemas de gestión de clientes (CRM) 100% adaptados a tu flujo de ventas, sin licencias costosas ni funciones que no necesitas."
    },
    {
        id: 'sistemas',
        title: "Sistemas a Medida",
        description: "Si tu empresa tiene una operación única, construimos el software exacto para resolverla. Desde portales operativos internos hasta plataformas corporativas."
    },
    {
        id: 'ecommerce',
        title: "E-Commerce Personalizado",
        description: "Tiendas online de alto rendimiento. Optimizadas para velocidad, conversiones y con pasarelas de pago integradas exactamente para las necesidades de tu negocio."
    },
    {
        id: 'automations',
        title: "Automatización con IA",
        description: "Eliminamos el trabajo manual repetitivo. Conectamos tus plataformas para que los datos viajen solos y ahorres cientos de horas operativas al mes."
    },
    {
        id: 'chatbot',
        title: "Agentes IA en WhatsApp",
        description: "Tu negocio atiende 24/7. Creamos asistentes de Inteligencia Artificial que entienden texto y audio, vendiendo y respondiendo directo en WhatsApp."
    },
    {
        id: 'web-design',
        title: "Desarrollo Web Elite",
        description: "Tu carta de presentación en internet. Diseñamos con estética premium, velocidad extrema (Next.js) y principios que convierten visitantes en clientes confiados."
    }
];

const INTEGRATIONS = [
    { name: 'Chatwoot', icon: 'fas fa-comment-dots', color: 'text-blue-500' },
    { name: 'Meta Tech Provider', icon: 'fab fa-meta', color: 'text-blue-600' },
    { name: 'Make', icon: 'fas fa-project-diagram', color: 'text-purple-600' },
    { name: 'Telegram', icon: 'fab fa-telegram', color: 'text-blue-400' },
    { name: 'OpenAI', icon: 'fas fa-robot', color: 'text-gray-800' },
    { name: 'VAPI', icon: 'fas fa-microphone', color: 'text-gray-800' },
    { name: 'Claude', icon: 'fas fa-brain', color: 'text-orange-800' },
    { name: 'n8n', icon: 'fas fa-code-branch', color: 'text-red-500' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'text-green-500' },
    { name: 'Grok', icon: 'fas fa-bolt', color: 'text-gray-800' },
    { name: 'Zapier', icon: 'fas fa-bolt', color: 'text-orange-500' },
    { name: 'Gemini', icon: 'fas fa-sparkles', color: 'text-blue-500' },
    { name: 'Calendar', icon: 'far fa-calendar-alt', color: 'text-blue-500' },
    { name: 'HighLevel', icon: 'fas fa-arrow-up', color: 'text-blue-800' },
];

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((current) => (current + 1) % VERBOS_HERO.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-sans text-gray-900 bg-white selection:bg-green-100 scroll-smooth overflow-x-hidden">
            
            {/* Elemento de Fondo de Cuadrícula */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            {/* HEADER / NAVIGATION */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 relative z-50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                            <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900">Grow Labs</span>
                    </div>

                    <div className="hidden lg:flex gap-8 text-sm font-medium text-gray-600">
                        <Link href="#solutions" className="hover:text-green-600 transition-colors">Funcionalidades</Link>
                        <Link href="#why" className="hover:text-green-600 transition-colors">Ventajas</Link>
                        <Link href="#tools" className="hover:text-green-600 transition-colors">Herramientas</Link>
                        <Link href="#faq" className="hover:text-green-600 transition-colors">FAQ</Link>
                    </div>

                    <div className="flex gap-3 items-center relative z-50">
                        <Link href="/cv-maker" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                            CV Maker
                        </Link>
                        <Link href="/tools/transcriptor" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors mr-2">
                            Transcriptor
                        </Link>
                        <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-primary px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm">
                            <span className="hidden sm:inline">Agendar Demo</span>
                            <span className="sm:hidden">Agendar</span>
                        </a>
                        <a href="https://wa.me/5492645438114" target="_blank" className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors lg:hidden">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <main className="relative z-10 w-full pt-20">
                <section className="pt-16 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 relative text-center">
                    <div className="container mx-auto max-w-4xl">
                        <div className="inline-block px-4 py-1.5 mb-6 md:mb-8 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-semibold uppercase tracking-widest shadow-sm">
                            Business Intelligence & IA Empresarial
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                            El sistema operativo que <br className="hidden lg:block" />
                            <span className="text-green-600 inline-block min-w-[250px] sm:min-w-[300px] md:min-w-[420px]">
                                <ScrambleText text={VERBOS_HERO[wordIndex]} />
                            </span> tu negocio
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 md:mb-10 max-w-3xl mx-auto px-2 leading-relaxed">
                            <strong>Ingeniería de software Full-Stack.</strong> Desarrollamos programas empresariales a medida, automatizamos tareas repetitivas y atendemos a tus clientes 24/7 integrando IA nativa en tus procesos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                            <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-primary w-full sm:w-auto px-8 py-4 text-center">
                                Diagnóstico Gratuito
                            </a>
                            <a href="https://wa.me/5492645438114" target="_blank" className="btn-secondary w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 border border-gray-200 shadow-sm bg-white hover:bg-gray-50 text-gray-900">
                                <i className="fab fa-whatsapp text-green-500 text-lg"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* INTEGRATIONS MARQUEE */}
                <section className="py-8 md:py-10 border-y border-gray-200 bg-white overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
                    
                    <div className="text-center text-xs md:text-sm font-semibold text-gray-400 mb-6 md:mb-8 uppercase tracking-widest px-4">
                        Herramientas de automatización que usamos
                    </div>

                    <div className="marquee-container">
                        <div className="marquee-content flex gap-8 md:gap-12 px-4 md:px-6">
                            {[...INTEGRATIONS, ...INTEGRATIONS].map((tool, idx) => (
                                <div key={idx} className="flex items-center gap-2 md:gap-3 text-gray-700 whitespace-nowrap min-w-max">
                                    <i className={`${tool.icon} text-xl md:text-2xl ${tool.color}`}></i>
                                    <span className="font-semibold text-sm md:text-base">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="py-12 md:py-16 bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                            {[
                                { label: "Reducción de Errores", value: "85%" },
                                { label: "Más Rápido", value: "10x" },
                                { label: "Disponibilidad", value: "24/7" },
                                { label: "Crecimiento", value: "+245%" }
                            ].map((stat, i) => (
                                <div key={i} className="py-2">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                    <p className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MISION / VISION SECTION (Restored & Light Theme adapted) */}
                <section className="py-20 bg-white border-b border-gray-200">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">Quiénes Somos</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Expertos en Tecnología para la Realidad Empresarial de LATAM</h3>
                        <p className="text-gray-600 text-lg mb-12 leading-relaxed">
                            Grow Labs nace de la experiencia directa en la complejidad operativa de las empresas. Entendemos profundamente los desafíos de burocracia, ineficiencia y falta de datos claros. Nuestra misión es transformar esa fricción en eficiencia mediante tecnología de punta adaptada a tus necesidades.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600"><i className="fas fa-rocket"></i></div>
                                <h4 className="font-bold text-gray-900 mb-2">Misión</h4>
                                <p className="text-sm text-gray-600">Eliminar la fricción operativa para que los equipos se enfoquen en lo que realmente importa: el crecimiento.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600"><i className="fas fa-brain"></i></div>
                                <h4 className="font-bold text-gray-900 mb-2">Visión</h4>
                                <p className="text-sm text-gray-600">Ser el cerebro digital que impulsa las operaciones ágiles de las empresas modernas líderes en LATAM.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4 text-green-600"><i className="fas fa-gem"></i></div>
                                <h4 className="font-bold text-gray-900 mb-2">Valores</h4>
                                <p className="text-sm text-gray-600">Precisión Operativa • Adaptación Local • Innovación Transparente y Escalabilidad garantizada.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCTS/SOLUTIONS SECTION */}
                <section id="solutions" className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 relative border-b border-gray-200">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-10 md:mb-16 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Servicios y <span className="text-green-600">Soluciones</span></h2>
                            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">Soluciones modulares diseñadas específicamente para optimizar procesos y ventas de tu negocio local.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {SOLUTIONS.map((s, idx) => (
                                <a 
                                    key={s.id} 
                                    href={`https://wa.me/5492645438114?text=${encodeURIComponent(`Hola, estaba viendo su sitio web y me interesa saber más sobre el servicio de ${s.title}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col hover:shadow-xl hover:border-green-400 transition-all cursor-pointer group hover:-translate-y-1 block"
                                >
                                    <span className="text-green-600 font-bold text-sm mb-4 bg-green-50 border border-green-100 w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-green-100 transition-colors">
                                        {idx + 1}
                                    </span>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{s.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">{s.description}</p>
                                    
                                    <div className="mt-auto flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-wider group-hover:text-green-700 transition-colors">
                                        Consultar  <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PROBLEMAS / COMPARACION (Restored & Light Theme adapted) */}
                <section className="py-20 bg-white border-b border-gray-200">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="flex flex-col md:flex-row gap-16">
                            {/* Problemas */}
                            <div className="w-full md:w-1/2">
                                <h3 className="text-3xl font-bold mb-8 text-gray-900">¿Tu empresa está perdiendo dinero sin saberlo?</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 text-xl border border-red-100"><i className="fas fa-times"></i></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Oportunidades Perdidas</h4>
                                            <p className="text-gray-600 text-sm">El 15-30% de los leads se pierden por falta de seguimiento o respuesta rápida.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 text-xl border border-red-100"><i className="fas fa-chart-down"></i></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Ineficiencias Operativas</h4>
                                            <p className="text-gray-600 text-sm">Tu equipo dedica horas a tareas manuales en lugar de a estrategias y ventas.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 text-xl border border-red-100"><i className="fas fa-user-clock"></i></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Clientes Frustrados</h4>
                                            <p className="text-gray-600 text-sm">Tiempos de respuesta inconsistentes generan mala experiencia empresarial.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparacion */}
                            <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold mb-6 text-center text-gray-900">Por qué Grow Labs es diferente</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 text-sm font-bold text-gray-500 border-b border-gray-200 pb-3">
                                        <span></span>
                                        <span className="text-green-600 text-center">Grow Labs</span>
                                        <span className="text-center">Tradicional</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm items-center py-1">
                                        <span className="text-gray-700 font-medium">Implementación</span>
                                        <span className="text-center font-bold text-green-700 bg-green-100 py-1.5 rounded-lg border border-green-200">Días/Semanas</span>
                                        <span className="text-center text-gray-500">6-12 meses</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm items-center py-1">
                                        <span className="text-gray-700 font-medium">Tecnología</span>
                                        <span className="text-center font-bold text-green-700 bg-green-100 py-1.5 rounded-lg border border-green-200">IA Inteligente</span>
                                        <span className="text-center text-gray-500">Software Rígido</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm items-center py-1">
                                        <span className="text-gray-700 font-medium">Soporte</span>
                                        <span className="text-center font-bold text-green-700 bg-green-100 py-1.5 rounded-lg border border-green-200">24/7 Asesoría</span>
                                        <span className="text-center text-gray-500">Tickets Lentos</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm items-center py-1">
                                        <span className="text-gray-700 font-medium">ROI (Retorno)</span>
                                        <span className="text-center font-bold text-green-700 bg-green-100 py-1.5 rounded-lg border border-green-200">Inmediato</span>
                                        <span className="text-center text-gray-500">Incierto</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROI, DATA & TECH SECTION (Restored moving SVG & Light Theme adapted) */}
                <section id="data" className="py-20 bg-gray-900 border-b border-gray-800 text-white relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                            {/* Texto BI */}
                            <div className="w-full md:w-1/2 text-left">
                                <span className="text-green-400 font-bold tracking-widest text-xs uppercase mb-2 block">Business Intelligence</span>
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                    El Poder de los <span className="text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">Datos</span>
                                </h2>
                                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                    No tomes decisiones ciegamente. Organizamos tus datos dispersos y los convertimos en un panel corporativo para predicciones precisas y métricas absolutas.
                                </p>
                                <a href="https://wa.me/5492645438114" target="_blank" className="text-green-400 font-bold hover:text-green-300 hover:underline decoration-green-400/50 underline-offset-8 transition-all">
                                    Solicitar una evaluación &rarr;
                                </a>
                            </div>

                            {/* SVG Line Chart */}
                            <div className="w-full md:w-1/2">
                                <div className="bg-black/50 p-8 rounded-3xl border border-gray-700 relative group overflow-hidden shadow-2xl backdrop-blur-sm">
                                    <div className="flex justify-between items-end mb-8 relative z-10">
                                        <div>
                                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Crecimiento Eficiencia</p>
                                            <h3 className="text-4xl font-bold text-white">+145%</h3>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                            <span className="text-xs text-green-500 font-bold tracking-widest">LIVE</span>
                                        </div>
                                    </div>

                                    {/* SVG Line Chart */}
                                    <div className="relative h-48 w-full">
                                        <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                                </linearGradient>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>

                                            <path
                                                d="M0,150 C50,140 80,100 120,110 C160,120 200,60 250,70 C300,80 350,20 400,30 V200 H0 Z"
                                                fill="url(#chartGradient)"
                                                className="opacity-70"
                                            />

                                            <path
                                                d="M0,150 C50,140 80,100 120,110 C160,120 200,60 250,70 C300,80 350,20 400,30"
                                                fill="none"
                                                stroke="#22c55e"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                filter="url(#glow)"
                                            >
                                                <animate
                                                    attributeName="stroke-dasharray"
                                                    from="0, 1000"
                                                    to="1000, 0"
                                                    dur="3s"
                                                    fill="freeze"
                                                    calcMode="spline"
                                                    keyTimes="0;1"
                                                    keySplines="0.4 0 0.2 1"
                                                />
                                            </path>

                                            {[
                                                { x: 120, y: 110 }, { x: 250, y: 70 }, { x: 400, y: 30 }
                                            ].map((point, i) => (
                                                <circle
                                                    key={i}
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="5"
                                                    fill="#000"
                                                    stroke="#22c55e"
                                                    strokeWidth="3"
                                                    className="transition-all duration-300 cursor-pointer"
                                                />
                                            ))}
                                        </svg>
                                    </div>

                                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono relative z-10 border-t border-gray-800 pt-5">
                                        <span>ENE</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROI SECTION SIMPLE (Restored) */}
                <section className="py-20 bg-green-500 text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-sm">Garantía Asegurada</h2>
                        <p className="text-xl font-medium max-w-2xl mx-auto mb-10 text-green-50">
                            Nuestros desarrollos no son gastos, son inversiones que recuperan dinero desde el primer trimestre.
                        </p>
                        <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="inline-block px-8 py-4 bg-gray-900 border border-gray-800 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
                            Agendar Auditoría Gratuita
                        </a>
                    </div>
                </section>


                {/* HERRAMIENTAS GRATUITAS (TOOLKIT) */}
                <section id="tools" className="py-16 md:py-24 px-4 md:px-6 bg-white border-b border-gray-200 overflow-hidden">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
                            {/* Texto y Título */}
                            <div className="md:w-1/2 text-center md:text-left">
                                <span className="inline-block py-1 px-3 rounded-full text-green-600 text-xs font-bold border border-green-200 bg-green-50 mb-4">
                                    OPEN ACCESS
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Herramientas Públicas</h2>
                                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                                    Muestras de nuestro poder técnico y desarrollos libres disponibles de manera totalmente gratuita para la comunidad.
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5"><i className="fas fa-check-circle text-green-500"></i> Código Abierto</span>
                                    <span className="flex items-center gap-1.5"><i className="fas fa-check-circle text-green-500"></i> Sin Registro</span>
                                    <span className="flex items-center gap-1.5"><i className="fas fa-check-circle text-green-500"></i> Uso Ilimitado</span>
                                </div>
                            </div>

                            {/* THE RESTORED SOCIAL CARD */}
                            <div className="md:w-1/2 w-full flex justify-center perspective-1000">
                                <div className="bg-white p-6 rounded-2xl max-w-sm w-full transform md:rotate-3 hover:rotate-0 transition-all duration-500 shadow-xl border border-gray-200 relative group-card">
                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-5 border-b border-gray-100 pb-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 p-0.5">
                                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                                <Image src="/lucas.jpeg" fill className="object-cover" alt="Lucas Profile" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Lucas M.</h4>
                                            <p className="text-xs text-gray-500 font-mono">@Founder_GrowLabs</p>
                                        </div>
                                        <div className="ml-auto opacity-20">
                                            <Image src="/logogrow.png" width={24} height={24} alt="Grow Logo" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 mb-5">
                                        <p className="text-gray-700 text-sm leading-relaxed font-normal">
                                            "En <span className="font-bold text-green-600">Grow Labs</span> creemos que la tecnología debe empujar todo hacia adelante. Por eso dejamos a disposición el uso libre de estas herramientas de inteligencia artificial para uso general."
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400 text-sm pt-2">
                                        <div className="flex gap-4">
                                            <i className="far fa-heart hover:text-red-500 transition-colors cursor-pointer text-lg"></i>
                                            <i className="far fa-comment hover:text-blue-500 transition-colors cursor-pointer text-lg"></i>
                                            <i className="far fa-paper-plane hover:text-green-500 transition-colors cursor-pointer text-lg"></i>
                                        </div>
                                        <span className="text-xs">Post de equipo</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 text-left">
                            <div className="light-card p-6 md:p-8 flex flex-col relative overflow-hidden group hover:border-green-300">
                                <div className="absolute top-0 right-0 p-1.5 px-3 md:p-2 md:px-4 bg-green-50 border-b border-l border-green-100 text-green-600 text-[10px] md:text-xs font-bold rounded-bl-lg">
                                    POPULAR
                                </div>
                                <div className="mb-4 md:mb-6"><i className="fas fa-file-alt text-2xl md:text-3xl text-gray-700 group-hover:text-green-600 transition-colors"></i></div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">CV Inteligente</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 flex-1">Diseños profesionales generados instantáneamente y validados por sistemas ATS.</p>
                                <Link href="/cv-maker" className="text-green-600 font-bold hover:text-green-700 transition-colors flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider mt-auto">
                                    IR A CV MAKER <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="light-card p-6 md:p-8 flex flex-col group hover:border-green-300">
                                <div className="mb-4 md:mb-6"><i className="fas fa-microphone-lines text-2xl md:text-3xl text-gray-700 group-hover:text-green-600 transition-colors"></i></div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Transcriptor IA</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 flex-1">Convierte reuniones en resúmenes estructurados usando IA. Transcripciones puras.</p>
                                <Link href="/tools/transcriptor" className="text-green-600 font-bold hover:text-green-700 transition-colors flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider mt-auto">
                                    TRANSCRIBIR <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="light-card p-6 md:p-8 flex flex-col group hover:border-green-300">
                                <div className="mb-4 md:mb-6"><i className="fas fa-images text-2xl md:text-3xl text-gray-700 group-hover:text-green-600 transition-colors"></i></div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Image to PDF</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 flex-1">Convierte fotografías de documentos directamente a PDFs ligeros. 100% privado.</p>
                                <Link href="/tools/image-to-pdf" className="text-green-600 font-bold hover:text-green-700 transition-colors flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider mt-auto">
                                    CONVERTIR <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq" className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">Preguntas Frecuentes</h2>
                        <div className="space-y-3 md:space-y-4 px-2 sm:px-0">
                            {[
                                { q: "¿Cuánto tiempo toma la implementación?", a: "La adopción de software e IA lleva típicamente entre 15 y 30 días, dependiendo de la magnitud de los datos de su empresa." },
                                { q: "¿Necesito conocimientos técnicos?", a: "Absolutamente no. Nosotros nos encargamos de todo el despliegue técnico e infraestructura. El software que usamos es en gran parte No-Code, enfocado a usuarios finales." },
                                { q: "¿Se conecta a mi sistema de facturación actual?", a: "Sí. Mediante APIs o Webhooks, interactuamos con casi cualquier sistema moderno o legacy." },
                                { q: "¿Cuál es el costo del servicio?", a: "Depende de la solución implementada. Por favor, agenda una reunión gratuita para realizar una consulta técnica y armar una cotización exacta." }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => toggleFaq(i)}>
                                    <div className="p-4 md:p-6 flex justify-between items-center text-base md:text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">
                                        <span className="pr-4">{faq.q}</span>
                                        <i className={`fas fa-chevron-down text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}></i>
                                    </div>
                                    <div className={`px-4 md:px-6 pb-4 md:pb-6 text-gray-600 text-sm overflow-hidden transition-all duration-300 ${openFaq === i ? 'block border-t border-gray-100 pt-3 md:pt-4' : 'hidden'}`}>
                                        {faq.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-white py-10 md:py-12 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 mx-auto mb-6">
                        <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                    </div>
                    <div className="flex justify-center gap-6 md:gap-8 mb-6 md:mb-8 text-xs md:text-sm font-medium flex-wrap">
                        <Link href="#solutions" className="text-gray-500 hover:text-gray-900 transition-colors">Funcionalidades</Link>
                        <Link href="#tools" className="text-gray-500 hover:text-gray-900 transition-colors">Herramientas</Link>
                        <a href="https://wa.me/5492645438114" target="_blank" className="text-gray-500 hover:text-gray-900 transition-colors">Contacto Técnico</a>
                    </div>
                    <div className="text-gray-400 text-xs text-center border-t border-gray-100 pt-6 max-w-sm mx-auto">
                        &copy; {new Date().getFullYear()} Grow Labs. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* External CSS for Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
