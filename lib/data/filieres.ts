import type { ComponentType } from "react";
import {
  FlaskConical,
  Cog,
  Layers,
  Leaf,
  Building2,
  Droplets,
  MapPin,
  Ruler,
  Radio,
  CircuitBoard,
  Zap,
  Cpu,
  Gem,
  Fuel,
  Mountain,
  CloudRain,
} from "lucide-react";

export interface Pole {
  id: string;
  code: string;
  name: string;
}

export interface Filiere {
  id: string;
  code: string;
  name: string;
  poleId: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  featured: boolean;
}

export const poles: Pole[] = [
  { id: "gpi", code: "GPI", name: "Génie des Procédés Industriels" },
  { id: "gc", code: "GC", name: "Génie Civil" },
  { id: "gsti", code: "GSTI", name: "Génie des Sciences et Technologies Industrielles" },
  { id: "gstm", code: "GSTM", name: "Génie des Sciences de la Terre et de la Météorologie" },
];

export const filieres: Filiere[] = [
  { id: "gpci", code: "GPCI", name: "Génie des Procédés Chimiques et Industriels", poleId: "gpi", href: "/explorer?filiere=GPCI", icon: FlaskConical, featured: true },
  { id: "gmi", code: "GMI", name: "Génie Mécanique et Industriel", poleId: "gpi", href: "/explorer?filiere=GMI", icon: Cog, featured: true },
  { id: "sim", code: "SIM", name: "Sciences et Ingénierie des Matériaux", poleId: "gpi", href: "/explorer?filiere=SIM", icon: Layers, featured: false },
  { id: "gpae", code: "GPAE", name: "Génie Pharmacologique, Alimentaire et Environnemental", poleId: "gpi", href: "/explorer?filiere=GPAE", icon: Leaf, featured: false },

  { id: "btp", code: "BTP", name: "Bâtiments et Travaux Publics", poleId: "gc", href: "/explorer?filiere=BTP", icon: Building2, featured: true },
  { id: "hydr", code: "HYDR", name: "Hydraulique", poleId: "gc", href: "/explorer?filiere=HYDR", icon: Droplets, featured: false },
  { id: "igat", code: "IGAT", name: "Information Géographique et Aménagement du Territoire", poleId: "gc", href: "/explorer?filiere=IGAT", icon: MapPin, featured: false },
  { id: "uagc", code: "UAGC", name: "Urbanisme, Architecture et Génie Civil", poleId: "gc", href: "/explorer?filiere=UAGC", icon: Ruler, featured: false },

  { id: "tco", code: "TCO", name: "Télécommunication", poleId: "gsti", href: "/explorer?filiere=TCO", icon: Radio, featured: true },
  { id: "en", code: "EN", name: "Électronique", poleId: "gsti", href: "/explorer?filiere=EN", icon: CircuitBoard, featured: true },
  { id: "ge", code: "GE", name: "Génie Électrique", poleId: "gsti", href: "/explorer?filiere=GE", icon: Zap, featured: true },
  { id: "isa", code: "ISA", name: "Ingénierie des Systèmes Avancés", poleId: "gsti", href: "/explorer?filiere=ISA", icon: Cpu, featured: false },

  // 👇 MISE À JOUR ICI : MIN -> IMIN, GGO -> GGEO, MtoH -> MTO
  { id: "imin", code: "IMIN", name: "Ingénierie Minière", poleId: "gstm", href: "/explorer?filiere=IMIN", icon: Gem, featured: false },
  { id: "ipe", code: "IPE", name: "Ingénierie Pétrolière", poleId: "gstm", href: "/explorer?filiere=IPE", icon: Fuel, featured: false },
  { id: "ggeo", code: "GGEO", name: "Génie Géologique", poleId: "gstm", href: "/explorer?filiere=GGEO", icon: Mountain, featured: false },
  { id: "mto", code: "MTO", name: "Météorologie et Hydrologie", poleId: "gstm", href: "/explorer?filiere=MTO", icon: CloudRain, featured: false },
];