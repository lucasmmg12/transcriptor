import React from 'react';
import Header from '@/components/Header';
import GrowIqResults from '@/components/grow-iq/GrowIqResults';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tu Resultado | Grow IQ',
  description: 'Resultados del diagnóstico de madurez operativa y digital.',
};

export default async function GrowIqResultsPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const token = params.token;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('grow_iq_diagnostics')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0f0d] selection:bg-emerald-500/30">
      <Header />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 relative z-10">
        <div className="container mx-auto">
          <GrowIqResults token={token} initialData={data} />
        </div>
      </div>
      
      {/* Estilos para impresión */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; }
          header, nav, button { display: none !important; }
          #grow-iq-report { background: white !important; border: none !important; color: black !important; box-shadow: none !important; }
          .text-white { color: black !important; }
          .text-gray-400, .text-gray-300 { color: #333 !important; }
          .bg-\\[#0f1513\\] { background: white !important; border: 1px solid #eee !important; }
          .bg-white\\/5 { background: #f9f9f9 !important; border: 1px solid #eaeaea !important; }
          .blur-3xl { display: none !important; }
        }
      `}} />
    </main>
  );
}
