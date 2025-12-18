# Guía de Despliegue en Vercel - Grow Labs Transcriptor

## 🚨 Error Actual

Si ves el error: **"Unexpected token 'R', "Request En"... is not valid JSON"**

Esto significa que las variables de entorno NO están configuradas correctamente en Vercel.

## ✅ Solución: Configurar Variables de Entorno en Vercel

### Paso 1: Acceder a la Configuración del Proyecto

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona el proyecto "Transcriptor" (o como lo hayas nombrado)
3. Haz clic en **"Settings"** (Configuración) en la parte superior
4. En el menú lateral, haz clic en **"Environment Variables"**

### Paso 2: Agregar las Variables de Entorno

Debes agregar **EXACTAMENTE** estas 3 variables con los valores de tu archivo `.env.local`:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [Copia el valor de NEXT_PUBLIC_SUPABASE_URL de tu archivo .env.local]
Environment: Production, Preview, Development (selecciona las 3)
```

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Copia el valor de NEXT_PUBLIC_SUPABASE_ANON_KEY de tu archivo .env.local]
Environment: Production, Preview, Development (selecciona las 3)
```

#### Variable 3: OPENAI_API_KEY
```
Name: OPENAI_API_KEY
Value: [Copia el valor de OPENAI_API_KEY de tu archivo .env.local]
Environment: Production, Preview, Development (selecciona las 3)
```

**IMPORTANTE**: Los valores deben ser exactamente los mismos que tienes en tu archivo `.env.local` local.

### Paso 3: Guardar y Redesplegar

1. Después de agregar las 3 variables, haz clic en **"Save"** (Guardar)
2. Ve a la pestaña **"Deployments"**
3. Encuentra el último deployment
4. Haz clic en los tres puntos (...) al lado del deployment
5. Selecciona **"Redeploy"** (Redesplegar)
6. Marca la opción **"Use existing Build Cache"** si aparece
7. Haz clic en **"Redeploy"**

### Paso 4: Verificar

Una vez que el redespliegue termine (toma 1-2 minutos):

1. Abre tu aplicación en Vercel
2. Intenta subir un archivo de audio
3. Debería funcionar correctamente

## 🔍 Verificación de Variables

Para verificar que las variables están configuradas:

1. En Vercel, ve a **Settings** → **Environment Variables**
2. Deberías ver exactamente 3 variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`

## ⚠️ Errores Comunes

### Error 1: "is not valid JSON"
**Causa**: Variables de entorno no configuradas o mal configuradas
**Solución**: Sigue los pasos anteriores exactamente

### Error 2: "Failed to fetch"
**Causa**: La API de OpenAI no está respondiendo
**Solución**: Verifica que tu API key de OpenAI sea válida y tenga créditos

### Error 3: "Error al guardar en la base de datos"
**Causa**: La tabla de Supabase no existe
**Solución**: Ejecuta el script SQL que está en `supabase-schema.sql`

## 📝 Notas Importantes

1. **NO compartas estas API keys públicamente** - Son secretas
2. Las variables que empiezan con `NEXT_PUBLIC_` son visibles en el cliente
3. La variable `OPENAI_API_KEY` es privada y solo se usa en el servidor
4. Después de cambiar variables de entorno, SIEMPRE debes redesplegar

## 🆘 Si Sigue Sin Funcionar

1. Verifica que las 3 variables estén exactamente como se muestran arriba
2. Asegúrate de haber seleccionado los 3 ambientes (Production, Preview, Development)
3. Haz un redespliegue completo (no uses caché)
4. Revisa los logs en Vercel:
   - Ve a tu proyecto
   - Haz clic en **"Deployments"**
   - Haz clic en el último deployment
   - Ve a **"Functions"** → **"procesar-audio"**
   - Revisa los logs para ver el error exacto

## 📞 Contacto

Si necesitas ayuda adicional, contacta al equipo de Grow Labs.
