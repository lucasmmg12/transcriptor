import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token, email, name, score, level } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // AQUI IRÍA LA INTEGRACIÓN CON SENDGRID, RESEND, POSTMARK, ETC.
    // Ejemplo de payload:
    const emailPayload = {
      to: email,
      subject: 'Tu resultado Grow IQ está listo',
      html: `
        <h1>Hola ${name},</h1>
        <p>Tu diagnóstico Grow IQ ha finalizado con éxito.</p>
        <h2>Puntaje: ${score}/100</h2>
        <h3>Nivel: ${level}</h3>
        <p>Puedes ver el informe detallado y tus recomendaciones aquí:</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.growlabs.lat'}/grow-iq/resultados/${token}">Ver mis resultados</a>
        <br/><br/>
        <p>Saludos,<br/>El equipo de Grow Labs</p>
      `
    };

    // Si tuviéramos un proveedor configurado:
    // await emailClient.send(emailPayload);
    console.log('Simulando envío de correo (Falta configurar proveedor SMTP/API):', emailPayload.to);

    return NextResponse.json({ success: true, message: 'Correo simulado exitosamente' });
  } catch (error) {
    console.error('Grow IQ Email API Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
