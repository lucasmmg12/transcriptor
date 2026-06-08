'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import R from './ScrollReveal';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0f0d]/90 backdrop-blur-md border-b border-white/5' : ''}`}>
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 relative"><Image src="/logogrow.png" fill alt="Grow Labs" className="object-contain" /></div>
                    <span className="font-bold text-sm tracking-wide">GROW LABS</span>
                </Link>
                <nav className="hidden md:flex gap-7 text-sm text-gray-400">
                    <a href="#servicios" className="hover:text-white transition-colors">Cómo trabajamos</a>
                    <a href="#soluciones" className="hover:text-white transition-colors">Soluciones</a>
                    <a href="#direccion" className="hover:text-white transition-colors">Dirección</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </nav>
                <div className="flex items-center gap-3">
                    <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="hidden md:inline-flex text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors items-center gap-1.5">
                        Solicitar diagnóstico <i className="fas fa-arrow-right text-xs" />
                    </a>
                    <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <i className={`fas ${open ? 'fa-times' : 'fa-bars'} text-sm`} />
                    </button>
                </div>
            </div>
            {open && (
                <div className="md:hidden bg-[#0a0f0d]/95 backdrop-blur-xl border-t border-white/5 px-6 py-5 space-y-3">
                    {['servicios', 'soluciones', 'direccion', 'faq'].map(s => (
                        <a key={s} href={`#${s}`} onClick={() => setOpen(false)} className="block text-gray-300 py-2 capitalize hover:text-emerald-400 transition-colors">{s === 'servicios' ? 'Cómo trabajamos' : s === 'soluciones' ? 'Soluciones' : s === 'direccion' ? 'Dirección' : 'FAQ'}</a>
                    ))}
                    <a href="https://cal.com/lucas-marinero-ji1yyg/15min" target="_blank" className="btn-grow w-full justify-center mt-2">Solicitar diagnóstico</a>
                </div>
            )}
        </header>
    );
}
