'use client';
import { useRef, useEffect } from 'react';

interface BuildingCanvasProps {
    progress: number; // 0 to 1
    className?: string;
}

const BUILDING_COLORS = {
    base: '#0A1F14',
    wall: '#0D2A1A',
    wallLit: '#10B981',
    window: '#064E3B',
    windowLit: '#34D399',
    glow: 'rgba(16, 185, 129, 0.3)',
    sky: '#050505',
};

export default function BuildingCanvas({ progress, className = '' }: BuildingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const W = rect.width;
        const H = rect.height;

        // Clear
        ctx.clearRect(0, 0, W, H);

        const totalFloors = 12;
        const floorsVisible = Math.floor(progress * totalFloors);
        const floorH = 32;
        const buildingW = 160;
        const startX = (W - buildingW) / 2;
        const groundY = H - 60;

        // Draw ground line
        ctx.strokeStyle = '#10B98140';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX - 40, groundY);
        ctx.lineTo(startX + buildingW + 40, groundY);
        ctx.stroke();

        // Draw floors from bottom up
        for (let i = 0; i < floorsVisible; i++) {
            const y = groundY - (i + 1) * floorH;
            const isNew = i === floorsVisible - 1;
            const alpha = isNew ? 0.6 + (progress * totalFloors % 1) * 0.4 : 1;

            ctx.globalAlpha = alpha;

            // Floor block
            ctx.fillStyle = BUILDING_COLORS.wall;
            ctx.fillRect(startX, y, buildingW, floorH - 2);

            // Left edge highlight
            ctx.fillStyle = '#10B98115';
            ctx.fillRect(startX, y, 3, floorH - 2);

            // Windows (4 per floor)
            const windowW = 24;
            const windowH = 18;
            const windowGap = (buildingW - 20 - 4 * windowW) / 3;
            for (let w = 0; w < 4; w++) {
                const wx = startX + 10 + w * (windowW + windowGap);
                const wy = y + 6;
                const lit = Math.random() > 0.3 || i < floorsVisible - 2;
                ctx.fillStyle = lit ? BUILDING_COLORS.windowLit : BUILDING_COLORS.window;
                ctx.globalAlpha = lit ? alpha * (0.4 + Math.random() * 0.6) : alpha * 0.2;
                ctx.fillRect(wx, wy, windowW, windowH);
            }
            ctx.globalAlpha = 1;

            // Glow effect for top floor
            if (isNew) {
                ctx.shadowColor = BUILDING_COLORS.wallLit;
                ctx.shadowBlur = 20;
                ctx.strokeStyle = '#10B98160';
                ctx.lineWidth = 1;
                ctx.strokeRect(startX, y, buildingW, floorH - 2);
                ctx.shadowBlur = 0;
            }
        }

        // Antenna on top if > 80% progress
        if (progress > 0.8) {
            const antennaY = groundY - floorsVisible * floorH;
            const centerX = startX + buildingW / 2;
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, antennaY);
            ctx.lineTo(centerX, antennaY - 30);
            ctx.stroke();

            // Blinking light
            const blink = Math.sin(Date.now() / 300) > 0;
            if (blink) {
                ctx.beginPath();
                ctx.arc(centerX, antennaY - 32, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#10B981';
                ctx.fill();
                ctx.shadowColor = '#10B981';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Ground reflection
        if (floorsVisible > 0) {
            const grad = ctx.createLinearGradient(startX, groundY, startX, groundY + 40);
            grad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(startX - 20, groundY, buildingW + 40, 40);
        }

    }, [progress]);

    // Re-render for blinking antenna
    useEffect(() => {
        if (progress <= 0.8) return;
        const interval = setInterval(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            // Trigger re-render by dispatching a resize-like approach
            const event = new Event('building-tick');
            canvas.dispatchEvent(event);
        }, 300);
        return () => clearInterval(interval);
    }, [progress]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{ imageRendering: 'pixelated' }}
        />
    );
}
