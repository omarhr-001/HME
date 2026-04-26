# Guide de Configuration Supabase

## Étapes pour initialiser votre base de données

### 1. Accédez au Dashboard Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet e-commerce
4. Allez dans l'onglet **SQL Editor** ou **SQL Execution**

### 2. Exécutez le script d'initialisation

Copiez et exécutez le contenu du fichier `scripts/01-init-schema.sql` :

1. Ouvrez le fichier `scripts/01-init-schema.sql`
2. Copiez tout le contenu
3. Collez-le dans le SQL Editor de Supabase
4. Cliquez sur **Run** ou appuyez sur Cmd/Ctrl + Enter

Ce script créera les tables suivantes :
- **users** - Utilisateurs de l'application
- **products** - Catalogue de produits
- **cart** - Panier d'achat
- **orders** - Commandes
- **order_items** - Articles des commandes
- **reviews** - Avis des clients
- **categories** - Catégories de produits

### 3. Insérez des données de test (optionnel)

Copiez et exécutez le contenu de `scripts/02-seed-data.sql` pour ajouter des données de test :

1. Ouvrez le fichier `scripts/02-seed-data.sql`
2. Copiez tout le contenu
3. Collez-le dans le SQL Editor de Supabase
4. Cliquez sur **Run**

### 4. Vérifiez vos variables d'environnement

Assurez-vous que votre fichier `.env.local` ou les variables Vercel contiennent :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Vous pouvez trouver ces valeurs dans :
- Settings → API → Project URL
- Settings → API → Project API keys → anon/public

### 5. Démarrez votre application

```bash
npm run dev
```

Visitez `http://localhost:3000` pour voir votre application.

## API Routes disponibles

- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/[id]` - Récupérer un produit spécifique
- `GET /api/orders/user/[userId]` - Récupérer les commandes d'un utilisateur

## Structure de la base de données

### Table: users
```sql
- id: UUID (clé primaire)
- email: text (unique)
- name: text
- password: text (hash bcrypt)
- created_at: timestamp
```

### Table: products
```sql
- id: serial (clé primaire)
- name: text
- description: text
- price: decimal
- stock: integer
- category_id: integer
- image_url: text
- created_at: timestamp
```

### Table: orders
```sql
- id: serial (clé primaire)
- user_id: UUID (clé étrangère)
- total_amount: decimal
- status: text
- created_at: timestamp
```

### Table: order_items
```sql
- id: serial (clé primaire)
- order_id: integer (clé étrangère)
- product_id: integer (clé étrangère)
- quantity: integer
- price: decimal
```

## Dépannage

**Erreur: "relation does not exist"**
- Assurez-vous d'avoir exécuté le script `01-init-schema.sql`

**Erreur: "permission denied"**
- Vérifiez vos variables d'environnement Supabase
- Assurez-vous d'utiliser la clé publique (anon key) et non la clé secrète

**Les données ne s'affichent pas**
- Vérifiez que vous avez exécuté le script `02-seed-data.sql`
- Consultez les logs de Supabase pour voir s'il y a des erreurs
