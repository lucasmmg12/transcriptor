'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { gsap } from '@/lib/gsap-config';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WebGLIcon from '@/components/WebGLIcon';
import WebGLGreenIcon from '@/components/WebGLGreenIcon';

const SOLUTIONS = [
    {
        id: 'sistemas-operativos',
        icon: 'fa-sitemap',
        title: "Sistemas operativos personalizados",
        description: "Software para controlar procesos, solicitudes, documentación, inventario, producción, logística, atención, administración o cualquier operación específica.",
        tags: ['Gestión de procesos', 'Flujos de aprobación', 'Trazabilidad', 'Roles y permisos']
    },
    {
        id: 'sistemas-gestion',
        icon: 'fa-chart-bar',
        title: "Sistemas de gestión y decisión",
        description: "Herramientas para transformar información operativa en control gerencial. Tableros diseñados para líderes que necesitan ver la realidad de su empresa.",
        tags: ['Dashboards', 'Indicadores', 'Alertas', 'Reportes automáticos', 'Rentabilidad']
    },
    {
        id: 'automatizacion-ia',
        icon: 'fa-robot',
        title: "Automatización e inteligencia aplicada",
        description: "Tecnología integrada dentro de los procesos reales de la organización para eliminar trabajo repetitivo y potenciar la capacidad de tus equipos.",
        tags: ['Integraciones', 'Procesamiento de datos', 'Asistentes internos', 'IA controlada']
    }
];

const INDUSTRIES = [
    {
        id: 'salud',
        icon: 'fa-hospital',
        title: 'Salud',
        items: ['Auditoría de historias clínicas.', 'Seguimiento de internaciones.', 'Gestión documental.', 'Control de facturación.', 'Indicadores clínicos.']
    },
    {
        id: 'logistica',
        icon: 'fa-truck',
        title: 'Logística',
        items: ['Gestión de viajes.', 'Seguimiento de vehículos.', 'Control de entregas.', 'Recepción con evidencia.', 'Mantenimiento y combustible.']
    },
    {
        id: 'comercio',
        icon: 'fa-store',
        title: 'Comercio e industria',
        items: ['Compras e inventario.', 'Control de costos.', 'Producción y trazabilidad.', 'Ventas y rentabilidad.', 'Tableros gerenciales.']
    },
    {
        id: 'servicios',
        icon: 'fa-users-cog',
        title: 'Empresas de servicios',
        items: ['Gestión de clientes y proyectos.', 'Tareas y responsables.', 'Seguimiento comercial.', 'Documentación.', 'Automatización de comunicaciones.']
    }
];

const WORK_STAGES = [
    { num: '01', title: 'Diagnóstico operativo', desc: 'Entendemos los procesos, responsables, información, problemas, dependencias y objetivos de la empresa.' },
    { num: '02', title: 'Diseño del sistema', desc: 'Definimos módulos, flujos, permisos, reglas, indicadores e integraciones.' },
    { num: '03', title: 'Desarrollo por etapas', desc: 'Construimos módulos funcionales y los validamos junto con los usuarios reales.' },
    { num: '04', title: 'Implementación y adopción', desc: 'Capacitamos al equipo, migramos información y acompañamos el uso de la herramienta.' },
    { num: '05', title: 'Evolución continua', desc: 'Medimos resultados y ampliamos el sistema según las nuevas necesidades de la organización.' },
];

const CASES = [
    {
        title: 'Sanatorio Argentino',
        image: '/sanatorio argentino.webp',
        featured: true,
        description: 'Hemos creado el sistema integral con el que se maneja administración y facturación, además de crear proyectos como auditorías de historias clínicas, análisis de datos y desarrollo de un RAG institucional (un sistema de Inteligencia Artificial que permite consultar miles de documentos internos e historias clínicas de forma instantánea y precisa).'
    },
    {
        title: 'Ecar',
        image: '/rombo.jpeg',
        featured: true,
        description: 'Sistema de gestión completo para una empresa constructora, integrando módulos de logística y de obra, con un desarrollo muy avanzado que incluye un apartado para conocer el estado crediticio de cada cliente.'
    },
    {
        title: 'Absorbpad',
        image: '/absorbpad.webp',
        featured: false,
        description: 'Página web que ahora tracciona y convierte visitantes en clientes de forma automática.'
    },
    {
        title: 'Adventure Pro',
        image: '/adventure pro.webp',
        featured: false,
        description: 'Desarrollo e integración de chatbots inteligentes para atención al cliente y ventas.'
    },
    {
        title: 'Estilo Apple',
        image: '/ea.png',
        featured: false,
        description: 'Sistema de gestión de punta a punta que maneja a todos sus clientes, sus ventas y bots de WhatsApp integrados.'
    },
    {
        title: 'Rustik',
        image: '/rustik.webp',
        featured: false,
        description: 'Implementación de un chatbot automatizado para gestión de consultas.'
    },
    {
        title: 'Neumáticos Gallo',
        image: '/neumaticos gallo.webp',
        featured: false,
        description: 'CRM integrado con chatbot que se utiliza estratégicamente para convertir mensajes en ventas.'
    },
    {
        title: 'Centro Médico de Especialidades',
        image: '/centro medico de especialidades.webp',
        featured: false,
        description: 'Software personalizado para gestionar, organizar y entregar estudios cardiológicos.'
    },
    {
        title: 'Vyper Suplementos',
        image: '/vyper suplementos.webp',
        featured: false,
        description: 'Sistema de gestión integral con ecommerce mayorista y minorista incluido en la misma plataforma.'
    }
];

const FAQS = [
    {
        q: '¿Qué tipo de software desarrolla Grow Labs?',
        a: 'Desarrollamos sistemas empresariales personalizados para ordenar procesos, centralizar información, automatizar tareas y mejorar el control operativo.'
    },
    {
        q: '¿Trabajan con software prearmado?',
        a: 'No ofrecemos un producto genérico que obligue a todas las empresas a trabajar de la misma forma. Cada proyecto se diseña alrededor de los procesos reales de la organización.'
    },
    {
        q: '¿Debo reemplazar todos mis sistemas actuales?',
        a: 'No necesariamente. Podemos integrar herramientas existentes, reemplazar únicamente procesos críticos o desarrollar nuevos módulos de manera progresiva.'
    },
    {
        q: '¿Cuánto demora un desarrollo?',
        a: 'Depende del alcance, la complejidad y la cantidad de módulos. El trabajo se organiza por etapas para entregar funcionalidades utilizables durante el proyecto.'
    },
    {
        q: '¿Qué empresas pueden trabajar con Grow Labs?',
        a: 'Empresas que ya tienen una operación activa y necesitan mejorar el control, reducir tareas manuales, integrar información o desarrollar herramientas específicas.'
    },
    {
        q: '¿Utilizan inteligencia artificial?',
        a: 'Sí, cuando aporta valor real al proceso. La inteligencia artificial puede integrarse para analizar información, procesar documentos, asistir usuarios o automatizar decisiones controladas.'
    },
    {
        q: '¿Qué es Grow IQ?',
        a: 'Es un diagnóstico automatizado que evalúa la madurez operativa, digital y tecnológica de una empresa y genera un puntaje de 0 a 100.'
    }
];

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Scroll Reveal Observer
    useEffect(() => {
        const sections = document.querySelectorAll('.reveal-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // GSAP 3D Scroll Animations & interactive tilt
    useEffect(() => {
        const cards = gsap.utils.toArray('.card-3d') as HTMLElement[];
        if (cards.length === 0) return;

        gsap.registerPlugin(ScrollTrigger);

        cards.forEach((card) => {
            gsap.set(card, {
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
                rotationX: 15,
                y: 80,
                opacity: 0,
                scale: 0.95
            });

            gsap.to(card, {
                rotationX: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                onStart: () => {
                    card.style.willChange = "transform, opacity";
                },
                onComplete: () => {
                    card.style.willChange = "auto";
                },
                scrollTrigger: {
                    trigger: card,
                    start: "top 92%",
                    toggleActions: "play none none none",
                }
            });
        });

        const quickTransforms = cards.map(card => {
            return {
                card,
                rotateX: gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power2.out" }),
                skewY: gsap.quickTo(card, "skewY", { duration: 0.5, ease: "power2.out" }),
                y: gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" })
            };
        });

        const scrollTriggerInstance = ScrollTrigger.create({
            onUpdate: (self) => {
                const velocity = self.getVelocity();
                let tilt = velocity / 350;
                tilt = Math.max(-8, Math.min(8, tilt));
                let skew = velocity / 1000;
                skew = Math.max(-2, Math.min(2, skew));
                let yOffset = velocity / 120;
                yOffset = Math.max(-15, Math.min(15, yOffset));

                quickTransforms.forEach((qt) => {
                    const rect = qt.card.getBoundingClientRect();
                    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
                    if (inViewport) {
                        qt.card.style.willChange = "transform";
                        qt.rotateX(-tilt);
                        qt.skewY(skew);
                        qt.y(yOffset);
                    }
                });
            }
        });

        const cleanupListeners: (() => void)[] = [];

        cards.forEach((card) => {
            const handleMouseMove = (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = x / rect.width - 0.5;
                const yc = y / rect.height - 0.5;
                const rotX = -yc * 20;
                const rotY = xc * 20;
                
                card.style.willChange = "transform";
                gsap.to(card, {
                    rotationX: rotX,
                    rotationY: rotY,
                    scale: 1.03,
                    z: 10,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            };

            const handleMouseLeave = () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    z: 0,
                    skewY: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    overwrite: "auto",
                    onComplete: () => {
                        card.style.willChange = "auto";
                    }
                });
            };

            const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0];
                const rect = card.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                
                if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    const xc = x / rect.width - 0.5;
                    const yc = y / rect.height - 0.5;
                    const rotX = -yc * 14;
                    const rotY = xc * 14;
                    
                    card.style.willChange = "transform";
                    gsap.to(card, {
                        rotationX: rotX,
                        rotationY: rotY,
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
            card.addEventListener('touchmove', handleTouchMove, { passive: true });
            card.addEventListener('touchend', handleMouseLeave);

            cleanupListeners.push(() => {
                card.removeEventListener('mousemove', handleMouseMove);
                card.removeEventListener('mouseleave', handleMouseLeave);
                card.removeEventListener('touchmove', handleTouchMove);
                card.removeEventListener('touchend', handleMouseLeave);
            });
        });

        return () => {
            scrollTriggerInstance.kill();
            cleanupListeners.forEach(cleanup => cleanup());
        };
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="font-sans text-gray-900 bg-gray-950 selection:bg-green-100 scroll-smooth overflow-x-hidden">
            
            {/* BACKGROUND VIDEO */}
            <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    poster="/building-construction.png"
                >
                    <source src="/building-hero-2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
            </div>

            {/* HEADER */}
            <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 relative z-50">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Grow Labs</span>
                    </div>

                    <div className="hidden lg:flex gap-6 xl:gap-8 text-sm font-medium text-gray-300">
                        <a href="#soluciones" onClick={(e) => scrollToSection(e, 'soluciones')} className="hover:text-green-400 transition-colors">Soluciones</a>
                        <a href="#como-trabajamos" onClick={(e) => scrollToSection(e, 'como-trabajamos')} className="hover:text-green-400 transition-colors">Cómo trabajamos</a>
                        <a href="#casos" onClick={(e) => scrollToSection(e, 'casos')} className="hover:text-green-400 transition-colors">Casos</a>
                        <Link href="/grow-iq" className="hover:text-green-400 transition-colors">Grow IQ</Link>
                        <a href="#herramientas" onClick={(e) => scrollToSection(e, 'herramientas')} className="hover:text-green-400 transition-colors">Herramientas</a>
                        <a href="#nosotros" onClick={(e) => scrollToSection(e, 'nosotros')} className="hover:text-green-400 transition-colors">Nosotros</a>
                        <a href="https://wa.me/5492645438114" target="_blank" className="hover:text-green-400 transition-colors">Contacto</a>
                    </div>

                    <div className="flex gap-3 items-center relative z-50">
                        <Link href="/grow-iq" className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm bg-green-500 text-white font-semibold rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all">
                            Calcular Grow IQ
                        </Link>
                        <a href="https://wa.me/5492645438114" target="_blank" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white shadow-md hover:bg-white/20 transition-colors lg:hidden">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative z-10 w-full pt-20">
                
                {/* 1. HERO PRINCIPAL */}
                <section className="pt-16 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 relative text-center min-h-[85vh] md:min-h-[75vh] flex items-center justify-center">
                    <div className="container mx-auto max-w-4xl">
                        <div className="inline-block px-4 py-1.5 mb-6 md:mb-8 rounded-full border border-green-400/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                            Software Empresarial A Medida
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight flex flex-col drop-shadow-lg">
                            <span>Convertimos procesos</span>
                            <span>desordenados en <span className="text-green-400">software que controla</span> tu empresa</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300 mb-8 md:mb-10 max-w-3xl mx-auto px-2 leading-relaxed drop-shadow-md">
                            <strong className="text-white">Analizamos cómo trabaja tu organización, ordenamos sus procesos</strong> y desarrollamos un sistema personalizado para centralizar la operación, reducir errores y acompañar su crecimiento.
                        </p>
                        <p className="text-sm text-gray-400 mb-8 max-w-2xl mx-auto italic">
                            Sistemas diseñados alrededor de tu empresa, no empresas obligadas a adaptarse a un software genérico.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                            <Link href="/grow-iq" className="w-full sm:w-auto px-8 py-4 text-center bg-green-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-105 transition-all">
                                Conocer el nivel digital de mi empresa
                            </Link>
                            <a href="#como-trabajamos" onClick={(e) => scrollToSection(e, 'como-trabajamos')} className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 border border-white/20 shadow-sm bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full font-semibold transition-all">
                                Ver cómo trabajamos <i className="fas fa-arrow-down ml-2 text-sm text-green-400"></i>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. EL PROBLEMA QUE RESOLVEMOS */}
                <section className="py-20 px-4 md:px-6 relative reveal-section bg-gray-950 border-t border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-gray-950 pointer-events-none"></div>
                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Tu empresa creció.<br/><span className="text-green-400">Sus sistemas no.</span></h2>
                            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                                Cuando una empresa crece sin una estructura tecnológica adecuada, la información se fragmenta, los controles dependen de personas y los errores se detectan demasiado tarde.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                            {[
                                { title: 'Información fragmentada', desc: 'Repartida entre Excel, WhatsApp y sistemas aislados.' },
                                { title: 'Doble carga', desc: 'Los mismos datos se ingresan varias veces manualmente.' },
                                { title: 'Ceguera gerencial', desc: 'La dirección no puede ver la operación en tiempo real.' },
                                { title: 'Errores tardíos', desc: 'Se detectan cuando ya impactaron al cliente o al dinero.' }
                            ].map((item, idx) => (
                                <div key={idx} className="card-3d bg-white/5 border border-red-500/20 rounded-2xl p-6 reveal-child backdrop-blur-sm hover:border-red-500/40 transition-colors">
                                    <div className="w-10 h-10 rounded-full text-red-400 flex items-center justify-center mb-4 border border-red-500/20 overflow-hidden relative">
                                        <WebGLIcon type={idx} className="absolute inset-0" />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="card-3d bg-green-500/10 border border-green-500/30 rounded-2xl p-6 md:p-8 text-center max-w-4xl mx-auto reveal-child backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <p className="text-lg md:text-xl text-white font-medium">
                                Grow Labs convierte esa operación fragmentada en un <strong className="text-green-400">sistema centralizado, trazable y diseñado alrededor de la lógica real</strong> de cada organización.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. CASOS Y PROYECTOS DE ÉXITO */}
                <section id="casos" className="py-12 md:py-24 bg-gray-950 text-white reveal-section border-t border-white/5">
                    <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                        <div className="text-center mb-10 md:mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Proyectos reales, <span className="text-green-400">resultados concretos</span></h2>
                            <p className="text-base md:text-lg text-gray-400">Empresas que ya transformaron su operación con Grow Labs.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-16">
                            {CASES.map((caso, i) => {
                                if (caso.featured) {
                                    return (
                                        <div 
                                            key={i} 
                                            className="card-3d bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/80 border border-green-500/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center shadow-[0_0_30px_rgba(34,197,94,0.12)] hover:border-green-400 hover:shadow-[0_0_40px_rgba(34,197,94,0.22)] transition-all md:col-span-2 reveal-child backdrop-blur-md relative overflow-hidden group"
                                        >
                                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/20 transition-all"></div>
                                            
                                            {caso.image && (
                                                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-green-400/50 bg-white p-2 shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center justify-center overflow-hidden">
                                                    <Image src={caso.image} alt={caso.title} fill className="object-contain p-2 rounded-full" />
                                                </div>
                                            )}
                                            
                                            <div className="flex-1">
                                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">{caso.title}</h3>
                                                <p className="text-gray-300 text-base md:text-lg leading-relaxed">{caso.description}</p>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div 
                                        key={i} 
                                        className="card-3d bg-gray-900/80 border border-white/10 rounded-2xl p-6 flex flex-col reveal-child hover:border-green-500/40 hover:bg-gray-900 transition-all relative group backdrop-blur-md shadow-lg"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            {caso.image ? (
                                                <div className="relative w-14 h-14 rounded-full border border-white/20 bg-white p-1.5 shrink-0 shadow-md overflow-hidden flex items-center justify-center">
                                                    <Image src={caso.image} alt={caso.title} fill className="object-contain p-1.5 rounded-full" />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold flex items-center justify-center shrink-0 text-xl shadow-sm">
                                                    {caso.title.charAt(0)}
                                                </div>
                                            )}
                                            <h3 className="text-xl font-bold text-white leading-snug">{caso.title}</h3>
                                        </div>

                                        <p className="text-gray-300 text-sm leading-relaxed flex-1">{caso.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center">
                            <a href="https://wa.me/5492645438114" target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black border border-white/10 transition-colors">
                                Quiero analizar un proceso de mi empresa <i className="fab fa-whatsapp text-green-400 text-lg"></i>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 3. GROW IQ DESTACADO */}
                <section className="py-24 px-4 md:px-6 bg-[#0a0f0d] relative border-y border-white/10 reveal-section overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3"></div>
                    <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6 border border-emerald-500/20">
                                DIAGNÓSTICO EMPRESARIAL GRATUITO
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Antes de desarrollar software, entendé <span className="text-emerald-400">dónde está el problema</span>
                            </h2>
                            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                Completá el diagnóstico Grow IQ y descubrí el nivel de madurez operativa, digital y tecnológica de tu empresa.
                            </p>
                            
                            <ul className="space-y-4 mb-10 text-gray-300">
                                <li className="flex items-start gap-3"><i className="fas fa-check-circle text-emerald-500 mt-1"></i> Puntaje empresarial de 0 a 100.</li>
                                <li className="flex items-start gap-3"><i className="fas fa-check-circle text-emerald-500 mt-1"></i> Evaluación de procesos, datos y automatización.</li>
                                <li className="flex items-start gap-3"><i className="fas fa-check-circle text-emerald-500 mt-1"></i> Identificación de cuellos de botella.</li>
                                <li className="flex items-start gap-3"><i className="fas fa-check-circle text-emerald-500 mt-1"></i> Recomendaciones personalizadas al instante.</li>
                            </ul>

                            <Link href="/grow-iq" className="inline-flex px-8 py-4 text-center bg-emerald-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-105 transition-all">
                                Calcular mi Grow IQ
                            </Link>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <div className="card-3d bg-gray-900/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 bg-white/5 rounded-bl-2xl text-[10px] text-gray-500 font-mono tracking-widest uppercase border-b border-l border-white/5">
                                    Ejemplo Visual
                                </div>
                                <div className="text-center mb-8">
                                    <div className="text-xs text-gray-400 font-bold tracking-widest mb-2">GROW IQ</div>
                                    <div className="text-6xl font-black text-white mb-2">64<span className="text-3xl text-gray-500 font-medium">/100</span></div>
                                    <div className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase">
                                        Empresa en proceso de ordenamiento
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: 'Procesos y organización', score: 71, color: 'bg-emerald-500' },
                                        { label: 'Datos e indicadores', score: 48, color: 'bg-red-500' },
                                        { label: 'Automatización', score: 42, color: 'bg-red-500' },
                                        { label: 'Gestión comercial', score: 69, color: 'bg-amber-500' },
                                        { label: 'Tecnología e IA', score: 55, color: 'bg-amber-500' },
                                        { label: 'Escalabilidad', score: 58, color: 'bg-amber-500' },
                                    ].map((dim, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-300">{dim.label}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 md:w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full ${dim.color}`} style={{ width: `${dim.score}%` }}></div>
                                                </div>
                                                <span className="text-sm font-bold text-white w-6 text-right">{dim.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. QUÉ CONSTRUIMOS (SOLUCIONES) */}
                <section id="soluciones" className="py-20 md:py-28 px-4 md:px-6 bg-gray-950 border-t border-white/5 reveal-section">
                    <div className="container mx-auto max-w-6xl relative z-10">
                        <div className="text-center md:text-left mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Software diseñado alrededor de <span className="text-green-400">tu operación</span></h2>
                            <p className="text-lg text-gray-400 max-w-3xl">
                                No ofrecemos un paquete cerrado. Diseñamos sistemas que representan los procesos reales, responsables, controles e indicadores de cada empresa.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            {SOLUTIONS.map((s, idx) => (
                                <div key={s.id} className="card-3d bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-green-500/30 hover:bg-white/10 transition-all reveal-child group backdrop-blur-sm">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-green-400 text-2xl mb-6 overflow-hidden relative group-hover:scale-110 transition-transform">
                                        <WebGLGreenIcon type={idx} className="absolute inset-0" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                                    <p className="text-gray-400 leading-relaxed mb-8 flex-1">{s.description}</p>
                                    
                                    <div className="space-y-3 pt-6 border-t border-white/10">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Ejemplos</div>
                                        {s.tags.map(tag => (
                                            <div key={tag} className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                                                <i className="fas fa-check text-green-400"></i> {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. EJEMPLOS DE APLICACIÓN (INDUSTRIAS) */}
                <section className="py-20 bg-gray-50 border-y border-gray-200 reveal-section">
                    <div className="container mx-auto max-w-6xl px-4 md:px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">El software puede adaptarse a operaciones como estas</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto italic text-sm">
                                Estos son ejemplos. Cada solución se diseña según la operación real de la empresa.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {INDUSTRIES.map((ind) => (
                                <div key={ind.id} className="card-3d bg-white p-6 rounded-2xl border border-gray-200 shadow-sm reveal-child">
                                    <div className="text-green-600 text-3xl mb-4"><i className={`fas ${ind.icon}`}></i></div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{ind.title}</h3>
                                    <ul className="space-y-2">
                                        {ind.items.map((item, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <i className="fas fa-circle text-[6px] text-green-400 mt-1.5"></i>
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. CÓMO TRABAJAMOS */}
                <section id="como-trabajamos" className="py-24 px-4 md:px-6 bg-gray-950 text-white relative reveal-section">
                    <div className="container mx-auto max-w-5xl relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Cómo convertimos tu operación en software</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                                La empresa no tiene que esperar meses para ver valor. El desarrollo se organiza por módulos funcionales y entregables concretos.
                            </p>
                        </div>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500/0 before:via-green-500/50 before:to-green-500/0">
                            {WORK_STAGES.map((stage, i) => (
                                <div key={stage.num} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active reveal-child`}>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 border-2 border-green-500 text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        {stage.num}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] card-3d bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-green-500/30 transition-colors">
                                        <h3 className="text-xl font-bold text-white mb-2">{stage.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{stage.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* 8. DIFERENCIAL */}
                <section className="py-20 px-4 md:px-6 bg-gray-950 text-white relative reveal-section border-t border-white/10">
                    <div className="container mx-auto max-w-5xl relative z-10">
                        <div className="text-center mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-4 border border-emerald-500/20">
                                NUESTRO DIFERENCIAL
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">No vendemos un sistema para que tu empresa se adapte</h2>
                            <p className="text-gray-400 text-lg">Diseñamos el sistema alrededor de la lógica real de tu organización.</p>
                        </div>

                        <div className="overflow-x-auto pb-6 reveal-child">
                            <table className="w-full min-w-[600px] text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="w-1/3"></th>
                                        <th className="p-4 bg-white/5 text-gray-300 font-bold text-lg rounded-tl-xl border-t border-l border-white/10">Software convencional</th>
                                        <th className="p-4 bg-green-500/10 text-green-400 font-bold text-xl rounded-tr-xl border-t border-r border-green-500/20">Grow Labs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['La empresa debe adaptarse', 'El sistema se adapta a la empresa'],
                                        ['Funciones genéricas', 'Módulos y procesos específicos'],
                                        ['Información fragmentada', 'Operación centralizada'],
                                        ['Implementación puramente técnica', 'Diseño operativo y tecnológico'],
                                        ['Cambios limitados', 'Evolución según el negocio'],
                                        ['Soporte reactivo', 'Acompañamiento continuo'],
                                        ['Soluciones rígidas', 'Arquitectura modular']
                                    ].map((row, i, arr) => (
                                        <tr key={i} className="border-b border-white/5">
                                            <td className="p-4 text-gray-400 text-sm font-medium border-l border-white/10">{i === 0 ? 'Enfoque' : i === 1 ? 'Funcionalidad' : i === 2 ? 'Datos' : i === 3 ? 'Implementación' : i === 4 ? 'Crecimiento' : i === 5 ? 'Soporte' : 'Estructura'}</td>
                                            <td className="p-4 bg-white/5 text-gray-400 text-sm">{row[0]}</td>
                                            <td className={`p-4 bg-green-500/5 text-green-300 text-sm font-bold border-r border-green-500/20 ${i === arr.length - 1 ? 'rounded-br-xl' : ''}`}>{row[1]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 9. HERRAMIENTAS GRATUITAS */}
                <section id="herramientas" className="py-24 px-4 md:px-6 bg-gray-50 border-t border-gray-200 reveal-section">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Tecnología abierta de Grow Labs</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Creamos herramientas gratuitas para ayudar a empresas y personas a acceder a información, analizar situaciones y mejorar su toma de decisiones.
                            </p>
                        </div>

                        {/* Para empresas */}
                        <div className="mb-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <i className="fas fa-building text-green-600"></i> Herramientas para empresas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card-3d bg-white border border-green-200 shadow-[0_10px_30px_rgba(34,197,94,0.1)] rounded-2xl p-8 reveal-child relative overflow-hidden">
                                    <div className="absolute top-0 right-0 px-4 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-bl-xl border-l border-b border-green-200">RECOMENDADO</div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Grow IQ</h4>
                                    <p className="text-gray-600 mb-6 text-sm">Descubrí el nivel de madurez operativa, digital y tecnológica de tu empresa.</p>
                                    <Link href="/grow-iq" className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                                        Calcular Grow IQ
                                    </Link>
                                </div>
                                <div className="card-3d bg-gray-100/50 border border-gray-200 rounded-2xl p-8 reveal-child flex flex-col justify-center items-center text-center">
                                    <h4 className="text-xl font-bold text-gray-400 mb-2">Próximamente</h4>
                                    <p className="text-gray-500 text-sm">Nuevas herramientas en desarrollo para evaluar procesos y calcular el retorno de inversión en software.</p>
                                </div>
                            </div>
                        </div>

                        {/* Para la comunidad */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <i className="fas fa-users text-blue-600"></i> Herramientas para la comunidad
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Link href="/cv-maker" className="card-3d bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all reveal-child group">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-file-alt"></i></div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">CV Inteligente</h4>
                                    <p className="text-sm text-gray-600">Creá un CV profesional estructurado para pasar los filtros de los reclutadores (ATS).</p>
                                </Link>
                                <Link href="/tools/transcriptor" className="card-3d bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:border-purple-300 hover:shadow-md transition-all reveal-child group">
                                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-microphone"></i></div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Transcriptor</h4>
                                    <p className="text-sm text-gray-600">Convertí audios y reuniones a texto con formato profesional de manera automática.</p>
                                </Link>
                                <Link href="/tools/image-to-pdf" className="card-3d bg-white border border-gray-200 shadow-sm rounded-2xl p-6 hover:border-orange-300 hover:shadow-md transition-all reveal-child group">
                                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-file-pdf"></i></div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Imágenes a PDF</h4>
                                    <p className="text-sm text-gray-600">Herramienta rápida y privada para combinar múltiples imágenes en un solo archivo PDF.</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. EQUIPO DIRECTIVO */}
                <section id="nosotros" className="py-24 px-4 md:px-6 bg-white border-t border-gray-200 reveal-section">
                    <div className="container mx-auto max-w-5xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Negocio, procesos y tecnología <span className="text-green-600">en un mismo equipo</span></h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Grow Labs combina conocimiento de gestión empresarial, diseño de procesos y desarrollo de software. Esto permite entender el problema operativo antes de decidir qué tecnología utilizar.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="card-3d bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center group shadow-sm hover:shadow-xl hover:border-green-300 transition-all reveal-child">
                                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                                    <Image src="/lucas.jpeg" alt="Lucas Marinero" fill className="object-cover" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Lucas Marinero</h3>
                                <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-4">Dirección de Producto e Innovación</p>
                                <p className="text-gray-600 text-base leading-relaxed max-w-xs mx-auto">
                                    Especializado en convertir procesos complejos en sistemas, automatizaciones, productos digitales y herramientas para la toma de decisiones.
                                </p>
                            </div>
                            <div className="card-3d bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center group shadow-sm hover:shadow-xl hover:green-300 transition-all reveal-child">
                                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-green-100 flex items-center justify-center">
                                    <span className="text-4xl font-black text-green-700/50">GR</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Gustavo Regalado</h3>
                                <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-4">Dirección Estratégica y Operativa</p>
                                <p className="text-gray-600 text-base leading-relaxed max-w-xs mx-auto">
                                    Especializado en gestión empresarial, organización de procesos, implementación y desarrollo comercial.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 11. FAQ */}
                <section id="faq" className="py-24 bg-gray-50 border-t border-gray-200 reveal-section">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
                            <p className="text-gray-600 text-lg">Todo lo que necesitas saber sobre nuestra forma de trabajar.</p>
                        </div>
                        <div className="space-y-4">
                            {FAQS.map((faq, index) => (
                                <div key={index} className="card-3d bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm reveal-child">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                    >
                                        <span className="font-bold text-gray-900 text-lg pr-8">{faq.q}</span>
                                        <i className={`fas fa-chevron-down text-green-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    <div 
                                        className="overflow-hidden transition-all duration-300 ease-in-out"
                                        style={{ maxHeight: openFaq === index ? '200px' : '0', opacity: openFaq === index ? 1 : 0 }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 12. CTA FINAL */}
                <section className="py-24 px-4 bg-gray-950 text-white text-center relative overflow-hidden reveal-section">
                    <div className="absolute inset-0 bg-green-500/10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="container mx-auto max-w-4xl relative z-10 reveal-child">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">El próximo sistema de tu empresa debería adaptarse a <span className="text-green-400">tu forma de trabajar</span></h2>
                        <p className="text-xl md:text-2xl font-medium text-gray-300 mb-12 max-w-3xl mx-auto">
                            Primero entendamos tus procesos, detectemos dónde se encuentra el mayor problema y definamos qué solución tendría un impacto real.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/grow-iq" className="px-10 py-5 bg-green-500 text-white font-bold rounded-full text-lg shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-105 transition-all">
                                Calcular mi Grow IQ
                            </Link>
                            <a href="https://wa.me/5492645438114" target="_blank" className="px-10 py-5 bg-white/10 text-white font-bold rounded-full text-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                                Hablar sobre un proyecto
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            {/* 13. FOOTER */}
            <footer className="bg-black py-16 text-gray-400 border-t border-white/10 relative z-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                    <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                                </div>
                                <span className="font-bold text-xl text-white tracking-tight">Grow Labs</span>
                            </div>
                            <p className="text-sm leading-relaxed max-w-sm mb-6">
                                Software empresarial a medida para ordenar procesos, centralizar información y acompañar el crecimiento de las organizaciones.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://wa.me/5492645438114" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all border border-white/10"><i className="fab fa-whatsapp"></i></a>
                                <a href="https://instagram.com/growlabs.lat" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all border border-white/10"><i className="fab fa-instagram"></i></a>
                                <a href="https://www.linkedin.com/company/grow-labs-latam/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all border border-white/10"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Navegación</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#soluciones" className="hover:text-green-400 transition-colors">Soluciones</a></li>
                                <li><a href="#como-trabajamos" className="hover:text-green-400 transition-colors">Cómo trabajamos</a></li>
                                <li><a href="#casos" className="hover:text-green-400 transition-colors">Casos de éxito</a></li>
                                <li><a href="#herramientas" className="hover:text-green-400 transition-colors">Herramientas Públicas</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Acceso Rápido</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/grow-iq" className="text-green-400 font-medium hover:text-green-300 transition-colors">Calcular Grow IQ</Link></li>
                                <li><Link href="/cv-maker" className="hover:text-white transition-colors">CV Inteligente</Link></li>
                                <li><Link href="/tools/transcriptor" className="hover:text-white transition-colors">Transcriptor Automático</Link></li>
                                <li><a href="https://wa.me/5492645438114" target="_blank" className="hover:text-white transition-colors">Contacto directo</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>&copy; {new Date().getFullYear()} Grow Labs. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <span className="hover:text-white cursor-pointer">Política de Privacidad</span>
                            <span className="hover:text-white cursor-pointer">Aviso Legal</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
