// Utilidad para dividir archivos de audio grandes
export async function splitAudioFile(file: File, chunkDurationMinutes: number = 10): Promise<Blob[]> {
    // Esta es una función placeholder
    // En producción, necesitarías usar una librería como ffmpeg.wasm
    // Por ahora, retornamos el archivo completo
    return [file]
}

export function estimateProcessingTime(fileSizeBytes: number): number {
    // Estimar tiempo de procesamiento basado en tamaño
    // Aproximadamente 1MB = 1 minuto de audio = 10-15 segundos de procesamiento
    const fileSizeMB = fileSizeBytes / (1024 * 1024)
    return Math.ceil(fileSizeMB * 12) // segundos
}

export function canProcessInVercel(fileSizeBytes: number, maxSeconds: number = 60): boolean {
    const estimatedTime = estimateProcessingTime(fileSizeBytes)
    return estimatedTime < maxSeconds
}
