# Guía de Verificación y Troubleshooting - Grow Labs Transcriptor

## 🔍 Verificar que Todo Esté Funcionando

### 1. Verificar Variables de Entorno en Vercel

Abre esta URL en tu navegador (reemplaza `tu-app` con tu dominio de Vercel):

```
https://tu-app.vercel.app/api/health
```

Deberías ver algo como:

```json
{
  "timestamp": "2024-12-19T...",
  "environment": "production",
  "vercel": "Yes",
  "checks": {
    "supabaseUrl": {
      "configured": true,
      "value": "✓ Configurado"
    },
    "supabaseKey": {
      "configured": true,
      "value": "✓ Configurado"
    },
    "openaiKey": {
      "configured": true,
      "value": "✓ Configurado",
      "prefix": "sk-proj"
    }
  },
  "allConfigured": true,
  "message": "✅ Todas las variables están configuradas correctamente."
}
```

### 2. Si `allConfigured` es `false`

Significa que las variables de entorno NO están configuradas en Vercel:

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega las 3 variables (copia los valores de tu archivo `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
5. **IMPORTANTE**: Selecciona los 3 ambientes (Production, Preview, Development)
6. Guarda
7. Ve a **Deployments** → Último deployment → **Redeploy**

### 3. Verificar el Deployment

Después de configurar las variables y redesplegar:

1. Espera 1-2 minutos a que termine el deployment
2. Abre de nuevo `/api/health`
3. Verifica que `allConfigured` sea `true`
4. Intenta subir un audio

## ❌ Error: "Unexpected token 'R', "Request En"... is not valid JSON"

Este error significa que el servidor está devolviendo HTML en lugar de JSON, lo cual ocurre cuando:

### Causa 1: Variables de Entorno No Configuradas

**Solución:**
1. Verifica `/api/health` como se explicó arriba
2. Configura las variables faltantes
3. Redesplega

### Causa 2: Deployment Antiguo en Caché

**Solución:**
1. Ve a Vercel → Deployments
2. Encuentra el último deployment
3. Haz clic en los 3 puntos (...)
4. Selecciona **Redeploy**
5. **NO** marques "Use existing Build Cache"
6. Espera a que termine

### Causa 3: Error en el Código

**Solución:**
1. Ve a Vercel → Deployments → Último deployment
2. Haz clic en **Functions**
3. Busca `procesar-audio`
4. Revisa los logs para ver el error exacto
5. Comparte el error conmigo para ayudarte

## 🎯 Checklist de Verificación

Antes de intentar procesar un audio, verifica:

- [ ] `/api/health` muestra `allConfigured: true`
- [ ] El último deployment en Vercel está en estado "Ready"
- [ ] Las 3 variables de entorno están configuradas
- [ ] Has redespliegado después de configurar las variables
- [ ] El archivo de audio es menor a 25MB
- [ ] El formato de audio es compatible (MP3, WAV, M4A, OPUS, etc.)

## 📊 Límites y Capacidades

| Característica | Límite |
|----------------|--------|
| Tamaño máximo de archivo | 25MB |
| Duración aproximada | 60-90 minutos |
| Tiempo de procesamiento | 1-3 minutos |
| Formatos soportados | MP3, WAV, M4A, OPUS, OGG, FLAC, WebM, MP4 |

## 🔧 Comandos Útiles

### Ver logs en tiempo real (local)
```bash
npm run dev
```

### Verificar variables locales
```bash
cat .env.local
```

### Verificar estado de Git
```bash
git status
git log -1
```

## 📞 Soporte

Si después de seguir todos estos pasos el problema persiste:

1. Toma una captura de pantalla de `/api/health`
2. Toma una captura de pantalla del error
3. Copia los logs de Vercel (Functions → procesar-audio)
4. Contacta:
   - WhatsApp: https://api.whatsapp.com/send/?phone=5492643229503
   - Instagram: https://www.instagram.com/growsanjuan/

## 🚀 Procesamiento de Archivos Grandes

La aplicación ahora soporta archivos de hasta 25MB con procesamiento optimizado:

- **Archivos pequeños (<8MB)**: Procesamiento directo
- **Archivos grandes (8-25MB)**: Procesamiento optimizado automático
  - Whisper transcribe el audio completo
  - GPT-4 analiza en partes si es necesario
  - Los resultados se combinan automáticamente

No necesitas hacer nada especial, el sistema detecta automáticamente el tamaño y usa la mejor estrategia.
