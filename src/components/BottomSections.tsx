'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import R from './ScrollReveal';

const FAQS = [
    { q: '¿Cómo empieza el proceso?', a: 'Con una reunión de diagnóstico gratuita donde entendemos tu operación, identificamos oportunidades y armamos un plan de trabajo con prioridades claras.' },
    { q: '¿Cuánto tiempo toma una implementación?', a: 'Depende del alcance. Una primera versión funcional puede estar lista en 15-30 días. Priorizamos entregas incrementales para que veas resultados desde el inicio.' },
    { q: '¿Necesito conocimientos técnicos?', a: 'No. Nosotros nos encargamos de toda la parte técnica. Lo que necesitamos es tu conocimiento del negocio para diseñar la solución correcta.' },
    { q: '¿Se integra con mis sistemas actuales?', a: 'Sí. Trabajamos con APIs, webhooks e integraciones para conectar con casi cualquier sistema existente.' },
];

export function FAQSection() {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <section id="faq" className="py-16 md:py-24 px-4 sm:px-6 border-t border-white/5">
            <div className="container mx-auto max-w-3xl">
                <R><h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Preguntas Frecuentes</h2></R>
                <div className="space-y-3">
                    {FAQS.map((f, i) => (
                        <R key={i} delay={i * 60}><div className="gl-card overflow-hidden cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
                            <div className="p-5 flex justify-between items-center">
                                <span className="font-semibold text-sm pr-4">{f.q}</span>
                                <i className={`fas fa-chevron-down text-gray-500 text-xs transition-transform duration-300 ${open === i ? 'rotate-180 text-emerald-400' : ''}`} />
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 pb-5 px-5 border-t border-white/5' : 'max-h-0'}`}>
                                <p className="text-gray-400 text-sm pt-3">{f.a}</p>
                            </div>
                        </div></R>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function CTASection() {
    return (
        <section className="py-16 md:py-24 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/3 to-transparent pointer-events-none" />
            <div className="container mx-auto max-w-4xl relative z-10 text-center">
                <R><h2 className="text-3xl md:text-5xl font-bold mb-4">Empezá ordenando tu empresa <span className="text-emerald-400">antes de sumar más herramientas</span></h2></R>
                <R delay={100}><p className="text-gray-400 mb-8 max-w-xl mx-auto text-base">Si tu empresa tiene potencial pero trabaja con procesos desordenados, herramientas sueltas o datos que nadie consolida, es hora de ordenar y escalar de verdad.</p></R>
                <R delay={200}><div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-grow justify-center"><i className="fas fa-calendar-check" /> Solicitar diagnóstico</a>
                    <a href="https://wa.me/5492645438114" target="_blank" className="btn-outline justify-center"><i className="fab fa-whatsapp text-emerald-400" /> Hablar por WhatsApp</a>
                </div></R>
            </div>
        </section>
    );
}

export function FooterSection() {
    return (
        <footer className="border-t border-white/5 pt-14 pb-8">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 relative"><Image src="/logogrow.png" fill alt="Grow Labs" className="object-contain" /></div>
                            <span className="font-bold text-sm tracking-wide">GROW LABS</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">Consultoría e implementación de sistemas digitales.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-3">Empresa</h4>
                        <div className="space-y-2 text-sm"><a href="#servicios" className="block text-gray-400 hover:text-white transition-colors">Cómo trabajamos</a><a href="#direccion" className="block text-gray-400 hover:text-white transition-colors">Dirección</a></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-3">Soluciones</h4>
                        <div className="space-y-2 text-sm"><a href="#soluciones" className="block text-gray-400 hover:text-white transition-colors">Automatización</a><a href="#soluciones" className="block text-gray-400 hover:text-white transition-colors">BI & Dashboards</a></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-3">Herramientas</h4>
                        <div className="space-y-2 text-sm"><Link href="/cv-maker" className="block text-gray-400 hover:text-white transition-colors">CV Maker</Link><Link href="/tools/transcriptor" className="block text-gray-400 hover:text-white transition-colors">Transcriptor IA</Link><Link href="/tools/image-to-pdf" className="block text-gray-400 hover:text-white transition-colors">Image to PDF</Link></div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-3">Contacto</h4>
                        <div className="space-y-2 text-sm"><a href="mailto:hola@growlabs.com.ar" className="block text-gray-400 hover:text-white transition-colors">hola@growlabs.com.ar</a><a href="https://wa.me/5492645438114" target="_blank" className="block text-gray-400 hover:text-white transition-colors">+54 9 264 543-8114</a><span className="block text-gray-600">San Juan, Argentina</span></div>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <span>© {new Date().getFullYear()} Grow Labs. Todos los derechos reservados.</span>
                    <div className="flex gap-3">
                        <a href="https://www.linkedin.com/in/lucas-marinero-182521308/" target="_blank" className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-white transition-all"><i className="fab fa-linkedin-in text-xs" /></a>
                        <a href="https://www.instagram.com/growsanjuan/" target="_blank" className="w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-white transition-all"><i className="fab fa-instagram text-xs" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
