import "dotenv/config";
import { randomBytes, scryptSync } from "crypto";
import { db } from "./index";
import {
  poles, filieres, memoires, keywords, memoireKeywords, profiles,
} from "./schema";
import { user, account } from "./auth-schema";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  console.log("Nettoyage…");
  await db.delete(memoireKeywords);
  await db.delete(memoires);
  await db.delete(keywords);
  await db.delete(profiles);
  await db.delete(account);
  await db.delete(user);
  await db.delete(filieres);
  await db.delete(poles);

  console.log("Pôles…");
  const p = await db.insert(poles).values([
    { code: "GPI", name: "Génie des Procédés Industriels" },
    { code: "GC", name: "Génie Civil" },
    { code: "GSTI", name: "Génie des Sciences et Technologies Industrielles" },
    { code: "GSTM", name: "Génie des Sciences de la Terre et de la Météorologie" },
  ]).returning();
  const gpi = p.find((x) => x.code === "GPI")!.id;
  const gc = p.find((x) => x.code === "GC")!.id;
  const gsti = p.find((x) => x.code === "GSTI")!.id;
  const gstm = p.find((x) => x.code === "GSTM")!.id;

  console.log("Filières…");
  const f = await db.insert(filieres).values([
    { code: "GPCI", name: "Génie des Procédés Chimiques et Industriels", poleId: gpi },
    { code: "GMI", name: "Génie Mécanique et Industriel", poleId: gpi },
    { code: "SIM", name: "Sciences et Ingénierie des Matériaux", poleId: gpi },
    { code: "GPAE", name: "Génie Pharmacologique, Alimentaire et Environnemental", poleId: gpi },
    { code: "BTP", name: "Bâtiments et Travaux Publics", poleId: gc },
    { code: "HYDR", name: "Hydraulique", poleId: gc },
    { code: "IGAT", name: "Information Géographique et Aménagement du Territoire", poleId: gc },
    { code: "UAGC", name: "Urbanisme, Architecture et Génie Civil", poleId: gc },
    { code: "TCO", name: "Télécommunication", poleId: gsti },
    { code: "EN", name: "Électronique", poleId: gsti },
    { code: "GE", name: "Génie Électrique", poleId: gsti },
    { code: "ISA", name: "Ingénierie des Systèmes Avancés", poleId: gsti },
    { code: "MIN", name: "Ingénierie Minière", poleId: gstm },
    { code: "IPE", name: "Ingénierie Pétrolière", poleId: gstm },
    { code: "GGO", name: "Génie Géologique", poleId: gstm },
    { code: "MtoH", name: "Météorologie et Hydrologie", poleId: gstm },
  ]).returning();
  const getF = (code: string) => f.find((x) => x.code === code)!.id;

  console.log("Utilisateur de test…");
  const userId = "seed-user-herry";
  await db.insert(user).values({
    id: userId,
    name: "ANDRIANINA Herry Flavina",
    email: "herry@espa.mg",
    emailVerified: true,
    image: "/images/authors/authors1.jpg",
  });
  await db.insert(account).values({
    id: "seed-account-herry",
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashPassword("password123"),
  });
  await db.insert(profiles).values({
    userId,
    role: "etudiant",
    filiereId: getF("TCO"),
    parcours: "STI",
  });

  console.log("Mémoires…");
  const m = await db.insert(memoires).values([
    { slug: "reseau-4g-itasy", title: "Conception d'un réseau de communication pour la couverture 4G dans la région d'Itasy", summary: "Ce mémoire présente la conception et la simulation d'un réseau de communication mobile adapté au contexte rural malgache.", image: "/images/projects/telecom.jpg", annee: 2026, niveau: "L3", encadreur: "M. R. Rakotomalala", pages: 98, userId, filiereId: getF("TCO") },
    { slug: "installation-photovoltaique-vakinankaratra", title: "Dimensionnement d'une installation photovoltaïque pour l'électrification rurale", summary: "Ce projet vise à dimensionner une installation solaire autonome pour alimenter un village rural non raccordé au réseau.", image: "/images/projects/solar.jpg", annee: 2026, niveau: "L3", encadreur: "M. R. Rakotomalala", pages: 65, userId, filiereId: getF("GE") },
    { slug: "monitoring-consommation-electrique", title: "Étude et réalisation d'un système de monitoring de la consommation électrique", summary: "Ce projet vise à concevoir un système de mesure et de suivi de la consommation électrique en temps réel.", image: "/images/projects/circuit.jpg", annee: 2026, niveau: "L3", encadreur: "M. H. Rakotomanana", pages: 72, userId, filiereId: getF("EN") },
    { slug: "stabilite-pont-beton-arme", title: "Analyse de la stabilité d'un pont en béton armé dans la ville d'Antananarivo", summary: "Cette étude porte sur l'analyse de la stabilité d'un pont en béton armé soumis à différentes sollicitations.", image: "/images/projects/bridge.jpg", annee: 2026, niveau: "L3", encadreur: "M. J. Randrianasolo", pages: 80, userId, filiereId: getF("BTP") },
    { slug: "reseau-5g-antananarivo", title: "Étude de déploiement d'un réseau 5G dans la ville d'Antananarivo", summary: "Cette étude analyse les conditions techniques et topologiques pour un déploiement 5G progressif à Antananarivo.", image: "/images/projects/telecom.jpg", annee: 2025, niveau: "M2", encadreur: "Mme L. Rasolimalala", pages: 112, userId, filiereId: getF("TCO") },
    { slug: "systeme-embarque-agriculture", title: "Conception d'un système embarqué pour le suivi des cultures agricoles", summary: "Ce projet présente un prototype de capteurs embarqués pour surveiller l'humidité et la température des cultures.", image: "/images/projects/circuit.jpg", annee: 2024, niveau: "M2", encadreur: "M. H. Rakotomanana", pages: 87, userId, filiereId: getF("EN") },
    { slug: "machine-agricole-adaptee", title: "Conception et fabrication d'une machine agricole adaptée aux conditions locales", summary: "Ce mémoire porte sur la conception mécanique et la fabrication d'une machine agricole adaptée au contexte malgache.", image: "/images/projects/bridge.jpg", annee: 2024, niveau: "M2", encadreur: "M. P. Andrianarivo", pages: 76, userId, filiereId: getF("GMI") },
    { slug: "purification-eaux-usees", title: "Optimisation du procédé de purification des eaux usées par adsorption", summary: "Cette étude propose une méthode d'adsorption optimisée pour la purification d'eaux usées industrielles.", image: "/images/projects/solar.jpg", annee: 2022, niveau: "L3", encadreur: "M. T. Rakotovao", pages: 90, userId, filiereId: getF("GPCI") },
    { slug: "barrage-hydraulique", title: "Étude de faisabilité d'un micro-barrage hydraulique en zone rurale", summary: "Cette étude évalue la faisabilité technique et économique d'un micro-barrage pour l'irrigation rurale.", image: "/images/projects/bridge.jpg", annee: 2023, niveau: "M2", encadreur: "M. J. Randrianasolo", pages: 105, userId, filiereId: getF("HYDR") },
    { slug: "sig-amenagement-urbain", title: "Mise en place d'un SIG pour l'aménagement urbain d'Antananarivo", summary: "Ce mémoire propose un système d'information géographique pour appuyer la planification urbaine de la capitale.", image: "/images/projects/telecom.jpg", annee: 2023, niveau: "M2", encadreur: "Mme H. Rasoarimalala", pages: 128, userId, filiereId: getF("IGAT") },
    { slug: "electrification-rurale-reseau", title: "Extension du réseau électrique pour l'électrification rurale dans le Vakinankaratra", summary: "Ce projet analyse les options techniques pour étendre le réseau électrique en zone rurale.", image: "/images/projects/solar.jpg", annee: 2025, niveau: "L3", encadreur: "M. R. Rakotomalala", pages: 78, userId, filiereId: getF("GE") },
    { slug: "fibre-optique-ftth", title: "Déploiement d'une architecture FTTH en fibre optique pour un quartier urbain", summary: "Cette étude propose une architecture FTTH pour la desserte en très haut débit d'un quartier d'Antananarivo.", image: "/images/projects/telecom.jpg", annee: 2025, niveau: "M2", encadreur: "Mme L. Rasolimalala", pages: 96, userId, filiereId: getF("TCO") },
    { slug: "ia-embarquee-robot", title: "Implémentation d'un modèle d'intelligence artificielle embarqué sur robot mobile", summary: "Ce mémoire étudie l'intégration d'un modèle d'IA léger sur un robot mobile à ressources limitées.", image: "/images/projects/circuit.jpg", annee: 2025, niveau: "M2", encadreur: "M. H. Rakotomanana", pages: 110, userId, filiereId: getF("ISA") },
    { slug: "beton-durable-antananarivo", title: "Étude de faisabilité d'un bâtiment scolaire durable à Antananarivo", summary: "Cette étude examine les choix constructifs pour un bâtiment scolaire durable adapté au climat local.", image: "/images/projects/bridge.jpg", annee: 2023, niveau: "M2", encadreur: "M. L. Andriatsitohaina", pages: 88, userId, filiereId: getF("BTP") },
    { slug: "maintenance-predictive", title: "Mise en place d'une maintenance prédictive sur une ligne de production industrielle", summary: "Ce projet propose un système de maintenance prédictive basé sur l'analyse de signaux vibratoires.", image: "/images/projects/circuit.jpg", annee: 2024, niveau: "M2", encadreur: "M. P. Andrianarivo", pages: 102, userId, filiereId: getF("GMI") },
    { slug: "prevision-climatique-satellite", title: "Modélisation et prévision climatique à l'aide de données satellitaires", summary: "Ce mémoire utilise des données satellitaires pour améliorer la prévision climatique à Madagascar.", image: "/images/projects/solar.jpg", annee: 2023, niveau: "M2", encadreur: "Mme S. Razafindrakoto", pages: 92, userId, filiereId: getF("MtoH") },
  ]).returning();

  console.log("Mots-clés…");
  const k = await db.insert(keywords).values([
    { name: "Réseaux mobiles" }, { name: "4G" }, { name: "5G" },
    { name: "Fibre optique" }, { name: "Énergie solaire" }, { name: "Photovoltaïque" },
    { name: "IoT" }, { name: "Capteurs" }, { name: "Béton armé" },
    { name: "Structures" }, { name: "Hydraulique" }, { name: "SIG" },
    { name: "Intelligence artificielle" }, { name: "Robotique" },
    { name: "Climat" }, { name: "Maintenance" },
  ]).returning();
  const getK = (name: string) => k.find((x) => x.name === name)!.id;
  const getM = (slug: string) => m.find((x) => x.slug === slug)!.id;

  console.log("Liaisons…");
  await db.insert(memoireKeywords).values([
    { memoireId: getM("reseau-4g-itasy"), keywordId: getK("Réseaux mobiles") },
    { memoireId: getM("reseau-4g-itasy"), keywordId: getK("4G") },
    { memoireId: getM("reseau-5g-antananarivo"), keywordId: getK("5G") },
    { memoireId: getM("reseau-5g-antananarivo"), keywordId: getK("Réseaux mobiles") },
    { memoireId: getM("fibre-optique-ftth"), keywordId: getK("Fibre optique") },
    { memoireId: getM("installation-photovoltaique-vakinankaratra"), keywordId: getK("Énergie solaire") },
    { memoireId: getM("installation-photovoltaique-vakinankaratra"), keywordId: getK("Photovoltaïque") },
    { memoireId: getM("electrification-rurale-reseau"), keywordId: getK("Énergie solaire") },
    { memoireId: getM("monitoring-consommation-electrique"), keywordId: getK("IoT") },
    { memoireId: getM("monitoring-consommation-electrique"), keywordId: getK("Capteurs") },
    { memoireId: getM("systeme-embarque-agriculture"), keywordId: getK("IoT") },
    { memoireId: getM("systeme-embarque-agriculture"), keywordId: getK("Capteurs") },
    { memoireId: getM("stabilite-pont-beton-arme"), keywordId: getK("Béton armé") },
    { memoireId: getM("stabilite-pont-beton-arme"), keywordId: getK("Structures") },
    { memoireId: getM("beton-durable-antananarivo"), keywordId: getK("Béton armé") },
    { memoireId: getM("barrage-hydraulique"), keywordId: getK("Hydraulique") },
    { memoireId: getM("sig-amenagement-urbain"), keywordId: getK("SIG") },
    { memoireId: getM("ia-embarquee-robot"), keywordId: getK("Intelligence artificielle") },
    { memoireId: getM("ia-embarquee-robot"), keywordId: getK("Robotique") },
    { memoireId: getM("prevision-climatique-satellite"), keywordId: getK("Climat") },
    { memoireId: getM("maintenance-predictive"), keywordId: getK("Maintenance") },
  ]);

  console.log("✅ Seed terminé.");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});