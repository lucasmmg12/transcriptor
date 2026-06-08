'use client';
import Link from 'next/link';
import Image from 'next/image';
import R from './ScrollReveal';

const SOLUTIONS = [
    { id: 'crm', title: 'CRM a Medida', desc: 'Desarrollamos sistemas de gestión de clientes 100% adaptados a tu flujo de ventas, sin licencias costosas ni funciones que no necesitás.' },
    { id: 'sistemas', title: 'Sistemas a Medida', desc: 'Si tu empresa tiene una operación única, construimos el software exacto para resolverla. Desde portales operativos hasta plataformas corporativas.' },
    { id: 'ecommerce', title: 'E-Commerce Personalizado', desc: 'Tiendas online de alto rendimiento. Optimizadas para velocidad, conversiones y con pasarelas de pago integradas.' },
    { id: 'automations', title: 'Automatización con IA', desc: 'Eliminamos el trabajo manual repetitivo. Conectamos tus plataformas para que los datos viajen solos y ahorres cientos de horas al mes.' },
    { id: 'chatbot', title: 'Agentes IA en WhatsApp', desc: 'Tu negocio atiende 24/7. Creamos asistentes de IA que entienden texto y audio, vendiendo y respondiendo directo en WhatsApp.' },
    { id: 'web-design', title: 'Desarrollo Web', desc: 'Tu carta de presentación en internet. Diseñamos con estética premium, velocidad extrema y principios que convierten visitantes en clientes.' },
];

export function ServicesGrid() {
    return (
        <section id="solutions" className="py-16 md:py-24 px-4 md:px-6 border-b border-white/5">
            <div className="container mx-auto max-w-6xl">
                <R><div className="mb-10 md:mb-14 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Servicios y <span className="text-emerald-400">Soluciones</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto md:mx-0">Soluciones modulares diseñadas para optimizar procesos y escalar tu negocio.</p>
                </div></R>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {SOLUTIONS.map((s, i) => (
                        <R key={s.id} delay={i * 80}><a href={`https://wa.me/5492645438114?text=${encodeURIComponent(`Hola, me interesa saber más sobre ${s.title}.`)}`} target="_blank" className="gl-card p-6 md:p-7 flex flex-col group hover:border-emerald-500/30 cursor-pointer block">
                            <span className="text-emerald-400 font-bold text-xs mb-3 bg-emerald-500/10 border border-emerald-500/20 w-7 h-7 flex items-center justify-center rounded-full">{i + 1}</span>
                            <h3 className="text-base md:text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors">{s.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">{s.desc}</p>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">Consultar <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform" /></div>
                        </a></R>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ProblemsSection() {
    return (
        <section className="py-16 md:py-20 px-4 sm:px-6 border-b border-white/5">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                    <div className="w-full md:w-1/2">
                        <R><h3 className="text-2xl md:text-3xl font-bold mb-6">Problemas que resolvemos todos los días</h3></R>
                        <div className="space-y-5">
                            {[
                                { icon: 'fa-times', title: 'Procesos sin trazabilidad', desc: 'Información dispersa en planillas, chats y papeles que nadie consolida.' },
                                { icon: 'fa-chart-line', title: 'Tareas manuales repetitivas', desc: 'Tu equipo dedica horas a trabajo operativo en lugar de enfocarse en estrategia.' },
                                { icon: 'fa-user-clock', title: 'Falta de visibilidad', desc: 'No tenés datos claros para tomar decisiones rápidas y fundamentadas.' },
                            ].map((p, i) => (
                                <R key={i} delay={i * 100}><div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0 border border-red-500/20"><i className={`fas ${p.icon} text-sm`} /></div>
                                    <div><h4 className="font-bold text-white text-sm mb-1">{p.title}</h4><p className="text-gray-500 text-xs">{p.desc}</p></div>
                                </div></R>
                            ))}
                        </div>
                    </div>
                    <R variant="right"><div className="w-full md:w-1/2 gl-card p-6 md:p-8">
                        <h3 className="text-lg font-bold mb-5 text-center">Por qué Grow Labs es diferente</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3 text-xs font-bold text-gray-500 border-b border-white/5 pb-3"><span /><span className="text-emerald-400 text-center">Grow Labs</span><span className="text-center">Tradicional</span></div>
                            {[
                                ['Implementación', 'Días/Semanas', '6-12 meses'],
                                ['Tecnología', 'IA Inteligente', 'Software Rígido'],
                                ['Soporte', '24/7 Asesoría', 'Tickets Lentos'],
                                ['ROI (Retorno)', 'Inmediato', 'Incierto'],
                            ].map(([label, gl, trad], i) => (
                                <div key={i} className="grid grid-cols-3 gap-3 text-xs items-center py-1">
                                    <span className="text-gray-400 font-medium">{label}</span>
                                    <span className="text-center font-bold text-emerald-400 bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/20">{gl}</span>
                                    <span className="text-center text-gray-600">{trad}</span>
                                </div>
                            ))}
                        </div>
                    </div></R>
                </div>
            </div>
        </section>
    );
}

export function BISection() {
    return (
        <section id="data" className="py-16 md:py-20 px-4 sm:px-6 border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <R variant="left"><div className="w-full md:w-1/2">
                        <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2 block">Datos que trabajan para vos</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-5">Ordená tus datos. <span className="text-emerald-400">Decidí mejor.</span></h2>
                        <p className="text-gray-400 text-base mb-6 leading-relaxed">Convertimos datos dispersos en tableros claros para medir, comparar y tomar decisiones con fundamento real.</p>
                        <a href="https://wa.me/5492645438114" target="_blank" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">Solicitar una evaluación →</a>
                    </div></R>
                    <R variant="right"><div className="w-full md:w-1/2">
                        <svg viewBox="0 0 400 200" className="w-full h-auto">
                            <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#10B981" stopOpacity="0.2" /><stop offset="50%" stopColor="#10B981" stopOpacity="0.8" /><stop offset="100%" stopColor="#10B981" stopOpacity="0.3" /></linearGradient></defs>
                            <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                            <line x1="0" y1="140" x2="400" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            <polyline fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points="0,160 50,150 100,130 150,140 200,100 250,80 300,90 350,50 400,30"><animate attributeName="stroke-dasharray" from="0,1000" to="1000,0" dur="2s" fill="freeze" /></polyline>
                            <text x="10" y="20" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="monospace">Crecimiento</text>
                            <text x="320" y="20" fill="#10B981" fontSize="11" fontFamily="monospace" fontWeight="bold">Eficiencia</text>
                        </svg>
                    </div></R>
                </div>
            </div>
        </section>
    );
}

export function ToolsSection() {
    return (
        <section id="tools" className="py-16 md:py-24 px-4 md:px-6 border-b border-white/5">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <span className="inline-block py-1 px-3 rounded-full text-emerald-400 text-xs font-bold border border-emerald-500/20 bg-emerald-500/10 mb-4">OPEN ACCESS</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Herramientas Gratuitas</h2>
                        <p className="text-gray-400 text-base mb-4">Desarrollos libres disponibles para la comunidad. Muestra de nuestra capacidad técnica.</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-gray-500">
                            {['Código Abierto','Sin Registro','Uso Ilimitado'].map(t => <span key={t} className="flex items-center gap-1.5"><i className="fas fa-check-circle text-emerald-500" />{t}</span>)}
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <div className="gl-card p-5 max-w-sm w-full transform md:rotate-2 hover:rotate-0 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative"><Image src="/lucas.jpeg" fill className="object-cover" alt="Lucas" /></div>
                                <div><h4 className="font-bold text-sm">Lucas M.</h4><p className="text-xs text-gray-500 font-mono">@Founder_GrowLabs</p></div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-3">&quot;En <span className="text-emerald-400 font-semibold">Grow Labs</span> creemos que la tecnología debe empujar todo hacia adelante. Por eso dejamos estas herramientas de IA disponibles de forma libre.&quot;</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { icon: 'fa-file-alt', title: 'CV Inteligente', desc: 'Diseños profesionales generados instantáneamente y validados por sistemas ATS.', href: '/cv-maker', cta: 'IR A CV MAKER', popular: true },
                        { icon: 'fa-microphone-lines', title: 'Transcriptor IA', desc: 'Convierte reuniones en resúmenes estructurados usando IA.', href: '/tools/transcriptor', cta: 'TRANSCRIBIR' },
                        { icon: 'fa-images', title: 'Image to PDF', desc: 'Convierte fotografías de documentos directamente a PDFs ligeros. 100% privado.', href: '/tools/image-to-pdf', cta: 'CONVERTIR' },
                    ].map((t, i) => (
                        <R key={i} delay={i * 80}><div className="gl-card p-6 md:p-7 flex flex-col group hover:border-emerald-500/30 relative overflow-hidden">
                            {t.popular && <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-bl-lg">POPULAR</div>}
                            <div className="mb-4"><i className={`fas ${t.icon} text-2xl text-gray-500 group-hover:text-emerald-400 transition-colors`} /></div>
                            <h3 className="text-lg font-bold mb-2">{t.title}</h3>
                            <p className="text-sm text-gray-400 mb-6 flex-1">{t.desc}</p>
                            <Link href={t.href} className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:text-emerald-300 transition-colors">{t.cta} <i className="fas fa-arrow-right" /></Link>
                        </div></R>
                    ))}
                </div>
            </div>
        </section>
    );
}
