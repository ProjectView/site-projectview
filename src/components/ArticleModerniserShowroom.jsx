import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles, TrendingDown, Clock, Users, Eye, Smartphone, Calendar } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleModerniserShowroom = () => {
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

  const signes = [
    {
      number: "1",
      icon: <TrendingDown className="w-12 h-12" />,
      title: "Vos clients passent... et repartent sans rien acheter",
      color: "from-[#CF6E3F] to-[#72B0CC]",
      symptoms: [
        "Taux de conversion en baisse progressive",
        "Temps moyen de visite qui diminue",
        "Les clients consultent leur smartphone plus que vos produits",
        "\"Je vais réfléchir\" devient la réponse par défaut"
      ],
      why: "Vos clients comparent en ligne avant de venir. Votre espace physique doit offrir une expérience qu'ils ne peuvent pas avoir sur internet. S'ils trouvent votre showroom moins informatif que votre site web ou celui de vos concurrents, ils n'ont aucune raison d'acheter chez vous.",
      solution: "Transformez votre showroom en expérience interactive. Tables tactiles pour explorer l'intégralité de votre catalogue, configurateurs 3D pour personnaliser les produits en temps réel, écrans dynamiques qui racontent l'histoire de vos produits. Donnez-leur une raison de rester.",
      stat: "Les showrooms modernisés observent une augmentation de 250% du temps moyen de visite et +47% de taux de conversion.",
      cta: "Découvrez nos solutions pour showrooms interactifs"
    },
    {
      number: "2",
      icon: <Clock className="w-12 h-12" />,
      title: "Vos supports marketing sont obsolètes avant même d'être imprimés",
      color: "from-[#72B0CC] to-[#82BC6C]",
      symptoms: [
        "Budget catalogues entre 20 000€ et 80 000€ par an",
        "Nouveaux produits non présentés pendant des mois",
        "Modifications de prix = stock de catalogues à jeter",
        "Informations différentes entre le site et le showroom"
      ],
      why: "Votre catalogue papier est déjà périmé le jour de sa livraison. Chaque lancement produit, chaque ajustement de prix, chaque nouvelle promotion crée un décalage entre votre communication physique et digitale. Résultat : confusion client et crédibilité écornée.",
      solution: "Affichage dynamique et tables tactiles pilotés depuis le cloud. Mettez à jour tous vos supports en même temps, partout, en quelques clics. Nouveau produit le matin ? Il est présenté à midi. Promotion flash ? Elle démarre à l'instant exact sur tous vos écrans.",
      stat: "Économie moyenne : 65 000€/an sur les coûts d'impression et de mise à jour des supports papier.",
      cta: "Calculez vos économies avec l'affichage dynamique"
    },
    {
      number: "3",
      icon: <Users className="w-12 h-12" />,
      title: "Vos vendeurs passent leur temps à répondre aux mêmes questions de base",
      color: "from-[#82BC6C] to-[#CF6E3F]",
      symptoms: [
        "\"C'est quoi la différence entre ces deux modèles ?\" x100 par jour",
        "Vendeurs saturés, clients qui attendent",
        "Impossibilité de se concentrer sur le conseil à forte valeur",
        "Les clients repartent avec des questions non répondues"
      ],
      why: "Votre équipe commerciale devrait être là pour conseiller, challenger, accompagner les décisions complexes. Pas pour réciter des fiches techniques qu'un écran interactif pourrait afficher en 3 secondes. Chaque minute perdue sur une question basique est une opportunité de vente consultative manquée.",
      solution: "Bornes tactiles en libre-service avec comparateurs produits, filtres intelligents, fiches techniques complètes. Vidéos explicatives, vues 360°, configurateurs. Les clients trouvent les réponses basiques eux-mêmes, votre équipe intervient pour la vraie valeur ajoutée.",
      stat: "70% d'autonomie client = équipe commerciale recentrée sur 30% de conseil à haute valeur. ROI : panier moyen +35%.",
      cta: "Libérez le potentiel de votre équipe commerciale"
    },
    {
      number: "4",
      icon: <Eye className="w-12 h-12" />,
      title: "Vous n'avez aucune idée de ce qui intéresse vraiment vos clients",
      color: "from-[#CF6E3F] to-[#82BC6C]",
      symptoms: [
        "Aucune donnée sur les produits consultés vs achetés",
        "Méconnaissance des parcours clients en magasin",
        "Décisions merchandising basées sur l'intuition",
        "Impossible de prouver le ROI de vos investissements showroom"
      ],
      why: "Votre e-commerce vous dit tout : pages vues, taux de rebond, parcours d'achat, abandons panier. Votre showroom physique ? Silence radio. Vous investissez des dizaines de milliers d'euros dans un espace sans savoir ce qui fonctionne, ce qui attire, ce qui convertit.",
      solution: "Technologies interactives avec analytics intégrés. Heatmaps d'interaction sur tables tactiles, mesure du temps passé par zone, produits les plus configurés, taux d'interaction par support. Enfin de la data actionnable pour optimiser votre espace et votre offre.",
      stat: "Les showrooms data-driven ajustent leur merchandising 4x plus vite et augmentent leur CA/m² de 28% en moyenne.",
      cta: "Transformez votre showroom en machine à insights"
    },
    {
      number: "5",
      icon: <Smartphone className="w-12 h-12" />,
      title: "L'expérience en ligne de vos concurrents est meilleure que votre showroom physique",
      color: "from-[#72B0CC] to-[#CF6E3F]",
      symptoms: [
        "Clients qui viennent voir en vrai puis commandent en ligne ailleurs",
        "\"C'est moins cher sur Amazon\" (alors que vos prix sont identiques)",
        "Perte de parts de marché face à des pure players",
        "Sentiment que votre showroom est un show-room, plus un point de vente"
      ],
      why: "La vraie concurrence n'est plus le magasin d'en face. C'est l'expérience fluide, personnalisée et immédiate qu'offrent les géants du digital. Si votre showroom physique ne dépasse pas cette expérience, il devient juste un endroit pour toucher le produit avant de l'acheter moins cher en ligne.",
      solution: "Créez une expérience phygitale impossible à reproduire en ligne. Réalité virtuelle pour projeter les produits chez le client, configurateurs géants collaboratifs pour concevoir à plusieurs, intelligence artificielle pour recommandations ultra-personnalisées. Faites de votre espace physique un avantage compétitif, pas un boulet.",
      stat: "68% des clients sont prêts à payer plus cher pour une expérience showroom exceptionnelle vs achat en ligne standard.",
      cta: "Reprenez l'avantage sur le digital"
    }
  ];

  const callToAction = {
    title: "Combien de ces 5 signes reconnaissez-vous ?",
    sections: [
      {
        score: "0-1 signe",
        text: "Vous êtes dans le top 10% des showrooms modernes. Restez à la pointe.",
        color: "text-[#82BC6C]"
      },
      {
        score: "2-3 signes",
        text: "Vous tenez encore le coup, mais vos concurrents modernisent. C'est le moment d'agir.",
        color: "text-[#CF6E3F]"
      },
      {
        score: "4-5 signes",
        text: "Code rouge. Chaque mois qui passe creuse l'écart avec le marché. L'urgence est là.",
        color: "text-red-600"
      }
    ]
  };

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

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
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

      {/* Hero Article */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ backgroundColor: '#f0f9ff' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(130, 188, 108, 0.3)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(114, 176, 204, 0.25)' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#82BC6C]/20 to-[#72B0CC]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-8 border border-[#82BC6C]/30 animate-fade-in-up">
            <Sparkles className="w-4 h-4" style={{ color: '#82BC6C' }} />
            <span className="text-sm font-medium text-gray-800">Article Informatif</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif', animationDelay: '0.1s' }}>
            5 signes qu'il est temps de <span style={{ color: '#82BC6C' }}>moderniser</span><br />
            votre showroom
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">8 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Expert Showroom</span>
            </div>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Vos clients comparent en ligne avant de venir. Votre espace physique doit offrir une expérience qu'ils ne peuvent pas avoir sur internet. Sinon, vous devenez un simple showroom... pour Amazon.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Voici les 5 signaux d'alerte qui indiquent que votre showroom est en train de perdre sa raison d'être. Et surtout, comment y remédier avant qu'il ne soit trop tard.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-20">
            {signes.map((signe, index) => (
              <article
                key={index}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
                id={`signe-${signe.number}`}
              >
                {/* Header du signe */}
                <div className="flex items-start gap-6 mb-8">
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${signe.color} text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {signe.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {signe.title}
                    </h2>
                  </div>
                </div>

                {/* Symptômes */}
                <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Symptômes reconnaissables
                  </h3>
                  <ul className="space-y-3">
                    {signe.symptoms.map((symptom, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-1">×</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pourquoi c'est grave */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#CF6E3F]"></span>
                    Pourquoi c'est plus grave que vous ne le pensez
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {signe.why}
                  </p>
                </div>

                {/* La solution */}
                <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#72B0CC]/10 border-l-4 border-[#82BC6C] rounded-r-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#82BC6C]"></span>
                    La solution moderne
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    {signe.solution}
                  </p>
                </div>

                {/* Statistique clé */}
                <div className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] rounded-2xl p-6 text-white mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                      {signe.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed font-medium">
                        <strong>Chiffre clé :</strong> {signe.stat}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < signes.length - 1 && (
                  <div className="mt-12 pt-12 border-t-2 border-gray-200"></div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Score Section */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(130, 188, 108, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {callToAction.title}
            </h2>
            <p className="text-xl text-gray-600">
              Faites le test honnêtement. Votre diagnostic en 30 secondes.
            </p>
          </div>

          <div className="space-y-6">
            {callToAction.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-[#72B0CC] hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center gap-6">
                  <div className={`text-4xl font-bold ${section.color}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {section.score}
                  </div>
                  <p className="text-lg text-gray-700 flex-1">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="audit" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Obtenez un audit gratuit<br />
            de votre showroom
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Un expert Projectview visite votre espace, identifie les points de friction, et vous remet un plan d'action concret avec ROI estimé. Sans engagement. Juste de la valeur.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              Réserver mon audit gratuit
              <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Audit sur site · Recommandations personnalisées · Chiffrage détaillé · Sans engagement
          </p>
        </div>
      </section>

      {/* Articles similaires */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Articles similaires
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/solutions/tables-tactiles"
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#72B0CC] hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors">
                Tables Tactiles : le guide complet
              </h4>
              <p className="text-gray-600 text-sm">
                Transformez votre showroom en expérience interactive
              </p>
            </Link>

            <Link
              to="/article/showroom-automobile"
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#CF6E3F] hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#CF6E3F] transition-colors">
                Cas client : Showroom Automobile
              </h4>
              <p className="text-gray-600 text-sm">
                De la brochure papier à l'expérience immersive
              </p>
            </Link>

            <Link
              to="/solutions/bureau-etude-vr"
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#82BC6C] hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#82BC6C] transition-colors">
                VR : vendez avant de construire
              </h4>
              <p className="text-gray-600 text-sm">
                Comment la VR transforme la vente de projets
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ArticleModerniserShowroom;
