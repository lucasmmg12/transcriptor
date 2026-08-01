import { jsPDF } from 'jspdf';

export async function generateGrowIqPdf(data: any, aiRecs: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Colors
  const darkNavy = '#0F172A';
  const emeraldPrimary = '#059669';
  const emeraldLight = '#D1FAE5';
  const textDark = '#1E293B';
  const textMuted = '#64748B';
  const bgLight = '#F8FAFC';
  const cardBorder = '#E2E8F0';

  // --- PAGE 1: COVER & EXECUTIVE SUMMARY ---

  // Top Dark Header Banner
  doc.setFillColor(15, 23, 42); // dark navy
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Green Accent Line
  doc.setFillColor(5, 150, 105);
  doc.rect(0, 40, pageWidth, 3, 'F');

  // Title inside Header Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('GROW LABS', margin, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // emerald-400
  doc.text('DIAGNÓSTICO DE MADUREZ OPERATIVA Y TECNOLÓGICA — GROW IQ', margin, 26);

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  const fechaStr = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Fecha de emisión: ${fechaStr}`, pageWidth - margin, 26, { align: 'right' });

  let y = 52;

  // Metadata Card Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Empresa: ${data.company_name || 'N/D'}`, margin + 6, y + 9);
  doc.text(`Evaluado por: ${data.full_name || 'N/D'} (${data.role || 'Directivo'})`, margin + 6, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Rubro: ${data.industry || 'General'}`, pageWidth - margin - 6, y + 9, { align: 'right' });
  doc.text(`Empleados: ${data.employees || 'N/D'}`, pageWidth - margin - 6, y + 17, { align: 'right' });

  y += 32;

  // SCORE SUMMARY SECTION
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'F');

  // Circle or Box for Score
  doc.setFillColor(5, 150, 105);
  doc.roundedRect(margin + 6, y + 5, 28, 28, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(`${data.total_score || 0}`, margin + 20, y + 21, { align: 'center' });
  doc.setFontSize(8);
  doc.text('/ 100 pts', margin + 20, y + 28, { align: 'center' });

  // Maturity Title & Level
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(data.maturity_level || 'Evaluación General', margin + 40, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('Puntaje consolidado basado en 6 dimensiones críticas de operación y tecnología.', margin + 40, y + 23);

  y += 46;

  // EXECUTIVE SUMMARY
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Resumen Ejecutivo', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const summaryText = aiRecs?.executiveSummary || 
    `La empresa ${data.company_name} presenta un nivel de madurez operativa de ${data.total_score}/100. El análisis evidencia áreas de oportunidad clave en la centralización de datos y la automatización de procesos repetitivos para potenciar la escalabilidad del negocio.`;

  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 8);
  
  // Box for summary
  const summaryBoxHeight = Math.max(20, splitSummary.length * 5 + 8);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, summaryBoxHeight, 3, 3, 'FD');

  doc.text(splitSummary, margin + 4, y + 7);
  y += summaryBoxHeight + 10;

  // DIMENSIONS TABLE
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Evaluación por Dimensiones Operativas', margin, y);
  y += 6;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DIMENSIÓN EVALUADA', margin + 4, y + 5.5);
  doc.text('PUNTAJE', margin + 115, y + 5.5, { align: 'center' });
  doc.text('ESTADO OPERATIVO', margin + 155, y + 5.5, { align: 'center' });

  y += 8;

  const dimensions = data.dimension_scores || [];
  dimensions.forEach((dim: any, i: number) => {
    const bgRow = i % 2 === 0 ? 255 : 248;
    doc.setFillColor(bgRow, bgRow, bgRow);
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 9, margin + contentWidth, y + 9);

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(dim.name, margin + 4, y + 6);

    // Score
    const scoreNum = dim.score || 0;
    doc.setFont('helvetica', 'bold');
    if (scoreNum >= 70) doc.setTextColor(5, 150, 105); // green
    else if (scoreNum >= 50) doc.setTextColor(217, 119, 6); // amber
    else doc.setTextColor(225, 29, 72); // red

    doc.text(`${scoreNum} / 100`, margin + 115, y + 6, { align: 'center' });

    // Status Label
    let statusText = 'Requiere atención urgente';
    if (scoreNum >= 70) statusText = 'Nivel Óptimo';
    else if (scoreNum >= 50) statusText = 'En Desarrollo';

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(statusText, margin + 155, y + 6, { align: 'center' });

    y += 9;
  });

  // Footer Page 1
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Grow Labs — Software empresarial a medida | www.growlabs.lat', margin, pageHeight - 10);
  doc.text('Página 1 de 2', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // --- PAGE 2: STRENGTHS, OPPORTUNITIES & ROADMAP ---
  doc.addPage();
  y = 20;

  // Header Banner Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GROW LABS — PLAN DE ACCIÓN Y RECOMENDACIONES DE IA', margin, 11);
  doc.text(`${data.company_name || ''}`, pageWidth - margin, 11, { align: 'right' });

  y = 26;

  // STRENGTHS & OPPORTUNITIES
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Diagnóstico de Fortalezas y Oportunidades', margin, y);
  y += 8;

  const strengths = aiRecs?.strengths || ['Procesos clave identificados', 'Compromiso directivo con la mejora continua'];
  const opportunities = aiRecs?.opportunities || ['Centralización de bases de datos operativas', 'Eliminación de la doble carga de información manual'];

  // Fortalezas Box
  doc.setFillColor(240, 253, 244); // light emerald
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, contentWidth / 2 - 3, 42, 3, 3, 'FD');

  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Fortalezas Destacadas', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  let ly = y + 14;
  strengths.slice(0, 4).forEach((str: string) => {
    const split = doc.splitTextToSize(`• ${str}`, contentWidth / 2 - 12);
    doc.text(split, margin + 4, ly);
    ly += split.length * 4.5;
  });

  // Oportunidades Box
  const xRight = margin + contentWidth / 2 + 3;
  doc.setFillColor(254, 242, 242); // light red/rose
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(xRight, y, contentWidth / 2 - 3, 42, 3, 3, 'FD');

  doc.setTextColor(225, 29, 72);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Oportunidades de Mejora Críticas', xRight + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  ly = y + 14;
  opportunities.slice(0, 4).forEach((opp: string) => {
    const split = doc.splitTextToSize(`• ${opp}`, contentWidth / 2 - 12);
    doc.text(split, xRight + 4, ly);
    ly += split.length * 4.5;
  });

  y += 50;

  // ACTION PLAN / ROADMAP
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. Hoja de Ruta Sugerida (Plan de Acción)', margin, y);
  y += 8;

  const actionPlan = aiRecs?.actionPlan || [
    { phase: 'Fase 1: Ordenamiento y Estandarización', detail: 'Centralizar los flujos de datos principales y eliminar la duplicidad de planillas.' },
    { phase: 'Fase 2: Desarrollo de Software a Medida', detail: 'Construir los módulos operativos clave para controlar procesos en tiempo real.' },
    { phase: 'Fase 3: Automatización e Integración de IA', detail: 'Integrar asistentes internos y tableros gerenciales para la toma de decisiones.' }
  ];

  actionPlan.forEach((step: any, idx: number) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'FD');

    // Number Badge
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(margin + 3, y + 3, 12, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${idx + 1}`, margin + 9, y + 11, { align: 'center' });

    // Step Title & Detail
    const titleText = step.phase || step.title || `Etapa ${idx + 1}`;
    const detailText = step.detail || step.description || '';

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(titleText, margin + 18, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const splitDetail = doc.splitTextToSize(detailText, contentWidth - 24);
    doc.text(splitDetail[0] || '', margin + 18, y + 13);

    y += 22;
  });

  y += 10;

  // CALL TO ACTION / CONTACT FOOTER CARD
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 28, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('¿Querés llevar tu operación al siguiente nivel?', margin + 10, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(16, 185, 129);
  doc.text('Agendá una sesión de diagnóstico estratégico con el equipo de Grow Labs.', margin + 10, y + 18);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('www.growlabs.lat | WhatsApp: +54 9 264 543-8114', pageWidth - margin - 10, y + 15, { align: 'right' });

  // Footer Page 2
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Grow Labs — Software empresarial a medida | www.growlabs.lat', margin, pageHeight - 10);
  doc.text('Página 2 de 2', pageWidth - margin, pageHeight - 10, { align: 'right' });

  // Save PDF
  const cleanCompanyName = (data.company_name || 'Empresa').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Diagnostico_GrowIQ_${cleanCompanyName}.pdf`);
}
