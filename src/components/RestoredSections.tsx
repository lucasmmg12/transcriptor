'use client';
import Image from 'next/image';
import { useState } from 'react';
import R from './ScrollReveal';

const LOGOS = [
    '/absorbpad.webp', '/adventure pro.webp', '/brico supermercados.webp',
    '/centro medico de especialidades.webp', '/jerpro.webp', '/lomos emi.webp',
    '/neumaticos gallo.webp', '/rustik.webp', '/sanatorio argentino.webp',
    '/todo alarmas.webp', '/vyper suplementos.webp'
];

const INTEGRATIONS = [
    { name: 'OpenAI', icon: 'fas fa-robot', color: 'text-emerald-400' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'text-green-400' },
    { name: 'Google Cloud', icon: 'fab fa-google', color: 'text-blue-400' },
    { name: 'Supabase', icon: 'fas fa-database', color: 'text-emerald-300' },
    { name: 'Zapier', icon: 'fas fa-bolt', color: 'text-orange-400' },
    { name: 'Vercel', icon: 'fas fa-triangle-exclamation', color: 'text-white' },
    { name: 'Next.js', icon: 'fab fa-react', color: 'text-cyan-400' },
    { name: 'Python', icon: 'fab fa-python', color: 'text-yellow-400' },
    { name: 'Stripe', icon: 'fab fa-stripe', color: 'text-purple-400' },
    { name: 'n8n', icon: 'fas fa-code-branch', color: 'text-red-400' },
    { name: 'Make', icon: 'fas fa-wand-magic-sparkles', color: 'text-violet-400' },
    { name: 'PostgreSQL', icon: 'fas fa-database', color: 'text-blue-300' },
];

export function ClientLogos() {
    const [selected, setSelected] = useState<string | null>(null);
    return (
        <>
        <section className="py-6 md:py-8 border-y border-white/5 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#0a0f0d] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#0a0f0d] to-transparent z-10" />
            <div className="text-center text-xs font-semibold text-gray-600 mb-5 uppercase tracking-widest px-4">Empresas que confían en nosotros</div>
            <div className="marquee-container">
                <div className="marquee-content flex gap-6 md:gap-10 px-4">
                    {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                        <div key={i} onClick={() => setSelected(logo)} className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 grayscale opacity-30 hover:grayscale-0 hover:opacity-80 transition-all duration-300 rounded-full bg-white/5 border border-white/10 cursor-pointer overflow-hidden p-2">
                            <Image src={logo} fill alt="Cliente" className="object-contain p-1" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
        {selected && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer" onClick={() => setSelected(null)}>
                <div className="relative w-full max-w-lg aspect-square bg-white/5 rounded-2xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg" onClick={() => setSelected(null)}><i className="fas fa-times" /></button>
                    <Image src={selected} fill alt="Cliente" className="object-contain p-4" />
                </div>
            </div>
        )}
        </>
    );
}

export function IntegrationsMarquee() {
    return (
        <section className="py-6 md:py-8 border-b border-white/5 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#0a0f0d] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#0a0f0d] to-transparent z-10" />
            <div className="text-center text-xs font-semibold text-gray-600 mb-5 uppercase tracking-widest px-4">Herramientas de automatización que usamos</div>
            <div className="marquee-container">
                <div className="marquee-content flex gap-8 md:gap-12 px-4">
                    {[...INTEGRATIONS, ...INTEGRATIONS].map((t, i) => (
                        <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                            <i className={`${t.icon} text-lg ${t.color}`} />
                            <span className="font-semibold text-sm text-gray-400">{t.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function StatsSection() {
    return (
        <section className="py-10 md:py-14 border-b border-white/5">
            <R><div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    {[
                        { label: 'Reducción de Errores', value: '85%' },
                        { label: 'Más Rápido', value: '10x' },
                        { label: 'Disponibilidad', value: '24/7' },
                        { label: 'Crecimiento', value: '+245%' },
                    ].map((s, i) => (
                        <div key={i} className="py-2">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div></R>
        </section>
    );
}

export function MisionSection() {
    return (
        <section className="py-16 md:py-20 px-4 sm:px-6 border-b border-white/5">
            <div className="container mx-auto max-w-4xl text-center">
                <R><span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 block">Sobre nosotros</span></R>
                <R delay={80}><h2 className="text-3xl md:text-4xl font-bold mb-6">Convertimos desorden operativo en sistemas digitales concretos</h2></R>
                <R delay={160}><p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed max-w-3xl mx-auto">
                    Grow Labs nace de la experiencia directa con la complejidad operativa de las empresas. Entendemos los desafíos de procesos dispersos, información desordenada y falta de visibilidad. Nuestra misión es transformar esa fricción en eficiencia mediante soluciones digitales a medida.
                </p></R>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                    {[
                        { icon: 'fa-rocket', title: 'Misión', desc: 'Eliminar la fricción operativa para que los equipos se enfoquen en lo que realmente importa: el crecimiento.' },
                        { icon: 'fa-brain', title: 'Visión', desc: 'Ser el partner digital que impulsa las operaciones ágiles de las empresas modernas en LATAM.' },
                        { icon: 'fa-gem', title: 'Valores', desc: 'Precisión Operativa • Adaptación Local • Innovación Transparente y Escalabilidad garantizada.' },
                    ].map((m, i) => (
                        <R key={i} delay={i * 100}><div className="gl-card p-6">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 text-emerald-400"><i className={`fas ${m.icon}`} /></div>
                            <h4 className="font-bold text-white mb-2">{m.title}</h4>
                            <p className="text-sm text-gray-400">{m.desc}</p>
                        </div></R>
                    ))}
                </div>
            </div>
        </section>
    );
}
