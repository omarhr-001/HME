# 📝 Guide Complet : Vérifier les Variables d'Environnement Supabase

## 🎯 Résumé rapide

Vous avez besoin de 2 variables **REQUISES** :
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Et 1 variable **OPTIONNELLE** (mais recommandée) :
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## 📍 Étape 1 : Récupérer vos clés dans Supabase

### Où trouver `NEXT_PUBLIC_SUPABASE_URL` :

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Sélectionnez votre **projet HME**
3. Cliquez sur **⚙️ Settings** (en bas à gauche)
4. Allez dans l'onglet **API**
5. Recherchez **Project URL**
6. Copiez l'URL (ex: `https://xxxxxxxxxxxx.supabase.co`)

### Où trouver `NEXT_PUBLIC_SUPABASE_ANON_KEY` :

1. Même écran Settings → API
2. Cherchez **Project API keys**
3. Vous verrez 2 clés :
   - `anon public` ← **C'est celle-ci !**
   - `service_role` (secret)
4. Copiez la clé **anon public**

### Où trouver `SUPABASE_SERVICE_ROLE_KEY` (optionnel) :

1. Même écran Settings → API
2. Cherchez **Project API keys**
3. Copiez la clé **service_role** (la 2e clé)

---

## 🔧 Étape 2 : Ajouter les variables à Vercel

### Pour un projet GitHub connecté :

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre **projet HME**
3. Cliquez sur **Settings** (⚙️) en haut
4. Sélectionnez **Environment Variables** (ou **Vars**)
5. Cliquez sur **Add New**
6. Remplissez les champs :

**Variable 1 :**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co
Environment: Production, Preview, Development
```

**Variable 2 :**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGc... (votre clé anon)
Environment: Production, Preview, Development
```

**Variable 3 (optionnel) :**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGc... (votre clé service_role)
Environment: Production, Preview, Development
```

7. Cliquez sur **Save**

### Pour le développement local (.env.local) :

1. Créez un fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (optionnel)
```

2. **Ne commitez PAS ce fichier** (il est dans `.gitignore`)

---

## ✅ Étape 3 : Vérifier que tout fonctionne

### Option 1 : Utiliser le script de vérification

```bash
node scripts/check-env.js
```

Vous devriez voir :
```
✅ NEXT_PUBLIC_SUPABASE_URL : https://xxxxx...
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY : eyJhbGc...
✅ Toutes les variables requises sont définies!
```

### Option 2 : Démarrer l'app

```bash
npm run dev
```

Ouvrez http://localhost:3000 et vérifiez qu'il n'y a pas d'erreurs dans la console.

### Option 3 : Vérifier dans le navigateur

1. Ouvrez votre app
2. Ouvrez la **Console du navigateur** (F12)
3. Tapez dans la console :

```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

Vous devriez voir votre URL Supabase.

---

## 🚨 Dépannage

### "Variables d'environnement non trouvées"

✅ **Solution :**
1. Vérifiez que les variables sont bien ajoutées dans Vercel Settings → Vars
2. Redémarrez votre serveur de développement (`npm run dev`)
3. Pour le .env.local, assurez-vous que le fichier est à la racine du projet

### "SUPABASE_URL is undefined"

✅ **Solution :**
1. Vérifiez le nom de la variable : doit être `NEXT_PUBLIC_SUPABASE_URL` (avec le préfixe `NEXT_PUBLIC_`)
2. Vérifiez que vous avez copié la bonne URL de Supabase
3. Redémarrez le serveur

### "Anon key is invalid"

✅ **Solution :**
1. Allez dans Supabase Settings → API
2. Copiez la clé **anon public** (pas la service_role)
3. Remplacez la valeur dans Vercel/env.local

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

---

## ✨ Vous êtes prêt !

Une fois toutes les variables configurées, vous pouvez :
- Utiliser `lib/supabase.ts` pour créer des clients Supabase
- Interroger la BD via `lib/db-actions.ts`
- Appeler les routes API `/api/products`, `/api/orders`, etc.
