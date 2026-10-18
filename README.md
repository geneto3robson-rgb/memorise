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
