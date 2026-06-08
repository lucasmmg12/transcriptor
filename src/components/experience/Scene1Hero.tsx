'use client';
import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import CodeBuilder from './CodeBuilder';
import BuildingCanvas from './BuildingCanvas';

const HERO_CODE = [
    { text: 'grow-labs init --project="Tu Negocio"', type: 'command' as const },
    { text: 'Initializing workspace...', type: 'info' as const },
    { text: 'Core engine loaded', type: 'success' as const },
    { text: 'Scanning business requirements...', type: 'info' as const },
    { text: 'AI pipeline connected', type: 'success' as const },
    { text: 'Foundation layer ready', type: 'success' as const },
    { text: 'Waiting for modules...', type: 'comment' as const },
];

export default function Scene1Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [buildingProgress, setBuildingProgress] = useState(0);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                pin: false,
                onUpdate: (self) => {
                    setBuildingProgress(self.progress * 0.25);
                },
            },
        });

        tl.fromTo('.hero-title', { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0);
        tl.fromTo('.hero-subtitle', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0.3);
        tl.fromTo('.hero-terminal', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1 }, 0.2);
        tl.fromTo('.hero-building', { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1 }, 0.2);
        tl.fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.8);

    }, { scope: sectionRef });

    return (
        <section id="scene-1" ref={sectionRef} className="relative min-h-[200vh]">
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Central glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
                </div>

                {/* Title */}
                <div className="relative z-10 text-center mb-12">
                    <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none opacity-0">
                        <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">GROW</span>
                        <span className="bg-gradient-to-b from-emerald-400 to-emerald-600 bg-clip-text text-transparent"> LABS</span>
                    </h1>
                    <p className="hero-subtitle text-lg sm:text-xl text-gray-400 mt-4 font-light tracking-wide opacity-0">
                        Construimos software que construye negocios
                    </p>
                </div>

                {/* Terminal + Building side by side */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    {/* Terminal */}
                    <div className="hero-terminal opacity-0 bg-[#0A0F0D] border border-white/10 rounded-xl p-5 backdrop-blur-sm shadow-2xl max-h-[300px] overflow-hidden">
                        <CodeBuilder lines={HERO_CODE} triggerId="scene-1" className="" />
                    </div>

                    {/* Building */}
                    <div className="hero-building opacity-0 h-[300px] relative">
                        <BuildingCanvas progress={buildingProgress} />
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="hero-scroll-hint absolute bottom-8 flex flex-col items-center gap-2 opacity-0">
                    <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Scroll para construir</span>
                    <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
                        <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
}
