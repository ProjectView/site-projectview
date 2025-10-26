#!/bin/bash

# Script CURL simple et fonctionnel pour tester le webhook

echo "🚀 Test 1: Article en Brouillon"
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook -H "Content-Type: application/json" -d '{"articleMarkdown":"---\nid: \"test-article\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nCeci est un test.","frontmatter":{"id":"test-article","title":"Test Article","category":"Guide Informatif","date":"2025-10-26","tags":["test"],"author":"ProjectBot"},"approved":false}'

echo ""
echo ""
echo "✅ Si tu vois 'pending_approval' ci-dessus, c'est bon!"
echo ""
echo "🚀 Test 2: Article Publié"
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook -H "Content-Type: application/json" -d '{"articleMarkdown":"---\nid: \"mon-premier-article\"\ntitle: \"Mon Premier Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\",\"netlify\"]\nauthor: \"ProjectBot\"\n---\n\n# Mon Premier Article\n\nCet article a été publié avec succès!","frontmatter":{"id":"mon-premier-article","title":"Mon Premier Article","category":"Guide Informatif","date":"2025-10-26","tags":["test","netlify"],"author":"ProjectBot"},"approved":true}'

echo ""
echo "✅ Si tu vois 'success' ci-dessus, l'article est publié!"
