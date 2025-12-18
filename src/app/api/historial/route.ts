import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('analisis_audios')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            return NextResponse.json(
                { error: 'Error al obtener el historial: ' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Error al obtener el historial', details: error.message },
            { status: 500 }
        )
    }
}
