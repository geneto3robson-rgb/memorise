"use client";

import { useState } from "react";
import { ChevronDown, Send } from "lucide-react";

const faqs = [
  { question: "Qu'est-ce que MemoRise ?", answer: "MemoRise est un catalogue en ligne qui référence les mémoires de fin d'études de l'ESPA. Il vous permet de trouver facilement un travail par filière, année ou auteur." },
  { question: "Puis-je télécharger les fichiers PDF des mémoires ?", answer: "Non, MemoRise est un catalogue de métadonnées. La conservation et la distribution des documents physiques restent assurées par la BAU (Bibliothèque)." },
  { question: "Comment publier mon propre mémoire ?", answer: "Il vous suffit de créer un compte étudiant, puis de vous rendre dans l'onglet 'Publier' de votre tableau de bord. Vous pourrez y renseigner toutes les informations relatives à votre travail." },
  { question: "Puis-je contacter l'auteur d'un mémoire ?", answer: "Oui, si l'auteur a renseigné ses réseaux sociaux (Facebook, LinkedIn) ou son numéro WhatsApp sur la page de son mémoire, vous pourrez le contacter directement." },
  { question: "Les informations de mon profil sont-elles visibles ?", answer: "Seuls votre nom et votre prénom sont visibles publiquement sur vos mémoires. Votre adresse e-mail et vos autres informations personnelles restent confidentielles." },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  // État pour le formulaire de contact rapide
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: "Utilisateur FAQ", 
          email: email, 
          subject: "Question depuis la FAQ", 
          message: question 
        }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setQuestion("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0A1E1E] dark:text-white mb-4">Foire Aux Questions</h1>
          <p className="text-neutral-500">Trouvez les réponses aux questions les plus fréquentes sur MemoRise.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Accordéon FAQ (Gauche) */}
          <div className="md:col-span-2 space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-[#0A1E1E] rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-[#0A1E1E] dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                >
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-5 text-sm text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Formulaire de question (Droite) */}
          <div className="bg-[#184F53] rounded-3xl p-8 h-fit text-white">
            <h2 className="text-xl font-bold mb-2">Vous ne trouvez pas votre réponse ?</h2>
            <p className="text-sm text-white/70 mb-6">Posez-nous votre question, notre équipe vous répondra rapidement.</p>
            
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Votre adresse e-mail" 
                className="w-full px-4 py-3 rounded-xl bg-white text-[#0A1E1E] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#CEEC22]" 
              />
              <textarea 
                required 
                rows={4} 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                placeholder="Écrivez votre question ici..." 
                className="w-full px-4 py-3 rounded-xl bg-white text-[#0A1E1E] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#CEEC22] resize-none" 
              />
              
              {status === "success" && <p className="text-[#CEEC22] text-sm font-medium">Votre question a bien été envoyée !</p>}
              {status === "error" && <p className="text-red-300 text-sm font-medium">Une erreur est survenue.</p>}

              <button type="submit" disabled={status === "loading"} className="w-full flex items-center justify-center gap-2 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                {status === "loading" ? "Envoi..." : <><Send className="w-5 h-5" /> Envoyer</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}