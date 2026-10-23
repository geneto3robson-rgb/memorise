"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Mode = "login" | "signup";
type Status = "idle" | "loading" | "error" | "success";

const inputClass =
  "w-full px-4 py-3 rounded-full bg-neutral-50 border border-neutral-200 text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cta-500 focus:bg-white transition-colors";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.5v5.4h7.1c4.2-3.8 6.6-9.5 6.6-15.9z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.4c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.4v5.6C8 41.2 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.2-3 .7-4.3V14H4.4C2.9 17 2 20.4 2 24s.9 7 2.4 10l7.4-5.7z" />
      <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8 6.8 4.4 14l7.4 5.7c1.7-5.2 6.5-9 12.2-9z" />
    </svg>
  );
}

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<Mode>(initialMode);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Sert pour l'e-mail OU le nom d'utilisateur
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  
  const [googleLoading, setGoogleLoading] = useState(false);

  const isLogin = mode === "login";

  const switchMode = (next: Mode) => {
    setMode(next);
    setStatus("idle");
    setMessage("");
    setGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle"); 
    setMessage("");

    if (!email || !password || (!isLogin && (!name || !confirm))) {
      setStatus("error");
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // LOGIQUE POUR GÉRER L'EMAIL OU LE NOM D'UTILISATEUR
    const isEmailInput = email.includes("@");
    
    // Si c'est un email, on le valide. Si c'est un username, on ne valide pas le format email.
    if (isEmailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Adresse e-mail invalide.");
      return;
    }

    // Création d'un email virtuel si l'utilisateur a tapé un nom d'utilisateur
    let finalEmail = email.trim();
    if (!isEmailInput) {
      // Nettoie le pseudo (pas d'espaces, pas de majuscules)
      finalEmail = `${finalEmail.toLowerCase().replace(/\s+/g, '')}@memorise.app`;
    }
    // FIN DE LA LOGIQUE

    if (password.length < 6) {
      setStatus("error");
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (!isLogin && password !== confirm) {
      setStatus("error");
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setStatus("loading");

    try {
      if (isLogin) {
        await authClient.signIn.email({
          email: finalEmail, // 👈 On utilise finalEmail
          password,
          callbackURL: "/tableau-de-bord",
        }, {
          onError: (ctx) => {
            setStatus("error");
            setMessage(ctx.error.message || "Identifiants incorrects.");
          },
          onSuccess: () => {
            setStatus("success");
            setMessage("Connexion réussie. Redirection…");
            router.push("/tableau-de-bord");
          }
        });
      } else {
        await authClient.signUp.email({
          email: finalEmail, // 👈 On utilise finalEmail
          password,
          name, // On garde le nom complet pour l'affichage
          callbackURL: "/tableau-de-bord",
        }, {
          onError: (ctx) => {
            setStatus("error");
            setMessage(ctx.error.message || "Erreur lors de la création du compte.");
          },
          onSuccess: () => {
            setStatus("success");
            setMessage("Compte créé. Redirection…");
            router.push("/tableau-de-bord");
          }
        });
      }
    } catch {
      setStatus("error");
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/tableau-de-bord",
      });
    } catch (error) {
      setGoogleLoading(false);
      setStatus("error");
      setMessage("Erreur lors de la connexion avec Google.");
    }
  };

  const loading = status === "loading";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      
      {/* Faux fond flouté */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center blur-sm scale-110" />
      <div className="absolute inset-0 bg-primary-950/60 backdrop-blur-md" />

      {/* Bouton Fermer (X) */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 p-2 rounded-full bg-white text-primary-900 hover:bg-neutral-100 transition-colors shadow-lg z-50"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Carte Modale avec effet de glissement */}
      <div className="relative z-10 w-full max-w-4xl h-[680px] rounded-3xl overflow-hidden shadow-2xl bg-white">
        
        {/* Panneau Vert (Glissant) */}
        <div
          className={`hidden lg:flex absolute inset-y-0 w-1/2 z-10 flex-col justify-between p-10 bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 transition-all duration-[900ms] ease-in-out ${
            isLogin ? "left-0 rounded-r-[40px]" : "left-1/2 rounded-l-[40px]"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MemoRise" width={40} height={40} unoptimized />
            <span className="text-xl font-bold text-white font-heading">MemoRise</span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-white font-heading mb-3 leading-tight">
              {isLogin ? "Bon retour parmi nous !" : "Bienvenue sur MemoRise !"}
            </h2>
            <p className="text-white/80">
              {isLogin
                ? "Connectez-vous pour accéder à votre espace."
                : "Créez votre compte pour accéder à votre espace."}
            </p>
          </div>

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-cta-500/10 blur-3xl" />
        </div>

        {/* Panneau Blanc (Formulaire) */}
        <div
          className={`absolute inset-y-0 w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white transition-all duration-[900ms] ease-in-out ${
            isLogin ? "lg:left-1/2" : "lg:left-0"
          }`}
        >
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-6">
            <Image src="/logo.svg" alt="MemoRise" width={32} height={32} unoptimized />
            <span className="text-lg font-bold text-primary-900 font-heading">MemoRise</span>
          </Link>

          <h1 className="text-2xl font-bold text-primary-900 font-heading mb-1">
            {isLogin ? "Se connecter" : "Créer un compte"}
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            {isLogin ? "Accédez à votre espace MemoRise." : "Rejoignez la communauté MemoRise."}
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || googleLoading}
                className={inputClass}
              />
            )}
            <input
              type="text" // 👈 Changé de "email" à "text" pour accepter les pseudos
              placeholder="E-mail ou Nom d'utilisateur" // 👈 Changé le placeholder
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || googleLoading}
              className={inputClass}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
                className={inputClass + " pr-12"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {!isLogin && (
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading || googleLoading}
                  className={inputClass + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary-900"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {message && (
              <p
                className={`text-xs text-center ${
                  status === "error" ? "text-error-500" : "text-success-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-400 disabled:opacity-60 disabled:cursor-not-allowed text-primary-900 font-semibold rounded-full py-3 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading
                ? "Chargement…"
                : isLogin
                ? "Se connecter"
                : "Créer mon compte"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400">Ou continuer avec</span>
            <span className="flex-1 h-px bg-neutral-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-full py-3 hover:bg-neutral-50 disabled:opacity-60 transition-colors"
          >
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : <GoogleIcon />}
            Google
          </button>

          <p className="text-center text-sm text-neutral-500 mt-6">
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button
              onClick={() => switchMode(isLogin ? "signup" : "login")}
              className="text-primary-900 font-semibold hover:text-cta-600 transition-colors"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ConnexionForm />
    </Suspense>
  );
}