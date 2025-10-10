import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, ChevronRight, Check, Zap, Eye, Users, TrendingUp, Shield, Clock, Home, Building2, Ruler, Palette } from 'lucide-react';

const BureauEtudeVR = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeCase, setActiveCase] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Immersion totale",
      description: "Vos clients marchent littéralement dans leur futur espace avant même le premier coup de pioche",
      color: "from-[#72B0CC] to-[#82BC6C]"
    },
    {
      icon: <Ruler className="w-8 h-8" />,
      title: "Précision millimétrique",
      description: "Visualisation à l'échelle 1:1 avec tous les détails techniques intégrés",
      color: "from-[#CF6E3F] to-[#72B0CC]"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Personnalisation en temps réel",
      description: "Changez les matériaux, couleurs et aménagements instantanément en VR",
      color: "from-[#82BC6C] to-[#CF6E3F]"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration multi-utilisateurs",
      description: "Plusieurs personnes peuvent explorer le projet ensemble, même à distance",
      color: "from-[#72B0CC] to-[#CF6E3F]"
    }
  ];

  const benefits = [
    {
      stat: "-67%",
      label: "de modifications",
      description: "en cours de chantier grâce à la validation préalable en VR"
    },
    {
      stat: "+89%",
      label: "de satisfaction",
      description: "client grâce à la projection immersive dans le projet"
    },
    {
      stat: "3 semaines",
      label: "gagnées",
      description: "en moyenne sur les délais de validation et de décision"
    },
    {
      stat: "100%",
      label: "de confiance",
      description: "zéro surprise à la livraison, résultat conforme aux attentes"
    }
  ];

  const useCases = [
    {
      icon: <Home className="w-12 h-12" />,
      title: "Promotion Immobilière",
      subtitle: "Vendez sur plan avec certitude",
      challenges: [
        "Difficulté pour les acheteurs de se projeter sur plans 2D",
        "40% de modifications après signature compromettent les marges",
        "Délais rallongés et conflits dus aux incompréhensions"
      ],
      solution: "Notre solution VR permet aux futurs propriétaires de visiter leur appartement avant construction, de tester différentes configurations, et de valider chaque détail. Résultat : zéro surprise, zéro conflit.",
      results: [
        "67% de modifications en moins",
        "Cycle de vente réduit de 30%",
        "Satisfaction client à 96%",
        "ROI atteint en 8 mois"
      ],
      color: "from-[#72B0CC] to-[#82BC6C]"
    },
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Architecture & Design",
      subtitle: "Présentez vos concepts comme jamais",
      challenges: [
        "Rendus 3D qui restent abstraits pour les clients",
        "Va-et-vient interminables sur les modifications",
        "Difficulté à faire comprendre les volumes et l'ambiance"
      ],
      solution: "Faites vivre vos projets à vos clients. Ils comprennent instantanément vos intentions, testent la lumière naturelle selon les heures, valident l'ergonomie des espaces.",
      results: [
        "45% de temps gagné en validation",
        "Taux de conversion +35%",
        "Projets plus ambitieux validés",
        "Portfolio différenciant"
      ],
      color: "from-[#CF6E3F] to-[#72B0CC]"
    },
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Aménagement Commercial",
      subtitle: "Optimisez vos espaces retail",
      challenges: [
        "Layouts testés seulement après travaux",
        "Coûts énormes des erreurs d'aménagement",
        "Flux clients non optimisés"
      ],
      solution: "Testez vos aménagements en VR avant travaux. Simulez les flux, optimisez les parcours clients, validez l'impact visuel de vos PLV.",
      results: [
        "80% d'économies sur les tests",
        "Flux clients optimisé dès J1",
        "+25% de CA au m²",
        "Déploiement multi-sites sécurisé"
      ],
      color: "from-[#82BC6C] to-[#CF6E3F]"
    }
  ];

  const technicalSpecs = [
    { label: "Casques VR", value: "Meta Quest 3, HTC Vive Pro, Pico 4" },
    { label: "Résolution", value: "Jusqu'à 4K par œil" },
    { label: "Compatibilité", value: "Revit, SketchUp, ArchiCAD, 3DS Max" },
    { label: "Multi-utilisateurs", value: "Jusqu'à 8 personnes simultanément" },
    { label: "Streaming", value: "Présentation à distance en temps réel" },
    { label: "Exports", value: "Photos 360°, vidéos immersives, rapports" }
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(207, 110, 63, 0.3)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(114, 176, 204, 0.25)' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#CF6E3F]/20 to-[#72B0CC]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-8 border border-[#CF6E3F]/30">
                <Compass className="w-4 h-4" style={{ color: '#CF6E3F' }} />
                <span className="text-sm font-medium text-gray-800">Bureau d'Étude VR</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Vendez le <span style={{ color: '#CF6E3F' }}>projet</span><br />
                avant même de<br />
                le <span style={{ color: '#72B0CC' }}>construire</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
                Fini les plans 2D incompréhensibles. Fini les modifications coûteuses en cours de chantier. Avec la VR, vos clients valident leur projet les yeux fermés... ou plutôt, le casque sur les yeux.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#demo"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                >
                  Essayer la démo VR
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
                <a
                  href="#cases"
                  className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                >
                  Voir les cas clients
                </a>
              </div>
            </div>

            <div className="relative animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
              <div className="relative bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-8">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-6">
                    <Compass className="w-32 h-32 text-gray-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-4">Visualisation VR interactive disponible</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#CF6E3F]/20 to-[#72B0CC]/20 rounded-full text-xs font-medium text-gray-700">Meta Quest</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-[#CF6E3F]/20 to-[#72B0CC]/20 rounded-full text-xs font-medium text-gray-700">HTC Vive</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-[#CF6E3F]/20 to-[#72B0CC]/20 rounded-full text-xs font-medium text-gray-700">Pico 4</span>
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
              Des <span style={{ color: '#CF6E3F' }}>résultats</span> mesurables
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La VR n'est pas qu'un gadget. C'est un investissement qui se mesure en temps gagné, en conflits évités, et en clients satisfaits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#CF6E3F]/30 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2 group-hover:scale-110 transition-transform duration-300">
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
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(207, 110, 63, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Pourquoi la <span style={{ color: '#72B0CC' }}>VR</span> change tout
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La différence entre regarder des plans et marcher dans son futur espace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#CF6E3F] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="cases" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cas d'<span style={{ color: '#CF6E3F' }}>usage</span> concrets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comment nos clients utilisent la VR pour transformer leur business
            </p>
          </div>

          <div className="space-y-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    <div className="flex-shrink-0 lg:w-80">
                      <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${useCase.color} text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        {useCase.icon}
                      </div>
                      <h3 className="text-3xl font-medium mb-2 group-hover:text-[#CF6E3F] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {useCase.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-4">{useCase.subtitle}</p>
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
                          La solution VR
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {useCase.solution}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#82BC6C]" />
                          Résultats obtenus
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
      <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Spécifications <span style={{ color: '#72B0CC' }}>techniques</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une technologie de pointe au service de vos projets
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {technicalSpecs.map((spec, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#72B0CC]/30 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
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
      <section id="demo" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#CF6E3F] via-[#72B0CC] to-[#82BC6C]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Compass className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à révolutionner<br />vos présentations de projets ?
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Testez gratuitement notre solution VR pendant 30 jours. Sans engagement, sans installation complexe. Juste l'expérience qui va transformer votre façon de vendre.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#CF6E3F] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              Demander une démo VR gratuite
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#CF6E3F] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Installation incluse · Formation offerte · Support dédié
          </p>
        </div>
      </section>
    </div>
  );
};

export default BureauEtudeVR;
