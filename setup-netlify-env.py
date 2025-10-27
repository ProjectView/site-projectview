#!/usr/bin/env python3
"""
Script de configuration Netlify pour ProjectBot
Configure automatiquement les variables d'environnement
"""

import subprocess
import sys
from pathlib import Path

def run_command(cmd):
    """Exécute une commande shell"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def check_netlify_logged_in():
    """Vérifie si l'utilisateur est connecté à Netlify"""
    success, stdout, stderr = run_command("netlify status")
    return success and "Not logged in" not in stdout

def set_env_variable(name, value):
    """Définit une variable d'environnement sur Netlify"""
    success, stdout, stderr = run_command(f'netlify env:set {name} "{value}"')
    return success

def get_env_variables():
    """Récupère les variables d'environnement"""
    success, stdout, stderr = run_command("netlify env:list")
    return stdout if success else ""

def main():
    print("🚀 Configuration Netlify pour ProjectBot")
    print("=" * 50)
    print()

    # Vérifier la connexion
    print("Vérification de la connexion Netlify...")
    if not check_netlify_logged_in():
        print("❌ Vous ne êtes pas connecté à Netlify")
        print()
        print("Veuillez d'abord exécuter: netlify login")
        print()
        print("Ou avec un token:")
        print('  export NETLIFY_AUTH_TOKEN="votre-token-ici"')
        print('  netlify link')
        sys.exit(1)

    print("✅ Vous êtes connecté à Netlify")
    print()

    # Variables obligatoires
    print("📝 Configuration des variables d'environnement")
    print("=" * 50)
    print()
    print("Variables OBLIGATOIRES:")
    print()

    env_vars = {
        "GITHUB_TOKEN": "Token d'accès GitHub avec permission 'repo'",
        "GITHUB_REPO_OWNER": "Propriétaire du repo (ex: ProjectView)",
        "GITHUB_REPO_NAME": "Nom du repo (ex: site-projectview)",
    }

    optional_vars = {
        "GOOGLE_SHEETS_API_KEY": "Google Sheets API Key (optionnel)",
        "GOOGLE_SHEETS_SPREADSHEET_ID": "Google Sheets Spreadsheet ID (optionnel)",
        "TELEGRAM_BOT_TOKEN": "Telegram Bot Token (optionnel)",
        "TELEGRAM_CHAT_ID": "Telegram Chat ID (optionnel)",
    }

    # Définir les variables obligatoires
    for var_name, description in env_vars.items():
        value = input(f"📌 {description}\n   {var_name}: ").strip()
        if value:
            if set_env_variable(var_name, value):
                print(f"   ✅ {var_name} défini")
            else:
                print(f"   ❌ Erreur en définissant {var_name}")
        else:
            print(f"   ⚠️  {var_name} non fourni (OBLIGATOIRE!)")
        print()

    # Définir les variables optionnelles
    print("Variables OPTIONNELLES:")
    print()
    for var_name, description in optional_vars.items():
        value = input(f"📌 {description}\n   {var_name} (appuyez sur Entrée pour ignorer): ").strip()
        if value:
            if set_env_variable(var_name, value):
                print(f"   ✅ {var_name} défini")
            else:
                print(f"   ❌ Erreur en définissant {var_name}")
        else:
            print(f"   ⏭️  {var_name} ignoré")
        print()

    # Afficher les variables définies
    print()
    print("=" * 50)
    print("✅ Variables d'environnement définies:")
    print("=" * 50)
    print()
    vars_output = get_env_variables()
    print(vars_output)

    print()
    print("🎉 Configuration terminée!")
    print()
    print("Tu peux maintenant:")
    print("  1. Importer le workflow N8N")
    print("  2. Lancer Projectbot via Telegram")
    print("  3. Générer des articles automatiquement ✨")

if __name__ == "__main__":
    main()
