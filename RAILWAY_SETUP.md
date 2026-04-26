# 🚀 Configuration Railway pour HME

## Aperçu

Votre projet e-commerce HME est maintenant connecté à une base de données PostgreSQL sur Railway avec les fonctionnalités suivantes :

### Tables de la Base de Données
- **users** - Gestion des utilisateurs et authentification
- **products** - Catalogue de produits
- **orders** - Historique des commandes
- **order_items** - Détails des articles dans chaque commande
- **cart** - Panier d'achat des utilisateurs
- **categories** - Catégories de produits

## Installation et Configuration

### 1. Variable d'Environnement
Assurez-vous que `DATABASE_URL` est configurée dans votre projet Vercel avec la connexion PostgreSQL de Railway :
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### 2. Initialiser la Base de Données
Pour créer toutes les tables et les index, exécutez :
```bash
npm run db:init
```

Cette commande :
- Crée toutes les tables nécessaires
- Ajoute les index de performance
- Configure les contraintes et relations

## Utilisation des Fonctions

### Produits
```typescript
import { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct 
} from '@/lib/db-actions';

// Récupérer tous les produits
const products = await getAllProducts();

// Récupérer un produit par ID
const product = await getProductById(1);

// Récupérer par catégorie
const electronics = await getProductsByCategory('Electronics');
```

### Commandes
```typescript
import { 
  getUserOrders, 
  getOrderById,
  createOrder,
  updateOrderStatus 
} from '@/lib/db-actions';

// Récupérer les commandes d'un utilisateur
const orders = await getUserOrders(1);

// Créer une commande
const order = await createOrder(
  1, // userId
  150.00, // totalAmount
  '123 Rue de Paris, 75000 Paris',
  'Notes optionnelles'
);

// Mettre à jour le statut
await updateOrderStatus(1, 'shipped');
```

### Utilisateurs
```typescript
import { 
  getUserById, 
  getUserByEmail,
  createUser,
  updateUser 
} from '@/lib/db-actions';

// Récupérer un utilisateur
const user = await getUserById(1);
const userByEmail = await getUserByEmail('email@example.com');

// Créer un utilisateur
const newUser = await createUser(
  'john@example.com',
  'hashedPassword', // Utilisez bcrypt en production
  'John Doe',
  '+33612345678',
  '123 Rue de Paris',
  'Paris',
  '75000',
  'France'
);
```

## Routes API Disponibles

### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products?category=Electronics` - Produits par catégorie
- `GET /api/products/[id]` - Produit spécifique

### Commandes
- `GET /api/orders/user/[userId]` - Commandes d'un utilisateur

## Structure des Fichiers Créés

```
/lib
  ├── db.ts           - Utilities de connexion PostgreSQL
  └── db-actions.ts   - Fonctions métier (Server Actions)

/app/api
  ├── products/
  │   ├── route.ts    - GET tous les produits
  │   └── [id]/
  │       └── route.ts - GET produit spécifique
  └── orders/user/
      └── [userId]/
          └── route.ts - GET commandes utilisateur

/scripts
  └── init-db.js      - Script d'initialisation DB
```

## Sécurité

⚠️ **En Production** :
1. Utilisez bcrypt pour hasher les mots de passe
2. Implémentez la validation des entrées
3. Configurez les règles Row Level Security (RLS)
4. Utilisez les variables d'environnement pour les secrets
5. Limitez les requêtes SQL avec paramètres

## Troubleshooting

### Erreur: "DATABASE_URL not found"
- Vérifiez que `DATABASE_URL` est configurée dans les variables d'environnement

### Erreur: "Connection refused"
- Vérifiez que Railway PostgreSQL est en ligne
- Vérifiez la validité de la connexion
- Testez la connectivité réseau

### Erreur: "Relation does not exist"
- Exécutez `npm run db:init` pour créer les tables
- Vérifiez que vous utilisez la bonne base de données

## Prochaines Étapes

1. ✅ Implémenter l'authentification sécurisée
2. ✅ Ajouter la validation des données
3. ✅ Créer les composants frontend
4. ✅ Implémenter le système de paiement
5. ✅ Configurer les notifications par email

---

**Documentation Railway** : https://docs.railway.app/
**PostgreSQL Documentation** : https://www.postgresql.org/docs/
