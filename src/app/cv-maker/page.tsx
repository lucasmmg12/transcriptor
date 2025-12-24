"use client";

import React from 'react';
import Link from 'next/link';

export default function CVMakerLanding() {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl w-full text-center">
                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Creador de Currículum Profesional
                </h1>
                <p className="text-xl text-gray-400 mb-12">
                    Diseña un CV de alto impacto en minutos. Elige cómo quieres empezar.
                </p>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Opción Manual */}
                    <Link href="/cv-maker/manual" className="group relative bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-500 text-blue-400 group-hover:text-white transition-all">
                            <i className="fas fa-pen-to-square text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-white">Manual</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Rellena cada campo paso a paso. Ideal si tienes tu información organizada y quieres control total sobre cada detalle.
                        </p>
                        <div className="mt-6 flex justify-center text-blue-400 font-bold text-sm tracking-wide uppercase group-hover:text-blue-300">
                            Comenzar &rarr;
                        </div>
                    </Link>

                    {/* Opción IA */}
                    <Link href="/cv-maker/ai" className="group relative bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
                        <div className="absolute -top-3 -right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                            Recomendado
                        </div>
                        <div className="absolute inset-0 bg-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-500 text-purple-400 group-hover:text-white transition-all">
                            <i className="fas fa-wand-magic-sparkles text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-white">Inteligencia Artificial</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Simplemente cuéntanos sobre ti en un párrafo. Nuestra IA redactará, estructurará y mejorará tu perfil profesional automáticamente.
                        </p>
                        <div className="mt-6 flex justify-center text-purple-400 font-bold text-sm tracking-wide uppercase group-hover:text-purple-300">
                            Probar Magia &rarr;
                        </div>
                    </Link>

                </div>

                <div className="mt-12">
                    <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
                        &larr; Volver al inicio
                    </Link>
                </div>

            </div>

            {/* Font Awesome */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
