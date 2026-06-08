'use client';
import R from './ScrollReveal';

const SOLS = [
    { icon: 'fa-robot', title: 'Automatización e inteligencia artificial', desc: 'Integramos IA y automatizaciones para reducir tareas manuales, acelerar respuestas y mejorar seguimiento.', tags: ['Agentes IA','WhatsApp','Flujos automáticos','Carga inteligente'] },
    { icon: 'fa-chart-bar', title: 'Business Intelligence y dashboards', desc: 'Convertimos datos dispersos en tableros claros para medir, comparar y decidir mejor.', tags: ['KPIs','Reportes ejecutivos','Métricas operativas','Paneles de gestión'] },
    { icon: 'fa-globe', title: 'Crecimiento digital y presencia comercial', desc: 'Sitios, landing pages y herramientas comerciales conectadas con tu estrategia de crecimiento.', tags: ['Sitios web','Landing pages','E-commerce','CRM'] },
];

export default function SolutionsSection() {
    return (
        <section id="soluciones" className="py-16 md:py-24 px-4 sm:px-6 border-t border-white/5 relative overflow-hidden">
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="container mx-auto max-w-6xl relative z-10">
                <R><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3 block">Nuestras soluciones</span>
                        <h2 className="text-3xl md:text-5xl font-bold">Tecnología aplicada a<br /><span className="text-emerald-400">problemas concretos</span></h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-sm md:text-base">Desarrollamos soluciones que combinan automatización, análisis de datos e inteligencia artificial para generar resultados medibles.</p>
                </div></R>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {SOLS.map((s, i) => (
                        <R key={i} delay={i * 100}><div className="gl-card p-6 md:p-7 flex flex-col group h-full">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 text-lg mb-5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-all">
                                <i className={`fas ${s.icon}`} />
                            </div>
                            <h3 className="text-base font-bold mb-2">{s.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">{s.desc}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {s.tags.map((t, j) => <span key={j} className="gl-tag"><i className="fas fa-check text-emerald-500 text-[7px]" />{t}</span>)}
                            </div>
                        </div></R>
                    ))}
                </div>
            </div>
        </section>
    );
}
