'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const SOLUTIONS = [
    {
        id: 'automations',
        title: "Automatización de Procesos",
        description: "Elimina tareas repetitivas y propensas a errores. Automatizamos flujos administrativos para liberar a tu equipo y ahorrar cientos de horas mensuales."
    },
    {
        id: 'rag',
        title: "Bases de Conocimiento IA",
        description: "Convierte tus manuales y PDFs en Asistentes virtuales que responden al instante. Una Inteligencia Artificial conectada únicamente a tu información institucional."
    },
    {
        id: 'apps',
        title: "Aplicaciones Personalizadas",
        description: "Desarrollamos portales Web y Mobile (Next.js) para tus clientes o colaboradores, centralizando operaciones con una experiencia de usuario impecable."
    },
    {
        id: 'chatbot',
        title: "Agentes IA para WhatsApp",
        description: "Atiende a tus clientes 24/7 con IA real, comprende audios y automatiza agendas o ventas directamente desde WhatsApp Business."
    },
    {
        id: 'data',
        title: "Inteligencia de Negocios",
        description: "Conectamos múltiples fuentes de datos (CRM, ERP) en Dashboards ejecutivos para visualizar, en tiempo real, el pulso financiero y operativo."
    },
    {
        id: 'web-design',
        title: "Desarrollo Front-End",
        description: "Diseño Web impulsado por Neuromarketing, optimizado en velocidad y con layouts modernos que convierten visitantes en clientes."
    }
];

const INTEGRATIONS = [
    { name: 'Chatwoot', icon: 'fas fa-comment-dots', color: 'text-blue-500' },
    { name: 'Meta Tech Provider', icon: 'fab fa-meta', color: 'text-blue-600' },
    { name: 'Make', icon: 'fas fa-project-diagram', color: 'text-purple-600' },
    { name: 'Telegram', icon: 'fab fa-telegram', color: 'text-blue-400' },
    { name: 'OpenAI', icon: 'fas fa-robot', color: 'text-black' },
    { name: 'VAPI', icon: 'fas fa-microphone', color: 'text-gray-800' },
    { name: 'Anthropic Claude', icon: 'fas fa-brain', color: 'text-orange-900' },
    { name: 'n8n', icon: 'fas fa-code-branch', color: 'text-red-500' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'text-green-500' },
    { name: 'Grok', icon: 'fas fa-bolt', color: 'text-black' },
    { name: 'Zapier', icon: 'fas fa-bolt', color: 'text-orange-500' },
    { name: 'Gemini', icon: 'fas fa-sparkles', color: 'text-blue-500' },
    { name: 'Google Calendar', icon: 'far fa-calendar-alt', color: 'text-blue-500' },
    { name: 'HighLevel', icon: 'fas fa-arrow-up', color: 'text-blue-800' },
];

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-sans text-gray-900 bg-white selection:bg-blue-100 scroll-smooth">
            
            {/* Elemento de Fondo de Cuadrícula */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            {/* HEADER / NAVIGATION */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold">
                            G
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900">Grow Labs</span>
                    </div>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                        <Link href="#solutions" className="hover:text-gray-900 transition-colors">Funcionalidades</Link>
                        <Link href="#why" className="hover:text-gray-900 transition-colors">Ventajas</Link>
                        <Link href="#tools" className="hover:text-gray-900 transition-colors">Herramientas</Link>
                        <Link href="#faq" className="hover:text-gray-900 transition-colors">FAQ</Link>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link href="/cv-maker" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            CV Maker
                        </Link>
                        <Link href="/tools/transcriptor" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mr-2">
                            Transcriptor
                        </Link>
                        <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-primary px-5 py-2 text-sm hidden md:block">
                            Agendar Demo
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <main className="relative z-10 w-full">
                <section className="pt-40 pb-20 md:pt-48 md:pb-24 px-6 relative text-center">
                    <div className="container mx-auto max-w-4xl">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-semibold uppercase tracking-widest shadow-sm">
                            Business Intelligence & IA Empresarial
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                            El sistema operativo que <span className="text-blue-600">escala tu negocio</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Automatizamos tareas repetitivas, conectamos tus datos y atendemos a tus clientes 24/7 sin escribir una sola línea de código.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-primary px-8 py-4 w-full sm:w-auto">
                                Diagnóstico Gratuito
                            </a>
                            <a href="https://wa.me/5492645438114" target="_blank" className="btn-secondary px-8 py-4 flex items-center justify-center gap-2 w-full sm:w-auto">
                                <i className="fab fa-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </section>

                {/* INTEGRATIONS MARQUEE (Similar a la imagen) */}
                <section className="py-10 border-y border-gray-200 bg-white overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
                    
                    <div className="text-center text-sm font-semibold text-gray-400 mb-8 uppercase tracking-widest">
                        Herramientas de automatización que usamos
                    </div>

                    <div className="marquee-container">
                        <div className="marquee-content flex gap-12 px-6">
                            {/* Doble render para lograr scroll infinito suave */}
                            {[...INTEGRATIONS, ...INTEGRATIONS].map((tool, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-gray-700 whitespace-nowrap min-w-max">
                                    <i className={`${tool.icon} text-2xl ${tool.color}`}></i>
                                    <span className="font-semibold">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="py-16 bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
                            <div className="py-4">
                                <span className="block text-5xl font-bold text-gray-900 mb-2">80%</span>
                                <span className="text-sm text-gray-600 font-medium block">Más rápido en tiempos de gestión</span>
                            </div>
                            <div className="py-4">
                                <span className="block text-5xl font-bold text-gray-900 mb-2">30%</span>
                                <span className="text-sm text-gray-600 font-medium block">Ahorro en costes operativos</span>
                            </div>
                            <div className="py-4">
                                <span className="block text-5xl font-bold text-gray-900 mb-2">24/7</span>
                                <span className="text-sm text-gray-600 font-medium block">Disponibilidad de agentes IA</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* PRODUCTS/SOLUTIONS SECTION */}
                <section id="solutions" className="py-24 px-6 bg-white relative border-b border-gray-200">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tú construyes el negocio,<br/>nosotros lo automatizamos</h2>
                            <p className="text-lg text-gray-600 max-w-2xl">Descubre las funcionalidades que te permitirán optimizar los recursos internos y mejorar la experiencia de tu cliente.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {SOLUTIONS.map((s, idx) => (
                                <article key={s.id} className="light-card p-8 flex flex-col hover:shadow-lg transition-shadow">
                                    <span className="text-blue-600 font-bold text-sm mb-4 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-full">
                                        {idx + 1}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHY SECTION */}
                <section id="why" className="py-24 bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="mb-16 max-w-2xl text-center mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hecho para escalar contigo</h2>
                            <p className="text-lg text-gray-600">Diseño robusto para empresas tradicionales que quieren dar el salto digital.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Accesible</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Entregamos tecnología amigable. No necesitas un equipo técnico interno para usar nuestras aplicaciones ni tableros; tu equipo aprenderá en minutos.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Datos en Tiempo Real</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Toma decisiones ejecutivas basadas en métricas reales de tu empresa, presentadas en dashboards limpios y fáciles de interpretar.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Retorno Garantizado (ROI)</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Nuestro enfoque no es un gasto, es una inversión. Las automatizaciones recuperan su coste inicial durante el primer trimestre operativo.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Estética SaaS Moderna</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">Aplicamos principios de diseño contemporáneo, amigables, rápidos y 100% responsivos para que tu marca destaque.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HERRAMIENTAS GRATUITAS (TOOLKIT) */}
                <section id="tools" className="py-24 px-6 bg-white border-b border-gray-200">
                    <div className="container mx-auto max-w-6xl text-center">
                        <span className="inline-block py-1 px-3 rounded-full text-blue-600 text-xs font-bold border border-blue-200 bg-blue-50 mb-4">
                            OPEN ACCESS
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Herramientas en la Nube</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">Muestras de nuestro poder técnico, 100% gratis para la comunidad.</p>

                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div className="light-card p-8 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 px-4 bg-blue-50 text-blue-600 text-xs font-bold rounded-bl-lg">
                                    POPULAR
                                </div>
                                <div className="mb-6"><i className="fas fa-file-alt text-3xl text-gray-700"></i></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">CV Inteligente</h3>
                                <p className="text-sm text-gray-600 mb-8 flex-1">Diseños profesionales generados instantáneamente y validados por sistemas ATS.</p>
                                <Link href="/cv-maker" className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider mt-auto">
                                    IR A CV MAKER <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="light-card p-8 flex flex-col">
                                <div className="mb-6"><i className="fas fa-microphone-lines text-3xl text-gray-700"></i></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Transcriptor IA</h3>
                                <p className="text-sm text-gray-600 mb-8 flex-1">Convierte reuniones en resúmenes estructurados usando Whisper. Detección automática de hablantes.</p>
                                <Link href="/tools/transcriptor" className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider mt-auto">
                                    TRANSCRIBIR <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>

                            <div className="light-card p-8 flex flex-col">
                                <div className="mb-6"><i className="fas fa-images text-3xl text-gray-700"></i></div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Image to PDF</h3>
                                <p className="text-sm text-gray-600 mb-8 flex-1">Convierte fotografías de documentos directamente a PDFs ligeros. Proceso 100% privado en navegador.</p>
                                <Link href="/tools/image-to-pdf" className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider mt-auto">
                                    CONVERTIR <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq" className="py-24 px-6 bg-gray-50 border-b border-gray-200">
                    <div className="container mx-auto max-w-3xl">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Preguntas Frecuentes</h2>
                        <div className="space-y-4">
                            {[
                                { q: "¿Cuánto tiempo toma la implementación?", a: "La adopción de software e IA lleva típicamente entre 15 y 30 días, dependiendo de la magnitud de los datos de su empresa." },
                                { q: "¿Necesito conocimientos técnicos?", a: "Absolutamente no. Nosotros nos encargamos de todo el despliegue técnico e infraestructura." },
                                { q: "¿Se conecta a mi sistema de facturación actual?", a: "Sí. Mediante APIs o Webhooks, interactuamos con casi cualquier sistema moderno o legacy." },
                                { q: "¿Cuál es el costo del servicio?", a: "Depende de la solución implementada. Por favor, agenda una reunión para realizar una cotización exacta." }
                            ].map((faq, i) => (
                                <div key={i} className="light-card overflow-hidden cursor-pointer" onClick={() => toggleFaq(i)}>
                                    <div className="p-6 flex justify-between items-center text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                        {faq.q}
                                        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}></i>
                                    </div>
                                    <div className={`px-6 pb-6 text-gray-600 text-sm overflow-hidden transition-all duration-300 ${openFaq === i ? 'block border-t border-gray-100 pt-4' : 'hidden'}`}>
                                        {faq.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-white py-12 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-900 text-white font-bold flex items-center justify-center mx-auto mb-6">
                        G
                    </div>
                    <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
                        <Link href="#solutions" className="text-gray-500 hover:text-gray-900 transition-colors">Funcionalidades</Link>
                        <Link href="#tools" className="text-gray-500 hover:text-gray-900 transition-colors">Herramientas</Link>
                        <a href="https://wa.me/5492645438114" target="_blank" className="text-gray-500 hover:text-gray-900 transition-colors">Contacto Técnico</a>
                    </div>
                    <div className="text-gray-400 text-xs">
                        &copy; {new Date().getFullYear()} Grow Labs. Todos los derechos reservados.
                    </div>
                </div>
            </footer>

            {/* External CSS for Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
