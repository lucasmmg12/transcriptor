'use client';
import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';

interface CodeLine {
    text: string;
    type: 'command' | 'success' | 'error' | 'warning' | 'info' | 'comment';
    delay?: number;
}

interface CodeBuilderProps {
    lines: CodeLine[];
    triggerId: string;
    className?: string;
}

function highlightLine(line: CodeLine) {
    const colors: Record<string, string> = {
        command: '#A78BFA',
        success: '#34D399',
        error: '#F87171',
        warning: '#FBBF24',
        info: '#9CA3AF',
        comment: '#4B5563',
    };
    const prefix: Record<string, string> = {
        command: '$ ',
        success: '  ✓ ',
        error: '  ✗ ',
        warning: '  ⚠ ',
        info: '  → ',
        comment: '  // ',
    };

    return (
        <span style={{ color: colors[line.type] }}>
            <span className="opacity-50">{prefix[line.type]}</span>
            {line.text}
        </span>
    );
}

export default function CodeBuilder({ lines, triggerId, className = '' }: CodeBuilderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleLines, setVisibleLines] = useState(0);

    useGSAP(() => {
        const trigger = document.getElementById(triggerId);
        if (!trigger) return;

        ScrollTrigger.create({
            trigger,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;
                const count = Math.floor(progress * lines.length);
                setVisibleLines(Math.min(count, lines.length));
            },
        });
    }, { dependencies: [triggerId, lines.length] });

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [visibleLines]);

    return (
        <div className={`code-builder font-mono text-sm leading-relaxed ${className}`} ref={containerRef}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="ml-3 text-xs text-gray-500 font-mono">grow-labs — terminal</span>
            </div>
            <div className="space-y-1.5">
                {lines.slice(0, visibleLines).map((line, i) => (
                    <div key={i} className="animate-fade-in-line whitespace-nowrap">
                        {highlightLine(line)}
                    </div>
                ))}
                {visibleLines < lines.length && (
                    <span className="inline-block w-2.5 h-5 bg-emerald-400 animate-pulse ml-1" />
                )}
            </div>
        </div>
    );
}
