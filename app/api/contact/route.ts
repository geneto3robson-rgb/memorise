import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialisation de Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation basique
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }

    // Envoi de l'e-mail
    await resend.emails.send({
      // ⚠️ IMPORTANT : Pour tester, tu dois utiliser "onboarding@resend.dev" comme expéditeur.
      // Une fois ton domaine (memorise.mg) validé sur Resend, tu pourras mettre "contact@memorise.mg".
      from: "MemoRise <onboarding@resend.dev>", 
      to: "ton-email-reel@gmail.com", // 👈 REMPLACE PAR TON VRAI EMAIL ICI
      subject: `[MemoRise] Nouveau message : ${subject || "Sans sujet"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nouveau message depuis le site MemoRise</h2>
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${subject || "Non renseigné"}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message :</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Message envoyé avec succès." });
  } catch (error) {
    console.error("Erreur Resend:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'e-mail." }, { status: 500 });
  }
}