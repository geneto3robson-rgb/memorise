import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    // ✅ On initialise Resend ICI (à l'intérieur de la requête) 
    // Cela empêche Next.js de planter lors du "build" sur Vercel
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, subject, message } = await request.json();

    // Validation basique
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }

    // Envoi de l'e-mail
    await resend.emails.send({
      // ⚠️ On garde onboarding@resend.dev pour les tests (ton domaine n'est pas encore validé)
      from: "MemoRise <onboarding@resend.dev>", 
      to: "geneto3robson@gmail.com", // Ton email est bien configuré ici
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