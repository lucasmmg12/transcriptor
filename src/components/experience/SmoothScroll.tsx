'use client';
import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap-config';

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return <>{children}</>;
}
