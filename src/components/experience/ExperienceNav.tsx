'use client';
import { useState, useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap-config';

const SCENES = [
    { id: 'scene-1', label: 'Init' },
    { id: 'scene-2', label: 'Diagnose' },
    { id: 'scene-3', label: 'Install' },
    { id: 'scene-4', label: 'Test' },
    { id: 'scene-5', label: 'Deploy' },
];

export default function ExperienceNav() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const triggers = SCENES.map((scene, i) => {
            return ScrollTrigger.create({
                trigger: `#${scene.id}`,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActive(i),
                onEnterBack: () => setActive(i),
            });
        });
        return () => triggers.forEach(t => t.kill());
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
            {SCENES.map((scene, i) => (
                <button
                    key={scene.id}
                    onClick={() => scrollTo(scene.id)}
                    className="group flex items-center gap-3"
                    title={scene.label}
                >
                    <span className={`block rounded-full transition-all duration-300 ${
                        active === i
                            ? 'w-3 h-3 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                            : 'w-2 h-2 bg-white/20 group-hover:bg-white/40'
                    }`} />
                    <span className={`text-xs font-mono transition-all duration-300 ${
                        active === i ? 'text-emerald-400 opacity-100' : 'text-white/0 group-hover:text-white/50'
                    }`}>{scene.label}</span>
                </button>
            ))}
        </nav>
    );
}
