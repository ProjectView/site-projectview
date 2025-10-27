#!/bin/bash

# Script de setup complet pour ProjectBot
# Utilisation: bash setup-projectbot.sh

set -e

echo "🚀 Setup complet ProjectBot - Automatisation d'articles"
echo "=================================================="
echo ""

# Vérifier que Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "📦 Installation de Netlify CLI..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI installé"
echo ""

# Vérifier la connexion Netlify
echo "🔐 Vérification de la connexion Netlify..."
if ! netlify status &> /dev/null; then
    echo ""
    echo "❌ Vous n'êtes pas connecté à Netlify"
    echo ""
    echo "Options:"
    echo "1. Interactive login:"
    echo "   netlify login"
    echo ""
    echo "2. Avec un token:"
    echo "   export NETLIFY_AUTH_TOKEN='votre-token'"
    echo "   netlify link"
    echo ""
    exit 1
fi

echo "✅ Connecté à Netlify"
echo ""

# Lier le site si nécessaire
echo "🔗 Liaison du site à Netlify..."
netlify link --silent 2>/dev/null || netlify link
echo "✅ Site lié"
echo ""

# Récupérer les variables existantes
echo "📋 Configuration des variables d'environnement"
echo "=================================================="
echo ""

# Variables obligatoires
echo "Variables OBLIGATOIRES:"
echo ""

read -p "📌 Token d'accès GitHub (avec permission 'repo'): " GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN est obligatoire!"
    exit 1
fi
netlify env:set GITHUB_TOKEN "$GITHUB_TOKEN"
echo "✅ GITHUB_TOKEN défini"
echo ""

read -p "📌 Propriétaire du repo GitHub (ex: ProjectView): " GITHUB_REPO_OWNER
if [ -z "$GITHUB_REPO_OWNER" ]; then
    echo "❌ GITHUB_REPO_OWNER est obligatoire!"
    exit 1
fi
netlify env:set GITHUB_REPO_OWNER "$GITHUB_REPO_OWNER"
echo "✅ GITHUB_REPO_OWNER défini"
echo ""

read -p "📌 Nom du repo GitHub (ex: site-projectview): " GITHUB_REPO_NAME
if [ -z "$GITHUB_REPO_NAME" ]; then
    echo "❌ GITHUB_REPO_NAME est obligatoire!"
    exit 1
fi
netlify env:set GITHUB_REPO_NAME "$GITHUB_REPO_NAME"
echo "✅ GITHUB_REPO_NAME défini"
echo ""

# Variables optionnelles
echo "Variables OPTIONNELLES (appuyez sur Entrée pour ignorer):"
echo ""

read -p "📌 Google Sheets API Key (optionnel): " GOOGLE_SHEETS_API_KEY
if [ ! -z "$GOOGLE_SHEETS_API_KEY" ]; then
    netlify env:set GOOGLE_SHEETS_API_KEY "$GOOGLE_SHEETS_API_KEY"
    echo "✅ GOOGLE_SHEETS_API_KEY défini"
fi
echo ""

read -p "📌 Google Sheets Spreadsheet ID (optionnel): " GOOGLE_SHEETS_SPREADSHEET_ID
if [ ! -z "$GOOGLE_SHEETS_SPREADSHEET_ID" ]; then
    netlify env:set GOOGLE_SHEETS_SPREADSHEET_ID "$GOOGLE_SHEETS_SPREADSHEET_ID"
    echo "✅ GOOGLE_SHEETS_SPREADSHEET_ID défini"
fi
echo ""

read -p "📌 Telegram Bot Token (optionnel): " TELEGRAM_BOT_TOKEN
if [ ! -z "$TELEGRAM_BOT_TOKEN" ]; then
    netlify env:set TELEGRAM_BOT_TOKEN "$TELEGRAM_BOT_TOKEN"
    echo "✅ TELEGRAM_BOT_TOKEN défini"
fi
echo ""

read -p "📌 Telegram Chat ID (optionnel): " TELEGRAM_CHAT_ID
if [ ! -z "$TELEGRAM_CHAT_ID" ]; then
    netlify env:set TELEGRAM_CHAT_ID "$TELEGRAM_CHAT_ID"
    echo "✅ TELEGRAM_CHAT_ID défini"
fi
echo ""

# Afficher les variables configurées
echo "=================================================="
echo "✅ Variables d'environnement configurées:"
echo "=================================================="
echo ""
netlify env:list
echo ""

# Vérifier le webhook
echo "🧪 Vérification du webhook..."
if netlify functions:list | grep -q "n8n-webhook"; then
    echo "✅ Fonction n8n-webhook disponible"
else
    echo "⚠️  Fonction n8n-webhook non trouvée (elle sera créée au prochain déploiement)"
fi
echo ""

echo "=================================================="
echo "✅ Setup complété avec succès!"
echo "=================================================="
echo ""
echo "Prochaines étapes:"
echo ""
echo "1. 📦 Importe le workflow N8N:"
echo "   - Ouvre N8N"
echo "   - Importe: N8N_WORKFLOW_UPDATED.json"
echo "   - Remplace les anciens nodes"
echo ""
echo "2. 🚀 Déploie le code:"
echo "   - git add ."
echo "   - git commit -m 'Setup ProjectBot'"
echo "   - git push"
echo ""
echo "3. 📱 Teste via Telegram:"
echo "   - Envoie un message à ProjectBot"
echo "   - Il devrait te proposer 3 idées d'articles"
echo ""
echo "4. ✨ Génère un article:"
echo "   - Choisis une idée"
echo "   - Choisis le format (simple ou riche)"
echo "   - Publie"
echo "   - L'article s'crée automatiquement sur GitHub!"
echo ""
echo "📚 Docs complètes: SETUP_PROJECTBOT.md"
echo ""
