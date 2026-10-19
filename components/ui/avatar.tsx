import Image from "next/image";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string; // Pour gérer la taille (ex: "w-10 h-10 text-sm")
}

export function UserAvatar({ name, image, className = "w-10 h-10 text-sm border-2 border-transparent" }: UserAvatarProps) {
  // Fonction pour extraire les initiales (ex: "Geneto Robson" -> "GR")
  const getInitials = (fullName?: string | null) => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // 1. Si l'utilisateur a une image, on l'affiche
  if (image) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 ${className}`}>
        <Image 
          src={image} 
          alt={name || "Avatar"} 
          fill 
          sizes="100px" 
          className="object-cover" 
        />
      </div>
    );
  }

  // 2. Sinon, on affiche les initiales avec les couleurs de ton thème
  return (
    <div 
      className={`rounded-full flex items-center justify-center shrink-0 bg-[#184F53] text-[#CEEC22] font-bold ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}