'use client';
import Image from 'next/image';
import R from './ScrollReveal';

export default function DirectionSection() {
    return (
        <section id="direccion" className="py-16 md:py-24 px-4 sm:px-6 border-t border-white/5">
            <div className="container mx-auto max-w-5xl">
                <R><div className="mb-12">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 block">Equipo directivo</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Dirección de Grow Labs</h2>
                    <p className="text-gray-400 max-w-2xl text-base">Combinamos visión tecnológica, pensamiento estratégico y capacidad real de implementación.</p>
                </div></R>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <R delay={0}><div className="gl-card p-6 md:p-8 text-center group">
                        <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-emerald-500/30 relative group-hover:border-emerald-400/60 transition-all">
                            <Image src="/lucas.jpeg" alt="Lucas Marinero" fill className="object-cover" />
                        </div>
                        <h3 className="text-lg font-bold">Lucas Marinero</h3>
                        <p className="text-emerald-400 text-sm font-medium mb-3">Cofundador · Dirección Técnica y Producto</p>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">Lidera la visión tecnológica, el desarrollo de soluciones digitales, automatizaciones y software a medida.</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Producto','IA','Automatización','Software'].map(t => <span key={t} className="gl-tag"><i className="fas fa-code text-emerald-500/60 text-[8px]" />{t}</span>)}
                        </div>
                    </div></R>
                    <R delay={120}><div className="gl-card p-6 md:p-8 text-center group">
                        <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-emerald-500/30 relative bg-emerald-900/20 flex items-center justify-center group-hover:border-emerald-400/60 transition-all">
                            <span className="text-3xl font-bold text-emerald-400/60">GR</span>
                        </div>
                        <h3 className="text-lg font-bold">Gustavo Regalado</h3>
                        <p className="text-emerald-400 text-sm font-medium mb-3">Socio · Dirección Estratégica, Operativa y Comercial</p>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">Fortalece la estrategia empresarial, el orden operativo, el desarrollo comercial y la implementación en empresas reales.</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Estrategia','Gestión','Procesos','Comercial'].map(t => <span key={t} className="gl-tag"><i className="fas fa-briefcase text-emerald-500/60 text-[8px]" />{t}</span>)}
                        </div>
                    </div></R>
                </div>

                <R><div className="gl-card p-6 md:p-8 text-center">
                    <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                        La fortaleza de Grow Labs está en la complementariedad: <span className="text-emerald-400 font-semibold">visión técnica para construir soluciones</span> y <span className="text-emerald-400 font-semibold">visión empresarial para aplicarlas correctamente.</span>
                    </p>
                </div></R>
            </div>
        </section>
    );
}
