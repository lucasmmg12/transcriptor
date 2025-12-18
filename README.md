# AudioInsight 🎙️

Una aplicación web profesional para transcribir y analizar archivos de audio utilizando IA.

## 🚀 Características

- **Transcripción Automática**: Utiliza OpenAI Whisper para convertir audio a texto
- **Análisis Inteligente**: GPT-4 analiza el contenido según el contexto seleccionado
- **Múltiples Contextos de Análisis**:
  - 💼 Entrevista de Trabajo
  - 🤝 Reunión con Cliente
  - 📝 Resumen General
- **Persistencia de Datos**: Almacena todos los análisis en Supabase
- **Interfaz Moderna**: Diseño glassmorphism con Tailwind CSS
- **Drag & Drop**: Sube archivos arrastrándolos
- **Historial Completo**: Visualiza todos tus análisis previos

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + React 19
- **Estilos**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **IA**: OpenAI (Whisper + GPT-4)
- **Lenguaje**: TypeScript

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de OpenAI con acceso a la API
- Cuenta de Supabase

## 🔧 Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

El archivo `.env.local` ya está configurado con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kpfhkmzgrytxbntjazlz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
OPENAI_API_KEY=tu_openai_key
```

### 3. Configurar la Base de Datos en Supabase

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/kpfhkmzgrytxbntjazlz

2. Navega a **SQL Editor** en el menú lateral

3. Ejecuta el siguiente script SQL para crear la tabla:

```sql
-- Crear la tabla analisis_audios
CREATE TABLE IF NOT EXISTS public.analisis_audios (
  id BIGSERIAL PRIMARY KEY,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo_analisis TEXT NOT NULL,
  transcripcion_original TEXT NOT NULL,
  resultado_analisis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_analisis_audios_created_at 
ON public.analisis_audios(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analisis_audios_tipo 
ON public.analisis_audios(tipo_analisis);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.analisis_audios ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir todas las operaciones (ajusta según tus necesidades de seguridad)
CREATE POLICY "Permitir todas las operaciones" 
ON public.analisis_audios 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE public.analisis_audios IS 'Almacena las transcripciones y análisis de archivos de audio';
COMMENT ON COLUMN public.analisis_audios.fecha IS 'Fecha y hora del análisis';
COMMENT ON COLUMN public.analisis_audios.tipo_analisis IS 'Tipo de análisis: entrevista-trabajo, reunion-cliente, resumen-general';
COMMENT ON COLUMN public.analisis_audios.transcripcion_original IS 'Texto transcrito por Whisper';
COMMENT ON COLUMN public.analisis_audios.resultado_analisis IS 'Análisis generado por GPT-4';
```

4. Haz clic en **Run** para ejecutar el script

5. Verifica que la tabla se creó correctamente yendo a **Table Editor** → `analisis_audios`

### 4. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📖 Uso

1. **Subir Audio**: Arrastra un archivo de audio o haz clic para seleccionarlo
   - Formatos aceptados: MP3, WAV, M4A, OPUS (WhatsApp), OGG, FLAC, WebM, MP4
2. **Seleccionar Contexto**: Elige el tipo de análisis que deseas realizar
3. **Procesar**: Haz clic en "Procesar Audio" y espera los resultados
4. **Ver Resultados**: La transcripción y el análisis se mostrarán automáticamente
5. **Consultar Historial**: Todos los análisis se guardan y pueden consultarse en la sección de historial

## 🎨 Tipos de Análisis

### 💼 Entrevista de Trabajo
Analiza entrevistas laborales identificando:
- Perfil del candidato
- Fortalezas principales
- Áreas de mejora
- Recomendación de contratación

### 🤝 Reunión con Cliente
Extrae información de reuniones comerciales:
- Requerimientos identificados
- Lista de tareas
- Tono y actitud del cliente
- Próximos pasos

### 📝 Resumen General
Genera un resumen ejecutivo con:
- Puntos clave
- Temas principales
- Conclusiones
- Información relevante

## 📁 Estructura del Proyecto

```
audioinsight/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── procesar-audio/
│   │   │   │   └── route.ts          # API para procesar audio
│   │   │   └── historial/
│   │   │       └── route.ts          # API para obtener historial
│   │   ├── layout.tsx                # Layout principal
│   │   ├── page.tsx                  # Página principal
│   │   └── globals.css               # Estilos globales
│   └── lib/
│       ├── supabase.ts               # Cliente de Supabase
│       └── openai.ts                 # Cliente de OpenAI y prompts
├── .env.local                        # Variables de entorno
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🔒 Seguridad

- Las API keys están protegidas en variables de entorno
- El archivo `.env.local` está en `.gitignore`
- Supabase RLS está habilitado (ajusta las políticas según tus necesidades)

## 🚀 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno en Vercel
4. Despliega

### Otras Plataformas

La aplicación es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 Notas Importantes

- **Límite de Tamaño**: Los archivos de audio no deben superar 25MB (límite de OpenAI Whisper)
- **Formatos Soportados**: MP3, WAV, M4A, MP4, MPEG, MPGA, WebM, OGG, OPUS, FLAC
  - ✅ **Compatible con WhatsApp**: Los audios de WhatsApp en formato OPUS son totalmente compatibles
- **Costos**: Esta aplicación consume créditos de OpenAI. Whisper cuesta $0.006/minuto y GPT-4 varía según el uso
- **Tiempo de Procesamiento**: Depende del tamaño del archivo, generalmente 30-60 segundos

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que la tabla `analisis_audios` existe en tu base de datos

### Error de OpenAI
- Verifica que tu API key sea válida
- Asegúrate de tener créditos disponibles en tu cuenta de OpenAI

### Error al subir archivos
- Verifica que el archivo sea menor a 25MB
- Asegúrate de que el formato sea uno de los soportados: MP3, WAV, M4A, OPUS, OGG, FLAC, WebM, MP4
- Los archivos de WhatsApp en formato OPUS son totalmente compatibles

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

---

Desarrollado con ❤️ usando Next.js, OpenAI y Supabase
