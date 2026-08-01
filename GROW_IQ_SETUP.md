# Grow IQ - Guía de Configuración e Integración

## Funcionalidad implementada
Se implementó "Grow IQ", un diagnóstico empresarial de madurez operativa y digital. Funciona de manera totalmente independiente del panel de control de Supabase con los requerimientos precisos: 6 dimensiones de madurez, opciones de respuesta de escala de 5 valores, puntajes de 0 a 100 y resultados renderizables por IA o determinísticos con impresión a PDF.

## Archivos creados
- \`src/app/grow-iq/page.tsx\`: Página introductoria y contenedor.
- \`src/components/grow-iq/GrowIqWizard.tsx\`: Componente del asistente paso a paso con almacenamiento temporal en \`localStorage\`.
- \`src/app/grow-iq/resultados/[token]/page.tsx\`: Página para visualizar los resultados únicos por token con soporte a impresión en CSS (PDF).
- \`src/components/grow-iq/GrowIqResults.tsx\`: Visualización gráfica y recomendaciones generadas por IA / determinísticas.
- \`src/app/api/grow-iq/route.ts\`: API para almacenamiento del lead y evaluación inicial determinística.
- \`src/app/api/grow-iq/openai/route.ts\`: API para procesamiento en segundo plano con OpenAI.
- \`src/app/api/grow-iq/email/route.ts\`: API reservada para el envío de correos (falta proveedor).
- \`src/lib/types/grow-iq.ts\`: Definición de interfaces TypeScript.
- \`src/lib/grow-iq/questions.ts\`: Datos estáticos de preguntas y dimensiones.
- \`src/lib/grow-iq/scoring.ts\`: Motor de cálculo puramente matemático.
- \`src/lib/grow-iq/recommendations.ts\`: Sistema experto determinístico (Fallback).
- \`supabase-growiq.sql\`: Definición de la tabla \`grow_iq_diagnostics\`.

## Archivos modificados
- \`src/app/page.tsx\`: Nueva sección "Grow IQ" como herramienta principal empresarial, antes de Herramientas de IA y separada visualmente.
- \`src/components/Header.tsx\`: CTA de "Solicitar diagnóstico" dirigiendo ahora a \`grow-iq\`.
- \`.env.local\`: Añadido token y secretos de Supabase/OpenAI.

## Variables de Entorno Necesarias (en producción)
Asegúrese de agregar las siguientes variables de entorno en Vercel:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
OPENAI_API_KEY=tu_openai_api_key

# Para correos (Cuando lo integren, p. ej. con Resend)
EMAIL_API_KEY=tu_email_provider_key
NEXT_PUBLIC_SITE_URL=https://www.growlabs.lat
\`\`\`

## Configuración de Base de Datos (Supabase)
Si va a migrar a otro entorno (por ejemplo producción nueva):
Ejecute el archivo \`supabase-growiq.sql\` proporcionado en la raíz del proyecto dentro de la consola SQL de su proyecto Supabase.
Las políticas RLS ya permiten creación de forma anónima, y lectura filtrada por \`token\`.

## Integración de OpenAI y Fallback
Si el modelo \`gpt-4o-mini\` falla por timeouts o si la variable de entorno \`OPENAI_API_KEY\` no está seteada, el sistema de forma inteligente mostrará el motor *Determinístico* (Nivel 1) para nunca frenar la experiencia de usuario.

## Cómo probar localmente
1. Ejecuta \`npm run dev\`.
2. Ingresa a \`http://localhost:3000/grow-iq\`.
3. Navega la herramienta y verifica en el dashboard de Supabase (o consola local si está corriendo) que la data esté insertada en la tabla \`grow_iq_diagnostics\`.

## Mejoras sugeridas para una v2
- Dashboard Administrador: Crear una ruta \`/admin/grow-iq\` para métricas consolidadas.
- Integración nativa de Resend / Postmark en el archivo \`api/grow-iq/email/route.ts\` para enviar el mail real (actualmente se simula).
- Ranking de mercado: Una vez recolectados más de 20 casos empíricos, activar la función que evalúe y compare en qué percentil está la empresa con respecto al promedio en la DB. (La infraestructura lo soporta, requiere añadir una llamada extra a BD).
