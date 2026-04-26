# 🚀 HME E-Commerce - Intégration Railway PostgreSQL

Votre projet HME est maintenant configuré avec une base de données PostgreSQL sur Railway !

## 📋 Résumé de ce qui a été créé

### 1. **Base de Données PostgreSQL**
- 11 tables principales (Users, Products, Orders, etc.)
- Indexes pour optimiser les requêtes
- Données d'exemple pré-chargées

### 2. **Fichiers Créés**

```
/vercel/share/v0-project/
├── scripts/
│   ├── init-db.js          # Script d'initialisation (pour dev local)
│   └── schema.sql          # Schéma SQL à exécuter sur Railway
│
├── lib/
│   ├── db.ts               # Connexion à la base de données
│   ├── db-actions.ts       # Fonctions CRUD pour tous les modèles
│   └── types.ts            # Types TypeScript pour typage strict
│
├── app/api/
│   ├── products/route.ts           # GET /api/products
│   ├── products/[id]/route.ts      # GET /api/products/:id
│   └── orders/user/[userId]/route.ts  # GET /api/orders/user/:userId
│
├── app/products/page.tsx   # Page produits (mise à jour)
├── RAILWAY_SETUP.md        # Guide de configuration
└── RAILWAY_INIT_GUIDE.md   # Guide complet d'initialisation
```

## 🔧 Configuration Rapide

### Étape 1: Initialiser la base de données sur Railway

1. Allez sur [https://railway.app](https://railway.app)
2. Ouvrez votre base de données PostgreSQL
3. Accédez à l'interface de gestion (pgAdmin ou Query Tool)
4. Copiez-collez le contenu du fichier `/scripts/schema.sql`
5. Exécutez le script SQL

### Étape 2: Vérifier la connexion

La variable `DATABASE_URL` est déjà configurée dans votre projet Vercel. Vous pouvez la vérifier dans:
- Settings → Vars

## 📡 API Routes Disponibles

### 1. Récupérer tous les produits
```bash
GET /api/products
```

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Sample Product 1",
    "description": "This is a sample product",
    "price": 99.99,
    "stock_quantity": 100,
    "category": "Electronics"
  }
]
```

### 2. Récupérer un produit spécifique
```bash
GET /api/products/1
```

### 3. Récupérer les commandes d'un utilisateur
```bash
GET /api/orders/user/1
```

## 📦 Utilisation dans les Composants

### Exemple: Afficher les produits
```tsx
'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'

export default function ProductsComponent() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

## 🗄️ Structure de la Base de Données

### Tables principales

- **users**: Authentification et profils utilisateurs
- **products**: Catalogue de produits
- **orders**: Commandes client
- **order_items**: Détails des articles dans les commandes
- **categories**: Catégories de produits
- **cart_items**: Articles dans le panier
- **wishlist_items**: Articles favoris
- **reviews**: Avis et évaluations
- **payments**: Historique des paiements
- **promotions**: Codes et réductions
- **inventory_logs**: Historique des modifications d'inventaire

## 🔄 Fonctions Disponibles dans `lib/db-actions.ts`

- `getProducts()` - Récupère tous les produits
- `getProductById(id)` - Récupère un produit spécifique
- `getUserOrders(userId)` - Récupère les commandes d'un utilisateur
- `createOrder(data)` - Crée une nouvelle commande
- `addToCart(userId, productId, quantity)` - Ajoute un article au panier
- Et bien d'autres...

## 🚀 Déploiement sur Vercel

1. Assurez-vous que `DATABASE_URL` est défini dans les variables d'environnement Vercel
2. Déployez votre application
3. Vercel créera automatiquement les instances de production

## 🐛 Dépannage

### Erreur: "connect ECONNREFUSED"
- Vérifiez que `DATABASE_URL` est bien défini
- Vérifiez que votre base de données Railway est active

### Erreur: "table does not exist"
- Exécutez le fichier `scripts/schema.sql` sur Railway
- Attendez quelques secondes que la base de données se synchronise

### Les produits ne s'affichent pas
- Vérifiez que vous avez exécuté le script SQL
- Vérifiez que les produits ont bien été insérés dans la base de données

## 📚 Documentation Complète

Pour des instructions plus détaillées, consultez:
- `RAILWAY_INIT_GUIDE.md` - Guide complet d'initialisation
- `RAILWAY_SETUP.md` - Documentation de configuration

## 🎯 Prochaines Étapes

1. ✅ Base de données PostgreSQL configurée
2. ✅ API routes créées
3. 📝 Page produits intégrée
4. 🔒 Ajouter l'authentification utilisateur
5. 🛒 Implémenter le système de panier
6. 💳 Ajouter le paiement Stripe
7. 📧 Ajouter les notifications par email

## 📞 Support

Pour toute question sur Railway:
- [Documentation Railway](https://docs.railway.app)
- [Discord Railway](https://discord.gg/railway)

Pour Next.js:
- [Documentation Next.js](https://nextjs.org/docs)
