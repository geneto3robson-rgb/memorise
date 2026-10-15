import "dotenv/config";
import { db } from "./index";
import {
  poles, filieres, users, memoires, keywords, memoireKeywords, favoris,
} from "./schema";

async function seed() {
  console.log("Nettoyage…");
  await db.delete(memoireKeywords);
  await db.delete(memoires);
  await db.delete(keywords);
  await db.delete(favoris);
  await db.delete(users);
  await db.delete(filieres);
  await db.delete(poles);

  console.log("Insertion des pôles…");
  const polesInseres = await db.insert(poles).values([
    { code: "GPI", name: "Génie des Procédés Industriels" },
    { code: "GC", name: "Génie Civil" },
    { code: "GSTI", name: "Génie des Sciences et Technologies Industrielles" },
    { code: "GSTM", name: "Génie des Sciences de la Terre et de la Météorologie" },
  ]).returning();

  const gpi = polesInseres.find((p) => p.code === "GPI")!;
  const gc = polesInseres.find((p) => p.code === "GC")!;
  const gsti = polesInseres.find((p) => p.code === "GSTI")!;
  const gstm = polesInseres.find((p) => p.code === "GSTM")!;

  console.log("Insertion des filières…");
  const filieresInseres = await db.insert(filieres).values([
    { code: "GPCI", name: "Génie des Procédés Chimiques et Industriels", poleId: gpi.id },
    { code: "GMI", name: "Génie Mécanique et Industriel", poleId: gpi.id },
    { code: "SIM", name: "Sciences et Ingénierie des Matériaux", poleId: gpi.id },
    { code: "GPAE", name: "Génie Pharmacologique, Alimentaire et Environnemental", poleId: gpi.id },
    { code: "BTP", name: "Bâtiments et Travaux Publics", poleId: gc.id },
    { code: "HYDR", name: "Hydraulique", poleId: gc.id },
    { code: "IGAT", name: "Information Géographique et Aménagement du Territoire", poleId: gc.id },
    { code: "UAGC", name: "Urbanisme, Architecture et Génie Civil", poleId: gc.id },
    { code: "TCO", name: "Télécommunication", poleId: gsti.id },
    { code: "EN", name: "Électronique", poleId: gsti.id },
    { code: "GE", name: "Génie Électrique", poleId: gsti.id },
    { code: "ISA", name: "Ingénierie des Systèmes Avancés", poleId: gsti.id },
    { code: "MIN", name: "Ingénierie Minière", poleId: gstm.id },
    { code: "IPE", name: "Ingénierie Pétrolière", poleId: gstm.id },
    { code: "GGO", name: "Génie Géologique", poleId: gstm.id },
    { code: "MtoH", name: "Météorologie et Hydrologie", poleId: gstm.id },
  ]).returning();

  const getF = (code: string) => filieresInseres.find((f) => f.code === code)!;

  console.log("Insertion de l'utilisateur de test…");
  const [herry] = await db.insert(users).values({
    name: "ANDRIANINA Herry Flavina",
    email: "herry@espa.mg",
    image: "/images/authors/authors1.jpg",
    role: "etudiant",
    filiereId: getF("TCO").id,
    parcours: "STI",
  }).returning();

  console.log("Insertion des mémoires…");
  const memoiresInseres = await db.insert(memoires).values([
    { slug: "reseau-4g-itasy", title: "Conception d'un réseau de communication pour la couverture 4G dans la région d'Itasy", summary: "Ce mémoire présente la conception et la simulation d'un réseau de communication mobile adapté au contexte rural malgache.", image: "/images/projects/telecom.jpg", annee: 2026, niveau: "L3", encadreur: "M. R. Rakotomalala", pages: 98, userId: herry.id, filiereId: getF("TCO").id },
    { slug: "installation-photovoltaique-vakinankaratra", title: "Dimensionnement d'une installation photovoltaïque pour l'électrification rurale", summary: "Ce projet vise à dimensionner une installation solaire autonome pour alimenter un village rural non raccordé au réseau.", image: "/images/projects/solar.jpg", annee: 2026, niveau: "L3", encadreur: "M. R. Rakotomalala", pages: 65, userId: herry.id, filiereId: getF("GE").id },
    { slug: "monitoring-consommation-electrique", title: "Étude et réalisation d'un système de monitoring de la consommation électrique", summary: "Ce projet vise à concevoir un système de mesure et de suivi de la consommation électrique en temps réel.", image: "/images/projects/circuit.jpg", annee: 2026, niveau: "L3", encadreur: "M. H. Rakotomanana", pages: 72, userId: herry.id, filiereId: getF("EN").id },
    { slug: "stabilite-pont-beton-arme", title: "Analyse de la stabilité d'un pont en béton armé dans la ville d'Antananarivo", summary: "Cette étude porte sur l'analyse de la stabilité d'un pont en béton armé soumis à différentes sollicitations.", image: "/images/projects/bridge.jpg", annee: 2026, niveau: "L3", encadreur: "M. J. Randrianasolo", pages: 80, userId: herry.id, filiereId: getF("BTP").id },
    { slug: "reseau-5g-antananarivo", title: "Étude de déploiement d'un réseau 5G dans la ville d'Antananarivo", summary: "Cette étude analyse les conditions techniques et topologiques pour un déploiement 5G progressif à Antananarivo.", image: "/images/projects/telecom.jpg", annee: 2025, niveau: "M2", encadreur: "Mme L. Rasolimalala", pages: 112, userId: herry.id, filiereId: getF("TCO").id },
    { slug: "systeme-embarque-agriculture", title: "Conception d'un système embarqué pour le suivi des cultures agricoles", summary: "Ce projet présente un prototype de capteurs embarqués pour surveiller l'humidité et la température des cultures.", image: "/images/projects/circuit.jpg", annee: 2024, niveau: "M2", encadreur: "M. H. Rakotomanana", pages: 87, userId: herry.id, filiereId: getF("EN").id },
    { slug: "machine-agricole-adaptee", title: "Conception et fabrication d'une machine agricole adaptée aux conditions locales", summary: "Ce mémoire porte sur la conception mécanique et la fabrication d'une machine agricole adaptée au contexte malgache.", image: "/images/projects/bridge.jpg", annee: 2024, niveau: "M2", encadreur: "M. P. Andrianarivo", pages: 76, userId: herry.id, filiereId: getF("GMI").id },
    { slug: "purification-eaux-usees", title: "Optimisation du procédé de purification des eaux usées par adsorption", summary: "Cette étude propose une méthode d'adsorption optimisée pour la purification d'eaux usées industrielles.", image: "/images/projects/solar.jpg", annee: 2022, niveau: "L3", encadreur: "M. T. Rakotovao", pages: 90, userId: herry.id, filiereId: getF("GPCI").id },
    { slug: "barrage-hydraulique", title: "Étude de faisabilité d'un micro-barrage hydraulique en zone rurale", summary: "Cette étude évalue la faisabilité technique et économique d'un micro-barrage pour l'irrigation rurale.", image: "/images/projects/bridge.jpg", annee: 2023, niveau: "M2", encadreur: "M. J. Randrianasolo", pages: 105, userId: herry.id, filiereId: getF("HYDR").id },
    { slug: "sig-amenagement-urbain", title: "Mise en place d'un SIG pour l'aménagement urbain d'Antananarivo", summary: "Ce mémoire propose un système d'information géographique pour appuyer la planification urbaine de la capitale.", image: "/images/projects/telecom.jpg", annee: 2023, niveau: "M2", encadreur: "Mme H. Rasoarimalala", pages: 128, userId: herry.id, filiereId: getF("IGAT").id },
    { slug: "electrification-rurale-reseau", title: "Extension du réseau électrique pour l'électrification rurale dans le Vakinankaratra", summary: "Ce projet analyse les options techniques pour étendre le réseau électrique en zone rurale.", image: "/images/projects/solar.jpg", annee: 2025, niveau: "L3", encadreur: "M. R. Rakotomalala", pages: 78, userId: herry.id, filiereId: getF("GE").id },
    { slug: "fibre-optique-ftth", title: "Déploiement d'une architecture FTTH en fibre optique pour un quartier urbain", summary: "Cette étude propose une architecture FTTH pour la desserte en très haut débit d'un quartier d'Antananarivo.", image: "/images/projects/telecom.jpg", annee: 2025, niveau: "M2", encadreur: "Mme L. Rasolimalala", pages: 96, userId: herry.id, filiereId: getF("TCO").id },
    { slug: "ia-embarquee-robot", title: "Implémentation d'un modèle d'intelligence artificielle embarqué sur robot mobile", summary: "Ce mémoire étudie l'intégration d'un modèle d'IA léger sur un robot mobile à ressources limitées.", image: "/images/projects/circuit.jpg", annee: 2025, niveau: "M2", encadreur: "M. H. Rakotomanana", pages: 110, userId: herry.id, filiereId: getF("ISA").id },
    { slug: "beton-durable-antananarivo", title: "Étude de faisabilité d'un bâtiment scolaire durable à Antananarivo", summary: "Cette étude examine les choix constructifs pour un bâtiment scolaire durable adapté au climat local.", image: "/images/projects/bridge.jpg", annee: 2023, niveau: "M2", encadreur: "M. L. Andriatsitohaina", pages: 88, userId: herry.id, filiereId: getF("BTP").id },
    { slug: "maintenance-predictive", title: "Mise en place d'une maintenance prédictive sur une ligne de production industrielle", summary: "Ce projet propose un système de maintenance prédictive basé sur l'analyse de signaux vibratoires.", image: "/images/projects/circuit.jpg", annee: 2024, niveau: "M2", encadreur: "M. P. Andrianarivo", pages: 102, userId: herry.id, filiereId: getF("GMI").id },
    { slug: "prevision-climatique-satellite", title: "Modélisation et prévision climatique à l'aide de données satellitaires", summary: "Ce mémoire utilise des données satellitaires pour améliorer la prévision climatique à Madagascar.", image: "/images/projects/solar.jpg", annee: 2023, niveau: "M2", encadreur: "Mme S. Razafindrakoto", pages: 92, userId: herry.id, filiereId: getF("MtoH").id },
  ]).returning();

  console.log("Insertion des mots-clés…");
  const keywordsInseres = await db.insert(keywords).values([
    { name: "Réseaux mobiles" },
    { name: "4G" },
    { name: "5G" },
    { name: "Fibre optique" },
    { name: "Énergie solaire" },
    { name: "Photovoltaïque" },
    { name: "IoT" },
    { name: "Capteurs" },
    { name: "Béton armé" },
    { name: "Structures" },
    { name: "Hydraulique" },
    { name: "SIG" },
    { name: "Intelligence artificielle" },
    { name: "Robotique" },
    { name: "Climat" },
    { name: "Maintenance" },
  ]).returning();

  const getK = (name: string) => {
  const k = keywordsInseres.find((k) => k.name === name);
  if (!k) throw new Error(`Mot-clé introuvable : ${name}`);
  return k.id;
};
const getM = (slug: string) => {
  const m = memoiresInseres.find((m) => m.slug === slug);
  if (!m) throw new Error(`Mémoire introuvable : ${slug}`);
  return m.id;
};

  console.log("Liaison mémoire ↔ mots-clés…");
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