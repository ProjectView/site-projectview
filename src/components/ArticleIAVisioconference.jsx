import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, ChevronRight, ChevronLeft, Sparkles, TrendingUp, Users, Award, Zap, Lightbulb } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';
import { NumberedCard, StatsGrid, StatCard, HighlightBox, ComparisonCard, TimelineItem, BenefitsGrid, CTABox } from './ArticleComponents';

const ArticleIAVisioconference = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#accueil" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Accueil</Link>
            <Link to="/#offres" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Solutions</Link>
            <Link to="/#mission" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Expertise</Link>
            <Link to="/blog" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Blog</Link>
            <Link to="/#contact" className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium">
              Contact
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t shadow-xl">
            <div className="px-6 py-6 space-y-4">
              <Link to="/#accueil" className="block hover:text-[#72B0CC] font-medium">Accueil</Link>
              <Link to="/#offres" className="block hover:text-[#72B0CC] font-medium">Solutions</Link>
              <Link to="/#mission" className="block hover:text-[#72B0CC] font-medium">Expertise</Link>
              <Link to="/blog" className="block hover:text-[#72B0CC] font-medium">Blog</Link>
              <Link to="/#contact" className="block text-center bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full">Contact</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#72B0CC' }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#82BC6C' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Retour au blog */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#72B0CC] transition-colors duration-300 mb-6 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour au blog</span>
          </Link>

          {/* Catégorie */}
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-4 py-2 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              Guide Informatif
            </span>
            <span className="text-gray-500 text-sm">IA • Visioconférence • Productivité</span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            L'IA au service de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">visioconférence</span>
          </h1>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>27 octobre 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>15 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Équipe ProjectView</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Hero */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Image Hero à ajouter</p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <article className="max-w-4xl mx-auto px-6 mb-32">
        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            À l'ère du travail hybride, les systèmes de visioconférence sont devenus indispensables. Mais comment rendre ces réunions plus productives et intelligentes ? C'est là que l'intelligence artificielle intervient, révolutionnant la façon dont nous communiquons à distance.
          </p>

          <HighlightBox type="info">
            <p className="text-lg text-gray-800 italic font-semibold">
              "Les réunions représentent 21 heures par semaine pour le professionnel moyen. L'IA peut transformer ce temps perdu en valeur créée."
            </p>
            <p className="text-sm text-gray-600 mt-2">— Étude McKinsey, 2025</p>
          </HighlightBox>
        </section>

        {/* Section Stats */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            L'impact de l'IA sur les réunions
          </h2>

          <StatsGrid>
            <StatCard icon={TrendingUp} label="Augmentation productivité" value="+45%" color="#72B0CC" />
            <StatCard icon={Users} label="Engagement amélioré" value="+67%" color="#82BC6C" />
            <StatCard icon={Award} label="Satisfaction équipe" value="92%" color="#CF6E3F" />
            <StatCard icon={Zap} label="Temps de réunion réduit" value="-30%" color="#72B0CC" />
          </StatsGrid>
        </section>

        {/* Section Capacités */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">4 capacités clés</span> de l'IA
          </h2>

          <NumberedCard number="1" title="Transcription et enregistrement intelligent" color="blue">
            <p className="text-gray-800 leading-relaxed mb-4">
              <strong>Précision:</strong> 95%+ d'exactitude avec reconnaissance de plusieurs locuteurs. L'IA apprend votre vocabulaire spécifique et s'améliore constamment.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">✅ Cas d'usage</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Procès-verbaux automatiques</li>
                  <li>• Recherche dans archives</li>
                  <li>• Conformité réglementaire</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">💡 Bénéfice</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 2h de temps regagné/semaine</li>
                  <li>• Zéro oublis d'infos clés</li>
                  <li>• Documentation pour tous</li>
                </ul>
              </div>
            </div>
          </NumberedCard>

          <NumberedCard number="2" title="Traduction en temps réel" color="green">
            <p className="text-gray-800 leading-relaxed mb-4">
              <strong>Couverture:</strong> Plus de 100 langues avec préservation du ton et contexte. Latence &lt;500ms pour expérience fluide.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Collaboration mondiale</li>
                  <li>• Pas de malentendus</li>
                  <li>• Équipes distribuées</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">💡 Impact</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Recrutement sans limites</li>
                  <li>• Clients mondiaux</li>
                  <li>• Expansion facile</li>
                </ul>
              </div>
            </div>
          </NumberedCard>

          <NumberedCard number="3" title="Résumés et points d'action automatiques" color="orange">
            <p className="text-gray-800 leading-relaxed mb-4">
              <strong>Génération:</strong> Résumés en 30 secondes, points d'action avec propriétaires assignés automatiquement.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">✅ Contenu généré</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Résumé executive</li>
                  <li>• Décisions prises</li>
                  <li>• Timeline suivi</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">💡 Résultat</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Aucune note manquée</li>
                  <li>• Accountability claire</li>
                  <li>• Follow-up garanti</li>
                </ul>
              </div>
            </div>
          </NumberedCard>

          <NumberedCard number="4" title="Analyse sentiment et engagement" color="red">
            <p className="text-gray-800 leading-relaxed mb-4">
              <strong>Analyse:</strong> Patterns de communication, frustration détectée, engagement mesuré en real-time.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">✅ Insights</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Qui parle combien</li>
                  <li>• Sujets sensibles détectés</li>
                  <li>• Climat d'équipe</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">💡 Application</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Coaching managers</li>
                  <li>• Culture d'équipe</li>
                  <li>• Problèmes détectés tôt</li>
                </ul>
              </div>
            </div>
          </NumberedCard>
        </section>

        {/* Section Avant/Après */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Avant vs Après l'IA
          </h2>

          <ComparisonCard
            title="Expérience d'une réunion"
            color="blue"
            before={[
              "Notes manuelles incomplètes",
              "Qui doit faire quoi? Flou",
              "Participants distants perdus",
              "Aucun record official",
              "Infos importantes oubliées",
              "Bruit de fond problématique"
            ]}
            after={[
              "Transcription 100% fidèle",
              "Points d'action clairs et assignés",
              "Tout le monde sur le même pied",
              "Enregistrement + transcription",
              "Résumé emails auto-envoyés",
              "Audio cristallin partout"
            ]}
          />
        </section>

        {/* Section Cas d'usage */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Qui utilise l'IA dans la visioconférence?
          </h2>

          <BenefitsGrid
            benefits={[
              {
                title: "Équipes distribuées",
                description: "Collaboration fluide peu importe la géographie ou fuseau horaire"
              },
              {
                title: "Secteur financier",
                description: "Enregistrement conforme, analyse de risque, documentation automatique"
              },
              {
                title: "Centres de contact",
                description: "Formation en temps réel, détection fraude, coaching d'agents"
              },
              {
                title: "Éducation",
                description: "Transcriptions pour accessibilité, création de contenu pédagogique"
              },
              {
                title: "Management",
                description: "Insights sur l'équipe, détection de problèmes, coaching"
              },
              {
                title: "Clients globaux",
                description: "Support multilingue, satisfaction accrue, zéro barrière langue"
              }
            ]}
          />
        </section>

        {/* Section défis */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les défis à anticiper
          </h2>

          <HighlightBox type="warning">
            <h3 className="font-bold text-gray-900 mb-3">Qualité de connexion</h3>
            <p className="text-gray-700">L'IA fonctionne mieux avec une connexion stable. Bruit de fond important = réduction de précision.</p>
          </HighlightBox>

          <HighlightBox type="error">
            <h3 className="font-bold text-gray-900 mb-3">Coûts et adoption</h3>
            <p className="text-gray-700">Investissement initial requis. Nécessite formation et changement de mentalité de l'équipe.</p>
          </HighlightBox>

          <HighlightBox type="warning">
            <h3 className="font-bold text-gray-900 mb-3">Confidentialité et biais</h3>
            <p className="text-gray-700">Données sensibles en jeu. L'IA peut avoir des biais. Besoin de gouvernance stricte.</p>
          </HighlightBox>
        </section>

        {/* Conclusion */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer vos réunions?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            L'intégration de l'IA aux systèmes de visioconférence n'est plus une question de "si", mais de "quand" et "comment". Les organisations qui adoptent cette technologie aujourd'hui gagnent un avantage compétitif significatif.
          </p>

          <CTABox
            title="Besoin d'aide pour démarrer?"
            description="Notre équipe d'experts peut vous aider à intégrer l'IA dans votre infrastructure existante et maximiser son ROI."
            buttonText="Parlons de votre cas"
            icon={Zap}
          />
        </section>
      </article>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #72B0CC, #82BC6C)' }}>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer votre expérience ?
          </h2>

          <p className="text-xl md:text-xl mb-12 opacity-95 max-w-2xl mx-auto">
            Découvrez comment ProjectView peut vous aider à créer des réunions plus intelligentes et productives.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              <span>Nous contacter</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Lire d'autres articles
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ArticleIAVisioconference;
