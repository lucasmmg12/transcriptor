'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const VERBOS_HERO = ["escala", "potencia", "automatiza", "transforma", "revoluciona"];

const CLIENT_LOGOS = [
    '/absorbpad.webp',
    '/adventure pro.webp',
    '/brico supermercados.webp',
    '/centro medico de especialidades.webp',
    '/jerpro.webp',
    '/lomos emi.webp',
    '/neumaticos gallo.webp',
    '/rustik.webp',
    '/sanatorio argentino.webp',
    '/todo alarmas.webp',
    '/vyper suplementos.webp'
];

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
    const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((current) => (current + 1) % VERBOS_HERO.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Scroll Reveal Observer — animates sections as they enter viewport
    useEffect(() => {
        const sections = document.querySelectorAll('.reveal-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-sans text-gray-900 bg-gray-950 selection:bg-green-100 scroll-smooth overflow-x-hidden">
            
            {/* ━━━ FIXED VIDEO BACKGROUND — visible across entire page ━━━ */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    poster="/building-construction.png"
                >
                    <source src="/building-hero-2.mp4" type="video/mp4" />
                </video>
                {/* Heavy dark overlay */}
                <div className="absolute inset-0 bg-black/75" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            </div>

            {/* HEADER / NAVIGATION */}
            <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 relative z-50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Grow Labs</span>
                    </div>

                    <div className="hidden lg:flex gap-8 text-sm font-medium text-gray-300">
                        <Link href="#solutions" className="hover:text-green-400 transition-colors">Funcionalidades</Link>
                        <Link href="#why" className="hover:text-green-400 transition-colors">Ventajas</Link>
                        <Link href="#tools" className="hover:text-green-400 transition-colors">Herramientas</Link>
                        <Link href="#faq" className="hover:text-green-400 transition-colors">FAQ</Link>
                    </div>

                    <div className="flex gap-3 items-center relative z-50">
                        <Link href="/cv-maker" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-green-400 transition-colors">
                            CV Maker
                        </Link>
                        <Link href="/tools/transcriptor" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-green-400 transition-colors mr-2">
                            Transcriptor
                        </Link>
                        <Link href="/diagnostico" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-green-400 transition-colors mr-2">
                            Diagnóstico
                        </Link>
                        <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-400 transition-all">
                            <span className="hidden sm:inline">Agendar Demo</span>
                            <span className="sm:hidden">Agendar</span>
                        </a>
                        <a href="https://wa.me/5492645438114" target="_blank" className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors lg:hidden">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO SECTION — video visible behind */}
            <main className="relative z-10 w-full pt-20">
                <section className="pt-16 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 relative text-center min-h-[85vh] md:min-h-[75vh] flex items-center justify-center">
                    <div className="container mx-auto max-w-4xl">
                        <div className="inline-block px-4 py-1.5 mb-6 md:mb-8 rounded-full border border-green-400/30 bg-green-500/10 text-green-400 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
                            Business Intelligence & IA Empresarial
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-tight flex flex-col md:block items-center justify-center drop-shadow-lg">
                            <span>El sistema operativo que</span>
                            <span key={wordIndex} className="text-green-400 animate-flip px-2 md:px-3">
                                {VERBOS_HERO[wordIndex]}
                            </span>
                            <span>tu negocio</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 mb-8 md:mb-10 max-w-3xl mx-auto px-2 leading-relaxed drop-shadow-md">
                            <strong className="text-white">Ingeniería de software Full-Stack.</strong> Desarrollamos programas empresariales a medida, automatizamos tareas repetitivas y atendemos a tus clientes 24/7 integrando IA nativa en tus procesos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                            <Link href="/diagnostico" className="w-full sm:w-auto px-8 py-4 text-center bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-400 hover:shadow-xl transition-all">
                                Diagnóstico Gratuito
                            </Link>
                            <a href="https://wa.me/5492645438114" target="_blank" className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 border border-white/20 shadow-sm bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full font-semibold transition-all">
                                <i className="fab fa-whatsapp text-green-400 text-lg"></i> WhatsApp
                            </a>
                        </div>

                        {/* Build status — subtle indicator */}
                        <div className="mt-12 md:mt-16">
                            <p className="text-xs font-mono text-green-400/40 tracking-wider">
                                BUILD: STABLE │ STATUS: PRODUCTION │ UPTIME: 99.9%
                            </p>
                        </div>
                    </div>
                </section>

                {/* PROCESS STEPS — compact strip over video */}
                <section className="py-8 md:py-12 relative">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative z-10 container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
                            {[
                                { step: '01', title: 'Diagnóstico', desc: 'Escaneamos tu operación', icon: '🔍' },
                                { step: '02', title: 'Arquitectura', desc: 'Diseñamos la solución', icon: '📐' },
                                { step: '03', title: 'Desarrollo', desc: 'Construimos con IA', icon: '⚡' },
                                { step: '04', title: 'Deploy', desc: 'Lo ponemos en producción', icon: '🚀' },
                            ].map((p) => (
                                <div key={p.step} className="text-center p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
                                    <span className="text-xl md:text-2xl mb-1 block">{p.icon}</span>
                                    <span className="text-[9px] md:text-[10px] font-mono text-green-400/60 tracking-wider">STEP {p.step}</span>
                                    <h4 className="font-bold text-white text-xs md:text-sm mt-0.5">{p.title}</h4>
                                    <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 hidden sm:block">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SOLUCIONES APLICADAS (2ND SCREEN) */}
                <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden reveal-section">
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                            <div>
                                <span className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3 block">Nuestras soluciones</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white">Tecnología aplicada a<br /><span className="text-green-400">problemas concretos</span></h2>
                            </div>
                            <p className="text-gray-400 max-w-md text-sm md:text-base">Desarrollamos soluciones que combinan automatización, análisis de datos e inteligencia artificial para generar resultados medibles.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                { icon: 'fa-building', title: 'Sistemas empresariales a medida', desc: 'Diseñamos plataformas que ordenan tus procesos, centralizan la información y eliminan el caos operativo de tu empresa.', tags: ['ERP','Gestión de procesos','Control operativo','Organización'] },
                                { icon: 'fa-chart-bar', title: 'Business Intelligence y dashboards', desc: 'Convertimos datos dispersos en tableros claros para medir, comparar y decidir mejor.', tags: ['KPIs','Reportes ejecutivos','Métricas operativas','Paneles de gestión'] },
                                { icon: 'fa-robot', title: 'Automatización e inteligencia artificial', desc: 'Integramos IA y automatizaciones para reducir tareas manuales, acelerar respuestas y mejorar seguimiento.', tags: ['Agentes IA','WhatsApp','Flujos automáticos','Carga inteligente'] },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-7 flex flex-col group hover:shadow-lg hover:border-green-400/30 transition-all h-full reveal-child backdrop-blur-sm">
                                    <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-lg mb-5 group-hover:border-green-400/40 group-hover:bg-green-500/15 transition-all">
                                        <i className={`fas ${s.icon}`}></i>
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">{s.desc}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {s.tags.map((t, j) => (
                                            <span key={j} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                                                <i className="fas fa-check text-green-500 text-[7px]"></i>{t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CÓMO TRABAJAMOS (3RD SCREEN) */}
                <section className="py-16 md:py-24 px-4 md:px-6 reveal-section relative">
                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="mb-12">
                            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3 block">Cómo trabajamos</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">No entregamos tecnología.<br />Entregamos <span className="text-green-400">resultados sostenibles.</span></h2>
                            <p className="text-gray-400 max-w-2xl text-base md:text-lg">Combinamos pensamiento estratégico, conocimiento del negocio y tecnología para diseñar sistemas que transforman.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { icon: 'fa-link', title: 'No vendemos herramientas sueltas', desc: 'Diseñamos soluciones conectadas con el problema real de cada empresa.' },
                                { icon: 'fa-crosshairs', title: 'Escuchamos el fondo del negocio', desc: 'Analizamos procesos, prioridades, datos y objetivos antes de implementar nada.' },
                                { icon: 'fa-sliders', title: 'Diseñamos sistemas a medida', desc: 'Cada empresa necesita una solución aplicable a su realidad concreta.' },
                                { icon: 'fa-microchip', title: 'Implementamos tecnología real', desc: 'Software, IA y automatizaciones cuando realmente aportan valor medible.' },
                                { icon: 'fa-handshake', title: 'Acompañamos la adopción', desc: 'Ajustamos y seguimos la implementación para que funcione en el día a día.' },
                                { icon: 'fa-puzzle-piece', title: 'Estrategia, procesos y tecnología', desc: 'La diferencia está en convertir una necesidad empresarial en una solución concreta.' },
                            ].map((p, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 group hover:shadow-md hover:border-green-400/30 transition-all backdrop-blur-sm reveal-child">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-green-400 group-hover:border-green-500/20 group-hover:bg-green-500/10 transition-all flex-shrink-0">
                                            <i className={`fas ${p.icon}`}></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm mb-1.5">{p.title}</h3>
                                            <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INTEGRATIONS MARQUEE */}
                <section className="py-8 md:py-10 border-y border-white/10 overflow-hidden relative reveal-section">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-black to-transparent z-10"></div>
                    
                    <div className="text-center text-xs md:text-sm font-semibold text-gray-400 mb-6 md:mb-8 uppercase tracking-widest px-4 relative z-10">
                        Herramientas de automatización que usamos
                    </div>

                    <div className="marquee-container">
                        <div className="marquee-content flex gap-8 md:gap-12 px-4 md:px-6">
                            {[...INTEGRATIONS, ...INTEGRATIONS].map((tool, idx) => (
                                <div key={idx} className="flex items-center gap-2 md:gap-3 text-gray-300 whitespace-nowrap min-w-max">
                                    <i className={`${tool.icon} text-xl md:text-2xl ${tool.color}`}></i>
                                    <span className="font-semibold text-sm md:text-base">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="py-12 md:py-16 border-b border-white/10 reveal-section relative">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                    <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                            {[
                                { label: "Reducción de Errores", value: "85%" },
                                { label: "Más Rápido", value: "10x" },
                                { label: "Disponibilidad", value: "24/7" },
                                { label: "Crecimiento", value: "+245%" }
                            ].map((stat, i) => (
                                <div key={i} className="py-2 reveal-child">
                                    <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                    <p className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MISION / VISION SECTION (Restored & Light Theme adapted) */}
                <section className="py-20 border-b border-white/10 reveal-section relative">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                    <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                        <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4">Quiénes Somos</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-white">Expertos en Tecnología para la Realidad Empresarial de LATAM</h3>
                        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                            Grow Labs nace de la experiencia directa en la complejidad operativa de las empresas. Entendemos profundamente los desafíos de burocracia, ineficiencia y falta de datos claros. Nuestra misión es transformar esa fricción en eficiencia mediante tecnología de punta adaptada a tus necesidades.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm reveal-child">
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-400"><i className="fas fa-rocket"></i></div>
                                <h4 className="font-bold text-white mb-2">Misión</h4>
                                <p className="text-sm text-gray-400">Eliminar la fricción operativa para que los equipos se enfoquen en lo que realmente importa: el crecimiento.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm reveal-child">
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-400"><i className="fas fa-brain"></i></div>
                                <h4 className="font-bold text-white mb-2">Visión</h4>
                                <p className="text-sm text-gray-400">Ser el cerebro digital que impulsa las operaciones ágiles de las empresas modernas líderes en LATAM.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm reveal-child">
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 text-green-400"><i className="fas fa-gem"></i></div>
                                <h4 className="font-bold text-white mb-2">Valores</h4>
                                <p className="text-sm text-gray-400">Precisión Operativa • Adaptación Local • Innovación Transparente y Escalabilidad garantizada.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CLIENTS MARQUEE (Moved above Solutions) */}
                <section className="py-8 md:py-12 border-b border-white/10 overflow-hidden relative reveal-section">
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
                    
                    <div className="text-center text-xs md:text-sm font-semibold text-gray-400 mb-8 uppercase tracking-widest px-4">
                        Más de 30 empresas ya confían y escalan con nosotros
                    </div>

                    <div className="marquee-container">
                        <div className="marquee-content flex gap-8 md:gap-12 px-4 md:px-6 items-center" style={{ animationDuration: '80s' }}>
                            {[...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedLogo(logo)}
                                    className="cursor-pointer relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 rounded-full bg-white/10 border border-white/10 flex items-center justify-center p-2 group overflow-hidden"
                                >
                                    <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-300">
                                        <Image src={logo} alt={`Cliente ${idx}`} fill className="object-contain" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PRODUCTS/SOLUTIONS SECTION */}
                <section id="solutions" className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 relative border-b border-gray-200 reveal-section">
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
                                    className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8 flex flex-col hover:shadow-xl hover:border-green-400 transition-all cursor-pointer group hover:-translate-y-1 block reveal-child"
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
                <section className="py-20 bg-white border-b border-gray-200 reveal-section">
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
                <section id="data" className="py-20 bg-gray-900 border-b border-gray-800 text-white relative overflow-hidden reveal-section">
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
                <section className="py-20 bg-green-500 text-white reveal-section">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-sm">Garantía Asegurada</h2>
                        <p className="text-xl font-medium max-w-2xl mx-auto mb-10 text-green-50">
                            Nuestros desarrollos no son gastos, son inversiones que recuperan dinero desde el primer trimestre.
                        </p>
                        <Link href="/diagnostico" className="inline-block px-8 py-4 bg-gray-900 border border-gray-800 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg">
                            Comenzar Diagnóstico
                        </Link>
                    </div>
                </section>


                {/* NUESTRO PROCESO (4 ETAPAS) */}
                <section className="py-16 md:py-24 px-4 md:px-6 bg-white border-b border-gray-200 reveal-section">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12 md:mb-16">
                            <span className="text-green-600 font-bold tracking-widest text-xs uppercase mb-3 block">Nuestro proceso</span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Del <span className="text-green-600">desorden</span> al sistema</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">No vendemos herramientas sueltas. Diseñamos un proceso de transformación con acompañamiento real.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { icon: 'fa-search-plus', title: 'Diagnóstico Digital', desc: 'Analizamos tu operación actual, identificamos cuellos de botella y diseñamos un mapa de prioridades claro.', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { icon: 'fa-sitemap', title: 'Ordenamiento de Procesos', desc: 'Documentamos y estructuramos los procesos clave para que tu equipo trabaje con claridad y trazabilidad.', color: 'text-green-500', bg: 'bg-green-50' },
                                { icon: 'fa-cogs', title: 'Implementación Tecnológica', desc: 'Desarrollamos e integramos las soluciones digitales que tu empresa necesita: software, automatizaciones, dashboards.', color: 'text-purple-500', bg: 'bg-purple-50' },
                                { icon: 'fa-chart-line', title: 'Seguimiento y Evolución', desc: 'Acompañamos la adopción, medimos resultados y ajustamos el sistema para que crezca con tu empresa.', color: 'text-amber-500', bg: 'bg-amber-50' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all shadow-sm reveal-child">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} text-lg border border-gray-100`}>
                                            <i className={`fas ${s.icon}`}></i>
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Etapa {i + 1}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{s.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.desc}</p>
                                    {i < 3 && (
                                        <div className="hidden lg:flex justify-end mt-4">
                                            <i className="fas fa-arrow-right text-green-500/30 text-sm"></i>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* EQUIPO DIRECTIVO */}
                <section className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 border-b border-gray-200 reveal-section">
                    <div className="container mx-auto max-w-5xl">
                        <div className="mb-12">
                            <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-3 block">Equipo directivo</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Dirección de Grow Labs</h2>
                            <p className="text-gray-600 max-w-2xl text-base">Combinamos visión tecnológica, pensamiento estratégico y capacidad real de implementación.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center group shadow-sm hover:shadow-lg transition-all">
                                <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-green-200 relative group-hover:border-green-400 transition-all">
                                    <Image src="/lucas.jpeg" alt="Lucas Marinero" fill className="object-cover" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Lucas Marinero</h3>
                                <p className="text-green-600 text-sm font-medium mb-3">Cofundador · Dirección Técnica y Producto</p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">Lidera la visión tecnológica, el desarrollo de soluciones digitales, automatizaciones y software a medida.</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['Producto','IA','Automatización','Software'].map(t => (
                                        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                                            <i className="fas fa-code text-green-500/60 text-[8px]"></i>{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center group shadow-sm hover:shadow-lg transition-all">
                                <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-green-200 relative bg-green-50 flex items-center justify-center group-hover:border-green-400 transition-all">
                                    <span className="text-3xl font-bold text-green-600/60">GR</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Gustavo Regalado</h3>
                                <p className="text-green-600 text-sm font-medium mb-3">Socio · Dirección Estratégica, Operativa y Comercial</p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">Fortalece la estrategia empresarial, el orden operativo, el desarrollo comercial y la implementación en empresas reales.</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['Estrategia','Gestión','Procesos','Comercial'].map(t => (
                                        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                                            <i className="fas fa-briefcase text-green-500/60 text-[8px]"></i>{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 text-center shadow-sm">
                            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
                                La fortaleza de Grow Labs está en la complementariedad: <span className="text-green-600 font-semibold">visión técnica para construir soluciones</span> y <span className="text-green-600 font-semibold">visión empresarial para aplicarlas correctamente.</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* HERRAMIENTAS GRATUITAS (TOOLKIT) */}
                <section id="tools" className="py-16 md:py-24 px-4 md:px-6 bg-white border-b border-gray-200 overflow-hidden reveal-section">
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
                                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl max-w-sm w-full transform md:rotate-3 hover:rotate-0 transition-all duration-500 shadow-xl border border-white/10 relative group-card">
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
                <section id="faq" className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 border-b border-gray-200 reveal-section">
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
            <footer className="bg-black/80 backdrop-blur-xl py-10 md:py-12 relative z-10 border-t border-white/10">
                <div className="container mx-auto px-6 text-center">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 mx-auto mb-6">
                        <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                    </div>
                    <div className="flex justify-center gap-6 md:gap-8 mb-6 md:mb-8 text-xs md:text-sm font-medium flex-wrap">
                        <Link href="#solutions" className="text-gray-400 hover:text-green-400 transition-colors">Funcionalidades</Link>
                        <Link href="#tools" className="text-gray-400 hover:text-green-400 transition-colors">Herramientas</Link>
                        <a href="https://wa.me/5492645438114" target="_blank" className="text-gray-400 hover:text-green-400 transition-colors">Contacto Técnico</a>
                    </div>
                    <div className="text-gray-500 text-xs text-center border-t border-white/10 pt-6 max-w-sm mx-auto">
                        &copy; {new Date().getFullYear()} Grow Labs. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* FLOATING SOCIAL BAR */}
            <div className="fixed right-4 md:right-6 bottom-4 md:bottom-8 flex flex-col gap-3 z-50">
                <a href="https://www.linkedin.com/in/lucas-marinero-182521308/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/10 hover:-translate-y-1 hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300">
                    <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://www.instagram.com/growsanjuan/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/10 hover:-translate-y-1 hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300">
                    <i className="fab fa-instagram"></i>
                </a>
                <a href="https://api.whatsapp.com/send/?phone=5492645438114&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl shadow-[0_4px_15px_rgba(37,211,102,0.3)] border border-[#25D366] hover:bg-[#1ebc59] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(37,211,102,0.4)] transition-all duration-300">
                    <i className="fab fa-whatsapp"></i>
                </a>
            </div>

            {/* CLIENT LOGO LIGHTBOX */}
            {selectedLogo && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer transition-opacity"
                    onClick={() => setSelectedLogo(null)}
                >
                    <div 
                        className="relative w-full max-w-3xl aspect-[16/9] md:aspect-video bg-white/5 rounded-2xl p-4 md:p-8 shadow-2xl transform transition-transform animate-flip cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 border border-gray-200 shadow-lg hover:bg-gray-100 hover:scale-110 transition-all z-10"
                            onClick={() => setSelectedLogo(null)}
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                        <div className="relative w-full h-full">
                            <Image src={selectedLogo} fill alt="Cliente Detalle" className="object-contain" />
                        </div>
                    </div>
                </div>
            )}

            {/* External CSS for Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
