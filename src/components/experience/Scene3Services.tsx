'use client';
import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import CodeBuilder from './CodeBuilder';
import BuildingCanvas from './BuildingCanvas';

const SERVICES = [
    { name: '@grow/erp-engine', label: 'ERP a Medida', desc: 'Sistemas de gestión empresarial completos. RRHH, compras, finanzas, logística.', icon: '🏗️' },
    { name: '@grow/ai-bot', label: 'Bot IA 24/7', desc: 'Atención automatizada vía WhatsApp con IA que entiende tu negocio.', icon: '🤖' },
    { name: '@grow/dashboard-bi', label: 'Dashboard BI', desc: 'Panel de Business Intelligence con datos en tiempo real y predicciones.', icon: '📊' },
    { name: '@grow/ecommerce', label: 'E-Commerce', desc: 'Tiendas online con catálogo, pagos y logística integrada.', icon: '🛒' },
    { name: '@grow/mobile-app', label: 'App Mobile', desc: 'Aplicaciones nativas y PWA para tu equipo y tus clientes.', icon: '📱' },
    { name: '@grow/web-platform', label: 'Web & Landing', desc: 'Sitios web de alto impacto que convierten visitantes en clientes.', icon: '🌐' },
];

const INSTALL_CODE = [
    { text: 'grow-labs install --modules', type: 'command' as const },
    { text: 'Resolving dependencies...', type: 'info' as const },
    ...SERVICES.map(s => ({ text: `${s.name} ............ installed`, type: 'success' as const })),
    { text: '', type: 'comment' as const },
    { text: '6 modules installed successfully', type: 'success' as const },
    { text: 'Building structure: floors 4-10 added', type: 'info' as const },
];

export default function Scene3Services() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [buildingProgress, setBuildingProgress] = useState(0.4);
    const [activeService, setActiveService] = useState(0);

    useGSAP(() => {
        if (!sectionRef.current || !trackRef.current) return;

        gsap.to(trackRef.current, {
            xPercent: -100 * ((SERVICES.length - 1) / SERVICES.length),
            ease: 'none',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: `+=${SERVICES.length * 400}`,
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    setBuildingProgress(0.4 + p * 0.35);
                    setActiveService(Math.min(Math.floor(p * SERVICES.length), SERVICES.length - 1));
                },
            },
        });
    }, { scope: sectionRef });

    return (
        <section id="scene-3" ref={sectionRef} className="relative min-h-screen">
            <div className="h-screen flex flex-col overflow-hidden">
                {/* Header */}
                <div className="pt-8 pb-4 px-6 flex-shrink-0">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                Installing <span className="text-emerald-400">modules</span>...
                            </h2>
                            <p className="text-gray-500 text-sm mt-1 font-mono">{activeService + 1}/{SERVICES.length} packages</p>
                        </div>
                        {/* Mini building indicator */}
                        <div className="hidden md:block w-24 h-32">
                            <BuildingCanvas progress={buildingProgress} />
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="max-w-6xl mx-auto mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
                            style={{ width: `${((activeService + 1) / SERVICES.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Terminal mini */}
                <div className="px-6 pb-4 flex-shrink-0">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-[#0A0F0D] border border-white/10 rounded-lg p-3 font-mono text-xs max-h-[80px] overflow-hidden">
                            <span className="text-purple-400">$ </span>
                            <span className="text-gray-400">grow-labs install --modules</span>
                            {SERVICES.slice(0, activeService + 1).map((s, i) => (
                                <div key={i} className="text-emerald-400 opacity-80">
                                    {'  '}✓ {s.name} <span className="text-gray-600">........</span> installed
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Horizontal scroll track */}
                <div className="flex-1 flex items-center overflow-hidden">
                    <div ref={trackRef} className="flex gap-6 px-6" style={{ width: `${SERVICES.length * 420}px` }}>
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.name}
                                className={`flex-shrink-0 w-[380px] p-8 rounded-2xl border transition-all duration-500 ${
                                    i === activeService
                                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] scale-105'
                                        : 'bg-white/[0.02] border-white/10 scale-95 opacity-50'
                                }`}
                            >
                                <span className="text-5xl mb-4 block">{s.icon}</span>
                                <h3 className="text-xl font-bold text-white mb-1">{s.label}</h3>
                                <p className="text-xs font-mono text-emerald-400/60 mb-3">{s.name}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                                <div className="mt-6 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${i <= activeService ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                                    <span className="text-xs font-mono text-gray-500">
                                        {i <= activeService ? 'installed' : 'pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
