'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { jsPDF } from 'jspdf';

// Tipos de datos
type DiagnosticData = {
    id: number;
    nombre: string;
    empresa_rubro: string;
    whatsapp: string;
    mail: string;
    necesidad_principal: string;
    situacion_actual: {
        opciones: string[];
        otro: string;
    };
    resultado_esperado: {
        opciones: string[];
        otro: string;
    };
    herramientas_datos: string;
    personas_usuario: string;
    urgencia: string;
    decision: {
        opcion: string;
        nombre_rol: string;
    };
    escala_solucion: string;
    material_util: {
        opciones: string[];
        comentario_final: string;
    };
    created_at: string;
};

export default function ResultadosDiagPage() {
    // Autenticación
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);

    // Datos del panel
    const [diagnostics, setDiagnostics] = useState<DiagnosticData[]>([]);
    const [selectedDiag, setSelectedDiag] = useState<DiagnosticData | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Verificar si ya estaba logueado
    useEffect(() => {
        const storedAuth = localStorage.getItem('diag_auth');
        const storedEmail = localStorage.getItem('diag_email');
        if (storedAuth === 'true' && storedEmail === 'lucasmmarinero@gmail.com') {
            setIsLoggedIn(true);
            fetchDiagnostics('lucasmmarinero@gmail.com', '123456');
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);

        try {
            const res = await fetch('/api/diagnosticos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput, password: passwordInput }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Credenciales incorrectas');
            }

            setDiagnostics(data.data);
            if (data.data.length > 0) {
                setSelectedDiag(data.data[0]);
            }
            setIsLoggedIn(true);
            localStorage.setItem('diag_auth', 'true');
            localStorage.setItem('diag_email', emailInput);
        } catch (err: any) {
            setLoginError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoginLoading(false);
        }
    };

    const fetchDiagnostics = async (email: string, pass: string) => {
        setLoadingData(true);
        try {
            const res = await fetch('/api/diagnosticos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass }),
            });
            const data = await res.json();
            if (res.ok) {
                setDiagnostics(data.data);
                if (data.data.length > 0) {
                    setSelectedDiag(data.data[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching diagnostics:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('diag_auth');
        localStorage.removeItem('diag_email');
        setIsLoggedIn(false);
        setDiagnostics([]);
        setSelectedDiag(null);
        setEmailInput('');
        setPasswordInput('');
    };

    // Exportar cuestionario seleccionado a PDF
    const exportToPDF = (diag: DiagnosticData) => {
        const doc = new jsPDF();
        let yPos = 20;

        // Estilo e Header
        doc.setFillColor(0, 82, 204); // Azul institucional
        doc.rect(0, 0, 210, 12, 'F');

        // Títulos principales
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(17, 24, 39);
        doc.text('INFORME DE DIAGNÓSTICO OPERATIVO', 14, yPos + 8);
        yPos += 15;

        // Subtítulo
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Generado el: ${new Date().toLocaleDateString()} | Grow Labs`, 14, yPos);
        yPos += 8;

        // Línea divisoria
        doc.setDrawColor(229, 231, 235);
        doc.line(14, yPos, 196, yPos);
        yPos += 10;

        // Sección de Datos de Contacto
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 82, 204);
        doc.text('1. Datos de Contacto', 14, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(17, 24, 39);

        const contactDetails = [
            `Cliente / Nombre: ${diag.nombre}`,
            `Empresa / Rubro: ${diag.empresa_rubro}`,
            `WhatsApp: ${diag.whatsapp}`,
            `Mail: ${diag.mail}`,
            `Fecha de Envío: ${new Date(diag.created_at).toLocaleString()}`,
        ];

        contactDetails.forEach((detail) => {
            doc.text(detail, 14, yPos);
            yPos += 6;
        });
        yPos += 6;

        // Función para imprimir sección de forma ordenada y con control de salto de página
        const printSection = (num: string, title: string, text: string | string[]) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 25;
            }

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(0, 82, 204);
            doc.text(`${num}. ${title}`, 14, yPos);
            yPos += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(55, 65, 81);

            if (Array.isArray(text)) {
                text.forEach((line) => {
                    if (yPos > 275) {
                        doc.addPage();
                        yPos = 25;
                    }
                    doc.text(line, 18, yPos);
                    yPos += 5.5;
                });
            } else {
                const lines = doc.splitTextToSize(text || 'No especificado', 180);
                lines.forEach((line: string) => {
                    if (yPos > 275) {
                        doc.addPage();
                        yPos = 25;
                    }
                    doc.text(line, 18, yPos);
                    yPos += 5.5;
                });
            }
            yPos += 6;
        };

        // 2. Necesidad Principal
        printSection('2', 'Necesidad Principal / Problema a resolver', diag.necesidad_principal);

        // 3. Situación Actual
        const sitOpciones = [
            ...diag.situacion_actual.opciones,
            diag.situacion_actual.otro ? `Otro: ${diag.situacion_actual.otro}` : '',
        ].filter(Boolean);
        printSection('3', 'Cómo lo resuelve actualmente', sitOpciones.length > 0 ? sitOpciones.map(o => `- ${o}`) : 'No especificado');

        // 4. Resultado Esperado
        const resOpciones = [
            ...diag.resultado_esperado.opciones,
            diag.resultado_esperado.otro ? `Otro: ${diag.resultado_esperado.otro}` : '',
        ].filter(Boolean);
        printSection('4', 'Resultados que le gustaría lograr', resOpciones.length > 0 ? resOpciones.map(o => `- ${o}`) : 'No especificado');

        // 5. Herramientas y Datos
        printSection('5', 'Herramientas actuales y estado de los datos', diag.herramientas_datos);

        // 6. Personas
        printSection('6', 'Cantidad de personas que usarán la solución', `- ${diag.personas_usuario}`);

        // 7. Urgencia
        printSection('7', 'Urgencia o plazo estimado de inicio', `- ${diag.urgencia}`);

        // 8. Decisión
        const decisionText = [
            `- Participación: ${diag.decision.opcion}`,
            diag.decision.nombre_rol ? `- Nombre/Rol de terceros involucrados: ${diag.decision.nombre_rol}` : '',
        ].filter(Boolean);
        printSection('8', 'Estructura de decisión de compra', decisionText);

        // 9. Escala
        printSection('9', 'Escala de solución imaginada o requerida', `- ${diag.escala_solucion}`);

        // 10. Material Útil y Comentarios
        const materialText = [
            `Materiales listos para compartir: ${diag.material_util.opciones.join(', ') || 'Ninguno'}`,
            `Comentario o nota final: ${diag.material_util.comentario_final || 'Sin comentarios adicionales'}`,
        ];
        printSection('10', 'Materiales y Comentarios finales', materialText);

        // Guardar el PDF con el nombre de la empresa y cliente
        const sanitizedClient = diag.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const sanitizedCompany = diag.empresa_rubro.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`diagnostico_${sanitizedCompany}_${sanitizedClient}.pdf`);
    };

    // Filtrar diagnósticos por búsqueda
    const filteredDiagnostics = diagnostics.filter((d) => {
        const search = searchTerm.toLowerCase();
        return (
            d.nombre.toLowerCase().includes(search) ||
            d.empresa_rubro.toLowerCase().includes(search) ||
            d.mail.toLowerCase().includes(search)
        );
    });

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-sans relative flex flex-col justify-between">
            {/* Fondo de Cuadrícula */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            <style jsx global>{`
                .bg-grid-pattern {
                    background-size: 40px 40px;
                    background-image: 
                        linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
                }
                .hover-3d-login {
                    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease;
                    transform-style: preserve-3d;
                }
                .hover-3d-login:hover {
                    transform: translateY(-4px) rotateX(1deg) rotateY(-1deg);
                    box-shadow: 0 15px 30px rgba(0, 82, 204, 0.1);
                }
            `}</style>

            {/* Header */}
            <header className="w-full z-50 bg-white border-b border-slate-200 py-3 md:py-4 relative">
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                            <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900">Grow Labs</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                            Auditoría de Diagnósticos
                        </span>
                    </div>

                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200 flex items-center gap-2"
                        >
                            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 md:p-8 relative z-10">
                {!isLoggedIn ? (
                    /* LOGIN CARD SCREEN */
                    <div className="w-full max-w-md mx-auto py-10">
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover-3d-login">
                            <div className="text-center mb-8">
                                <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100">
                                    <i className="fas fa-lock text-2xl"></i>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Acceso Restringido</h1>
                                <p className="text-xs text-gray-500 mt-2 font-mono">
                                    Ingresa tus credenciales autorizadas
                                </p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Usuario / Mail</label>
                                    <input
                                        type="email"
                                        required
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder="lucasmmarinero@gmail.com"
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-700 mb-1.5">Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        placeholder="••••••"
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                                    />
                                </div>

                                {loginError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2 animate-[headShake_0.5s_ease-out_forwards]">
                                        <i className="fas fa-exclamation-circle text-sm"></i>
                                        {loginError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loginLoading}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
                                >
                                    {loginLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Validando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Ingresar</span>
                                            <i className="fas fa-right-to-bracket"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    /* DASHBOARD SCREEN */
                    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        
                        {/* LEFT COLUMN: LIST */}
                        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            {/* Search bar */}
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Buscar por cliente, mail o empresa..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                                    />
                                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                </div>
                            </div>

                            {/* List Content */}
                            <div className="flex-grow overflow-y-auto max-h-[600px] divide-y divide-slate-100 custom-scrollbar">
                                {loadingData ? (
                                    <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2 justify-center">
                                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-medium">Cargando registros...</span>
                                    </div>
                                ) : filteredDiagnostics.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        No se encontraron registros de diagnósticos.
                                    </div>
                                ) : (
                                    filteredDiagnostics.map((diag) => (
                                        <button
                                            key={diag.id}
                                            onClick={() => setSelectedDiag(diag)}
                                            className={`w-full p-4 text-left hover:bg-slate-50 transition-all flex justify-between items-center border-l-4 ${
                                                selectedDiag?.id === diag.id
                                                    ? 'border-blue-600 bg-blue-50/20'
                                                    : 'border-transparent'
                                            }`}
                                        >
                                            <div className="min-w-0 pr-3">
                                                <h3 className="text-xs font-bold text-gray-900 truncate">
                                                    {diag.nombre}
                                                </h3>
                                                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                                                    {diag.empresa_rubro}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-mono block mt-1">
                                                    {new Date(diag.created_at).toLocaleDateString()} - {new Date(diag.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <i className="fas fa-chevron-right text-gray-300 text-xs shrink-0"></i>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: DETAILS */}
                        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            {selectedDiag ? (
                                <>
                                    {/* Detail Header */}
                                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                        <div>
                                            <h2 className="text-sm font-bold text-gray-900">
                                                {selectedDiag.nombre}
                                            </h2>
                                            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                                                {selectedDiag.empresa_rubro}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => exportToPDF(selectedDiag)}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
                                        >
                                            <i className="fas fa-file-pdf"></i> Exportar PDF
                                        </button>
                                    </div>

                                    {/* Detail Content */}
                                    <div className="flex-grow p-6 overflow-y-auto max-h-[530px] space-y-6 custom-scrollbar text-xs">
                                        
                                        {/* Contact Grid */}
                                        <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                            <div>
                                                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] block">WhatsApp</span>
                                                <a 
                                                    href={`https://wa.me/${selectedDiag.whatsapp.replace(/[^0-9]/g, '')}`} 
                                                    target="_blank" 
                                                    className="font-bold text-blue-600 hover:underline flex items-center gap-1.5 mt-0.5"
                                                >
                                                    <i className="fab fa-whatsapp text-green-500"></i> {selectedDiag.whatsapp}
                                                </a>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] block">Mail de contacto</span>
                                                <span className="font-bold text-gray-800 block mt-0.5">{selectedDiag.mail}</span>
                                            </div>
                                        </div>

                                        {/* Questions mapping */}
                                        <div className="space-y-5">
                                            <div>
                                                <h4 className="font-bold text-blue-600 mb-1.5">2. Necesidad principal</h4>
                                                <p className="text-gray-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">{selectedDiag.necesidad_principal}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-blue-600 mb-1.5">3. Situación actual</h4>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {selectedDiag.situacion_actual.opciones.map((opt) => (
                                                        <span key={opt} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700">
                                                            {opt}
                                                        </span>
                                                    ))}
                                                </div>
                                                {selectedDiag.situacion_actual.otro && (
                                                    <p className="text-slate-500 italic">Otro: {selectedDiag.situacion_actual.otro}</p>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-blue-600 mb-1.5">4. Resultado esperado</h4>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {selectedDiag.resultado_esperado.opciones.map((opt) => (
                                                        <span key={opt} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700">
                                                            {opt}
                                                        </span>
                                                    ))}
                                                </div>
                                                {selectedDiag.resultado_esperado.otro && (
                                                    <p className="text-slate-500 italic">Otro: {selectedDiag.resultado_esperado.otro}</p>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-blue-600 mb-1.5">5. Herramientas y datos</h4>
                                                <p className="text-gray-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">{selectedDiag.herramientas_datos}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-bold text-blue-600 mb-1">6. Personas usuarias</h4>
                                                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 inline-block">{selectedDiag.personas_usuario}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-blue-600 mb-1">7. Urgencia de inicio</h4>
                                                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 inline-block">{selectedDiag.urgencia}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-bold text-blue-600 mb-1.5">8. Decisión de compra</h4>
                                                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 inline-block mb-1.5">{selectedDiag.decision.opcion}</span>
                                                    {selectedDiag.decision.nombre_rol && (
                                                        <p className="text-slate-500 italic">Involucrado: {selectedDiag.decision.nombre_rol}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-blue-600 mb-1">9. Escala de solución</h4>
                                                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700 inline-block">{selectedDiag.escala_solucion}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-blue-600 mb-1.5">10. Materiales y Comentario final</h4>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {selectedDiag.material_util.opciones.map((opt) => (
                                                        <span key={opt} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700">
                                                            {opt}
                                                        </span>
                                                    ))}
                                                    {selectedDiag.material_util.opciones.length === 0 && (
                                                        <span className="text-slate-400 italic">Ningún material</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                                                    {selectedDiag.material_util.comentario_final || 'Sin comentarios adicionales.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex items-center justify-center p-8 text-slate-400 text-xs">
                                    Selecciona un diagnóstico de la lista para auditar sus respuestas.
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="w-full py-4 text-center text-[10px] text-slate-400 relative z-10 border-t border-slate-200 bg-white">
                <div className="container mx-auto px-4">
                    &copy; {new Date().getFullYear()} Grow Labs | Auditoría Interna de Diagnósticos.
                </div>
            </footer>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );
}
