'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

// Tipos de datos para el cuestionario
type FormState = {
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
};

const INITIAL_STATE: FormState = {
    nombre: '',
    empresa_rubro: '',
    whatsapp: '',
    mail: '',
    necesidad_principal: '',
    situacion_actual: { opciones: [], otro: '' },
    resultado_esperado: { opciones: [], otro: '' },
    herramientas_datos: '',
    personas_usuario: '',
    urgencia: '',
    decision: { opcion: '', nombre_rol: '' },
    escala_solucion: '',
    material_util: { opciones: [], comentario_final: '' },
};

const SITUACION_ACTUAL_OPTIONS = [
    { label: 'Excel/planillas', value: 'Excel/planillas' },
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Papel', value: 'Papel' },
    { label: 'Sistema actual', value: 'Sistema actual' },
    { label: 'Manualmente', value: 'Manualmente' },
];

const RESULTADO_ESPERADO_OPTIONS = [
    { label: 'Ahorrar tiempo', value: 'Ahorrar tiempo' },
    { label: 'Ordenar información', value: 'Ordenar información' },
    { label: 'Automatizar tareas', value: 'Automatizar tareas' },
    { label: 'Mejorar atención', value: 'Mejorar atención' },
    { label: 'Vender más', value: 'Vender más' },
    { label: 'Tener reportes/indicadores', value: 'Tener reportes/indicadores' },
    { label: 'Crear sistema a medida', value: 'Crear sistema a medida' },
    { label: 'Usar IA', value: 'Usar IA' },
];

const PERSONAS_OPTIONS = [
    'Solo yo',
    '2 a 5 personas',
    '6 a 10 personas',
    'Más de 10',
    'No lo sé todavía'
];

const URGENCIA_OPTIONS = [
    'Lo antes posible',
    'Durante este mes',
    'Próximos 2/3 meses',
    'Más adelante',
    'Estamos evaluando'
];

const DECISION_OPTIONS = [
    'Yo decido',
    'Decido con otra persona',
    'Lo decide otra persona'
];

const ESCALA_OPTIONS = [
    'Inicial, simple y concreta',
    'Intermedia, con varias funciones',
    'Integral',
    'Necesito orientación'
];

const MATERIAL_OPTIONS = [
    'Planilla',
    'Capturas',
    'Página web',
    'Sistema actual',
    'Ejemplo'
];

export default function DiagnosticoPage() {
    const [step, setStep] = useState(0); // 0: Welcome, 1 to 10: Form steps, 11: Success
    const [form, setForm] = useState<FormState>(INITIAL_STATE);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Animación 3D en base al paso y dirección
    const getCardStyle = (currentStep: number) => {
        if (currentStep !== step) return 'hidden';
        return direction === 'forward' 
            ? 'animate-[slideIn3D_0.6s_ease-out_forwards]' 
            : 'animate-[slideIn3DBack_0.6s_ease-out_forwards]';
    };

    const handleNext = () => {
        if (validateStep()) {
            setDirection('forward');
            setStep((s) => s + 1);
            setError(null);
        }
    };

    const handleBack = () => {
        setDirection('backward');
        setStep((s) => Math.max(0, s - 1));
        setError(null);
    };

    const validateStep = (): boolean => {
        if (step === 1) {
            if (!form.nombre.trim() || !form.empresa_rubro.trim() || !form.whatsapp.trim() || !form.mail.trim()) {
                setError('Por favor completa todos los campos de contacto.');
                return false;
            }
        }
        if (step === 2) {
            if (!form.necesidad_principal.trim()) {
                setError('Por favor descríbenos tu necesidad principal.');
                return false;
            }
        }
        if (step === 3) {
            if (form.situacion_actual.opciones.length === 0 && !form.situacion_actual.otro.trim()) {
                setError('Por favor selecciona al menos una opción o describe tu situación actual.');
                return false;
            }
        }
        if (step === 4) {
            if (form.resultado_esperado.opciones.length === 0 && !form.resultado_esperado.otro.trim()) {
                setError('Por favor selecciona al menos un resultado esperado.');
                return false;
            }
        }
        if (step === 5) {
            if (!form.herramientas_datos.trim()) {
                setError('Por favor cuéntanos sobre tus herramientas y datos actuales.');
                return false;
            }
        }
        if (step === 6) {
            if (!form.personas_usuario) {
                setError('Por favor selecciona cuántas personas usarían la solución.');
                return false;
            }
        }
        if (step === 7) {
            if (!form.urgencia) {
                setError('Por favor indícanos la urgencia del proyecto.');
                return false;
            }
        }
        if (step === 8) {
            if (!form.decision.opcion) {
                setError('Por favor selecciona quién participa en la decisión.');
                return false;
            }
            if ((form.decision.opcion === 'Decido con otra persona' || form.decision.opcion === 'Lo decide otra persona') && !form.decision.nombre_rol.trim()) {
                setError('Por favor especifica el nombre o rol de la otra persona.');
                return false;
            }
        }
        if (step === 9) {
            if (!form.escala_solucion) {
                setError('Por favor selecciona la escala de la solución que imaginas.');
                return false;
            }
        }
        return true;
    };

    const handleCheckboxChange = (
        section: 'situacion_actual' | 'resultado_esperado' | 'material_util',
        value: string
    ) => {
        setForm((prev) => {
            const currentOptions = prev[section].opciones;
            const newOptions = currentOptions.includes(value)
                ? currentOptions.filter((o) => o !== value)
                : [...currentOptions, value];
            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    opciones: newOptions,
                },
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: dbError } = await supabase.from('diagnosticos').insert({
                nombre: form.nombre,
                empresa_rubro: form.empresa_rubro,
                whatsapp: form.whatsapp,
                mail: form.mail,
                necesidad_principal: form.necesidad_principal,
                situacion_actual: form.situacion_actual,
                resultado_esperado: form.resultado_esperado,
                herramientas_datos: form.herramientas_datos,
                personas_usuario: form.personas_usuario,
                urgencia: form.urgencia,
                decision: form.decision,
                escala_solucion: form.escala_solucion,
                material_util: form.material_util,
            });

            if (dbError) throw dbError;

            setStep(11); // Mostrar pantalla de éxito
        } catch (err: any) {
            console.error('Error al guardar el diagnóstico:', err);
            setError(err.message || 'Ocurrió un error al enviar el cuestionario. Por favor reintenta.');
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => {
        if (step === 0 || step === 11) return null;
        const percentage = (step / 10) * 100;
        return (
            <div className="w-full max-w-xl mx-auto mb-8 px-4 relative z-20">
                <div className="flex justify-between text-xs text-gray-500 font-mono mb-2">
                    <span className="font-bold text-green-600">PASO {step} de 10</span>
                    <span>{Math.round(percentage)}% completado</span>
                </div>
                {/* 3D looking progress bar container */}
                <div className="h-3 bg-slate-100 rounded-full border border-slate-200 overflow-hidden shadow-inner relative flex items-center">
                    <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-[0_1px_5px_rgba(34,197,94,0.4)] transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden relative flex flex-col justify-between">
            {/* Elemento de Fondo de Cuadrícula */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

            {/* Floating 3D Glowing Elements in Background */}
            <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-green-200/20 blur-3xl pointer-events-none z-0 animate-[floatBlob_10s_infinite_alternate]"></div>
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-emerald-200/10 blur-3xl pointer-events-none z-0 animate-[floatBlob_14s_infinite_alternate-reverse]"></div>

            {/* Estilos CSS personalizados para la animación 3D */}
            <style jsx global>{`
                .bg-grid-pattern {
                    background-size: 40px 40px;
                    background-image: 
                        linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
                }
                
                @keyframes slideIn3D {
                    0% {
                        opacity: 0;
                        transform: rotateY(30deg) translate3d(60px, 0, -80px) scale(0.96);
                    }
                    100% {
                        opacity: 1;
                        transform: rotateY(0deg) translate3d(0, 0, 0) scale(1);
                    }
                }

                @keyframes slideIn3DBack {
                    0% {
                        opacity: 0;
                        transform: rotateY(-30deg) translate3d(-60px, 0, -80px) scale(0.96);
                    }
                    100% {
                        opacity: 1;
                        transform: rotateY(0deg) translate3d(0, 0, 0) scale(1);
                    }
                }

                @keyframes floatBlob {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    100% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                }

                .perspective-container {
                    perspective: 1200px;
                    perspective-origin: 50% 50%;
                }

                .hover-3d-card {
                    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease, border-color 0.4s ease;
                    transform-style: preserve-3d;
                }

                .hover-3d-card:hover {
                    transform: translateY(-4px) translateZ(8px) rotateX(0.5deg) rotateY(-0.5deg);
                    box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.08);
                }

                .hover-3d-option {
                    transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.2s, border-color 0.2s;
                }

                .hover-3d-option:hover {
                    transform: translateY(-2px) translateZ(4px);
                }
            `}</style>

            {/* Header */}
            <header className="w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 md:py-4 relative">
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                <Image src="/logogrow.png" alt="Grow Labs" fill className="object-cover" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-gray-900">Grow Labs</span>
                        </Link>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Diagnóstico
                        </span>
                    </div>

                    <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors">
                        Volver al Inicio
                    </Link>
                </div>
            </header>

            {/* Main content container with 3D Perspective */}
            <main className="flex-grow flex items-center justify-center py-8 md:py-12 px-4 relative z-10 perspective-container">
                <div className="w-full max-w-3xl flex flex-col justify-center relative">
                    {renderProgressBar()}

                    <div className="relative w-full">

                        {/* STEP 0: WELCOME SCREEN */}
                        {step === 0 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm text-center max-w-xl mx-auto hover-3d-card ${getCardStyle(0)}`}>
                                <div className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-6 border border-green-100 shadow-sm">
                                    <i className="fas fa-clipboard-question text-3xl animate-pulse"></i>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                                    CUESTIONARIO BREVE DE DIAGNÓSTICO
                                </h1>
                                <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
                                    Para preparar una primera reunión clara y orientarte con una solución acorde a tu etapa.
                                </p>
                                
                                <div className="bg-green-50 border border-green-200/60 text-green-800 rounded-xl p-4 mb-8 text-xs md:text-sm font-medium flex items-center gap-3">
                                    <i className="fas fa-clock text-lg text-green-600"></i>
                                    <span className="text-left">
                                        <strong>Completar en 5 minutos.</strong> La idea es entender tu problema antes de presupuestar y no proponerte algo fuera de escala.
                                    </span>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-sm md:text-base"
                                >
                                    Comenzar Cuestionario
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        )}

                        {/* STEP 1: CONTACT DETAILS */}
                        {step === 1 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(1)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">1</span>
                                    Datos de contacto
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-2">Nombre y apellido</label>
                                        <input
                                            type="text"
                                            value={form.nombre}
                                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                            placeholder="Ej: Juan Pérez"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-2">Empresa / Rubro</label>
                                        <input
                                            type="text"
                                            value={form.empresa_rubro}
                                            onChange={(e) => setForm({ ...form, empresa_rubro: e.target.value })}
                                            placeholder="Ej: Distribuidora Alimenticia"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={form.whatsapp}
                                            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                            placeholder="Ej: +5492645438114"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={form.mail}
                                            onChange={(e) => setForm({ ...form, mail: e.target.value })}
                                            placeholder="Ej: juan@empresa.com"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 2: MAIN NEED */}
                        {step === 2 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(2)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">2</span>
                                    Necesidad principal
                                </h2>
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-3">
                                        ¿Qué problema, necesidad o idea querés resolver?
                                    </label>
                                    <textarea
                                        value={form.necesidad_principal}
                                        onChange={(e) => setForm({ ...form, necesidad_principal: e.target.value })}
                                        placeholder="Ej: Queremos automatizar la atención de clientes en WhatsApp que hacen preguntas repetitivas y derivarlos automáticamente a nuestro CRM..."
                                        className="w-full h-40 p-4 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all resize-none leading-relaxed shadow-sm"
                                    />
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 3: CURRENT SITUATION */}
                        {step === 3 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(3)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">3</span>
                                    Situación actual
                                </h2>
                                <p className="text-sm font-semibold text-gray-700 mb-4">¿Cómo lo resolvés hoy?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                    {SITUACION_ACTUAL_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleCheckboxChange('situacion_actual', opt.value)}
                                            className={`p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 hover-3d-option ${
                                                form.situacion_actual.opciones.includes(opt.value)
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                                form.situacion_actual.opciones.includes(opt.value)
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.situacion_actual.opciones.includes(opt.value) && <i className="fas fa-check text-[10px]"></i>}
                                            </div>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 mb-2">Otro (especificar):</label>
                                    <input
                                        type="text"
                                        value={form.situacion_actual.otro}
                                        onChange={(e) => setForm({
                                            ...form,
                                            situacion_actual: { ...form.situacion_actual, otro: e.target.value }
                                        })}
                                        placeholder="Ej: Usando una aplicación móvil básica o cuadernos"
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 4: EXPECTED RESULT */}
                        {step === 4 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(4)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">4</span>
                                    Resultado esperado
                                </h2>
                                <p className="text-sm font-semibold text-gray-700 mb-4">¿Qué te gustaría lograr?</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                                    {RESULTADO_ESPERADO_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleCheckboxChange('resultado_esperado', opt.value)}
                                            className={`p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 hover-3d-option ${
                                                form.resultado_esperado.opciones.includes(opt.value)
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                                form.resultado_esperado.opciones.includes(opt.value)
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.resultado_esperado.opciones.includes(opt.value) && <i className="fas fa-check text-[10px]"></i>}
                                            </div>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold text-gray-500 mb-2">Otro (especificar):</label>
                                    <input
                                        type="text"
                                        value={form.resultado_esperado.otro}
                                        onChange={(e) => setForm({
                                            ...form,
                                            resultado_esperado: { ...form.resultado_esperado, otro: e.target.value }
                                        })}
                                        placeholder="Ej: Reducir costos de almacenamiento o de servidores"
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                    />
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 5: TOOLS AND DATA */}
                        {step === 5 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(5)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">5</span>
                                    Herramientas y datos
                                </h2>
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-gray-700 mb-3">
                                        ¿Qué herramientas usan hoy? ¿Ya tienen datos cargados en algún lugar?
                                    </label>
                                    <textarea
                                        value={form.herramientas_datos}
                                        onChange={(e) => setForm({ ...form, herramientas_datos: e.target.value })}
                                        placeholder="Ej: Actualmente usamos Trello, sheets de Excel compartidas y los datos de clientes están en una base PostgreSQL interna..."
                                        className="w-full h-40 p-4 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all resize-none leading-relaxed shadow-sm"
                                    />
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 6: INTENDED USERS */}
                        {step === 6 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(6)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">6</span>
                                    Personas que usarían la solución
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {PERSONAS_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setForm({ ...form, personas_usuario: opt })}
                                            className={`p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 hover-3d-option ${
                                                form.personas_usuario === opt
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                form.personas_usuario === opt
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.personas_usuario === opt && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 7: URGENCY */}
                        {step === 7 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(7)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">7</span>
                                    Urgencia
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {URGENCIA_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setForm({ ...form, urgencia: opt })}
                                            className={`p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 hover-3d-option ${
                                                form.urgencia === opt
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                form.urgencia === opt
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.urgencia === opt && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 8: DECISION MAKER */}
                        {step === 8 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(8)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">8</span>
                                    Decisión
                                </h2>
                                <p className="text-sm font-semibold text-gray-700 mb-4">¿Quién participa en la decisión de avanzar?</p>
                                <div className="flex flex-col gap-3 mb-5">
                                    {DECISION_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setForm({
                                                ...form,
                                                decision: { ...form.decision, opcion: opt }
                                            })}
                                            className={`p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 hover-3d-option ${
                                                form.decision.opcion === opt
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                form.decision.opcion === opt
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.decision.opcion === opt && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                
                                {(form.decision.opcion === 'Decido con otra persona' || form.decision.opcion === 'Lo decide otra persona') && (
                                    <div className="flex flex-col animate-[fadeIn_0.3s_ease-out_forwards]">
                                        <label className="text-xs font-semibold text-gray-500 mb-2">Nombre / Rol de la persona:</label>
                                        <input
                                            type="text"
                                            value={form.decision.nombre_rol}
                                            onChange={(e) => setForm({
                                                ...form,
                                                decision: { ...form.decision, nombre_rol: e.target.value }
                                            })}
                                            placeholder="Ej: Socio gerente, Director de Finanzas"
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                )}
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 9: SOLUTION SCALE */}
                        {step === 9 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(9)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">9</span>
                                    Escala de solución imaginada
                                </h2>
                                <p className="text-sm font-semibold text-gray-700 mb-4 leading-relaxed">
                                    Para orientarte bien y no proponerte algo fuera de escala, ¿qué tipo de solución imaginás?
                                </p>
                                <div className="flex flex-col gap-3">
                                    {ESCALA_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setForm({ ...form, escala_solucion: opt })}
                                            className={`p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 hover-3d-option ${
                                                form.escala_solucion === opt
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                form.escala_solucion === opt
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.escala_solucion === opt && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                {renderNavButtons()}
                            </div>
                        )}

                        {/* STEP 10: USEFUL MATERIAL & SUBMIT */}
                        {step === 10 && (
                            <form onSubmit={handleSubmit} className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-10 shadow-sm hover-3d-card ${getCardStyle(10)}`}>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-sm font-bold font-mono border border-green-100">10</span>
                                    Material útil y comentario final
                                </h2>
                                
                                <p className="text-sm font-semibold text-gray-700 mb-3">¿Tenés algo para compartir?</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                    {MATERIAL_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => handleCheckboxChange('material_util', opt)}
                                            className={`p-3 border rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-2 hover-3d-option ${
                                                form.material_util.opciones.includes(opt)
                                                    ? 'border-green-500 bg-green-50/50 text-green-900 shadow-sm'
                                                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                form.material_util.opciones.includes(opt)
                                                    ? 'border-green-600 bg-green-600 text-white'
                                                    : 'border-slate-300 bg-white'
                                            }`}>
                                                {form.material_util.opciones.includes(opt) && <i className="fas fa-check text-[8px]"></i>}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex flex-col mb-5">
                                    <label className="text-sm font-semibold text-gray-700 mb-2">Comentario final / Notas adicionales</label>
                                    <textarea
                                        value={form.material_util.comentario_final}
                                        onChange={(e) => setForm({
                                            ...form,
                                            material_util: { ...form.material_util, comentario_final: e.target.value }
                                        })}
                                        placeholder="Ej: Preferimos que la reunión sea en horario de tarde. Adjuntaremos capturas en la primera llamada de WhatsApp."
                                        className="w-full h-24 p-3 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all resize-none leading-relaxed shadow-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-3 text-sm animate-[headShake_0.5s_ease-in-out_forwards]">
                                        <i className="fas fa-exclamation-circle text-lg"></i>
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={loading}
                                        className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-xl transition-all text-sm disabled:opacity-50"
                                    >
                                        Atrás
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-grow py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3 text-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Enviando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Enviar Diagnóstico</span>
                                                <i className="fas fa-paper-plane"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* STEP 11: SUCCESS SCREEN */}
                        {step === 11 && (
                            <div className={`bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm text-center max-w-xl mx-auto hover-3d-card ${getCardStyle(11)}`}>
                                <div className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-6 border border-green-100 shadow-sm animate-bounce">
                                    <i className="fas fa-circle-check text-4xl"></i>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                    ¡Diagnóstico Enviado!
                                </h2>
                                <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
                                    Muchas gracias por tomarte el tiempo de completar el cuestionario. Con esta información prepararemos una propuesta más útil y una reunión mucho más productiva.
                                </p>
                                
                                <div className="bg-green-50 border border-green-200/50 text-green-800 rounded-xl p-5 mb-8 text-xs md:text-sm text-left">
                                    <h4 className="font-bold mb-2 flex items-center gap-2">
                                        <i className="fas fa-info-circle text-green-600"></i> ¿Qué sigue ahora?
                                    </h4>
                                    <p className="leading-relaxed">
                                        Analizaremos tus respuestas y un consultor de <strong>Grow Labs</strong> se pondrá en contacto contigo vía WhatsApp o Mail dentro de las próximas 24 horas hábiles.
                                    </p>
                                </div>

                                <Link
                                    href="/"
                                    className="inline-flex px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 items-center justify-center gap-3 text-sm sm:text-base"
                                >
                                    Volver al Inicio
                                    <i className="fas fa-home"></i>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Footer text */}
            <footer className="w-full py-6 text-center text-xs text-slate-400 relative z-10 border-t border-slate-100 bg-white">
                <div className="container mx-auto px-4">
                    Gracias. Con esta información podemos preparar una reunión más concreta y útil.
                </div>
            </footer>

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </div>
    );

    // Render navigation buttons for steps 1-9
    function renderNavButtons() {
        return (
            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-100">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2.5 text-xs sm:text-sm animate-[headShake_0.5s_ease-in-out_forwards]">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}
                
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-xl transition-all text-sm"
                    >
                        Atrás
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex-grow py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                    >
                        <span>Siguiente</span>
                        <i className="fas fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        );
    }
}
