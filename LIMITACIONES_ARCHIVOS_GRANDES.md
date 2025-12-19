# Limitaciones de Archivos Grandes en Vercel

## 🚨 Problema

Los archivos de audio grandes (>10MB o >10 minutos) **no pueden procesarse** en Vercel debido a límites de tiempo de ejecución:

- **Vercel Hobby (Gratis)**: 10 segundos máximo
- **Vercel Pro**: 60 segundos máximo  
- **Vercel Enterprise**: 900 segundos (15 minutos) máximo

Un audio de 31 minutos puede tardar **2-5 minutos** en procesarse, excediendo estos límites.

## ✅ Soluciones

### Solución 1: Dividir el Audio (Recomendado)

**Divide tu audio en partes más pequeñas:**

1. Usa una herramienta como:
   - **Audacity** (gratis): https://www.audacityteam.org/
   - **Online Audio Cutter**: https://online-audio-converter.com/
   - **FFmpeg** (línea de comandos)

2. Divide el audio en segmentos de **máximo 10 minutos** cada uno

3. Procesa cada segmento por separado en la aplicación

4. Combina los resultados manualmente

**Ejemplo con FFmpeg:**
```bash
# Dividir audio en segmentos de 10 minutos (600 segundos)
ffmpeg -i audio_largo.mp3 -f segment -segment_time 600 -c copy parte_%03d.mp3
```

### Solución 2: Comprimir el Audio

**Reduce el tamaño del archivo:**

1. Usa una herramienta de compresión:
   - **Audacity**: Exporta con menor bitrate (64kbps es suficiente para voz)
   - **Online Audio Compressor**: https://www.freeconvert.com/audio-compressor

2. Configuración recomendada para voz:
   - Formato: MP3
   - Bitrate: 64 kbps (voz) o 128 kbps (música)
   - Sample Rate: 22050 Hz (voz) o 44100 Hz (música)
   - Mono (1 canal) para voz

### Solución 3: Upgrade de Vercel

**Actualiza tu plan de Vercel:**

- **Vercel Pro** ($20/mes): 60 segundos → Procesa hasta ~15 minutos de audio
- **Vercel Enterprise**: 900 segundos → Procesa hasta ~60 minutos de audio

### Solución 4: Contactar con Grow Labs

**Para archivos muy grandes o procesamiento frecuente:**

Contacta con Grow Labs para soluciones personalizadas:
- WhatsApp: https://api.whatsapp.com/send/?phone=5492643229503
- Podemos configurar un servidor dedicado sin límites de tiempo
- Procesamiento en lote de múltiples archivos
- API personalizada para tu caso de uso

## 📊 Límites Actuales

| Tipo de Plan | Tiempo Máximo | Audio Máximo (aprox.) | Tamaño Máximo |
|--------------|---------------|----------------------|---------------|
| Hobby (Gratis) | 10 segundos | ~2 minutos | ~2MB |
| Pro | 60 segundos | ~10 minutos | ~10MB |
| Enterprise | 900 segundos | ~60 minutos | ~60MB |

**Nota**: Los tiempos son aproximados y dependen de la calidad del audio y la carga del servidor.

## 🛠️ Herramientas Recomendadas

### Para Dividir Audio:
- **Audacity** (Windows/Mac/Linux): https://www.audacityteam.org/
- **mp3DirectCut** (Windows): https://mpesch3.de/
- **FFmpeg** (Línea de comandos): https://ffmpeg.org/

### Para Comprimir Audio:
- **Audacity** con exportación MP3 de bajo bitrate
- **Online Audio Compressor**: https://www.freeconvert.com/audio-compressor
- **HandBrake** (para video con audio): https://handbrake.fr/

### Para Convertir Formatos:
- **Online Audio Converter**: https://online-audio-converter.com/
- **CloudConvert**: https://cloudconvert.com/audio-converter
- **FFmpeg**

## 💡 Consejos

1. **Para entrevistas/reuniones**: 64 kbps mono es suficiente
2. **Para música**: Usa 128-192 kbps stereo
3. **Divide audios largos** antes de subir
4. **Usa formato MP3** para mejor compatibilidad
5. **Elimina silencios** al inicio y final para reducir tamaño

## 📞 Soporte

Si necesitas ayuda o tienes archivos muy grandes para procesar regularmente, contacta con Grow Labs:

- WhatsApp: https://api.whatsapp.com/send/?phone=5492643229503
- Instagram: https://www.instagram.com/growsanjuan/
- LinkedIn: https://www.linkedin.com/in/lucas-marinero-182521308/
