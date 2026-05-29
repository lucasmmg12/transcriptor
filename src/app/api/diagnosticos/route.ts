import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validar credenciales provistas por el usuario
        if (email !== 'lucasmmarinero@gmail.com' || password !== '123456') {
            return NextResponse.json(
                { error: 'Credenciales inválidas o no autorizado' },
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json(
                { error: 'Variables de entorno de Supabase no configuradas' },
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Crear cliente administrativo de Supabase para omitir RLS de lectura
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        // Obtener todos los diagnósticos ordenados del más nuevo al más viejo
        const { data, error } = await supabaseAdmin
            .from('diagnosticos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data,
        }, { headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('Error en API de diagnósticos:', error);
        return NextResponse.json(
            {
                error: 'Error al obtener los diagnósticos',
                details: error.message || 'Error desconocido',
            },
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
