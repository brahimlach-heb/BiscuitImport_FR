# 🍪 **BiscuitImport - Système de Gestion d'Inventaire**

Application web de gestion complète pour l'importation et la distribution de biscuits. Système d'inventaire, gestion des fournisseurs, commandes d'achat et bien plus.

---

## 📋 **Table des Matières**

1. [Fonctionnalités](#fonctionnalités)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Modules Implémentés](#modules-implémentés)
5. [Commandes d'Achat](#commandes-dachat-po)
6. [Usage](#usage)
7. [Structure du Projet](#structure-du-projet)

---

## ✨ **Fonctionnalités**

### **Gestion Complète**
- ✅ **Catalogue Produits** - Gestion des biscuits, catégories, saveurs
- ✅ **Stock Management** - Suivi inventaire, alertes faible stock, mouvements
- ✅ **Entrepôts** - Multi-localisation, capacité, transferts
- ✅ **Fournisseurs** - Gestion des partenaires, produits, performance
- ✅ **Commandes d'Achat** - Création, suivi, réception avec articles
- ✅ **Commandes Clients** - Ventes, historique, devis/factures
- ✅ **Utilisateurs** - Gestion rôles, permissions, comptes
- ✅ **Rapports** - Analytiques, statistiques, exports

### **Interface**
- 🎨 Design moderne avec Framer Motion animations
- 📱 Responsive (desktop, tablet, mobile)
- 🎯 Intuitive et user-friendly
- 🌙 Support thème clair/sombre

---

## 🏗️ **Architecture**

### **Stack Technologique**
- **Frontend**: React 18 + Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios API service layer
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion
- **Styling**: CSS modules + responsive design

### **Pattern Architecture**
```
src/
├── components/          # React components
│   └── AdminDashboard.jsx (6800+ lines - hub principal)
├── services/            # API service layer
│   ├── productService.js
│   ├── stockService.js
│   ├── warehouseService.js
│   ├── supplierService.js
│   └── purchaseOrderService.js
├── store/              # Redux state management
│   ├── store.js        # configureStore
│   └── slices/         # Redux slices
│       ├── stockSlice.js
│       ├── warehouseSlice.js
│       ├── supplierSlice.js
│       └── purchaseOrderSlice.js
└── assets/             # Images, icons
```

---

## 🚀 **Installation**

### **Prérequis**
- Node.js 16+
- npm ou yarn
- Backend API en cours d'exécution (http://localhost:3000)

### **Setup**

```bash
# Clone et installation
git clone <repo>
cd BiscuitImport_FR
npm install

# Variables d'environnement
# .env.local ou hardcodé dans services:
VITE_API_BASE_URL=http://localhost:3000

# Développement
npm run dev

# Build Production
npm run build

# Preview
npm run preview
```

---

## 📦 **Modules Implémentés**

### **1. Stock Management**
**Fichiers**: `stockService.js`, `stockSlice.js`, `AdminDashboard_stock.css`

**Endpoints** (8):
- `getAllStocks()` - Récupérer tous les stocks
- `getStockByProduct()` - Stock par produit
- `adjustStock()` - Ajuster quantité
- `getStockMovements()` - Historique mouvements
- `getLowStockAlerts()` - Produits rupture
- `getStockReport()` - Rapport détaillé
- `transferStock()` - Transfert entre emplacements
- `importStockData()` - Import batch

**UI Features**:
- 📊 Summary cards (total, rupture, faible)
- 📝 Tableau des stocks avec filtrage
- 🔔 Alertes rupture de stock
- ⏱️ Historique mouvements avec timeline
- 🎛️ Ajustement manuel quantités
- 💾 Import/export données

---

### **2. Warehouse Management**
**Fichiers**: `warehouseService.js`, `warehouseSlice.js`, `AdminDashboard_warehouse_supplier.css`

**Endpoints** (9):
- `getAllWarehouses()` - Lister tous les entrepôts
- `getWarehouseById()` - Détails entrepôt
- `createWarehouse()` - Créer nouvel entrepôt
- `updateWarehouse()` - Modifier entrepôt
- `deleteWarehouse()` - Supprimer entrepôt
- `getWarehouseStock()` - Stock par entrepôt
- `transferBetweenWarehouses()` - Transfert inter-entrepôt
- `getWarehouseTransfers()` - Historique transferts
- `getWarehouseCapacity()` - Utilisation capacité

**UI Features**:
- 🏢 Summary cards (total, actifs, capacité)
- 📋 Tableau multi-colonnes (nom, lieu, ville, capacité)
- 🔄 Statut actif/inactif
- ✏️ Edit/Delete modals (framework prêt)
- 🔍 Filtrage recherche nom/localisation

---

### **3. Supplier Management**
**Fichiers**: `supplierService.js`, `supplierSlice.js`, `AdminDashboard_warehouse_supplier.css`

**Endpoints** (11):
- `getAllSuppliers()` - Lister fournisseurs
- `getSupplierById()` - Détails fournisseur
- `createSupplier()` - Créer fournisseur
- `updateSupplier()` - Modifier fournisseur
- `deleteSupplier()` - Supprimer fournisseur
- `getSupplierProducts()` - Catalogue produits
- `addSupplierProduct()` - Ajouter produit au catalogue
- `updateSupplierProduct()` - Modifier prix/stock
- `removeSupplierProduct()` - Retirer du catalogue
- `getSupplierPerformance()` - Métriques performance
- `getSupplierHistory()` - Historique commandes

**UI Features**:
- 👥 Summary cards (total, actifs, taux activité %)
- 📊 Tableau fournisseurs (nom, contact, email, téléphone, ville)
- 🎯 Taux d'activité calculé
- 🏭 Icon avec initial fournisseur
- 🔍 Filtrage multi-critères
- ✏️ Edit/Delete modals (prêts)

---

## 🛒 **Commandes d'Achat (PO)**

### **Module Complet: Purchase Order System**

**Fichiers Source**:
- `purchaseOrderService.js` (12 endpoints)
- `purchaseOrderSlice.js` (Redux state management)
- `AdminDashboard_po.css` (550+ lignes styling)
- `AdminDashboard.jsx` (600+ lignes integration)

---

### **API Endpoints** (12)

```javascript
// CRUD de base
getAllPurchaseOrders()           // Récupérer toutes les PO
getPurchaseOrderById(id)         // Détails d'une PO
createPurchaseOrder(data)        // Créer nouvelle PO
updatePurchaseOrder(id, data)    // Modifier PO
deletePurchaseOrder(id)          // Supprimer PO

// Gestion articles
addPurchaseOrderLine(orderId, line)      // Ajouter article
removePurchaseOrderLine(orderId, lineId) // Supprimer article

// Workflow
updatePurchaseOrderStatus(id, status)    // Changer statut
receivePurchaseOrder(id, items)          // Réceptionner + MAJ stock

// Filtres & Rapports
getPurchaseOrdersBySupplier(id)          // PO par fournisseur
getPurchaseOrdersByStatus(status)        // Filtrer par statut
getPurchaseOrderHistory(id)              // Audit trail

// Export
generatePurchaseOrderPDF(id)             // PDF rapportable
```

---

### **Statuts Workflow**

| Statut | Couleur | Description | Actions |
|--------|---------|-------------|---------|
| **draft** 🟠 | Orange | Brouillon en édition | Envoyer → sent |
| **sent** 🔵 | Bleu | Envoyée au fournisseur | Réceptionner → received |
| **received** 🟢 | Vert | Reçue et validée | - (terminal) |
| **cancelled** 🔴 | Rouge | Annulée | - (terminal) |

---

### **Redux State**

```javascript
{
  purchaseOrders: [],           // Toutes les PO
  currentPurchaseOrder: null,   // PO actuellement visualisée
  purchaseOrderLines: [],       // Articles de la PO
  purchaseOrderHistory: [],     // Historique des changements
  loading: false,               // État chargement
  error: null,                  // Messages d'erreur
  successMessage: null          // Messages de succès
}
```

---

### **UI Modals Complets**

#### **1️⃣ Créer Commande d'Achat**
```
┌─ Nouvelle Commande d'Achat ────────────────┐
│ Fournisseur:        [Dropdown]            │
│ Entrepôt Destination: [Dropdown]          │
│ Notes:              [Textarea]            │
│                                            │
│ ──── Articles de la Commande ────          │
│ ┌─ Biscuit Chocolat 50×DH12.50 = DH625     │
│ │ Biscuit Vanille  30×DH10.00 = DH300      │
│ └─────────────────────────────────────────│
│ Montant Total: DH925.00                    │
│                                            │
│     [Annuler] [Créer]                    │
└────────────────────────────────────────────┘
```

**Features**:
- ✅ Sélection fournisseur
- ✅ Choix entrepôt destination
- ✅ Ajout articles multiples
- ✅ Calcul automatique montants
- ✅ Suppression articles

#### **2️⃣ Ajouter Article**
```
┌─ Ajouter un Article ─────────────┐
│ Produit:  [Dropdown produits]   │
│ Quantité: [0]                   │
│ Prix Unit: [DH0.00]              │
│ Montant: DH0.00 (auto-calc)      │
│                                  │
│   [Annuler] [Ajouter]          │
└──────────────────────────────────┘
```

**Smart Features**:
- ✅ Auto-remplissage prix produit
- ✅ Calcul temps réel montant
- ✅ Validation quantité > 0

#### **3️⃣ Voir Détails PO**
```
┌─ Détails Commande PO-1 ───────────────┐
│                                       │
│ Fournisseur: [Affichage/Edit]        │
│ Entrepôt:    [Affichage/Edit]        │
│ Statut:      [Dropdown édit]         │
│ Montant:     [Montant total]         │
│ Notes:       [Textarea]              │
│                                       │
│ ──── Articles (2) ────               │
│ │Produit│Quantité│P.U.│Total│      │
│ │Choco  │  50   │DH12.50│DH625│      │
│ │Vanille│  30   │DH10.00│DH300│      │
│                                       │
│ ──── Historique ────                │
│ • Créée 20/03/2026                  │
│ • Envoyée 21/03/2026                │
│                                       │
│  [Fermer] [Réceptionner]           │
└───────────────────────────────────────┘
```

**Features Complètes**:
- ✅ Affichage tous détails
- ✅ Edit statut directe
- ✅ Tableau articles formaté
- ✅ Timeline historique événements
- ✅ Bouton réception contextuel

#### **4️⃣ Réceptionner Commande**
```
┌─ Réceptionner Commande ─────────────┐
│ Confirmer réception PO-2?           │
│                                     │
│ ──── Articles à Réceptionner ────   │
│ │Fruits Rouges    Q: 100 R: [100]  │
│                                     │
│ Mettra à jour stock + statut       │
│                                     │
│   [Annuler] [Confirmer Réception]  │
└─────────────────────────────────────┘
```

**Sécurité**:
- ✅ Confirmation requise
- ✅ Saisie quantités reçues
- ✅ Validation avant traitement
- ✅ Mise à jour stock + statut

---

### **Summary Cards**

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total        │  │ Brouillon    │  │ Montant Total│  │ Reçues       │
│ [N] Commandes│  │ [N] À envoyer│  │ [DH] Budget   │  │ [N] Validées │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

### **Tableau Principal**

Colonnes:
- N° Commande (PO-[ID])
- Fournisseur (nom)
- Entrepôt (destination)
- Montant (DH formaté)
- Statut (badge couleur)
- Date création
- Actions (Détails, Envoyer, Réceptionner)

**Features**:
- 🔍 Recherche: N° PO, fournisseur, entrepôt
- 📊 Filtre statut: Tous/Brouillon/Envoyée/Reçue/Annulée
- 🎯 Actions contextuelles (statut-dépendantes)
- 📱 Responsive table

---

### **Mock Data**

4 commandes d'achat pour démo:
```javascript
// PO-1: draft - Prête à envoyer
// PO-2: sent - En attente réception
// PO-3: received - Complète
// PO-4: sent - En transit
```

---

### **CSS Styling** (AdminDashboard_po.css)

**Components**:
- ✅ Container + header + actions
- ✅ Summary cards avec hover effects
- ✅ Filters input + select
- ✅ Table responsive avec hover
- ✅ Status badges (4 couleurs)
- ✅ Modals avec animations
- ✅ Forms + articles sections
- ✅ Responsive breakpoints (768px, 480px)

**Responsive Design**:
```css
/* Desktop: 1024px+ */
Full width table + 4-column grid cards

/* Tablet: 768px */
2-column grid cards + responsive table

/* Mobile: 480px */
1-column stack + full-width inputs
```

---

### **Redux Integration**

**Thunks** (10):
```javascript
getAllPurchaseOrders()          // pending/fulfilled/rejected
getPurchaseOrderById()
createPurchaseOrder()           // Add to array
updatePurchaseOrder()           // Update in array
deletePurchaseOrder()           // Remove from array
updatePurchaseOrderStatus()     // Change status
receivePurchaseOrder()          // Update + stock trigger
getPurchaseOrdersBySupplier()
getPurchaseOrdersByStatus()
getPurchaseOrderHistory()
```

**Reducers** (custom):
```javascript
clearError()
clearSuccessMessage()
setCurrentPurchaseOrder()
resetCurrentPurchaseOrder()
```

---

### **State Local Management**

```javascript
// Search & Filter
poSearchQuery              // Recherche texte
poStatusFilter            // Filtre statut

// Forms
newPurchaseOrder          // Formulaire création
poItems[]                 // Articles ajoutés
newPoItem                 // Article en édition

// Modals
isCreatingPurchaseOrder   // Modal création
showPoItemModal           // Modal ajouter article
isReceivingPO             // Modal réception
poReceiveItems{}          // Quantités reçues
```

---

### **Localisations**

Toute l'interface en **Français (FR)**:
- Libellés: "Commande d'Achat", "Fournisseur", etc.
- Dates: Format français (JJ/MM/AAAA)
- Devises: EUR formaté (DH)
- Messages: Notifications en français

---

## 💻 **Usage**

### **Accéder au Module**

1. **Admin Dashboard** → Clic menu
2. **Onglet "Commandes Achat"** (ShoppingBag icon)
3. Note: ADMIN role requis

### **Workflows Courants**

#### **Créer une Commande**
```
1. Clic "Nouvelle Commande"
2. Sélectionner fournisseur + entrepôt
3. Clic "Ajouter Article"
4. Choisir produit + quantité + prix
5. Clic "Ajouter" (répéter pour articles multiples)
6. Clic "Créer" → Statut: draft
```

#### **Envoyer Commande**
```
1. Tableau: Clic bouton "Envoyer" (draft PO)
2. Statut change: draft → sent
3. Date updated
4. Fournisseur notification prête
```

#### **Réceptionner Commande**
```
1. Tableau: Clic "Réceptionner" (sent PO)
2. Modal: Confirmer quantités reçues
3. Clic "Confirmer Réception"
4. Stock auto-updated
5. Statut: sent → received
```

#### **Voir Détails**
```
1. Tableau: Clic "Détails"
2. Modal: Voir tous détails
3. Timer modal: Affiche historique
4. Edit statut directe si besoin
```

---

## 📁 **Structure du Projet**

```
BiscuitImport_FR/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AdminDashboard.jsx          # 6800+ lines (hub)
│   │   ├── AdminDashboard.css          # Styles principal
│   │   ├── AdminDashboard_additions.css
│   │   ├── AdminDashboard_stock.css
│   │   ├── AdminDashboard_warehouse_supplier.css
│   │   ├── AdminDashboard_po.css       # PO Styles ✨ NEW
│   │   ├── AdminDashboard_period_filter.css
│   │   ├── HomePage.jsx
│   │   ├── LoginForm.jsx
│   │   ├── InvoicePage.jsx
│   │   └── ... autres composants
│   ├── services/
│   │   ├── index.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── stockService.js             # Stock management ✨
│   │   ├── warehouseService.js         # Warehouse mgmt ✨
│   │   ├── supplierService.js          # Supplier mgmt ✨
│   │   ├── purchaseOrderService.js     # PO system ✨ NEW
│   │   └── ... autres services
│   ├── store/
│   │   ├── store.js
│   │   ├── hooks.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── productSlice.js
│   │       ├── stockSlice.js           # Stock state ✨
│   │       ├── warehouseSlice.js       # Warehouse state ✨
│   │       ├── supplierSlice.js        # Supplier state ✨
│   │       ├── purchaseOrderSlice.js   # PO state ✨ NEW
│   │       └── ... autres slices
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md                            # Documentation ✨ UPDATED
```

---

## 🔄 **Prochaines Étapes**

### **Priorité 4: Lot/Serial Traceability** (À venir)
- Lier aux PO reçues
- Tracking par lot/batch
- Numéros de série
- Dates expiration
- Historique mouvements par lot

### **Priorité 5: Physical Inventory** (À venir)
- Compte manuel des stocks
- Variance vs theoretical
- Reports réconciliation

---

## 📊 **Métrics & Monitoring**

- **Modules Implémentés**: 5/6 (83%)
- **Services API**: 50+ endpoints
- **Redux Slices**: 12
- **React Components**: 15+
- **CSS Files**: 7
- **Lines of Code**: 15,000+

---

## 🛠️ **Tech Stack**

| Layer | Technologies |
|-------|---|
| **Frontend** | React 18, Vite, ESLint |
| **State** | Redux Toolkit, Async Thunks |
| **HTTP** | Axios, REST API |
| **UI** | Lucide Icons, Framer Motion |
| **Styling** | CSS Modules, Responsive |
| **Build** | Vite (dev + production) |

---

## 📞 **Support**

Pour questions ou bugs sur le système de Commandes d'Achat:
- Vérifier mock data en AdminDashboard.jsx (ligne ~135)
- Consulter purchaseOrderService.js pour endpoints
- Vérifier purchaseOrderSlice.js pour state management
- Voir AdminDashboard_po.css pour styling

---

**Dernière mise à jour**: 25 Mars 2026 ✨
