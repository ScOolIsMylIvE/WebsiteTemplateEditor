# Plan détaillé pour déployer et enrichir le Générateur de Pages Web

Ce plan est conçu pour un débutant et inclut les **étapes d’installation** des API et outils nécessaires.

---
## 1. Préparation de l’environnement local

1. **Installer Node.js** (version LTS recommandée) : téléchargement via https://nodejs.org
2. **Installer Git** : https://git-scm.com/downloads
3. **Créer un dossier de projet** et initialiser un dépôt Git :
   ```bash
   mkdir generator-site
   cd generator-site
   git init
   ```

---
## 2. Initialisation du projet Next.js & UI

1. **Créer une nouvelle app Next.js** :
   ```bash
   npx create-next-app@latest .
   ```
2. **Installer les dépendances UI et utilitaires** :
   ```bash
   npm install tailwindcss shadcn-ui lucide-react jsPDF firebase @huggingface/inference openai
   npx tailwindcss init -p
   ```
3. **Configurer Tailwind CSS** : ajoutez dans `tailwind.config.js` et importez `@/styles/globals.css`.
4. **Installer shadcn/ui** selon la doc officielle.

---
## 3. Configuration des clés et variables d’environnement

1. Créez un fichier `.env.local` à la racine :
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=VOTRE_CLE
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-projet
   NEXT_PUBLIC_HUGGING_FACE_API_KEY=VOTRE_CLE_HF
   OPENAI_API_KEY=VOTRE_CLE_OPENAI
   ```
2. **Protéger** ce fichier dans `.gitignore` pour ne pas partager vos clés.

---
## 4. Intégration Firebase (Firestore + Auth)

1. **Installer Firebase** déjà fait en section 2.
2. **Initialiser** dans `lib/firebase.js` :
   ```js
   import { initializeApp } from 'firebase/app';
   import { getFirestore } from 'firebase/firestore';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
   };
   const app = initializeApp(firebaseConfig);
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   ```
3. **Activer Firestore** et **Email/Password Auth** dans la console Firebase.
4. **Règles de sécurité Firestore** (`Firestore > Rules`) :
   ```js
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /projects/{uid}/{id} {
         allow read, write: if request.auth.uid == uid;
       }
     }
   }
   ```

---
## 5. Ajout de l’authentification (pages Login/Signup)

1. **Pages** `/login.js` et `/signup.js` avec formulaires (shadcn/ui).
2. **Hooks** : `useAuthState(auth)` pour obtenir l’utilisateur connecté.
3. **Protection des routes** : middleware Next.js ou composant wrapper.

---
## 6. Intégration des SDKs IA

1. **Hugging Face** :
   ```bash
   npm install @huggingface/inference
   ```
   Utilisation dans `lib/ai.js` :
   ```js
   import { HfInference } from '@huggingface/inference';
   export const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY);
   ```
2. **OpenAI** :
   ```bash
   npm install openai
   ```
   Dans `lib/ai.js` :
   ```js
   import OpenAI from 'openai';
   export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   ```
3. **Fonctions utilitaires** dans `lib/ai.js` pour `suggestWithOpenAI` et `suggestWithHF`.

---
## 7. Développement de l’interface

1. **Pages** :
   - `pages/index.jsx` (éditeur)
   - `pages/dashboard.jsx` (liste projets)
   - `pages/login.jsx` / `pages/signup.jsx`
2. **Composants** :
   - `ProjectControls`, `NicheSelector`, `DetailsForm`, `SectionEditor`, `ActionsBar`, `Preview`
3. **UX** : toasts, spinners, dark mode switch.
4. **Appel IA** : bouton « Suggérer » avec mise à jour d’état par `handleContentChange`.

---
## 8. Export et sauvegarde

1. **Export HTML** : génération de string + Blob.
2. **Export PDF** : `jsPDF`.
3. **Sauvegarde** : `setDoc(doc(db,'projects', uid, projectName), data)`.
4. **Chargement** : `onSnapshot` sur `projects/{uid}`.

---
## 9. Tests & CI/CD

1. **Jest + React Testing Library** pour unités et intégration.
2. **GitHub Actions** (`.github/workflows/ci.yml`) pour lancer tests.
3. **Vercel** : déploiement automatique sur push main, variables d’env en Dashboard Vercel.

---
## 10. Surveillance et évolutions

1. **Sentry** pour erreurs.
2. **Firebase Analytics** pour usage.
3. **Fonctionnalités futures** : versioning, collaboration, export DOCX.

---
### Questions de validation
1. Préfères-tu une **structure de dossier** spécifique (monorepo, src/) ?  
2. As-tu besoin d’un guide pour l’**énvironnement de dev** (Docker, ESLint, Prettier) ?  
3. Veux-tu un workflow GitHub (**branches**, PR template, etc.) ?  
4. Quel **niveau de tests** souhaites-tu (unitaires, E2E) ?  

Réponds pour que j’ajuste le plan et les exemples de code !
