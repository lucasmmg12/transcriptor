'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

export default function ScrollReveal({ children, className = '', delay = 0, variant = 'up' }: {
    children: ReactNode; className?: string; delay?: number; variant?: 'up' | 'left' | 'right' | 'scale';
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [vis, setVis] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVis(true); obs.disconnect(); }
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const base = 'transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]';
    const v: Record<string, string> = {
        up: vis ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        left: vis ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0',
        right: vis ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0',
        scale: vis ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
    };

    return (
        <div ref={ref} className={`${base} ${v[variant]} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
}
