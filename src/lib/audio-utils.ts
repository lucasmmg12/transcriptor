// Utilidad para contar tokens aproximadamente
export function estimateTokens(text: string): number {
    // Aproximación: 1 token ≈ 4 caracteres en español
    return Math.ceil(text.length / 4)
}

// Dividir texto en chunks que quepan en el límite de tokens
export function splitTextIntoChunks(text: string, maxTokens: number = 6000): string[] {
    const estimatedTokens = estimateTokens(text)

    if (estimatedTokens <= maxTokens) {
        return [text]
    }

    const chunks: string[] = []
    const maxCharsPerChunk = maxTokens * 4 // Aproximadamente

    // Dividir por párrafos primero
    const paragraphs = text.split('\n\n')
    let currentChunk = ''

    for (const paragraph of paragraphs) {
        const potentialChunk = currentChunk + '\n\n' + paragraph

        if (potentialChunk.length > maxCharsPerChunk && currentChunk.length > 0) {
            // El chunk actual está lleno, guardarlo y empezar uno nuevo
            chunks.push(currentChunk.trim())
            currentChunk = paragraph
        } else {
            currentChunk = potentialChunk
        }
    }

    // Agregar el último chunk
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim())
    }

    // Si aún hay chunks muy grandes, dividirlos por oraciones
    const finalChunks: string[] = []
    for (const chunk of chunks) {
        if (chunk.length > maxCharsPerChunk) {
            // Dividir por oraciones
            const sentences = chunk.match(/[^.!?]+[.!?]+/g) || [chunk]
            let subChunk = ''

            for (const sentence of sentences) {
                if ((subChunk + sentence).length > maxCharsPerChunk && subChunk.length > 0) {
                    finalChunks.push(subChunk.trim())
                    subChunk = sentence
                } else {
                    subChunk += sentence
                }
            }

            if (subChunk.trim().length > 0) {
                finalChunks.push(subChunk.trim())
            }
        } else {
            finalChunks.push(chunk)
        }
    }

    return finalChunks
}

// Crear un resumen de chunks
export function createChunkSummary(chunks: string[]): string {
    return `Este texto fue dividido en ${chunks.length} partes para su análisis.
  
Parte 1: ${estimateTokens(chunks[0])} tokens aprox.
${chunks.length > 1 ? `Parte 2: ${estimateTokens(chunks[1])} tokens aprox.` : ''}
${chunks.length > 2 ? `Parte 3: ${estimateTokens(chunks[2])} tokens aprox.` : ''}
${chunks.length > 3 ? `... y ${chunks.length - 3} partes más` : ''}

Total estimado: ${estimateTokens(chunks.join(' '))} tokens`
}
