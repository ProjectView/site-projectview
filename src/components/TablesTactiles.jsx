import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Table2, ChevronRight, Check, Zap, Eye, Users, TrendingUp, Shield, Clock, ShoppingBag, Car, Building, Layers } from 'lucide-react';

const TablesTactiles = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Expérience immersive",
      description: "Vos clients ne regardent plus, ils touchent, explorent et configurent en temps réel",
      color: "from-[#72B0CC] to-[#82BC6C]"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Contenu interactif illimité",
      description: "Catalogues 3D, configurateurs produits, animations, vidéos, tout est possible",
      color: "from-[#CF6E3F] to-[#72B0CC]"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Mise à jour instantanée",
      description: "Nouveaux produits, prix, promotions : changez tout en quelques clics, à distance",
      color: "from-[#82BC6C] to-[#CF6E3F]"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-utilisateurs",
      description: "Plusieurs personnes peuvent interagir simultanément sur la même table",
      color: "from-[#72B0CC] to-[#CF6E3F]"
    }
  ];

  const benefits = [
    {
      stat: "+89%",
      label: "de mémorisation",
      description: "contre 10% pour une brochure papier classique"
    },
    {
      stat: "x3",
      label: "temps d'engagement",
      description: "les clients passent 3x plus de temps sur vos produits"
    },
    {
      stat: "-75%",
      label: "de coûts d'impression",
      description: "fini les catalogues obsolètes avant même d'être distribués"
    },
    {
      stat: "+250%",
      label: "de conversions",
      description: "grâce à l'interaction et la personnalisation en temps réel"
    }
  ];

  const useCases = [
    {
      icon: <Car className="w-12 h-12" />,
      title: "Showroom Automobile",
      subtitle: "De la brochure papier à l'expérience immersive",
      challenges: [
        "Catalogues papier coûteux et rapidement obsolètes",
        "Impossibilité de montrer toutes les options et configurations",
        "Clients qui repartent sans documentation",
        "Expérience statique qui n'engage pas"
      ],
      solution: "Une table tactile 4K de 55 pouces où vos clients explorent vos modèles en 3D, personnalisent les couleurs, options, finitions. Ils voient le prix évoluer en temps réel et peuvent envoyer leur configuration par email.",
      results: [
        "250% d'engagement client en plus",
        "Zéro coût d'impression",
        "100% des gammes accessibles",
        "Configuration envoyée directement au CRM"
      ],
      color: "from-[#72B0CC] to-[#82BC6C]",
      metrics: {
        before: "Budget catalogues : 45 000€/an",
        after: "Économie : 38 000€/an"
      }
    },
    {
      icon: <Building className="w-12 h-12" />,
      title: "Promotion Immobilière",
      subtitle: "Présentez vos programmes comme jamais",
      challenges: [
        "Plans difficiles à comprendre pour les clients",
        "Impossibilité de montrer tous les lots disponibles",
        "Rendez-vous longs et peu productifs",
        "Difficultés à se projeter dans l'espace"
      ],
      solution: "Table tactile présentant vos résidences en 3D interactive. Vos clients tournent autour du bâtiment, explorent les appartements, visualisent les vues, comparent les lots. Tout est intuitif, visuel, mémorable.",
      results: [
        "Cycle de vente réduit de 30%",
        "2x plus de lots présentés par RDV",
        "Différenciation forte vs concurrence",
        "Taux de conversion +45%"
      ],
      color: "from-[#CF6E3F] to-[#72B0CC]",
      metrics: {
        before: "Durée moyenne RDV : 90 min",
        after: "Durée optimisée : 45 min"
      }
    },
    {
      icon: <ShoppingBag className="w-12 h-12" />,
      title: "Retail & Centres Commerciaux",
      subtitle: "Réinventez le point de vente",
      challenges: [
        "Espace limité vs gamme produits étendue",
        "Clients qui repartent sans avoir tout vu",
        "Vendeurs sollicités pour des questions basiques",
        "Expérience client peu différenciante"
      ],
      solution: "Bornes tactiles où vos clients explorent l'intégralité de votre catalogue, comparent les produits, consultent les fiches techniques, visualisent les produits en 3D et situation. Votre équipe se concentre sur la valeur ajoutée.",
      results: [
        "100% du catalogue accessible",
        "Autonomie client +70%",
        "Équipe libérée pour le conseil",
        "Panier moyen +35%"
      ],
      color: "from-[#82BC6C] to-[#CF6E3F]",
      metrics: {
        before: "20% du catalogue visible en magasin",
        after: "100% du catalogue accessible"
      }
    }
  ];

  const technicalSpecs = [
    { label: "Tailles disponibles", value: "32\", 43\", 55\", 65\", 75\" et sur-mesure" },
    { label: "Résolution", value: "4K Ultra HD (3840 x 2160)" },
    { label: "Technologie tactile", value: "Capacitif 10 points ou infrarouge 40 points" },
    { label: "Luminosité", value: "350-500 cd/m² selon modèle" },
    { label: "Installation", value: "Sur pied, encastrée, murale ou mobile" },
    { label: "Système", value: "Windows, Android ou solution web" },
    { label: "Connectivité", value: "WiFi, Ethernet, Bluetooth, NFC" },
    { label: "Gestion", value: "CMS cloud pour mise à jour à distance" }
  ];

  const applications = [
    {
      title: "Configurateur produit 3D",
      description: "Personnalisez en temps réel : couleurs, matériaux, options",
      icon: <Layers className="w-6 h-6" />
    },
    {
      title: "Catalogue interactif",
      description: "Explorez, filtrez, comparez tous vos produits",
      icon: <Table2 className="w-6 h-6" />
    },
    {
      title: "Visites virtuelles",
      description: "Parcourez des espaces en 360° ou en 3D temps réel",
      icon: <Eye className="w-6 h-6" />
    },
    {
      title: "Gamification",
      description: "Quizz, jeux, animations pour engager vos clients",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  const demoContent = [
    {
      title: "Mode Exploration",
      description: "Navigation intuitive dans votre catalogue produit",
      features: ["Zoom, rotation 360°", "Filtres intelligents", "Comparaison côte à côte"]
    },
    {
      title: "Mode Configuration",
      description: "Personnalisation en temps réel des produits",
      features: ["Choix couleurs/matériaux", "Ajout d'options", "Calcul prix instantané"]
    },
    {
      title: "Mode Présentation",
      description: "Présentation guidée par le vendeur",
      features: ["Annotations en direct", "Favoris et sélection", "Export PDF/Email"]
    }
  ];

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg shadow-xl py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:-translate-x-2 transition-transform" />
            <div className="flex items-center gap-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <span className="text-2xl font-medium tracking-tight" style={{ color: '#1f2937' }}>PROJECT</span>
              <span className="text-2xl font-light tracking-tight" style={{ color: '#72B0CC' }}>VIEW</span>
            </div>
          </Link>
          <a
            href="#contact"
            className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
          >
            Demander une démo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden" style={{ backgroundColor: '#f0f9ff' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.3)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(130, 188, 108, 0.25)' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-8 border border-[#72B0CC]/30">
                <Table2 className="w-4 h-4" style={{ color: '#72B0CC' }} />
                <span className="text-sm font-medium text-gray-800">Tables Tactiles</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Arrêtez de <span style={{ color: '#CF6E3F' }}>présenter</span>.<br />
                Faites <span style={{ color: '#72B0CC' }}>vivre</span>.
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
                Vos catalogues papier dorment dans un tiroir. Vos PowerPoint endorment vos clients. Il est temps de passer à l'interactivité qui engage, captive et convertit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#demo"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                >
                  Voir la démo interactive
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
                <a
                  href="#cases"
                  className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                >
                  Cas clients
                </a>
              </div>
            </div>

            <div className="relative animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="relative bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-8">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
                    <Table2 className="w-32 h-32 text-gray-400 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[32, 55, 75].map((size) => (
                      <button
                        key={size}
                        className="px-4 py-3 bg-gradient-to-r from-[#72B0CC]/10 to-[#82BC6C]/10 rounded-xl text-sm font-medium text-gray-700 hover:from-[#72B0CC]/20 hover:to-[#82BC6C]/20 transition-all duration-300 hover:scale-105"
                      >
                        {size}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              L'impact <span style={{ color: '#72B0CC' }}>mesurable</span> du tactile
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des chiffres qui parlent mieux que n'importe quel argument commercial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#72B0CC]/30 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {benefit.stat}
                </div>
                <div className="text-lg font-bold text-gray-900 mb-2">{benefit.label}</div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(130, 188, 108, 0.15)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Applications <span style={{ color: '#72B0CC' }}>illimitées</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une table tactile, des centaines de possibilités
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {app.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-[#72B0CC] transition-colors">
                  {app.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {app.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Modes */}
      <section id="demo" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Trois <span style={{ color: '#CF6E3F' }}>modes</span> d'utilisation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De l'autonomie totale à la présentation guidée
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {demoContent.map((mode, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105 ${
                  activeDemo === index ? 'border-[#72B0CC] shadow-2xl' : 'border-gray-200 hover:border-[#72B0CC]/30'
                }`}
                style={{ animationDelay: `${0.1 * index}s` }}
                onClick={() => setActiveDemo(index)}
              >
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-4">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {mode.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {mode.description}
                </p>
                <ul className="space-y-3">
                  {mode.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="cases" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cas d'<span style={{ color: '#CF6E3F' }}>usage</span> terrain
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comment nos clients transforment leur expérience client
            </p>
          </div>

          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="flex-shrink-0 lg:w-80">
                      <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${useCase.color} text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        {useCase.icon}
                      </div>
                      <h3 className="text-3xl font-medium mb-2 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {useCase.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">{useCase.subtitle}</p>

                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
                        <div className="text-sm font-bold text-red-600 mb-2">AVANT</div>
                        <div className="text-sm text-gray-700 mb-4">{useCase.metrics.before}</div>
                        <div className="text-sm font-bold text-[#82BC6C] mb-2">APRÈS</div>
                        <div className="text-sm text-gray-700">{useCase.metrics.after}</div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Les défis
                        </h4>
                        <ul className="space-y-2">
                          {useCase.challenges.map((challenge, i) => (
                            <li key={i} className="text-gray-600 pl-4 border-l-2 border-red-200">
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-l-4 border-[#82BC6C] pl-6 py-4 bg-green-50/50 rounded-r-xl">
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Check className="w-5 h-5 text-[#82BC6C]" />
                          La solution tactile
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {useCase.solution}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#82BC6C]" />
                          Résultats mesurés
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {useCase.results.map((result, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm">{result}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Spécifications <span style={{ color: '#72B0CC' }}>techniques</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Du hardware pro au software sur-mesure
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {technicalSpecs.map((spec, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#72B0CC]/30 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-900">{spec.label}</span>
                  <span className="text-gray-600 text-right flex-1 ml-4">{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Table2 className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer<br />votre expérience client ?
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Testez une table tactile dans votre showroom pendant 15 jours. Sans engagement. Installation et formation incluses. Vous verrez la différence dans les yeux de vos clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              Essai gratuit 15 jours
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Installation offerte · Formation incluse · Support 7j/7
          </p>
        </div>
      </section>
    </div>
  );
};

export default TablesTactiles;
