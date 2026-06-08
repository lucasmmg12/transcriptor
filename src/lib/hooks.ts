'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/** Hook: Intersection Observer for scroll-reveal animations */
export function useReveal(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.disconnect(); } },
            { threshold, rootMargin: '0px 0px -50px 0px' }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return { ref, revealed };
}

/** Hook: Animated counter */
export function useCounter(target: number, duration = 2000, startOnReveal = false) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(!startOnReveal);
    const start = useCallback(() => setStarted(true), []);

    useEffect(() => {
        if (!started) return;
        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [started, target, duration]);

    return { count, start };
}
