'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';

const SOLUTIONS = [
    {
        id: 'automations',
        title: "Módulos de Automatización",
        icon: "cogs",
        color: "green", // text-grow
        colorClass: "text-grow",
        bgClass: "bg-green-500/10",
        description: "Elimina tareas repetitivas y propensas a errores. Automatizamos procesos administrativos complejos para liberar a tu equipo.",
        features: [
            "Reducción del 90% en tiempo de gestión",
            "Eliminación de errores humanos",
            "Integración con tus sistemas actuales"
        ],
        details: {
            theoretical: "La automatización de procesos empresariales (BPA) consiste en el uso de tecnología para ejecutar tareas y flujos de trabajo recurrentes con mínima intervención humana. Se busca reemplazar la ejecución manual de procesos administrativos por reglas lógicas ejecutadas por software (RPA - Robotic Process Automation).",
            practical: "Imagina tener un 'empleado robot' invisible que no duerme. En lugar de que una persona copie datos de un email y los pegue en un Excel, un script lo hace instantáneamente. Conecta sistemas que normalmente no hablan entre sí (ej. tu banco con tu sistema contable, o tu email con tu CRM).",
            example: "Una empresa de logística recibía 500 pedidos diarios por WhatsApp. Antes, 4 empleados los cargaban manualmente, tardando 6 horas. Con nuestra automatización, el pedido se extrae del chat, se carga en el ERP, y se generan la factura y la hoja de ruta de despacho en 30 segundos, reduciendo el error humano a 0% y liberando al staff para ventas."
        }
    },
    {
        id: 'rag',
        title: "RAG Institucional (IA)",
        icon: "database",
        color: "blue",
        colorClass: "text-blue-400",
        bgClass: "bg-blue-500/10",
        description: "Tu base de conocimiento institucional potenciada por IA. Convierte manuales y procesos en respuestas instantáneas.",
        features: [
            "Búsqueda en toda tu documentación",
            "Respuestas contextualizadas y citadas",
            "Onboarding de empleados acelerado"
        ],
        details: {
            theoretical: "RAG (Retrieval-Augmented Generation) es una arquitectura de Inteligencia Artificial que combina grandes modelos de lenguaje (LLMs como GPT) con una base de conocimientos privada y vectorial. Permite que la IA 'aprenda' y responda específicamente sobre los datos privados de una organización, citando fuentes.",
            practical: "Es como darle un cerebro a tus archivos PDF, Excels y manuales. Puedes 'chatear' con toda la documentación de tu empresa. Un empleado le pregunta '¿Cuál es el procedimiento de devolución para clientes VIP?' y el sistema responde citando la página exacta del manual de operaciones, en lugar de alucinar información.",
            example: "Una aseguradora con miles de páginas de condiciones generales. Los agentes de soporte tardaban 20 minutos en buscar coberturas específicas. Con RAG, escriben la consulta y obtienen la respuesta precisa junto con la cláusula contractual en 5 segundos, aumentando la satisfacción del cliente y la velocidad de resolución."
        }
    },
    {
        id: 'apps',
        title: "Aplicaciones Digitales",
        icon: "mobile-alt",
        color: "purple",
        colorClass: "text-purple-400",
        bgClass: "bg-purple-500/10",
        description: "Suite completa de aplicaciones para conectar clientes, colaboradores y administración.",
        features: [
            "Portal de Clientes: Autogestión",
            "Gestor de Proyectos: Trazabilidad",
            "Asistente de Reuniones: IA Transcriptor"
        ],
        details: {
            theoretical: "El desarrollo de interfaces digitales personalizadas (Web & Mobile Apps) sirve como punto de contacto e interacción entre la empresa y sus stakeholders. Centralizan datos, operaciones y comunicaciones en la nube, permitiendo acceso ubicuo y trazabilidad total.",
            practical: "Olvida los papeles perdidos y las planillas de Excel compartidas por email. Es crear tu propia plataforma (como tu propio Uber o Homebanking interno) donde tus clientes inician sesión para ver el estado de sus pedidos, o tus empleados marcan asistencia y suben reportes desde el celular.",
            example: "Una constructora gestionaba el avance de obra con papeles que se perdían y fotos de WhatsApp desorganizadas. Implementamos una App Web Progresiva (PWA) donde los capataces suben reportes diarios geo-referenciados. Los inversores ven el avance en tiempo real desde un dashboard, aumentando la transparencia y confianza."
        }
    },
    {
        id: 'chatbot',
        title: "Chatbot WhatsApp IA",
        icon: "comments",
        color: "yellow",
        colorClass: "text-yellow-400",
        bgClass: "bg-yellow-500/10",
        description: "Atiende a tus clientes 24/7 con inteligencia real, no menús frustrantes. Vende, agenda y resuelve dudas.",
        features: [
            "Atención personalizada 24/7",
            "Sin árboles de decisión rígidos",
            "Gestión de turnos y ventas"
        ],
        details: {
            theoretical: "Agentes conversacionales avanzados implementados sobre la API de WhatsApp Business. Utilizan Procesamiento de Lenguaje Natural (NLP) avanzado para interpretar la intención y el sentimiento del usuario, mantener el contexto de la conversación (memoria) y ejecutar acciones complejas mediante integración de APIs.",
            practical: "No es el típico chatbot de 'Marque 1 para ventas'. Es un asistente que habla natural, entiende audios, maneja ironía y empatía. Puede agendar citas en tu calendario real, enviar catálogos personalizados y cerrar ventas a las 3 de la mañana mientras tu equipo duerme.",
            example: "Una clínica médica saturada por llamadas telefónicas para turnos. Implementamos un agente de IA en WhatsApp que atiende a 1000 pacientes simultáneos, verifica disponibilidad en el sistema de agenda médica, confirma cobertura de obras sociales y reserva el turno. Redujo el ausentismo en un 40% (recordatorios) y descomprimió la recepción."
        }
    }
];


export default function Home() {
    // Estado para FAQ y ROI Calculator (simple visual toggle)
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [selectedSolution, setSelectedSolution] = useState<typeof SOLUTIONS[0] | null>(null);

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
                        <Link href="#tools" className="hover:text-grow transition-colors">Herramientas</Link>
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
                        {SOLUTIONS.map((solution) => (
                            <div
                                key={solution.id}
                                className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group hover:scale-[1.02] border border-white/5 hover:border-white/10"
                                onClick={() => setSelectedSolution(solution)}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 ${solution.bgClass} rounded-xl ${solution.colorClass} text-2xl`}>
                                        <i className={`fas fa-${solution.icon}`}></i>
                                    </div>
                                    <button className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors flex items-center gap-2">
                                        Ver Detalle <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                                <p className="text-gray-400 mb-6">{solution.description}</p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    {solution.features.map((feature, idx) => (
                                        <li key={idx} className="flex gap-2">
                                            <i className={`fas fa-check ${solution.colorClass}`}></i>
                                            {/* Handle the HTML inside string (strong tags) if any, though current data is plain text mostly, 
                                                except for Apps which had manual bolding. Let's make it simple for now or use dangerouslySetInnerHTML if needed,
                                                but for safety I'll render the Apps features as strings in the data directly. */}
                                            <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
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

            {/* ROI, DATA & TECH SECTION */}
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

                                        <path
                                            d="M0,150 C50,140 80,100 120,110 C160,120 200,60 250,70 C300,80 350,20 400,30 V200 H0 Z"
                                            fill="url(#chartGradient)"
                                            className="opacity-50"
                                        />

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

            {/* HERRAMIENTAS GRATUITAS (TOOLKIT SECTION) */}
            <section id="tools" className="py-24 px-6 relative border-t border-white/10 bg-black/40">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-20 animate-fade-in">
                        <div className="md:w-1/2 text-left">
                            <span className="inline-block py-1 px-3 rounded-lg bg-green-500/10 text-green-400 text-xs font-bold mb-4 border border-green-500/20">
                                POWERED BY GROW LABS
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Herramientas <span className="text-white">Gratuitas</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Tecnología de élite al alcance de todos. Potencia tu productividad y carrera con nuestra suite open access, diseñada originalmente para uso interno y ahora disponible para ti.
                            </p>

                            <div className="flex gap-4 items-center text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i> Sin registros
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i> 100% Privado
                                </span>
                                <span className="flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i> Acceso Ilimitado
                                </span>
                            </div>
                        </div>

                        <div className="md:w-1/2 w-full flex justify-center perspective-1000">
                            {/* THE RESTORED SOCIAL CARD */}
                            <div className="glass-card p-6 rounded-2xl max-w-sm w-full transform rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 border border-white/10 bg-black/60 relative group-card">
                                {/* Top Gradient Line */}
                                <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

                                {/* Header */}
                                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 p-0.5 shadow-lg shadow-green-500/20">
                                        <div className="w-full h-full rounded-full overflow-hidden relative">
                                            <Image src="/lucas.jpeg" fill className="object-cover" alt="Lucas Profile" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Lucas M.</h4>
                                        <p className="text-xs text-green-400 font-mono">@Founder_GrowLabs</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Image src="/logogrow.png" width={24} height={24} alt="Grow Logo" className="opacity-80" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4 mb-6">
                                    <p className="text-gray-300 text-sm leading-relaxed font-light">
                                        "En <span className="text-green-400 font-bold">Grow Labs</span> creemos que la IA debe ser accesible. Por eso liberamos nuestras mejores herramientas internas para que vos también puedas automatizar tu trabajo."
                                    </p>
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 group hover:border-green-500/30 transition-colors">
                                        <Image src="/fondogrow.png" fill className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Grow Background" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md">
                                                <i className="fas fa-play text-white text-xl pl-1"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-between items-center text-gray-500 text-sm">
                                    <div className="flex gap-5">
                                        <i className="far fa-heart hover:text-red-500 transition-colors cursor-pointer text-lg"></i>
                                        <i className="far fa-comment hover:text-blue-400 transition-colors cursor-pointer text-lg"></i>
                                        <i className="far fa-paper-plane hover:text-green-400 transition-colors cursor-pointer text-lg"></i>
                                    </div>
                                    <span className="text-xs text-gray-600">Hace 2 horas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* Card 1: CV Maker */}
                        <div className="glass-card p-8 rounded-3xl border border-white/5 hover:border-grow/30 transition-all group relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 p-3 bg-white/5 rounded-bl-2xl backdrop-blur-md border-b border-l border-white/5 z-10">
                                <span className="text-xs font-bold text-grow">MÁS POPULAR</span>
                            </div>
                            <div className="w-14 h-14 bg-grow rounded-2xl flex items-center justify-center text-black text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="fas fa-file-alt"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-grow transition-colors">CV Maker Inteligente</h3>
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-1">
                                Diseña un currículum profesional, validado por expertos y optimizado para ATS. Incluye formatos de exportación premium y diseño de alto impacto.
                            </p>
                            <Link href="/cv-maker" className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all mt-auto">
                                <span>Crear mi CV</span>
                                <i className="fas fa-arrow-right text-grow"></i>
                            </Link>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-grow/10 rounded-full blur-3xl group-hover:bg-grow/20 transition-colors"></div>
                        </div>

                        {/* Card 2: Transcriptor */}
                        <div className="glass-card p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col">
                            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="fas fa-microphone-lines"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Transcriptor IA</h3>
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-1">
                                Convierte audios de reuniones, entrevistas o WhatsApp a texto en segundos. Obtén resúmenes automáticos, minutas y detección de hablantes con GPT-4.
                            </p>
                            <Link href="/tools/transcriptor" className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all mt-auto">
                                <span>Transcribir Audio</span>
                                <i className="fas fa-arrow-right text-blue-400"></i>
                            </Link>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
                        </div>

                        {/* Card 3: Presentaciones */}
                        <div className="glass-card p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group relative overflow-hidden flex flex-col">
                            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="fas fa-layer-group"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">Slides Generator</h3>
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed flex-1">
                                Transforma textos o ideas en presentaciones visuales completas. Exporta a PDF con diseños artísticos estilo "Visual Novel" o corporativos.
                            </p>
                            <Link href="/tools/presentaciones" className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all mt-auto">
                                <span>Generar PDF</span>
                                <i className="fas fa-arrow-right text-purple-400"></i>
                            </Link>

                            {/* Decorative glow */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
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
                        <a href="#tools" className="text-gray-500 hover:text-white transition-colors">Herramientas</a>
                        <a href="https://wa.me/5492645438114" target="_blank" className="text-gray-500 hover:text-white transition-colors">Contacto</a>
                    </div>

                    <div className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Grow Labs Technology. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* SOLUTION DETAILS MODAL */}
            {selectedSolution && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedSolution(null)}>
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-black" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sticky top-0 bg-neutral-900/95 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${selectedSolution.bgClass} ${selectedSolution.colorClass}`}>
                                    <i className={`fas fa-${selectedSolution.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-bold text-white">{selectedSolution.title}</h3>
                            </div>
                            <button onClick={() => setSelectedSolution(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">

                            {/* Theoretical */}
                            <div className="flex gap-6 flex-col md:flex-row">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 border border-white/10">
                                        <i className="fas fa-book"></i>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Definición Teórica</h4>
                                    <p className="text-gray-400 leading-relaxed">{selectedSolution.details.theoretical}</p>
                                </div>
                            </div>

                            {/* Practical */}
                            <div className="flex gap-6 flex-col md:flex-row">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 border border-white/10">
                                        <i className="fas fa-wrench"></i>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">En la Práctica</h4>
                                    <p className="text-gray-400 leading-relaxed">{selectedSolution.details.practical}</p>
                                </div>
                            </div>

                            {/* Case Study */}
                            <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5">
                                <div className="flex gap-4 items-start">
                                    <div className={`mt-1 p-2 rounded-lg ${selectedSolution.bgClass} ${selectedSolution.colorClass}`}>
                                        <i className="fas fa-chart-line"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2">Caso de Éxito</h4>
                                        <p className="text-gray-300 leading-relaxed font-light italic">"{selectedSolution.details.example}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
                            <button onClick={() => setSelectedSolution(null)} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 transition-colors">
                                Cerrar
                            </button>
                            <a href="https://wa.me/5492645438114" target="_blank" className="px-6 py-3 rounded-xl bg-grow text-black font-bold hover:bg-green-400 transition-colors hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2">
                                <span>Solicitar esta Solución</span>
                                <i className="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* External CSS for Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
