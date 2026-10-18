# MemoRise

Plateforme web de découverte et d'exploration des mémoires de fin d'études de l'École Supérieure Polytechnique d'Antananarivo (ESPA).

## À propos

MemoRise centralise les métadonnées des mémoires de fin d'études réalisés à l'ESPA et permet aux étudiants, anciens étudiants et enseignants de les rechercher, filtrer et consulter depuis une interface web moderne.

La plateforme ne stocke pas les fichiers PDF des mémoires. Elle constitue une couche de découverte complémentaire aux dispositifs documentaires existants, notamment la Bibliothèque et Archives Universitaires (BAU).

## Fonctionnalités

- Catalogue public consultable sans connexion
- Recherche par titre, auteur, mots-clés
- Filtres par filière, domaine, niveau et année
- Pagination automatique du catalogue
- Consultation détaillée d'une notice (résumé, encadreur, contacts de l'auteur)
- Publication volontaire de métadonnées par les membres connectés (limite : 3 par compte)
- Enregistrement de mémoires dans une liste de favoris personnelle
- Gestion du profil : filière, parcours, statut, contacts
- Authentification par email/mot de passe et Google
- Interface responsive (mobile, tablette, ordinateur)
- Thème clair et sombre

## Stack technique

- **Framework** : Next.js 16 (App Router) + React 19 + TypeScript
- **Styles** : Tailwind CSS v4
- **API** : tRPC
- **Base de données** : PostgreSQL (Neon)
- **ORM** : Drizzle
- **Authentification** : Better Auth
- **Validation** : Zod
- **Déploiement** : Vercel (prévu)

## Installation

```bash
git clone https://github.com/geneto3robson-rgb/memorise.git
cd memorise
npm install
npm run dev

## Architecture du projet

app/                Routes Next.js (App Router)
├─ (app)/            Pages connectées (tableau de bord, publier, favoris…)
│  ├─ tableau-de-bord/   
│  ├─ publier/
│  ├─ favoris/
│  ├─ publication/
│  └─ parametres/
├─ (admin)/          Espace administrateur (en cours)
├─ api/              Routes API (tRPC + authentification)
├─ connexion/        Page d'authentification
├─ explorer/         Catalogue public avec layout adaptatif
├─ memoires/         Détail d'un mémoire (route [slug])
└─ page.tsx          Landing page publique

components/          Composants React réutilisables
├─ landing/          Sections de la landing
├─ layout/           Navbar, sidebar, footer, modals
├─ memoire/          Détail et modal de mémoire
└─ ui/               Composants d'interface de base

db/                  Schéma et accès base de données
├─ schema.ts         Tables métier (filières, mémoires, profils…)
├─ auth-schema.ts    Tables Better Auth (user, session, account…)
├─ index.ts          Connexion Drizzle
└─ seed.ts           Données initiales

lib/                 Utilitaires
├─ auth.ts           Configuration Better Auth
├─ auth-client.ts    Client d'authentification
├─ theme-context.tsx Gestion du thème clair/sombre
└─ data/             Référentiels statiques (filières, domaines…)

trpc/                Configuration tRPC
├─ init.ts           Initialisation + procédures (public, protégé)
├─ client.tsx        Client React
└─ routers/          Routeurs (memoire, favori…)
```bash
git clone https://github.com/geneto3robson-rgb/memorise.git
cd memorise

Périmètre

Version actuelle : catalogue limité à l'ESPA.
L'extension à d'autres établissements et l'ajout d'une recherche sémantique assistée par intelligence artificielle constituent des perspectives futures.

Auteur

RAVELOTIARAY Jacsilin Geneto Robson
Licence Télécommunication — Parcours STI
ESPA Antananarivo, 2026
npm install
npm run dev
