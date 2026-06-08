'use client';
import { useEffect, useRef } from 'react';

export default function Particles() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = ref.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        if (!ctx) return;

        let w = (c.width = window.innerWidth);
        let h = (c.height = window.innerHeight);
        let animId: number;

        const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
        const count = Math.min(60, Math.floor((w * h) / 20000));
        const maxDist = 120;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 * (1 - dist / maxDist)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };

        const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}
