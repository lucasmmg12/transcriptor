'use client';
import R from './ScrollReveal';

export default function HeroSection() {
    return (
        <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 relative">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                    <div className="md:w-1/2">
                        <R><span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4 block">Consultoría & Sistemas Digitales</span></R>
                        <R delay={80}><h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">Soluciones para <span className="text-emerald-400">ordenar</span><br />y <span className="text-emerald-400">escalar</span> tu empresa</h1></R>
                        <R delay={160}><p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg">Acompañamos a empresas y emprendedores desde el diagnóstico hasta la implementación de sistemas digitales que realmente funcionan.</p></R>
                        <R delay={240}><div className="flex flex-col sm:flex-row gap-3">
                            <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-grow justify-center"><i className="fas fa-calendar-check" /> Solicitar diagnóstico</a>
                            <a href="https://wa.me/5492645438114" target="_blank" className="btn-outline justify-center"><i className="fab fa-whatsapp text-emerald-400" /> Hablar por WhatsApp</a>
                        </div></R>
                    </div>
                    <div className="md:w-1/2 space-y-4">
                        <R delay={200} variant="right">
                            <div className="gl-card p-5 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i className="fas fa-sitemap text-sm" /></div><h3 className="font-bold text-sm">Ordenamiento digital de empresas</h3></div>
                                <div className="bg-black/40 rounded-lg p-4 border border-white/5 text-xs text-gray-500">
                                    <div className="grid grid-cols-3 gap-2 mb-3">{['Diagnóstico','Procesos','Implementación'].map(s => <div key={s} className="bg-white/5 rounded p-2 text-center"><div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1"/>{s}</div>)}</div>
                                    <div className="flex gap-2">{[1,2,3,4].map(i => <div key={i} className="flex-1 h-1.5 rounded bg-emerald-500/20"><div className="h-full rounded bg-emerald-400" style={{width:`${i*25}%`}}/></div>)}</div>
                                </div>
                            </div>
                        </R>
                        <R delay={300} variant="right">
                            <div className="gl-card p-5 relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-3"><div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i className="fas fa-laptop-code text-sm" /></div><h3 className="font-bold text-sm">Sistemas a medida</h3></div>
                                <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-xs">
                                    <div className="flex gap-2 mb-2">{['Dashboard','Ventas','Reportes'].map(t => <span key={t} className="px-2 py-1 rounded bg-white/5 text-gray-500">{t}</span>)}</div>
                                    <div className="grid grid-cols-4 gap-1">{[60,80,40,90,50,70,85,45].map((h,i) => <div key={i} className="bg-emerald-500/10 rounded-sm" style={{height:h*0.4}}><div className="w-full bg-emerald-400/40 rounded-sm" style={{height:`${h}%`}}/></div>)}</div>
                                </div>
                            </div>
                        </R>
                    </div>
                </div>
            </div>
        </section>
    );
}
