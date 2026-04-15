'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-sm">
                            G
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
                            El sistema operativo que <span className="text-green-600">escala tu negocio</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto px-2">
                            Automatizamos tareas repetitivas, conectamos tus datos y atendemos a tus clientes 24/7 sin escribir una sola línea de código.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                            <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-primary w-full sm:w-auto px-8 py-4 text-center">
                                Diagnóstico Gratuito
                            </a>
                            <a href="https://wa.me/5492645438114" target="_blank" className="btn-secondary w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2">
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                            <div className="py-4">
                                <span className="block text-4xl md:text-5xl font-bold text-gray-900 mb-2">80%</span>
                                <span className="text-xs md:text-sm text-gray-600 font-medium block">Más rápido en tiempos de gestión</span>
                            </div>
                            <div className="py-4">
                                <span className="block text-4xl md:text-5xl font-bold text-gray-900 mb-2">30%</span>
                                <span className="text-xs md:text-sm text-gray-600 font-medium block">Ahorro en costes operativos</span>
                            </div>
                            <div className="py-4">
                                <span className="block text-4xl md:text-5xl font-bold text-gray-900 mb-2">24/7</span>
                                <span className="text-xs md:text-sm text-gray-600 font-medium block">Disponibilidad de agentes IA</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCTS/SOLUTIONS SECTION */}
                <section id="solutions" className="py-16 md:py-24 px-4 md:px-6 bg-white relative border-b border-gray-200">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-10 md:mb-16 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">Tú construyes el negocio,<br className="hidden md:block"/>nosotros lo automatizamos</h2>
                            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto md:mx-0">Descubre las funcionalidades que te permitirán optimizar los recursos internos y mejorar la experiencia de tu cliente.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {SOLUTIONS.map((s, idx) => (
                                <a 
                                    key={s.id} 
                                    href={`https://wa.me/5492645438114?text=${encodeURIComponent(`Hola, estaba viendo su sitio web y me interesa saber más sobre el servicio de ${s.title}.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="light-card p-6 md:p-8 flex flex-col hover:shadow-xl hover:border-green-400 transition-all cursor-pointer group hover:-translate-y-1 block"
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

                {/* WHY SECTION */}
                <section id="why" className="py-16 md:py-24 bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                        <div className="mb-12 md:mb-16 max-w-2xl text-center mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hecho para escalar contigo</h2>
                            <p className="text-base md:text-lg text-gray-600 px-4">Diseño robusto para empresas tradicionales que quieren dar el salto digital.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-16">
                            <div className="bg-white p-6 md:p-0 md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                                    <i className="fas fa-check-circle text-green-500"></i> Accesible
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Entregamos tecnología amigable. No necesitas un equipo técnico interno para usar nuestras aplicaciones ni tableros; tu equipo aprenderá en minutos.</p>
                            </div>
                            <div className="bg-white p-6 md:p-0 md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                                    <i className="fas fa-chart-pie text-green-500"></i> Datos en Tiempo Real
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Toma decisiones ejecutivas basadas en métricas reales de tu empresa, presentadas en dashboards limpios y fáciles de interpretar.</p>
                            </div>
                            <div className="bg-white p-6 md:p-0 md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                                    <i className="fas fa-seedling text-green-500"></i> Retorno Garantizado (ROI)
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Nuestro enfoque no es un gasto, es una inversión. Las automatizaciones recuperan su coste inicial durante el primer trimestre operativo.</p>
                            </div>
                            <div className="bg-white p-6 md:p-0 md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-none">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                                    <i className="fas fa-laptop-code text-green-500"></i> Estética SaaS Moderna
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Aplicamos principios de diseño contemporáneo, amigables, rápidos y 100% responsivos para que tu marca destaque.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HERRAMIENTAS GRATUITAS (TOOLKIT) */}
                <section id="tools" className="py-16 md:py-24 px-4 md:px-6 bg-white border-b border-gray-200">
                    <div className="container mx-auto max-w-6xl text-center">
                        <span className="inline-block py-1 px-3 rounded-full text-green-600 text-xs font-bold border border-green-200 bg-green-50 mb-4">
                            OPEN ACCESS
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Herramientas en la Nube</h2>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 md:mb-16 px-4">Muestras de nuestro poder técnico, 100% gratis para la comunidad.</p>

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
                                <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 flex-1">Convierte reuniones en resúmenes estructurados usando Whisper. Detección automática de hablantes.</p>
                                <Link href="/tools/transcriptor" className="text-green-600 font-bold hover:text-green-700 transition-colors flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider mt-auto">
                                    TRANSCRIBIR <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="light-card p-6 md:p-8 flex flex-col group hover:border-green-300">
                                <div className="mb-4 md:mb-6"><i className="fas fa-images text-2xl md:text-3xl text-gray-700 group-hover:text-green-600 transition-colors"></i></div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Image to PDF</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 flex-1">Convierte fotografías de documentos directamente a PDFs ligeros. Proceso 100% privado en navegador.</p>
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
                                <div key={i} className="light-card overflow-hidden cursor-pointer bg-white" onClick={() => toggleFaq(i)}>
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
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-900 text-white font-bold flex items-center justify-center mx-auto mb-6 text-sm md:text-base">
                        G
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
