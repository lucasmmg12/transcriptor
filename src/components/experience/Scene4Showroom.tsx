'use client';
import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import BuildingCanvas from './BuildingCanvas';

const METRICS = [
    { label: 'Reducción de Errores', value: 85, suffix: '%', color: 'text-emerald-400' },
    { label: 'Velocidad', value: 10, suffix: 'x', color: 'text-emerald-300' },
    { label: 'Disponibilidad', value: 24, suffix: '/7', color: 'text-emerald-400' },
    { label: 'Crecimiento', value: 245, suffix: '%', prefix: '+', color: 'text-emerald-300' },
];

const TEST_CODE = [
    { text: 'grow-labs test --metrics --verbose', type: 'command' as const },
    { text: 'Running performance suite...', type: 'info' as const },
    { text: 'PASS  error_reduction ............ 85%', type: 'success' as const },
    { text: 'PASS  speed_benchmark ............ 10x faster', type: 'success' as const },
    { text: 'PASS  uptime_check ............... 24/7 ✓', type: 'success' as const },
    { text: 'PASS  growth_metrics ............. +245%', type: 'success' as const },
    { text: '', type: 'comment' as const },
    { text: 'All 4 tests passed | Build: STABLE', type: 'success' as const },
];

export default function Scene4Showroom() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [buildingProgress, setBuildingProgress] = useState(0.75);

    useGSAP(() => {
        if (!sectionRef.current) return;

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    setProgress(self.progress);
                    setBuildingProgress(0.75 + self.progress * 0.2);
                },
            },
        });

        gsap.fromTo('.metrics-grid > div', { opacity: 0, y: 40, scale: 0.9 }, {
            opacity: 1, y: 0, scale: 1, stagger: 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'top 20%', scrub: 1 }
        });

        gsap.fromTo('.test-terminal', { opacity: 0, y: 30 }, {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 40%', scrub: 1 }
        });
    }, { scope: sectionRef });

    return (
        <section id="scene-4" ref={sectionRef} className="relative min-h-[200vh]">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
                {/* Aurora background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-600/3 blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
                </div>

                <h2 className="relative z-10 text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
                    Running <span className="text-emerald-400">tests</span>...
                </h2>
                <p className="text-sm font-mono text-gray-500 mb-8">
                    {progress < 1 ? 'Validating metrics...' : 'All tests passed ✓'}
                </p>

                {/* Metrics grid */}
                <div className="metrics-grid relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                    {METRICS.map((m, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-center backdrop-blur-sm">
                            <p className={`text-3xl md:text-4xl font-black font-mono ${m.color}`}>
                                {m.prefix || ''}{Math.floor(m.value * Math.min(progress * 2, 1))}{m.suffix}
                            </p>
                            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">{m.label}</p>
                            <div className="mt-3 flex items-center justify-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${progress > 0.3 ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                                <span className="text-[10px] font-mono text-emerald-400/60">PASS</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom: Terminal + Building */}
                <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="test-terminal bg-[#0A0F0D] border border-white/10 rounded-xl p-4 font-mono text-xs max-h-[200px] overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                            <span className="w-2 h-2 rounded-full bg-red-500/60" />
                            <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                            <span className="w-2 h-2 rounded-full bg-green-500/60" />
                            <span className="ml-2 text-gray-600">test-suite</span>
                        </div>
                        {TEST_CODE.slice(0, Math.floor(progress * TEST_CODE.length) + 1).map((line, i) => (
                            <div key={i} className="py-0.5" style={{ color: line.type === 'success' ? '#34D399' : line.type === 'command' ? '#A78BFA' : line.type === 'error' ? '#F87171' : '#6B7280' }}>
                                {line.type === 'command' ? '$ ' : line.type === 'success' ? '  ✓ ' : line.type === 'error' ? '  ✗ ' : '  → '}
                                {line.text}
                            </div>
                        ))}
                    </div>

                    <div className="h-[200px]">
                        <BuildingCanvas progress={buildingProgress} />
                    </div>
                </div>
            </div>
        </section>
    );
}
