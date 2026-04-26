# Guide d'Initialisation Railway PostgreSQL

## Étape 1: Obtenir votre chaîne de connexion Railway

1. Allez sur [https://railway.app](https://railway.app)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet PostgreSQL
4. Cliquez sur l'onglet "Connect"
5. Copiez la chaîne de connexion PostgreSQL (DATABASE_URL)

## Étape 2: Initialiser votre base de données

### Option A: Utiliser pgAdmin (Interface Web)

1. Dans Railway, cliquez sur votre base de données PostgreSQL
2. Cliquez sur "Open pgAdmin" ou accédez à l'interface de gestion
3. Ouvrez la section "SQL Editor" ou "Query Tool"
4. Copiez-collez le contenu du fichier `scripts/schema.sql`
5. Exécutez le script SQL

### Option B: Utiliser psql (Ligne de commande)

```bash
# Copier la DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:port/database"

# Exécuter le schéma SQL
psql "$DATABASE_URL" < scripts/schema.sql
```

### Option C: Utiliser Railway CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Sélectionner le projet
railway link

# Exécuter le schéma
railway run psql < scripts/schema.sql
```

## Étape 3: Vérifier l'initialisation

Connectez-vous à votre base de données et vérifiez que toutes les tables ont été créées:

```sql
\dt
```

Vous devriez voir:
- users
- products
- orders
- order_items
- categories
- cart_items
- wishlist_items
- reviews
- payments
- promotions
- inventory_logs

## Étape 4: Configurer votre projet Next.js

### 1. Ajouter la variable d'environnement

Dans votre projet Vercel:
1. Allez dans Settings → Vars
2. Ajoutez `DATABASE_URL` avec la valeur de votre Railway
3. Assurez-vous que c'est disponible pour Development et Production

### 2. Vérifier la configuration

```bash
# Testez la connexion
npm run db:init  # Ceci devrait maintenant fonctionner
```

## Étape 5: Utiliser la base de données dans votre app

### Récupérer les produits

```typescript
// app/page.tsx
import { getProducts } from '@/lib/db-actions'

export default async function HomePage() {
  const products = await getProducts()
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Créer une commande

```typescript
// app/api/orders/route.ts
import { createOrder } from '@/lib/db-actions'

export async function POST(req: Request) {
  const data = await req.json()
  const order = await createOrder(data)
  return Response.json(order)
}
```

## API Routes disponibles

### GET /api/products
Récupère tous les produits

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Sample Product",
    "price": 99.99,
    "stock_quantity": 100
  }
]
```

### GET /api/products/[id]
Récupère un produit spécifique

**Réponse:**
```json
{
  "id": 1,
  "name": "Sample Product",
  "description": "...",
  "price": 99.99,
  "stock_quantity": 100
}
```

### GET /api/orders/user/[userId]
Récupère les commandes d'un utilisateur

**Réponse:**
```json
[
  {
    "id": 1,
    "order_number": "ORD-001",
    "total_amount": 299.99,
    "status": "completed"
  }
]
```

## Dépannage

### Erreur: "connect ECONNREFUSED"
- Vérifiez que `DATABASE_URL` est bien défini
- Vérifiez que votre base de données Railway est active
- Attendez quelques secondes que Railway démarre le service

### Erreur: "permission denied"
- Vérifiez vos identifiants Railway
- Assurez-vous que l'utilisateur PostgreSQL a les bonnes permissions

### Les tables n'existent pas
- Exécutez le script `scripts/schema.sql` directement dans Railway
- Vérifiez que le script s'est exécuté sans erreurs

## Prochaines étapes

1. ✅ Base de données créée
2. ✅ Schéma initialisé
3. 📝 Ajouter l'authentification utilisateur
4. 📝 Créer les pages produits
5. 📝 Implémenter le panier
6. 📝 Ajouter le système de paiement

## Ressources

- [Documentation Railway](https://docs.railway.app)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Next.js Database Guide](https://nextjs.org/docs/app/building-your-application/using-databases)
