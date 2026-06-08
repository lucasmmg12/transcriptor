'use client';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

const LOGOS = [
    '/absorbpad.webp', '/adventure pro.webp', '/brico supermercados.webp',
    '/centro medico de especialidades.webp', '/jerpro.webp', '/lomos emi.webp',
    '/neumaticos gallo.webp', '/rustik.webp', '/sanatorio argentino.webp',
    '/todo alarmas.webp', '/vyper suplementos.webp'
];

export default function ClientsMarquee() {
    return (
        <section className="py-8 md:py-12 border-y border-white/5 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <ScrollReveal>
                <div className="text-center text-xs font-semibold text-gray-500 mb-6 md:mb-8 uppercase tracking-widest px-4">
                    Empresas que confían en nosotros
                </div>
            </ScrollReveal>

            <div className="marquee-container">
                <div className="marquee-content flex gap-8 md:gap-12 px-4 items-center" style={{ animationDuration: '80s' }}>
                    {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
                        <div key={i} className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-2 overflow-hidden">
                            <div className="relative w-full h-full">
                                <Image src={logo} alt={`Cliente`} fill className="object-contain" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
