'use client';
import R from './ScrollReveal';

const ITEMS = [
    { icon: 'fa-link', title: 'No vendemos herramientas sueltas', desc: 'Diseñamos soluciones conectadas con el problema real de cada empresa.' },
    { icon: 'fa-crosshairs', title: 'Escuchamos el fondo del negocio', desc: 'Analizamos procesos, prioridades, datos y objetivos antes de implementar nada.' },
    { icon: 'fa-sliders', title: 'Diseñamos sistemas a medida', desc: 'Cada empresa necesita una solución aplicable a su realidad concreta.' },
    { icon: 'fa-microchip', title: 'Implementamos tecnología real', desc: 'Software, IA y automatizaciones cuando realmente aportan valor medible.' },
    { icon: 'fa-handshake', title: 'Acompañamos la adopción', desc: 'Ajustamos y seguimos la implementación para que funcione en el día a día.' },
    { icon: 'fa-puzzle-piece', title: 'Es estrategia, procesos y tecnología', desc: 'La diferencia está en convertir una necesidad empresarial en una solución concreta.' },
];

export default function PrinciplesSection() {
    return (
        <section id="servicios" className="py-16 md:py-24 px-4 sm:px-6 border-t border-white/5">
            <div className="container mx-auto max-w-6xl">
                <R><div className="mb-12">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 block">Cómo trabajamos</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-3">No entregamos tecnología.<br />Entregamos <span className="text-emerald-400">resultados sostenibles.</span></h2>
                    <p className="text-gray-400 max-w-2xl text-base md:text-lg">Combinamos pensamiento estratégico, conocimiento del negocio y tecnología para diseñar sistemas que transforman.</p>
                </div></R>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ITEMS.map((p, i) => (
                        <R key={i} delay={i * 80}><div className="gl-card p-6 group">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all flex-shrink-0">
                                    <i className={`fas ${p.icon}`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1.5">{p.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        </div></R>
                    ))}
                </div>
            </div>
        </section>
    );
}
