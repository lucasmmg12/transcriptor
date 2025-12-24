"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';

// Tipos de datos (Exportados para uso externo)
export interface Job {
    id: string;
    role: string;
    year: string;
    company: string;
    description: string;
}

export interface Education {
    id: string;
    title: string;
    institution: string;
    detail: string;
}

export interface Course {
    id: string;
    name: string;
    institution: string;
}

export interface CVData {
    personalInfo: {
        firstName: string;
        lastName: string;
        title: string;
        birthDate: string;
        familyStatus: string;
        phone: string;
        email: string;
        instagram: string;
        location: string;
        imageUrl: string;
    };
    profile: string;
    experience: Job[];
    education: Education[];
    skills: string[];
    courses: Course[];
    languagesAndSoftware: string;
}

interface CVEditorProps {
    initialData: CVData;
}

export default function CVEditor({ initialData }: CVEditorProps) {
    const [data, setData] = useState<CVData>(initialData);
    const [scale, setScale] = useState(1);
    const previewRef = useRef<HTMLDivElement>(null);

    // Auto-resize logic
    useEffect(() => {
        const handleResize = () => {
            if (previewRef.current) {
                const containerWidth = previewRef.current.offsetWidth;
                // A4 Landscape width in px (approx 297mm * 3.7795 px/mm ~ 1122px) + shadow/padding
                const cvWidth = 1122;
                const margin = 60; // Extra margin
                const availableWidth = containerWidth - margin;

                let newScale = 1;
                if (availableWidth < cvWidth) {
                    newScale = availableWidth / cvWidth;
                }
                // Limit max scale to 1 to avoid blurriness on very large screens if any
                if (availableWidth > cvWidth) {
                    newScale = 1;
                }

                setScale(newScale);
            }
        };

        window.addEventListener('resize', handleResize);
        // Slight delay to ensure rendering
        setTimeout(handleResize, 100);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInputChange = (section: keyof CVData, field: string, value: string) => {
        // @ts-ignore
        setData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSimpleChange = (field: keyof CVData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            handleInputChange('personalInfo', 'imageUrl', url);
        }
    };

    const addItem = (listName: 'experience' | 'education' | 'courses', emptyItem: any) => {
        // @ts-ignore
        setData(prev => ({
            ...prev,
            // @ts-ignore
            [listName]: [...prev[listName], { ...emptyItem, id: Date.now().toString() }]
        }));
    };

    const removeItem = (listName: 'experience' | 'education' | 'courses', id: string) => {
        // @ts-ignore
        setData(prev => ({
            ...prev,
            // @ts-ignore
            [listName]: prev[listName].filter((item: any) => item.id !== id)
        }));
    };

    const updateItem = (listName: 'experience' | 'education' | 'courses', id: string, field: string, value: string) => {
        // @ts-ignore
        setData(prev => ({
            ...prev,
            // @ts-ignore
            [listName]: prev[listName].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
        }));
    };

    const updateSkill = (index: number, value: string) => {
        const newSkills = [...data.skills];
        newSkills[index] = value;
        setData(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => setData(prev => ({ ...prev, skills: [...prev.skills, "Nueva Habilidad"] }));
    const removeSkill = (index: number) => {
        const newSkills = data.skills.filter((_, i) => i !== index);
        setData(prev => ({ ...prev, skills: newSkills }));
    };

    const downloadPDF = () => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.html2pdf) {
            const element = document.getElementById('cv-content');
            const opt = {
                margin: 0,
                filename: `CV_${data.personalInfo.lastName}_${data.personalInfo.firstName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };
            // @ts-ignore
            window.html2pdf().set(opt).from(element).save();
        } else {
            alert("La librería de PDF aún se está cargando, intenta de nuevo en unos segundos.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
            <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            {/* --- FORMULARIO (LADO IZQUIERDO) --- */}
            <div className="w-full md:w-1/3 p-6 overflow-y-auto h-screen border-r border-gray-700 bg-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Editor de CV</h2>
                    <a href="/cv-maker" className="text-xs text-gray-400 hover:text-white"> &larr; Volver</a>
                </div>

                {/* Datos Personales */}
                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Información Personal</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            {data.personalInfo.imageUrl && <img src={data.personalInfo.imageUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white" />}
                            <input type="file" onChange={handleImageUpload} className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" accept="image/*" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={data.personalInfo.firstName} onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)} placeholder="Nombre" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                            <input type="text" value={data.personalInfo.lastName} onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)} placeholder="Apellido" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        </div>
                        <input type="text" value={data.personalInfo.title} onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)} placeholder="Título Profesional" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={data.personalInfo.phone} onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)} placeholder="Teléfono" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                            <input type="text" value={data.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} placeholder="Email" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        </div>
                        <input type="text" value={data.personalInfo.instagram} onChange={(e) => handleInputChange('personalInfo', 'instagram', e.target.value)} placeholder="Instagram" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        <input type="text" value={data.personalInfo.location} onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)} placeholder="Ubicación" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />

                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={data.personalInfo.birthDate} onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)} placeholder="Fecha Nacimiento" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                            <input type="text" value={data.personalInfo.familyStatus} onChange={(e) => handleInputChange('personalInfo', 'familyStatus', e.target.value)} placeholder="Datos Familiares" className="w-full p-2 bg-gray-700 rounded border border-gray-600" />
                        </div>
                    </div>
                </section>

                {/* Perfil */}
                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Perfil Profesional</h3>
                    <textarea rows={6} value={data.profile} onChange={(e) => handleSimpleChange('profile', e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm" />
                </section>

                {/* Experiencia */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                        <h3 className="text-lg font-semibold">Experiencia</h3>
                        <button onClick={() => addItem('experience', { role: 'Nuevo Rol', year: '2025', company: 'Empresa', description: '' })} className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-700">+ Añadir</button>
                    </div>
                    <div className="space-y-4">
                        {data.experience.map((job) => (
                            <div key={job.id} className="p-3 bg-gray-700 rounded border border-gray-600 relative">
                                <button onClick={() => removeItem('experience', job.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
                                <input type="text" value={job.role} onChange={(e) => updateItem('experience', job.id, 'role', e.target.value)} placeholder="Cargo" className="w-full mb-2 p-1 bg-gray-800 rounded border border-gray-600 text-sm font-bold" />
                                <div className="flex gap-2 mb-2">
                                    <input type="text" value={job.company} onChange={(e) => updateItem('experience', job.id, 'company', e.target.value)} placeholder="Empresa" className="w-2/3 p-1 bg-gray-800 rounded border border-gray-600 text-sm" />
                                    <input type="text" value={job.year} onChange={(e) => updateItem('experience', job.id, 'year', e.target.value)} placeholder="Años" className="w-1/3 p-1 bg-gray-800 rounded border border-gray-600 text-sm text-center" />
                                </div>
                                <textarea rows={3} value={job.description} onChange={(e) => updateItem('experience', job.id, 'description', e.target.value)} placeholder="Descripción (usa saltos de línea)" className="w-full p-1 bg-gray-800 rounded border border-gray-600 text-sm" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Educación */}
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
                        <h3 className="text-lg font-semibold">Formación</h3>
                        <button onClick={() => addItem('education', { title: 'Nuevo Título', institution: 'Institución', detail: 'Año/Estado' })} className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-700">+ Añadir</button>
                    </div>
                    <div className="space-y-4">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="p-3 bg-gray-700 rounded border border-gray-600 relative">
                                <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><i className="fas fa-trash"></i></button>
                                <input type="text" value={edu.title} onChange={(e) => updateItem('education', edu.id, 'title', e.target.value)} placeholder="Título" className="w-full mb-2 p-1 bg-gray-800 rounded border border-gray-600 text-sm font-bold" />
                                <div className="flex gap-2">
                                    <input type="text" value={edu.institution} onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)} placeholder="Institución" className="w-2/3 p-1 bg-gray-800 rounded border border-gray-600 text-sm" />
                                    <input type="text" value={edu.detail} onChange={(e) => updateItem('education', edu.id, 'detail', e.target.value)} placeholder="Detalle" className="w-1/3 p-1 bg-gray-800 rounded border border-gray-600 text-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Habilidades */}
                <section className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Habilidades (Tags)</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {data.skills.map((skill, idx) => (
                            <div key={idx} className="flex bg-gray-700 rounded border border-gray-600 overflow-hidden">
                                <input value={skill} onChange={(e) => updateSkill(idx, e.target.value)} className="w-24 p-1 bg-transparent text-xs text-white focus:outline-none" />
                                <button onClick={() => removeSkill(idx)} className="text-red-400 hover:bg-gray-600 px-2 text-xs">x</button>
                            </div>
                        ))}
                        <button onClick={addSkill} className="text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white font-bold">+ Agregar</button>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="flex justify-between items-center mb-2 border-b border-gray-600 pb-2">
                        <h3 className="text-lg font-semibold">Cursos</h3>
                        <button onClick={() => addItem('courses', { name: 'Curso', institution: 'Entidad' })} className="text-xs bg-green-600 px-2 py-1 rounded hover:bg-green-700">+ Añadir</button>
                    </div>
                    {data.courses.map((course) => (
                        <div key={course.id} className="flex gap-2 mb-2 items-center bg-gray-700 p-2 rounded">
                            <div className="flex-1">
                                <input value={course.name} onChange={(e) => updateItem('courses', course.id, 'name', e.target.value)} placeholder="Curso" className="w-full mb-1 p-1 bg-gray-800 rounded border border-gray-600 text-xs font-bold" />
                                <input value={course.institution} onChange={(e) => updateItem('courses', course.id, 'institution', e.target.value)} placeholder="Lugar" className="w-full p-1 bg-gray-800 rounded border border-gray-600 text-xs text-gray-400" />
                            </div>
                            <button onClick={() => removeItem('courses', course.id)} className="text-red-400 text-xs px-2"><i className="fas fa-trash"></i></button>
                        </div>
                    ))}
                </section>

                <section className="mb-12">
                    <h3 className="text-lg font-semibold mb-2 border-b border-gray-600 pb-2">Idiomas & Software</h3>
                    <textarea rows={5} value={data.languagesAndSoftware} onChange={(e) => handleSimpleChange('languagesAndSoftware', e.target.value)} className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm font-mono" />
                </section>

            </div>

            {/* --- PREVIEW (LADO DERECHO) --- */}
            <div ref={previewRef} className="w-full md:w-2/3 bg-gray-500 p-8 flex flex-col items-center relative overflow-hidden h-[100vh] justify-start pt-20">

                {/* Barra de Herramientas flotante */}
                <div className="absolute top-6 z-50 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-xl flex gap-4 items-center">
                    <span className="font-bold text-sm">Vista Previa</span>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                        <i className="fas fa-file-pdf"></i> Descargar PDF
                    </button>
                </div>

                {/* Contenedor Escalable */}
                <div
                    style={{
                        marginTop: '20px',
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.3s ease',
                        width: '1122px', // 297mm approx
                        flexShrink: 0,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* --- AQUI COMIENZA EL HTML DEL USUARIO TRADUCIDO A JSX --- */}
                    <div id="cv-content" className="a4-landscape w-[1122px] h-[794px] bg-white relative flex overflow-hidden text-slate-900" style={{ fontFamily: '"Montserrat", sans-serif' }}>

                        {/* SIDEBAR */}
                        <div className="w-[22%] bg-slate-50 h-full flex flex-col border-r border-gray-200">
                            <div className="p-8 pb-10 flex flex-col items-center">
                                <div
                                    className="w-[9rem] h-[9rem] rounded-full border-[5px] border-blue-100 shadow-md mb-6 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${data.personalInfo.imageUrl}')`, backgroundColor: '#e2e8f0' }}
                                ></div>
                                <div className="text-center">
                                    <h1 className="text-3xl font-extrabold leading-none text-slate-800 uppercase tracking-tighter">
                                        {data.personalInfo.firstName}<br /><span className="text-blue-600">{data.personalInfo.lastName}</span>
                                    </h1>
                                </div>
                            </div>

                            <div className="flex-grow px-6 py-2 space-y-8 overflow-hidden mt-4">
                                {/* Contacto */}
                                <div>
                                    <h2 className="font-bold uppercase tracking-widest text-xs text-slate-500 mb-2 border-b border-gray-200 pb-1">Contacto</h2>
                                    <ul className="text-[12px] text-gray-600 space-y-3">
                                        <li className="flex items-center gap-2"><i className="fas fa-phone text-blue-500 w-4"></i> {data.personalInfo.phone}</li>
                                        <li className="flex items-center gap-2"><i className="fas fa-envelope text-blue-500 w-4"></i> {data.personalInfo.email}</li>
                                        <li className="flex items-center gap-2"><i className="fab fa-instagram text-blue-500 w-4"></i> {data.personalInfo.instagram}</li>
                                        <li className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-blue-500 w-4"></i> {data.personalInfo.location}</li>
                                    </ul>
                                </div>
                                {/* Datos */}
                                <div>
                                    <h2 className="font-bold uppercase tracking-widest text-xs text-slate-500 mb-2 border-b border-gray-200 pb-1">Datos</h2>
                                    <ul className="text-[12px] text-gray-600 space-y-2">
                                        <li><strong>Nacimiento:</strong> {data.personalInfo.birthDate}</li>
                                        <li><strong>Familia:</strong> {data.personalInfo.familyStatus}</li>
                                    </ul>
                                </div>
                                {/* Skills */}
                                <div>
                                    <h2 className="font-bold uppercase tracking-widest text-xs text-slate-500 mb-2 border-b border-gray-200 pb-1">Habilidades</h2>
                                    <div className="flex flex-wrap gap-1">
                                        {data.skills.map((skill, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-[10px] font-semibold border border-blue-100">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-100 text-center border-t border-gray-200 mt-auto">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{data.personalInfo.firstName} {data.personalInfo.lastName}</p>
                            </div>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="w-[78%] h-full p-10 flex flex-col">
                            <div className="flex justify-between items-end border-b-2 border-gray-100 pb-4 mb-6">
                                <div>
                                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight uppercase">{data.personalInfo.firstName} <span className="text-slate-800">{data.personalInfo.lastName}</span></h1>
                                    <p className="text-blue-600 font-bold tracking-widest text-sm mt-1 uppercase">{data.personalInfo.title}</p>
                                </div>
                            </div>

                            <div className="flex gap-10 h-full overflow-hidden">

                                {/* COL 1 */}
                                <div className="w-[60%] flex flex-col gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-sm border-b-2 border-blue-600 pb-1 mb-3 tracking-wide">
                                            <i className="fas fa-user-circle"></i> Perfil Profesional
                                        </div>
                                        <p className="text-[12px] leading-relaxed text-gray-600 text-justify whitespace-pre-line">
                                            {data.profile}
                                        </p>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-sm border-b-2 border-blue-600 pb-1 mb-3 tracking-wide">
                                            <i className="fas fa-briefcase"></i> Experiencia Profesional
                                        </div>
                                        {data.experience.map((job) => (
                                            <div key={job.id} className="mb-4 last:mb-0">
                                                <div className="flex justify-between items-end mb-1">
                                                    <h3 className="text-sm font-bold text-slate-800">{job.role}</h3>
                                                    <span className="text-[11px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">{job.year}</span>
                                                </div>
                                                <p className="text-[11px] font-bold text-blue-500 mb-1">{job.company}</p>
                                                <ul className="list-none text-[11px] text-gray-600 leading-tight space-y-1">
                                                    {job.description.split('\n').filter(d => d.trim() !== "").map((line, idx) => (
                                                        <li key={idx} className="pl-0">{line}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* COL 2 */}
                                <div className="w-[40%] flex flex-col gap-6 border-l border-gray-100 pl-8">

                                    {/* Formación */}
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-sm border-b-2 border-blue-600 pb-1 mb-3 tracking-wide">
                                            <i className="fas fa-graduation-cap"></i> Formación
                                        </div>
                                        <ul className="space-y-3">
                                            {data.education.map((edu) => (
                                                <li key={edu.id}>
                                                    <p className="text-[11px] font-bold text-slate-800">{edu.title}</p>
                                                    <p className="text-[11px] text-gray-500 italic">{edu.institution} | {edu.detail}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Cursos */}
                                    <div>
                                        <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-sm border-b-2 border-blue-600 pb-1 mb-3 tracking-wide">
                                            <i className="fas fa-certificate"></i> Cursos
                                        </div>
                                        <ul className="space-y-2">
                                            {data.courses.map((course) => (
                                                <li key={course.id} className="text-[11px] text-gray-600 border-l-2 border-blue-400 pl-2">
                                                    <strong>{course.name}</strong><br />{course.institution}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Idiomas/Soft */}
                                    <div className="mt-auto bg-blue-50 p-6 rounded-lg">
                                        <h4 className="text-[13px] font-bold text-blue-800 mb-2 uppercase">Idiomas & Software</h4>
                                        <p className="text-[11px] text-blue-700 leading-relaxed whitespace-pre-line">
                                            {data.languagesAndSoftware}
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>

            {/* Importar fuentes específicas en la página si no están en layout */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
        </div>
    );
}

// Datos iniciales genéricos por defecto
export const GENERIC_DATA: CVData = {
    personalInfo: {
        firstName: "NOMBRE",
        lastName: "APELLIDO",
        title: "Título Profesional • Especialidad",
        birthDate: "DD/MM/AAAA",
        familyStatus: "Estado Civil",
        phone: "000-000-0000",
        email: "email@ejemplo.com",
        instagram: "@usuario",
        location: "Ciudad, País",
        imageUrl: "" // Imagen vacía por defecto
    },
    profile: "Este es un espacio para describir tu perfil profesional. Menciona tus años de experiencia, tus principales logros y tus objetivos profesionales. La redacción debe ser clara, concisa y orientada a resultados.",
    experience: [
        {
            id: "1",
            role: "Puesto Actual",
            year: "2023 - Actualidad",
            company: "Empresa Actual",
            description: "• Logro principal o responsabilidad clave.\n• Otro logro destacado.\n• Tarea relevante desempeñada."
        },
        {
            id: "2",
            role: "Puesto Anterior",
            year: "2020 - 2023",
            company: "Empresa Anterior",
            description: "• Responsabilidad clave.\n• Logro cuantificable."
        }
    ],
    education: [
        { id: "1", title: "Título Universitario", institution: "Universidad", detail: "Año de graduación / Estado" },
        { id: "2", title: "Título Secundario / Otro", institution: "Institución", detail: "Año" }
    ],
    skills: ["Habilidad 1", "Habilidad 2", "Habilidad 3", "Habilidad 4"],
    courses: [
        { id: "1", name: "Nombre del Curso", institution: "Institución" },
        { id: "2", name: "Otro Curso", institution: "Plataforma Online" }
    ],
    languagesAndSoftware: "• Idioma (Nivel)\n• Software 1\n• Software 2"
};
