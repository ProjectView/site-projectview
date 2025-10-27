# Guide: Formatage Avancé des Articles

Ce guide explique comment utiliser les composants de mise en forme avancée dans tes articles markdown.

## Les Composants Disponibles

### 1. NumberedCard
Pour créer des encarts numérotés avec fond coloré.

**Usage dans JSX:**
```jsx
<NumberedCard number="1" title="Titre du composant" color="blue">
  <p><strong>Spécifications:</strong> Texte descriptif</p>
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-bold">✅ Avantages</h4>
      <ul className="space-y-1 text-sm">
        <li>• Avantage 1</li>
        <li>• Avantage 2</li>
      </ul>
    </div>
  </div>
</NumberedCard>
```

**Couleurs disponibles:** blue, green, orange, red, purple

---

### 2. StatsGrid + StatCard
Pour afficher des statistiques en grille.

```jsx
<StatsGrid>
  <StatCard icon={TrendingUp} label="Augmentation de productivité" value="+45%" color="#72B0CC" />
  <StatCard icon={Users} label="Utilisateurs satisfaits" value="98%" color="#82BC6C" />
  <StatCard icon={Award} label="Projets réussis" value="500+" color="#CF6E3F" />
  <StatCard icon={Zap} label="Déploiements" value="1000+" color="#72B0CC" />
</StatsGrid>
```

---

### 3. HighlightBox
Pour mettre en avant des citations, infos ou avertissements.

```jsx
<HighlightBox type="success">
  <p className="text-lg font-semibold text-gray-800">
    "Les écrans collaboratifs ont multiplié notre productivité par 3"
  </p>
  <p className="text-sm text-gray-600 mt-2">— Manager, Équipe IT</p>
</HighlightBox>
```

**Types:** success, warning, error, info

---

### 4. ComparisonCard
Pour comparaison avant/après.

```jsx
<ComparisonCard
  title="Impact des écrans collaboratifs"
  color="orange"
  before={[
    "Câbles partout",
    "Participant distants relégués",
    "Partage d'une seule source",
    "Bruit de fond problématique"
  ]}
  after={[
    "Wireless 100%",
    "Participants distants 'dans la salle'",
    "4 sources simultanées",
    "Suppression bruit IA"
  ]}
/>
```

---

### 5. TimelineItem
Pour créer une timeline d'évolution.

```jsx
<TimelineItem
  year="2015"
  title="L'ère des projecteurs"
  color="#72B0CC"
  description="Projecteur fixe, câbles, adaptateurs multiples..."
/>
```

---

### 6. BenefitsGrid
Pour lister les bénéfices avec icônes.

```jsx
<BenefitsGrid
  benefits={[
    {
      title: "Immersive et engageante",
      description: "L'écran grand format capture l'attention"
    },
    {
      title: "Multi-touch intuitif",
      description: "Interaction naturelle pour tous les participants"
    },
    {
      title: "Détails visibles de loin",
      description: "Résolution 4K lisible même au fond de la salle"
    }
  ]}
/>
```

---

### 7. CTABox
Pour appels à l'action avec icône.

```jsx
<CTABox
  title="Besoin de plus d'infos?"
  description="Découvrez comment transformer vos réunions"
  buttonText="Nous contacter"
  icon={Zap}
/>
```

---

## Comment Intégrer dans un Article

Tu as deux options:

### Option 1: Markdown pur (Simple)
Utilise les sections markdown standards avec formatage Tailwind basique (blocs de citation, listes, etc). Parfait pour 80% des articles.

### Option 2: Markdown + JSX (Avancé)
Mélange markdown et composants React pour des articles riches comme "Écrans Collaboratifs".

**Exemple d'article hybride:**

```markdown
---
id: "mon-article"
title: "Mon Article Avancé"
...
---

# Mon Article

Texte en markdown normal.

```jsx
<NumberedCard number="1" title="Premier point" color="blue">
  <p>Contenu en JSX</p>
</NumberedCard>
```

Plus de texte markdown.

```jsx
<StatsGrid>
  <StatCard ... />
</StatsGrid>
```

Conclusion.
```

---

## Performance

- Les articles pur markdown: Légers et rapides
- Les articles hybrides: Riches mais plus lourds
- Utilise JSX seulement quand tu as besoin de mise en forme avancée

---

**Besoin d'aide?** Regarde les composants dans `/src/components/ArticleComponents.jsx`
