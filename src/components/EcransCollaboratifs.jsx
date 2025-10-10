import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Monitor, ChevronRight, Check, Zap, Eye, Users, TrendingUp, Shield, Clock, Wifi, Share2, Video, Presentation, Layers, FileText, Building } from 'lucide-react';

const EcransCollaboratifs = () => {
  const [activePain, setActivePain] = useState(0);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const painPoints = [
    {
      title: "Les câbles qui ne fonctionnent jamais",
      stat: "15 min",
      description: "perdues en moyenne au début de CHAQUE réunion"
    },
    {
      title: "\"Vous me voyez ? Vous m'entendez ?\"",
      stat: "23%",
      description: "du temps de réunion perdu en problèmes techniques"
    },
    {
      title: "Post-it et photos de tableau",
      stat: "67%",
      description: "des idées perdues après la réunion"
    }
  ];

  const features = [
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Connexion sans fil instantanée",
      description: "Un clic depuis votre PC, Mac, tablette ou smartphone. 5 secondes, pas 15 minutes.",
      benefit: "Commencez vos réunions à l'heure, enfin.",
      color: "from-[#72B0CC] to-[#82BC6C]"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Partage simultané multi-sources",
      description: "4 participants peuvent afficher leur écran en même temps. Comparez, confrontez, co-créez.",
      benefit: "Fini les \"attends je reprends le partage\"",
      color: "from-[#CF6E3F] to-[#72B0CC]"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Tableau blanc infini + annotations",
      description: "Dessinez, écrivez, annotez directement sur l'écran. Tout est sauvegardé automatiquement.",
      benefit: "Vos idées survivent à la réunion",
      color: "from-[#82BC6C] to-[#CF6E3F]"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Visio intégrée haute qualité",
      description: "Caméra 4K, micros directionnels, haut-parleurs premium. Teams, Zoom, Meet natifs.",
      benefit: "Une seule interface pour tout gérer",
      color: "from-[#72B0CC] to-[#CF6E3F]"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Export et partage instantané",
      description: "Envoyez le compte-rendu visuel par email ou cloud en un clic. QR code pour récupération mobile.",
      benefit: "Plus de photos floues de tableau blanc",
      color: "from-[#CF6E3F] to-[#82BC6C]"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité entreprise",
      description: "Connexion sécurisée, données chiffrées, compatible Active Directory et SSO.",
      benefit: "Votre DSI peut dormir tranquille",
      color: "from-[#82BC6C] to-[#72B0CC]"
    }
  ];

  const benefits = [
    {
      stat: "73%",
      label: "de temps gagné",
      description: "en connexion et démarrage de réunion",
      icon: <Clock className="w-6 h-6" />
    },
    {
      stat: "+85%",
      label: "de productivité",
      description: "mesurée par les équipes utilisatrices",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      stat: "12 min",
      label: "économisées",
      description: "par réunion en moyenne (études terrain)",
      icon: <Zap className="w-6 h-6" />
    },
    {
      stat: "100%",
      label: "des idées",
      description: "capturées, sauvegardées et partagées",
      icon: <Eye className="w-6 h-6" />
    }
  ];

  const useCases = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Équipes Commerciales",
      subtitle: "Présentations clients percutantes",
      challenges: [
        "Temps perdu à brancher le PC du client",
        "Présentations figées, pas d'interaction",
        "Impossible de co-créer avec le client en direct",
        "Compte-rendu fait de mémoire après la réunion"
      ],
      solution: "L'écran collaboratif transforme vos présentations en sessions de travail interactives. Le client partage ses documents, vous annotez ensemble les propositions, vous modifiez en temps réel. À la fin, tout est exporté automatiquement.",
      results: [
        "Taux de signature +47%",
        "Durée cycle de vente -30%",
        "Satisfaction client 9.2/10",
        "Zéro perte d'information"
      ],
      color: "from-[#72B0CC] to-[#82BC6C]",
      metrics: {
        before: "Taux de conversion : 23%",
        after: "Nouveau taux : 34%"
      },
      testimonial: {
        quote: "Nos clients sont bluffés. On ne fait plus des présentations, on co-construit les solutions avec eux en direct.",
        author: "Directeur Commercial, ESN 350 personnes"
      }
    },
    {
      icon: <Presentation className="w-12 h-12" />,
      title: "Équipes Créatives & Design",
      subtitle: "Brainstorming et revues de projet fluides",
      challenges: [
        "Chacun sur son écran, pas de vision partagée",
        "Difficile de comparer plusieurs versions",
        "Post-it qui se décollent et se perdent",
        "Impossibilité de garder trace des décisions"
      ],
      solution: "Affichez 4 maquettes simultanément, annotez en direct, votez avec des stickers numériques. Tout le process créatif est capturé. Les distants participent comme s'ils étaient dans la salle.",
      results: [
        "Cycle créatif réduit de 40%",
        "Validation client en 1 session",
        "100% de traçabilité des choix",
        "Équipes remote vraiment intégrées"
      ],
      color: "from-[#CF6E3F] to-[#72B0CC]",
      metrics: {
        before: "Itérations moyennes : 4.5",
        after: "Itérations moyennes : 2.3"
      },
      testimonial: {
        quote: "On a divisé par deux nos allers-retours. Les clients valident plus vite car ils voient tout, clairement.",
        author: "Lead Designer, Agence digitale"
      }
    },
    {
      icon: <Building className="w-12 h-12" />,
      title: "Directions & Comités",
      subtitle: "Réunions stratégiques efficaces",
      challenges: [
        "15 min perdues à chaque début de comité",
        "Difficultés à partager les dashboards",
        "Visio complexe pour les membres distants",
        "Décisions prises mais non documentées"
      ],
      solution: "Connexion en 5 secondes, dashboards partagés en grand format, visio HD intégrée, prise de notes collaborative sur l'écran. Compte-rendu visuel envoyé automatiquement à tous les participants.",
      results: [
        "Réunions commencées à l'heure (+95%)",
        "Durée comités réduite de 25%",
        "Décisions documentées 100%",
        "Satisfaction dirigeants +92%"
      ],
      color: "from-[#82BC6C] to-[#CF6E3F]",
      metrics: {
        before: "Réunion à l'heure : 45%",
        after: "Réunion à l'heure : 95%"
      },
      testimonial: {
        quote: "Plus de temps perdu en technique. On se concentre sur l'essentiel : prendre les bonnes décisions.",
        author: "DG, Groupe industriel"
      }
    }
  ];

  const technicalSpecs = [
    {
      category: "Écrans",
      specs: [
        { label: "Tailles disponibles", value: "55\", 65\", 75\", 86\" et 98\"" },
        { label: "Résolution", value: "4K Ultra HD (3840 x 2160)" },
        { label: "Technologie tactile", value: "Infrarouge 20 points ou capacitif" },
        { label: "Temps de réponse", value: "<8ms pour une fluidité parfaite" }
      ]
    },
    {
      category: "Connectivité",
      specs: [
        { label: "Sans fil", value: "AirPlay, Miracast, Chromecast natif" },
        { label: "Ports", value: "HDMI x3, USB-C, USB 3.0, Ethernet" },
        { label: "Protocoles", value: "Compatible tous OS (Win, Mac, iOS, Android)" },
        { label: "Réseau", value: "WiFi 6, Ethernet Gigabit" }
      ]
    },
    {
      category: "Audio/Vidéo",
      specs: [
        { label: "Caméra", value: "4K 120° avec suivi intelligent" },
        { label: "Microphones", value: "Array 8 micros avec réduction bruit" },
        { label: "Haut-parleurs", value: "2 x 15W stéréo" },
        { label: "Visio", value: "Teams, Zoom, Meet, WebEx certifiés" }
      ]
    },
    {
      category: "Logiciel",
      specs: [
        { label: "Tableau blanc", value: "Infini, multi-utilisateurs, cloud" },
        { label: "Compatibilité", value: "Office 365, Google Workspace, PDF" },
        { label: "Sécurité", value: "Chiffrement, SSO, Active Directory" },
        { label: "Mises à jour", value: "OTA automatiques, zéro maintenance" }
      ]
    }
  ];

  const comparisonItems = [
    {
      feature: "Démarrage réunion",
      classic: "15 min (câbles, drivers, connexion)",
      collaborative: "30 secondes (sans fil, automatique)",
      improvement: "-97%"
    },
    {
      feature: "Partage d'écran",
      classic: "1 personne à la fois",
      collaborative: "4 écrans simultanés",
      improvement: "x4"
    },
    {
      feature: "Capture d'idées",
      classic: "Photos floues de post-it",
      collaborative: "Tout sauvegardé en HD + export",
      improvement: "100%"
    },
    {
      feature: "Visio intégrée",
      classic: "PC + webcam + adaptateurs",
      collaborative: "Tout intégré, 1 clic",
      improvement: "Simplicité totale"
    },
    {
      feature: "Compte-rendu",
      classic: "Rédigé après, incomplet",
      collaborative: "Export auto, complet, visuel",
      improvement: "Instantané"
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
            Tester gratuitement
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
                <Monitor className="w-4 h-4" style={{ color: '#72B0CC' }} />
                <span className="text-sm font-medium text-gray-800">Écrans Collaboratifs</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Et si vos réunions<br />
                devenaient enfin<br />
                <span style={{ color: '#72B0CC' }}>productives</span> ?
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
                Chaque minute perdue en connexion est une opportunité manquée. Vos équipes méritent mieux qu'un tableau blanc et des câbles incompatibles.
              </p>

              {/* Pain Points Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {painPoints.map((pain, index) => (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur p-4 rounded-xl border-2 border-red-200 hover:border-red-400 hover:scale-105 transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setActivePain(index)}
                  >
                    <div className="text-3xl font-bold text-red-600 mb-1">{pain.stat}</div>
                    <div className="text-xs text-gray-700 leading-tight">{pain.description}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#demo"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                >
                  Essai gratuit 30 jours
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
                <a
                  href="#comparison"
                  className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                >
                  Voir la différence
                </a>
              </div>
            </div>

            <div className="relative animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="relative bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-8">
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
                    <Monitor className="w-32 h-32 text-white/30 animate-pulse" />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <div className="flex-1 h-16 bg-white/20 backdrop-blur rounded-lg"></div>
                      <div className="flex-1 h-16 bg-white/20 backdrop-blur rounded-lg"></div>
                      <div className="flex-1 h-16 bg-white/20 backdrop-blur rounded-lg"></div>
                      <div className="flex-1 h-16 bg-white/20 backdrop-blur rounded-lg"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Partage multi-sources</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-full"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] rounded-full"></div>
                      <div className="w-8 h-8 bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] rounded-full"></div>
                    </div>
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
              L'impact sur vos <span style={{ color: '#72B0CC' }}>réunions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des chiffres mesurés sur 500+ installations en entreprise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#72B0CC]/30 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {benefit.icon}
                </div>
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

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(130, 188, 108, 0.15)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              La <span style={{ color: '#72B0CC' }}>collaboration</span> sans friction
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connectez-vous en un geste, partagez instantanément, co-créez naturellement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${0.1 * index}s` }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-[#82BC6C] font-medium text-sm">
                  <Check className="w-5 h-5" />
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Avant / <span style={{ color: '#82BC6C' }}>Après</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La différence qui change tout au quotidien
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
              {/* Header */}
              <div className="grid grid-cols-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white p-6">
                <div className="font-bold"></div>
                <div className="font-bold text-center">Réunion classique</div>
                <div className="font-bold text-center">Écran collaboratif</div>
              </div>

              {/* Rows */}
              {comparisonItems.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 p-6 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-300`}
                >
                  <div className="font-bold text-gray-900">{item.feature}</div>
                  <div className="text-center text-gray-600 text-sm px-4">
                    <div className="inline-block px-3 py-2 bg-red-100 rounded-lg border border-red-200">
                      {item.classic}
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <div className="inline-block px-3 py-2 bg-green-100 rounded-lg border border-green-400 text-sm font-medium">
                      {item.collaborative}
                    </div>
                    <div className="text-xs text-[#82BC6C] font-bold mt-1">{item.improvement}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="cases" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cas d'<span style={{ color: '#CF6E3F' }}>usage</span> métiers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comment les équipes transforment leur façon de travailler
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

                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200 mb-6">
                        <div className="text-sm font-bold text-red-600 mb-2">AVANT</div>
                        <div className="text-sm text-gray-700 mb-4">{useCase.metrics.before}</div>
                        <div className="text-sm font-bold text-[#82BC6C] mb-2">APRÈS</div>
                        <div className="text-sm text-gray-700">{useCase.metrics.after}</div>
                      </div>

                      {/* Testimonial */}
                      <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-6 rounded-xl border-l-4 border-[#72B0CC]">
                        <p className="text-sm italic text-gray-700 mb-3">"{useCase.testimonial.quote}"</p>
                        <p className="text-xs text-gray-600 font-medium">— {useCase.testimonial.author}</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Les défis quotidiens
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
                          La transformation
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Spécifications <span style={{ color: '#72B0CC' }}>techniques</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Du hardware pro à l'expérience utilisateur fluide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {technicalSpecs.map((category, catIndex) => (
              <div
                key={catIndex}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#72B0CC]/30 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * catIndex}s` }}
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]"></div>
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-0">
                      <span className="font-medium text-gray-900 text-sm">{spec.label}</span>
                      <span className="text-gray-600 text-right flex-1 ml-4 text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Monitor className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Testez sans risque<br />pendant 30 jours
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Installation gratuite dans votre salle de réunion. Formation de vos équipes incluse. Si vous n'êtes pas conquis, on reprend l'écran. Mais ça n'arrive jamais.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              Commencer l'essai gratuit
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
            Installation offerte · Formation incluse · Support 7j/7 · Satisfait ou remboursé
          </p>
        </div>
      </section>
    </div>
  );
};

export default EcransCollaboratifs;
