"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#051414] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-[#184F53] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1E1E] dark:text-white mb-4">Contactez-nous</h1>
          <p className="text-neutral-500">Une question, une suggestion ou un problème technique ? Écrivez-nous.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Colonne Infos */}
          <div className="bg-[#E8F0F0] dark:bg-[#0A1E1E] rounded-3xl p-8 h-fit">
            <h2 className="text-xl font-bold text-[#0A1E1E] dark:text-white mb-6">Nos coordonnées</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#184F53] flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#184F53] dark:text-[#CEEC22]" />
                </div>
                <div>
                  <p className="font-bold text-[#0A1E1E] dark:text-white">Adresse</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">École Supérieure Polytechnique<br />Antananarivo, Madagascar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#184F53] flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-5 h-5 text-[#184F53] dark:text-[#CEEC22]" />
                </div>
                <div>
                  <p className="font-bold text-[#0A1E1E] dark:text-white">E-mail</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">contact@memorise.mg</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#184F53] flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 text-[#184F53] dark:text-[#CEEC22]" />
                </div>
                <div>
                  <p className="font-bold text-[#0A1E1E] dark:text-white">Téléphone</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">+261 34 78 805 02</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Formulaire */}
          <div className="bg-[#E8F0F0] dark:bg-[#0A1E1E] rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A1E1E] dark:text-white mb-1">Nom complet</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#051414] text-[#0A1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#184F53]" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A1E1E] dark:text-white mb-1">E-mail</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#051414] text-[#0A1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#184F53]" placeholder="vous@exemple.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A1E1E] dark:text-white mb-1">Sujet</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#051414] text-[#0A1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#184F53]" placeholder="L'objet de votre message" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0A1E1E] dark:text-white mb-1">Message</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#051414] text-[#0A1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#184F53] resize-none" placeholder="Écrivez votre message ici..." />
              </div>

              {status === "success" && <p className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">Votre message a bien été envoyé !</p>}
              {status === "error" && <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">Une erreur est survenue. Veuillez réessayer.</p>}

              <button type="submit" disabled={status === "loading"} className="w-full flex items-center justify-center gap-2 bg-[#CEEC22] hover:bg-[#b5d11b] text-[#0A1E1E] font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2">
                {status === "loading" ? "Envoi en cours..." : <><Send className="w-5 h-5" /> Envoyer le message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}