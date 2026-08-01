'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DIMENSIONS, QUESTIONS, OPEN_QUESTIONS, OPTIONS } from '@/lib/grow-iq/questions';
import { GrowIqFormState } from '@/lib/types/grow-iq';
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';

const INITIAL_STATE: GrowIqFormState = {
  companyName: '',
  industry: '',
  province: '',
  country: 'Argentina',
  employees: '',
  antiquity: '',
  role: '',
  answers: {},
  openAnswers: {},
  fullName: '',
  email: '',
  whatsapp: '',
  privacyAccepted: false,
};

const EMPLOYEES_OPTIONS = ['1 a 5', '6 a 10', '11 a 20', '21 a 50', '51 a 100', 'Más de 100'];
const INDUSTRY_OPTIONS = ['Salud', 'Comercio', 'Servicios profesionales', 'Industria', 'Construcción', 'Minería', 'Logística', 'Gastronomía', 'Tecnología', 'Educación', 'Agro', 'Otro'];

export default function GrowIqWizard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState(0); // 0: Basic Info, 1-6: Dimensions, 7: Open Questions, 8: Contact
  const [formData, setFormData] = useState<GrowIqFormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('growIqProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.state) setFormData(parsed.state);
        if (parsed.step !== undefined) setStep(parsed.step);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('growIqProgress', JSON.stringify({ state: formData, step }));
    }
  }, [formData, step, isClient]);

  const updateField = (field: keyof GrowIqFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAnswer = (questionId: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const updateOpenAnswer = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      openAnswers: { ...prev.openAnswers, [questionId]: value }
    }));
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      return !!(formData.companyName && formData.industry && formData.province && formData.employees && formData.role);
    }
    if (step >= 1 && step <= 6) {
      const dimension = DIMENSIONS[step - 1];
      const dimensionQuestions = QUESTIONS.filter(q => q.dimensionId === dimension.id);
      return dimensionQuestions.every(q => formData.answers[q.id] !== undefined);
    }
    if (step === 7) {
      return OPEN_QUESTIONS.every(q => !!formData.openAnswers[q.id]);
    }
    if (step === 8) {
      return !!(formData.fullName && formData.email && formData.whatsapp && formData.privacyAccepted);
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/grow-iq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error al procesar el diagnóstico');
      
      localStorage.removeItem('growIqProgress');
      router.push(`/grow-iq/resultados/${data.token}`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null; // Avoid hydration mismatch

  const totalSteps = 9;
  const progress = Math.round((step / (totalSteps - 1)) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0f1513] rounded-2xl border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
          style={{ width: `\${progress}%` }}
        />
      </div>

      <div className="mb-8 flex justify-between items-center mt-2">
        <span className="text-sm font-medium text-gray-400">Paso {step + 1} de {totalSteps}</span>
        <span className="text-sm font-bold text-emerald-400">{progress}% Completado</span>
      </div>

      <div className="min-h-[400px]">
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-2">Información de la empresa</h2>
            <p className="text-gray-400 mb-8">Contanos sobre tu organización para personalizar el diagnóstico.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre de la empresa *</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.companyName}
                  onChange={e => updateField('companyName', e.target.value)}
                  placeholder="Ej. Acme Corp"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Rubro *</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                    value={formData.industry}
                    onChange={e => updateField('industry', e.target.value)}
                  >
                    <option value="" disabled className="bg-gray-900 text-gray-500">Seleccionar rubro...</option>
                    {INDUSTRY_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                    ))}
                  </select>
                </div>
                {formData.industry === 'Otro' && (
                   <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Especificar rubro *</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      value={formData.customIndustry || ''}
                      onChange={e => updateField('customIndustry', e.target.value)}
                      placeholder="Ej. Desarrollo Inmobiliario"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Provincia *</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    value={formData.province}
                    onChange={e => updateField('province', e.target.value)}
                    placeholder="Ej. Buenos Aires"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Cantidad de empleados *</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none"
                    value={formData.employees}
                    onChange={e => updateField('employees', e.target.value)}
                  >
                    <option value="" disabled className="bg-gray-900 text-gray-500">Seleccionar...</option>
                    {EMPLOYEES_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cargo o Rol *</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.role}
                  onChange={e => updateField('role', e.target.value)}
                  placeholder="Ej. Director General, Gerente de Operaciones..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Steps 1-6: Dimensions */}
        {step >= 1 && step <= 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-2">{DIMENSIONS[step - 1].name}</h2>
            <p className="text-gray-400 mb-8">Respondé con sinceridad para obtener un diagnóstico preciso.</p>
            
            <div className="space-y-8">
              {QUESTIONS.filter(q => q.dimensionId === DIMENSIONS[step - 1].id).map((q, idx) => (
                <div key={q.id} className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                  <p className="text-lg text-white mb-4 font-medium"><span className="text-emerald-500 mr-2">{idx + 1}.</span>{q.text}</p>
                  <div className="flex flex-col gap-2">
                    {OPTIONS.map(opt => (
                      <label 
                        key={opt.value} 
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border \${
                          formData.answers[q.id] === opt.value 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-white' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 \${
                          formData.answers[q.id] === opt.value ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500'
                        }`}>
                          {formData.answers[q.id] === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Open Questions */}
        {step === 7 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-2">Desafíos actuales</h2>
            <p className="text-gray-400 mb-8">Contanos brevemente sobre los retos de tu operación.</p>
            
            <div className="space-y-6">
              {OPEN_QUESTIONS.map((q, idx) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-white mb-2"><span className="text-emerald-500 mr-1">{idx + 1}.</span>{q.text}</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    rows={3}
                    maxLength={300}
                    value={formData.openAnswers[q.id] || ''}
                    onChange={e => updateOpenAnswer(q.id, e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                  />
                  <div className="text-right mt-1 text-xs text-gray-500">
                    {(formData.openAnswers[q.id] || '').length}/300
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Contact */}
        {step === 8 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-2">Ya casi terminamos</h2>
            <p className="text-gray-400 mb-8">Ingresá tus datos para ver tu Grow IQ y acceder al informe completo.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre y apellido *</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.fullName}
                  onChange={e => updateField('fullName', e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Correo electrónico corporativo *</label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  placeholder="Ej. juan@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">WhatsApp *</label>
                <input 
                  type="tel" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.whatsapp}
                  onChange={e => updateField('whatsapp', e.target.value)}
                  placeholder="Ej. +54 9 11 1234-5678"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={formData.privacyAccepted}
                      onChange={e => updateField('privacyAccepted', e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-500 rounded bg-transparent peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all"></div>
                    <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Acepto la política de privacidad y doy mi consentimiento para el uso de estos datos en la elaboración del diagnóstico.
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mt-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/10">
        <button
          onClick={handleBack}
          disabled={step === 0 || isSubmitting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all \${
            step === 0 || isSubmitting ? 'text-gray-600 cursor-not-allowed opacity-50' : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        {step < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            disabled={!validateStep()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all \${
              validateStep() 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!validateStep() || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all \${
              validateStep() && !isSubmitting
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
              </>
            ) : (
              'Ver mi Grow IQ'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
