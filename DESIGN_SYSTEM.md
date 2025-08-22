# Design System - Dashboard Opération Passeport

## Vue d'ensemble

Ce design system documente l'architecture visuelle et les composants d'un dashboard Next.js 15 utilisant React 19, Tailwind CSS 4, et Lucide React pour les icônes. Le système est conçu pour afficher des KPIs et analytics de manière claire et professionnelle.

## Architecture technique

### Stack technologique
- **Framework** : Next.js 15 avec App Router
- **UI** : React 19
- **Styling** : Tailwind CSS 4 avec configuration inline
- **Icons** : Lucide React (v0.539.0)
- **Typography** : Geist Sans & Geist Mono (Google Fonts)
- **Language** : TypeScript strict

### Configuration des couleurs

#### Variables CSS racine
```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

## Palette de couleurs

### Couleurs principales

#### Slate (Couleurs neutres principales)
- `slate-100` : Arrière-plan général (#f1f5f9)
- `slate-200` : Bordures et séparateurs (#e2e8f0) 
- `slate-500` : Texte secondaire (#64748b)
- `slate-600` : Texte d'icônes et labels (#475569)
- `slate-700` : Texte des badges inactifs (#334155)
- `slate-900` : Texte principal et états actifs (#0f172a)

#### Emerald (Couleurs de succès/positif)
- `emerald-50` : Arrière-plan des badges positifs (#ecfdf5)
- `emerald-700` : Texte des badges positifs (#047857)

#### Rose (Couleurs d'erreur/négatif)
- `rose-50` : Arrière-plan des badges négatifs (#fff1f2)
- `rose-700` : Texte des badges négatifs (#be123c)

### Usage des couleurs

```css
/* Arrière-plans */
bg-slate-100    /* Page principale */
bg-white        /* Cartes et composants */
bg-slate-900    /* États actifs */

/* Texte */
text-slate-900  /* Titres et valeurs principales */
text-slate-600  /* Labels et icônes */
text-slate-500  /* Texte secondaire */
text-white      /* Texte sur fonds sombres */

/* Bordures */
border-slate-200  /* Bordures standards */
border-slate-900  /* Bordures actives */
```

## Typography

### Configuration des polices

```tsx
// Layout configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});
```

### Hiérarchie typographique

```css
/* Titre principal */
text-2xl font-semibold text-slate-900

/* Valeurs KPI principales */
text-3xl font-semibold text-slate-900

/* Labels de cartes */
text-sm font-medium text-slate-600

/* Badges */
text-xs font-semibold

/* Sous-titres */
text-xs text-slate-500

/* Pills/Navigation */
text-sm
```

## Espacements et Layout

### Grille responsive

```css
/* Container principal */
mx-auto max-w-7xl space-y-6

/* Grille KPI */
grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4

/* Padding général */
p-6 sm:p-10  /* Page */
p-4          /* Cartes */
```

### Espacements internes

```css
/* Espacement vertical */
space-y-6   /* Entre sections principales */
mt-2        /* Entre éléments de carte */
mt-1        /* Entre valeur et sous-titre */

/* Espacement horizontal */
gap-4       /* Grille générale */
gap-3       /* Entre valeur et delta */
gap-2       /* Entre icône et texte */
gap-1       /* Dans les badges */

/* Padding */
px-3 py-1   /* Pills navigation */
px-2 py-1   /* Badges delta */
```

## Composants UI

### 1. KpiCard

**Fichier** : `/src/app/components/KpiCard.tsx`

Composant principal pour afficher des métriques avec icône, valeur, delta et sous-titre.

```tsx
type Props = {
  title: string;
  icon: LucideIcon;
  value: number | null | undefined;
  delta?: number | null;
  subtitle?: string;
};
```

**Structure CSS** :
```css
/* Container */
rounded-2xl border border-slate-200 bg-white p-4 shadow-sm

/* Header avec icône */
flex items-center gap-2 text-slate-600
text-sm font-medium

/* Valeur principale */
text-3xl font-semibold text-slate-900

/* Layout valeur + delta */
mt-2 flex items-baseline gap-3

/* Sous-titre */
mt-1 text-xs text-slate-500
```

**Usage** :
```tsx
<KpiCard
  title="Passeports commandés"
  icon={Package}
  value={1234}
  delta={12.5}
  subtitle="+ 150 passeports"
/>
```

### 2. DeltaBadge

**Fichier** : `/src/app/components/DeltaBadge.tsx`

Badge pour afficher les variations avec couleurs et icônes contextuelles.

```tsx
type Props = { 
  delta?: number | null 
};
```

**Logique de couleurs** :
```tsx
// États possibles
const isZero = v === 0;
const isPos = v > 0;

// Icônes
const Icon = isZero ? Minus : isPos ? ArrowUpRight : ArrowDownRight;

// Couleurs
const color = isZero
  ? "text-slate-600 bg-slate-100"      // Neutre
  : isPos  
  ? "text-emerald-700 bg-emerald-50"   // Positif
  : "text-rose-700 bg-rose-50";        // Négatif
```

**Structure CSS** :
```css
inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold
```

### 3. Navigation Pills (Header)

**Structure CSS** :
```css
/* Container */
flex items-center gap-2

/* Pill active */
rounded-lg border px-3 py-1 text-sm bg-slate-900 text-white border-slate-900

/* Pill inactive */
rounded-lg border px-3 py-1 text-sm bg-white text-slate-700 border-slate-200
```

## Icônes (Lucide React)

### Icônes utilisées
```tsx
import { 
  Package,        // Passeports
  ShoppingCart,   // Commandes
  BarChart3,      // Moyennes/Analytics
  Calendar,       // Dates/Périodes
  ArrowUpRight,   // Tendance positive
  ArrowDownRight, // Tendance négative
  Minus           // Tendance neutre
} from "lucide-react";
```

### Tailles standard
```tsx
// Icônes dans les cartes
<Icon size={16} />

// Icônes dans les badges
<Icon size={14} />
```

## Patterns de layout

### 1. Structure de page
```tsx
<div className="min-h-screen bg-slate-100 p-6 sm:p-10">
  <div className="mx-auto max-w-7xl space-y-6">
    {/* Header */}
    {/* Content sections */}
  </div>
</div>
```

### 2. Header avec navigation
```tsx
<header className="flex flex-wrap items-center justify-between gap-4">
  <h1 className="text-2xl font-semibold text-slate-900">
    Titre
  </h1>
  <div className="flex items-center gap-2">
    {/* Pills de navigation */}
  </div>
</header>
```

### 3. Grille de KPI
```tsx
<section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* KPI Cards */}
</section>
```

## Animations et interactions

### Hover effects
- **Cartes** : `shadow-sm` par défaut, pas d'effet hover défini
- **Pills** : Changement de couleur via état actif/inactif

### Transitions
- Pas d'animations CSS explicites définies
- Utilisation des transitions naturelles du navigateur

### États interactifs
- Pills de navigation avec états actif/inactif
- Pas d'autres interactions définies dans les composants actuels

## Formatage des données

### Nombres
```tsx
// Configuration française
function formatNumber(n: number | null | undefined, digits = 0): string {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return v.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
```

### Pourcentages
```tsx
function formatPercent(n: number | null | undefined, digits = 2): string {
  return `${formatNumber(n, digits)} %`;
}
```

## Responsive Design

### Breakpoints utilisés
```css
sm:   /* 640px+ */ p-10, p-6 par défaut
md:   /* 768px+ */ grid-cols-2
lg:   /* 1024px+ */ grid-cols-4
```

### Approche mobile-first
- Layout en colonne unique par défaut
- Progression vers grille multi-colonnes sur écrans plus larges

## Accessibilité

### Considérations implémentées
- Structure sémantique avec header, section
- Contraste de couleurs élevé (slate-900 sur blanc)
- Tailles de texte lisibles (minimum 12px/0.75rem)
- Espacement suffisant entre éléments interactifs

### Améliorations possibles
- Ajout d'attributs ARIA
- Support des lecteurs d'écran pour les métriques
- Navigation au clavier pour les pills

## Bonnes pratiques

### Structure des composants
1. **Props typés** avec TypeScript
2. **Gestion des valeurs nulles** avec fallbacks
3. **Séparation des préoccupations** (logique/présentation)
4. **Réutilisabilité** via props configurables

### CSS/Tailwind
1. **Classes utilitaires** plutôt que CSS custom
2. **Responsive classes** avec approche mobile-first  
3. **Cohérence des espacements** avec scale Tailwind
4. **Variables CSS** pour thème sombre/clair

### Performance
1. **Composants légers** sans dépendances lourdes
2. **Icons as components** (optimisation automatique)
3. **CSS minimal** via Tailwind purge

## Extensions suggérées

### Composants manquants
- **Button** : Boutons primaires/secondaires
- **Input** : Champs de formulaire
- **Modal** : Boîtes de dialogue
- **Table** : Tableaux de données
- **Loading** : États de chargement
- **Toast** : Notifications

### Améliorations système
- **Dark mode** : Implémentation complète
- **Animations** : Micro-interactions
- **Focus states** : Accessibilité clavier
- **Error states** : Gestion des erreurs
- **Skeleton loaders** : États de chargement

Cette documentation constitue une base solide pour étendre le design system vers d'autres projets en conservant la cohérence visuelle et les bonnes pratiques établies.