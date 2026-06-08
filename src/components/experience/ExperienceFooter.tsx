'use client';

export default function ExperienceFooter() {
    return (
        <footer className="relative z-10 border-t border-white/5 bg-[#030705]">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-black tracking-tight mb-2">
                            <span className="text-white">GROW</span>
                            <span className="text-emerald-400"> LABS</span>
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Fábrica de software inteligente.<br />
                            San Juan, Argentina.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Servicios</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer">ERP a Medida</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Bot IA 24/7</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer">Dashboard BI</li>
                            <li className="hover:text-emerald-400 transition-colors cursor-pointer">E-Commerce</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contacto</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>
                                <a href="https://wa.me/5492645438114" target="_blank" className="hover:text-emerald-400 transition-colors">
                                    📱 WhatsApp
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/growsanjuan/" target="_blank" className="hover:text-emerald-400 transition-colors">
                                    📸 Instagram
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/lucas-marinero-182521308/" target="_blank" className="hover:text-emerald-400 transition-colors">
                                    💼 LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600 font-mono">
                        © {new Date().getFullYear()} Grow Labs. Todos los derechos reservados.
                    </p>
                    <p className="text-[10px] text-gray-700 tracking-widest uppercase font-mono">
                        Diseñado y desarrollado por Grow Labs
                    </p>
                </div>
            </div>
        </footer>
    );
}
