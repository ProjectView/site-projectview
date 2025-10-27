#!/bin/bash

# Script de setup Netlify pour ProjectBot
# À lancer une fois après: netlify login

echo "🚀 Configuration Netlify pour ProjectBot..."

# Vérifier que l'utilisateur est connecté
if ! netlify status &> /dev/null; then
    echo "❌ Vous devez d'abord vous connecter avec: netlify login"
    exit 1
fi

echo "✅ Connecté à Netlify"

# Lier le site si nécessaire
echo ""
echo "Liaison du site à Netlify..."
netlify link --silent 2>/dev/null || netlify link

echo ""
echo "📝 Configuration des variables d'environnement..."

# Fonction pour demander et setter une variable
set_env_var() {
    local var_name=$1
    local var_description=$2

    read -p "📌 Entrez la valeur pour $var_description ($var_name): " var_value

    if [ ! -z "$var_value" ]; then
        netlify env:set $var_name "$var_value"
        echo "✅ $var_name défini"
    else
        echo "⏭️  $var_name ignoré"
    fi
    echo ""
}

# Variables obligatoires
set_env_var "GITHUB_TOKEN" "GitHub Personal Access Token (avec permission repo)"
set_env_var "GITHUB_REPO_OWNER" "Propriétaire du repo GitHub (ex: ProjectView)"
set_env_var "GITHUB_REPO_NAME" "Nom du repo GitHub (ex: site-projectview)"

echo ""
echo "Variables optionnelles:"
echo ""

# Variables optionnelles
set_env_var "GOOGLE_SHEETS_API_KEY" "Google Sheets API Key (optionnel)"
set_env_var "GOOGLE_SHEETS_SPREADSHEET_ID" "Google Sheets Spreadsheet ID (optionnel)"
set_env_var "TELEGRAM_BOT_TOKEN" "Telegram Bot Token (optionnel)"
set_env_var "TELEGRAM_CHAT_ID" "Telegram Chat ID (optionnel)"

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "Variables définies:"
netlify env:list

echo ""
echo "🎉 Tu peux maintenant publier des articles via N8N!"
