'use client';
import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import CodeBuilder from './CodeBuilder';
import BuildingCanvas from './BuildingCanvas';

const DIAGNOSIS_CODE = [
    { text: 'grow-labs diagnose --scan', type: 'command' as const },
    { text: 'Scanning current systems...', type: 'info' as const },
    { text: 'ERROR: Data silos detected — 5 disconnected sources', type: 'error' as const },
    { text: 'ERROR: No automation layer configured', type: 'error' as const },
    { text: 'WARNING: Manual processes consuming 40+ hrs/week', type: 'warning' as const },
    { text: 'WARNING: Response time avg: 24hrs (target: <1hr)', type: 'warning' as const },
    { text: '', type: 'comment' as const },
    { text: 'grow-labs diagnose --fix', type: 'command' as const },
    { text: 'Patching data pipeline...', type: 'success' as const },
    { text: 'Connecting data sources (5/5)...', type: 'success' as const },
    { text: 'Installing automation layer...', type: 'success' as const },
    { text: 'Optimizing response workflow...', type: 'success' as const },
    { text: 'All issues resolved ✨', type: 'success' as const },
];

export default function Scene2Diagnosis() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [buildingProgress, setBuildingProgress] = useState(0.25);
    const [shake, setShake] = useState(false);

    useGSAP(() => {
        if (!sectionRef.current) return;

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    const p = self.progress;
                    setShake(p > 0.15 && p < 0.45);
                    setBuildingProgress(0.25 + p * 0.15);
                },
            },
        });

        gsap.fromTo('.diag-left', { opacity: 0, x: -40 }, {
            opacity: 1, x: 0,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 }
        });
        gsap.fromTo('.diag-right', { opacity: 0, x: 40 }, {
            opacity: 1, x: 0,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 30%', scrub: 1 }
        });
        gsap.fromTo('.diag-title', { opacity: 0, y: 30 }, {
            opacity: 1, y: 0,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 50%', scrub: 1 }
        });
    }, { scope: sectionRef });

    return (
        <section id="scene-2" ref={sectionRef} className="relative min-h-[200vh]">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
                {/* Red/Green gradient background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-red-900/5 to-transparent" />
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/5 to-transparent" />
                </div>

                <h2 className="diag-title relative z-10 text-3xl md:text-5xl font-black text-center mb-10 tracking-tight">
                    <span className="text-red-400">Errores</span>
                    <span className="text-gray-500 mx-3">→</span>
                    <span className="text-emerald-400">Soluciones</span>
                </h2>

                <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Terminal */}
                    <div className="diag-left bg-[#0A0F0D] border border-white/10 rounded-xl p-5 backdrop-blur-sm shadow-2xl max-h-[350px] overflow-hidden">
                        <CodeBuilder lines={DIAGNOSIS_CODE} triggerId="scene-2" />
                    </div>

                    {/* Building (shaking when errors) */}
                    <div className={`diag-right h-[350px] relative transition-transform ${shake ? 'animate-shake' : ''}`}>
                        <BuildingCanvas progress={buildingProgress} />
                    </div>
                </div>
            </div>
        </section>
    );
}
