import { Dimension, Question, OpenQuestion } from '../types/grow-iq';

export const DIMENSIONS: Dimension[] = [
  { id: 'procesos_organizacion', name: 'Procesos y organización', weight: 22 },
  { id: 'datos_indicadores', name: 'Datos e indicadores', weight: 20 },
  { id: 'automatizacion_integracion', name: 'Automatización e integración', weight: 18 },
  { id: 'gestion_comercial', name: 'Gestión comercial y clientes', weight: 15 },
  { id: 'tecnologia_ia', name: 'Tecnología e inteligencia artificial', weight: 10 },
  { id: 'escalabilidad', name: 'Escalabilidad y dependencia operativa', weight: 15 }
];

export const OPTIONS = [
  { label: 'No ocurre', value: 0 },
  { label: 'Ocurre pocas veces', value: 25 },
  { label: 'Ocurre parcialmente', value: 50 },
  { label: 'Ocurre en la mayoría de los casos', value: 75 },
  { label: 'Ocurre de forma sistemática', value: 100 }
];

export const QUESTIONS: Question[] = [
  // Dimensión 1: Procesos y organización
  { id: 'q_1_1', dimensionId: 'procesos_organizacion', text: '¿Los principales procesos de la empresa están documentados?', type: 'direct', order: 1 },
  { id: 'q_1_2', dimensionId: 'procesos_organizacion', text: '¿Las personas conocen claramente sus responsabilidades?', type: 'direct', order: 2 },
  { id: 'q_1_3', dimensionId: 'procesos_organizacion', text: '¿Existen tareas que solamente una persona sabe realizar?', type: 'inverse', order: 3 },
  { id: 'q_1_4', dimensionId: 'procesos_organizacion', text: '¿Los errores operativos se registran y analizan?', type: 'direct', order: 4 },
  { id: 'q_1_5', dimensionId: 'procesos_organizacion', text: '¿La empresa tiene procedimientos definidos para las tareas críticas?', type: 'direct', order: 5 },
  { id: 'q_1_6', dimensionId: 'procesos_organizacion', text: '¿Los responsables pueden saber fácilmente en qué estado se encuentra cada proceso?', type: 'direct', order: 6 },

  // Dimensión 2: Datos e indicadores
  { id: 'q_2_1', dimensionId: 'datos_indicadores', text: '¿La dirección tiene acceso rápido a los principales indicadores del negocio?', type: 'direct', order: 7 },
  { id: 'q_2_2', dimensionId: 'datos_indicadores', text: '¿La información se encuentra centralizada?', type: 'direct', order: 8 },
  { id: 'q_2_3', dimensionId: 'datos_indicadores', text: '¿Los datos deben recopilarse manualmente para crear reportes?', type: 'inverse', order: 9 },
  { id: 'q_2_4', dimensionId: 'datos_indicadores', text: '¿La empresa cuenta con dashboards o tableros actualizados?', type: 'direct', order: 10 },
  { id: 'q_2_5', dimensionId: 'datos_indicadores', text: '¿Se toman decisiones utilizando datos concretos?', type: 'direct', order: 11 },
  { id: 'q_2_6', dimensionId: 'datos_indicadores', text: '¿Es sencillo conocer ventas, costos, productividad o rentabilidad?', type: 'direct', order: 12 },

  // Dimensión 3: Automatización e integración
  { id: 'q_3_1', dimensionId: 'automatizacion_integracion', text: '¿La empresa utiliza software para sus procesos principales?', type: 'direct', order: 13 },
  { id: 'q_3_2', dimensionId: 'automatizacion_integracion', text: '¿Los sistemas intercambian información automáticamente?', type: 'direct', order: 14 },
  { id: 'q_3_3', dimensionId: 'automatizacion_integracion', text: '¿Se cargan los mismos datos en diferentes sistemas o planillas?', type: 'inverse', order: 15 },
  { id: 'q_3_4', dimensionId: 'automatizacion_integracion', text: '¿Las aprobaciones se realizan principalmente por WhatsApp o correo?', type: 'inverse', order: 16 },
  { id: 'q_3_5', dimensionId: 'automatizacion_integracion', text: '¿Existen tareas repetitivas que podrían automatizarse?', type: 'inverse', order: 17 },
  { id: 'q_3_6', dimensionId: 'automatizacion_integracion', text: '¿La empresa utiliza alertas automáticas ante eventos importantes?', type: 'direct', order: 18 },

  // Dimensión 4: Gestión comercial y clientes
  { id: 'q_4_1', dimensionId: 'gestion_comercial', text: '¿La empresa utiliza un CRM o sistema de seguimiento comercial?', type: 'direct', order: 19 },
  { id: 'q_4_2', dimensionId: 'gestion_comercial', text: '¿Se registran todas las oportunidades de venta?', type: 'direct', order: 20 },
  { id: 'q_4_3', dimensionId: 'gestion_comercial', text: '¿Existen seguimientos automáticos para potenciales clientes?', type: 'direct', order: 21 },
  { id: 'q_4_4', dimensionId: 'gestion_comercial', text: '¿La empresa mide la satisfacción o retención de clientes?', type: 'direct', order: 22 },
  { id: 'q_4_5', dimensionId: 'gestion_comercial', text: '¿Puede identificar cuáles son sus clientes o productos más rentables?', type: 'direct', order: 23 },
  { id: 'q_4_6', dimensionId: 'gestion_comercial', text: '¿Existe un proceso comercial claro desde el primer contacto hasta la venta?', type: 'direct', order: 24 },

  // Dimensión 5: Tecnología e inteligencia artificial
  { id: 'q_5_1', dimensionId: 'tecnologia_ia', text: '¿La empresa utiliza inteligencia artificial en tareas concretas?', type: 'direct', order: 25 },
  { id: 'q_5_2', dimensionId: 'tecnologia_ia', text: '¿Los empleados tienen lineamientos para utilizar herramientas de IA?', type: 'direct', order: 26 },
  { id: 'q_5_3', dimensionId: 'tecnologia_ia', text: '¿La empresa ha identificado procesos donde la IA podría aportar valor?', type: 'direct', order: 27 },
  { id: 'q_5_4', dimensionId: 'tecnologia_ia', text: '¿La información crítica está protegida mediante permisos y accesos?', type: 'direct', order: 28 },
  { id: 'q_5_5', dimensionId: 'tecnologia_ia', text: '¿Los sistemas tecnológicos acompañan el crecimiento de la empresa?', type: 'direct', order: 29 },
  { id: 'q_5_6', dimensionId: 'tecnologia_ia', text: '¿Existe una estrategia para incorporar nuevas tecnologías?', type: 'direct', order: 30 },

  // Dimensión 6: Escalabilidad y dependencia operativa
  { id: 'q_6_1', dimensionId: 'escalabilidad', text: '¿La empresa podría aumentar significativamente su volumen sin duplicar su estructura?', type: 'direct', order: 31 },
  { id: 'q_6_2', dimensionId: 'escalabilidad', text: '¿Los procesos dependen demasiado de los dueños o gerentes?', type: 'inverse', order: 32 },
  { id: 'q_6_3', dimensionId: 'escalabilidad', text: '¿La operación puede continuar si una persona clave se ausenta?', type: 'direct', order: 33 },
  { id: 'q_6_4', dimensionId: 'escalabilidad', text: '¿La empresa puede incorporar nuevos empleados rápidamente?', type: 'direct', order: 34 },
  { id: 'q_6_5', dimensionId: 'escalabilidad', text: '¿Los problemas se detectan antes de que impacten al cliente?', type: 'direct', order: 35 },
  { id: 'q_6_6', dimensionId: 'escalabilidad', text: '¿La dirección puede supervisar la operación sin intervenir constantemente?', type: 'direct', order: 36 }
];

export const OPEN_QUESTIONS: OpenQuestion[] = [
  { id: 'oq_1', text: '¿Cuál es actualmente el principal problema operativo de tu empresa?', answer: '' },
  { id: 'oq_2', text: '¿Qué proceso te gustaría mejorar o automatizar primero?', answer: '' },
  { id: 'oq_3', text: '¿Cuál es el principal objetivo de la empresa para los próximos 12 meses?', answer: '' },
  { id: 'oq_4', text: '¿Qué tarea consume más tiempo al equipo?', answer: '' }
];
