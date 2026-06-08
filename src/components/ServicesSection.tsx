'use client';
import ScrollReveal from './ScrollReveal';

const SERVICES = [
    { icon: 'fa-search-plus', title: 'Diagnóstico Digital', desc: 'Analizamos tu operación actual, identificamos cuellos de botella y diseñamos un mapa de prioridades claro.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: 'fa-sitemap', title: 'Ordenamiento de Procesos', desc: 'Documentamos y estructuramos los procesos clave para que tu equipo trabaje con claridad y trazabilidad.', color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: 'fa-cogs', title: 'Implementación Tecnológica', desc: 'Desarrollamos e integramos las soluciones digitales que tu empresa necesita: software, automatizaciones, dashboards.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: 'fa-chart-line', title: 'Seguimiento y Evolución', desc: 'Acompañamos la adopción, medimos resultados y ajustamos el sistema para que crezca con tu empresa.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

export default function ServicesSection() {
    return (
        <section id="servicios" className="py-16 md:py-24 px-4 sm:px-6 relative">
            <div className="container mx-auto max-w-6xl">
                <ScrollReveal>
                    <div className="text-center mb-12 md:mb-16">
                        <span className="text-green-400 font-bold tracking-widest text-xs uppercase mb-3 block">Nuestro proceso</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Del <span className="neon-text text-green-400">desorden</span> al sistema</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">No vendemos herramientas sueltas. Diseñamos un proceso de transformación con acompañamiento real.</p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {SERVICES.map((s, i) => (
                        <ScrollReveal key={i} delay={i * 100}>
                            <div className="grow-card p-6 md:p-8 h-full flex flex-col group">
                                {/* Step number */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} text-lg`}>
                                        <i className={`fas ${s.icon}`} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Etapa {i + 1}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-green-400 transition-colors">{s.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed flex-1">{s.desc}</p>

                                {/* Connector arrow (not on last) */}
                                {i < 3 && (
                                    <div className="hidden lg:flex justify-end mt-4">
                                        <i className="fas fa-arrow-right text-green-500/30 text-sm" />
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
