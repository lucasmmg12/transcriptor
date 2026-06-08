'use client';
import { useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import BuildingCanvas from './BuildingCanvas';

const DEPLOY_LINES = [
    '$ grow-labs deploy --production',
    '  → Optimizing bundle...',
    '  ✓ Assets compressed (92% reduction)',
    '  ✓ CDN configured — global edge network',
    '  ✓ SSL certificates generated',
    '  ✓ Performance score: 98/100',
    '  ✓ Deploy successful ✨',
    '',
    '  🚀 Your software is live!',
];

export default function Scene5Launch() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const [showFlash, setShowFlash] = useState(false);

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
                    setShowFlash(self.progress > 0.7);
                },
            },
        });

        gsap.fromTo('.deploy-cta', { opacity: 0, y: 40, scale: 0.9 }, {
            opacity: 1, y: 0, scale: 1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 30%', end: 'top 10%', scrub: 1 }
        });
    }, { scope: sectionRef });

    const visibleLines = Math.floor(progress * DEPLOY_LINES.length);

    return (
        <section id="scene-5" ref={sectionRef} className="relative min-h-[200vh]">
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
                {/* Flash effect */}
                {showFlash && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute inset-0 bg-emerald-400/5 animate-pulse" style={{ animationDuration: '2s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-400/10 blur-[80px]" />
                    </div>
                )}

                <h2 className="relative z-10 text-3xl md:text-5xl font-black tracking-tight text-white mb-2 text-center">
                    Deploy <span className="text-emerald-400">successful</span> ✨
                </h2>

                {/* Terminal + Building centered */}
                <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-8">
                    {/* Terminal */}
                    <div className="bg-[#0A0F0D] border border-white/10 rounded-xl p-5 font-mono text-sm max-h-[280px] overflow-hidden">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                            <span className="ml-2 text-xs text-gray-600">deploy</span>
                        </div>
                        {DEPLOY_LINES.slice(0, visibleLines).map((line, i) => (
                            <div key={i} className="py-0.5" style={{
                                color: line.startsWith('$') ? '#A78BFA' :
                                       line.includes('✓') ? '#34D399' :
                                       line.includes('🚀') ? '#FBBF24' :
                                       line.includes('→') ? '#9CA3AF' : '#4B5563'
                            }}>
                                {line}
                            </div>
                        ))}
                        {visibleLines < DEPLOY_LINES.length && (
                            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
                        )}
                    </div>

                    {/* Building — complete */}
                    <div className={`h-[280px] transition-all duration-700 ${showFlash ? 'scale-105' : ''}`}>
                        <BuildingCanvas progress={0.95 + progress * 0.05} />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="deploy-cta relative z-10 text-center mt-4 opacity-0">
                    <p className="text-xl md:text-2xl font-bold text-white mb-2">
                        Tu próximo proyecto empieza <span className="text-emerald-400">ahora</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                        Agendá un diagnóstico gratuito. Analizamos tu negocio y te mostramos qué podemos construir juntos.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://wa.me/5492645438114"
                            target="_blank"
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full text-sm tracking-wide shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all hover:scale-105 active:scale-95"
                        >
                            💬 Diagnóstico Gratuito
                        </a>
                        <a
                            href="https://wa.me/5492645438114"
                            target="_blank"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 text-white font-bold rounded-full text-sm tracking-wide transition-all hover:scale-105 active:scale-95"
                        >
                            📞 WhatsApp Directo
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
