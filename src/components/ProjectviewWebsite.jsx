import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Monitor, Tv, Table2, Compass, Bot, Sparkles, Zap, Eye } from 'lucide-react';
import Chatbot from './Chatbot';

const ProjectviewWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const [logoColor, setLogoColor] = useState('#72B0CC');
  const [sliderPositions, setSliderPositions] = useState({
    0: 50, 1: 50, 2: 50, 3: 50, 4: 50
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const colors = ['#72B0CC', '#CF6E3F', '#82BC6C'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % colors.length;
      setLogoColor(colors[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSliderChange = (index, value) => {
    setSliderPositions(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const offers = [
    {
      icon: <Monitor className="w-16 h-16" />,
      title: "Écrans Collaboratifs",
      hook: "Et si vos réunions devenaient enfin productives ?",
      pain: "Chaque minute perdue en connexion est une opportunité manquée. Vos équipes méritent mieux qu'un tableau blanc et des câbles incompatibles.",
      solution: "La collaboration sans friction",
      benefit: "Connectez-vous en un geste, partagez instantanément, co-créez naturellement. Vos idées méritent une technologie qui suit votre rythme, pas l'inverse.",
      stats: "73% de temps gagné en réunion",
      color: "from-[#72B0CC] to-[#82BC6C]",
      gradient: "bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10",
      beforeVideo: "URL_VIDEO_REUNION_ANARCHIQUE.mp4",
      afterVideo: "URL_VIDEO_REUNION_MODERNE.mp4",
      beforeLabel: "Réunion classique : câbles, connexions difficiles, temps perdu",
      afterLabel: "Avec Projectview : connexion instantanée, collaboration fluide"
    },
    {
      icon: <Tv className="w-16 h-16" />,
      title: "Affichage Dynamique",
      hook: "Votre showroom dort-il quand vos clients passent ?",
      pain: "Dans un monde saturé d'écrans, votre message reste invisible. Vos supports statiques ne captent plus l'attention, ils la perdent.",
      solution: "L'impact visuel qui marque les esprits",
      benefit: "Animez vos messages, captez les regards, actualisez en temps réel depuis n'importe où. Faites de chaque écran un ambassadeur actif de votre marque.",
      stats: "+340% d'engagement client",
      color: "from-[#CF6E3F] to-[#72B0CC]",
      gradient: "bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10",
      beforeVideo: "URL_VIDEO_SHOWROOM_STATIQUE.mp4",
      afterVideo: "URL_VIDEO_SHOWROOM_DYNAMIQUE.mp4",
      beforeLabel: "Showroom traditionnel : supports papier, informations figées",
      afterLabel: "Avec Projectview : écrans animés, contenus captivants"
    },
    {
      icon: <Table2 className="w-16 h-16" />,
      title: "Tables Tactiles",
      hook: "Arrêtez de présenter. Faites vivre.",
      pain: "Votre client hoche la tête pendant que vous parlez, mais ne se projette pas. Les PowerPoint endorment, les catalogues restent fermés.",
      solution: "L'expérience qui convertit",
      benefit: "Vos clients touchent, manipulent, personnalisent en direct. Ils ne regardent plus votre produit, ils le configurent. La différence entre voir et vouloir.",
      stats: "89% de mémorisation",
      color: "from-[#72B0CC] to-[#82BC6C]",
      gradient: "bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10",
      beforeVideo: "URL_VIDEO_PRESENTATION_CLASSIQUE.mp4",
      afterVideo: "URL_VIDEO_TABLE_TACTILE.mp4",
      beforeLabel: "Présentation passive : catalogues papier, client spectateur",
      afterLabel: "Avec Projectview : interaction tactile, exploration active"
    },
    {
      icon: <Compass className="w-16 h-16" />,
      title: "Bureau d'Étude VR",
      hook: "Vendez le projet avant même de le construire",
      pain: "Les plans 2D créent le doute. Les rendus 3D restent abstraits. Vos clients valident... puis changent d'avis en chantier. Chaque modification coûte cher.",
      solution: "La validation totale avant le premier coup de pioche",
      benefit: "Vos clients marchent dans leur futur espace, testent les volumes, ajustent les détails. Zéro surprise, zéro conflit, zéro retard. Juste la certitude du résultat.",
      stats: "-67% de modifications",
      color: "from-[#CF6E3F] to-[#72B0CC]",
      gradient: "bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10",
      beforeVideo: "URL_VIDEO_PLANS_2D.mp4",
      afterVideo: "URL_VIDEO_VISITE_VR.mp4",
      beforeLabel: "Méthode classique : plans 2D, difficulté de projection",
      afterLabel: "Avec Projectview : immersion VR totale, validation certaine"
    },
    {
      icon: <Bot className="w-16 h-16" />,
      title: "Assistant IA Personnalisé",
      hook: "Votre expert disponible 24/7, pour chaque client",
      pain: "Vos équipes répondent aux mêmes questions, cherchent les mêmes infos, perdent un temps précieux. Pendant ce temps, des opportunités s'évaporent.",
      solution: "L'intelligence qui libère votre temps",
      benefit: "Réponses instantanées, recommandations personnalisées, processus automatisés. Votre IA connaît vos produits, comprend vos clients, ne dort jamais.",
      stats: "10h gagnées par semaine",
      color: "from-[#82BC6C] to-[#CF6E3F]",
      gradient: "bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10",
      beforeVideo: "URL_VIDEO_TRAVAIL_MANUEL.mp4",
      afterVideo: "URL_VIDEO_ASSISTANT_IA.mp4",
      beforeLabel: "Travail traditionnel : recherches manuelles, temps perdu",
      afterLabel: "Avec Projectview : IA intelligente, réponses instantanées"
    }
  ];

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="text-2xl font-medium tracking-tight" style={{ color: '#1f2937' }}>PROJECT</span>
            <span className="text-2xl font-light tracking-tight transition-colors duration-1000" style={{ color: logoColor }}>VIEW</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#accueil" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Accueil</a>
            <a href="#offres" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Solutions</a>
            <a href="#mission" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Expertise</a>
            <a href="#blog" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Blog</a>
            <a href="#contact" className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium">
              Contact
            </a>
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
              <a href="#accueil" className="block hover:text-[#72B0CC] font-medium">Accueil</a>
              <a href="#offres" className="block hover:text-[#72B0CC] font-medium">Solutions</a>
              <a href="#mission" className="block hover:text-[#72B0CC] font-medium">Expertise</a>
              <a href="#blog" className="block hover:text-[#72B0CC] font-medium">Blog</a>
              <a href="#contact" className="block text-center bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Ultra Modern */}
      <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#f0f9ff' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.3)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(207, 110, 63, 0.25)' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-float-slow" style={{ backgroundColor: 'rgba(130, 188, 108, 0.3)' }}></div>
          <div className="absolute top-10 right-1/3 w-64 h-64 rounded-full blur-2xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.2)' }}></div>
          <div className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full blur-2xl animate-float-delayed" style={{ backgroundColor: 'rgba(207, 110, 63, 0.2)' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-8 border border-[#72B0CC]/30">
                <Sparkles className="w-4 h-4" style={{ color: '#72B0CC' }} />
                <span className="text-sm font-medium text-gray-800">La nouvelle ère de l'expérience client</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                La <span style={{ color: '#72B0CC' }}>technologie</span><br />
                au service de<br />
                l'<span style={{ color: '#CF6E3F' }}>émotion</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
                Chaque interaction compte. Chaque espace raconte une histoire. Transformons ensemble vos lieux en expériences inoubliables.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="#offres"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Découvrez comment
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#mission"
                  className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-200"
                  style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                >
                  Notre expertise
                </a>
              </div>
            </div>

            <div className="relative mx-auto md:mx-0 max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-3xl transform rotate-3 opacity-30 blur-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] rounded-3xl transform -rotate-2 opacity-20 blur-2xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-1 border-2 border-[#72B0CC]/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 rounded-xl border border-[#72B0CC]/30">
                      <div className="p-3 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-lg">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">+340%</div>
                        <div className="text-sm text-gray-600">Engagement client</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#CF6E3F]/20 to-[#72B0CC]/20 rounded-xl border border-[#CF6E3F]/30">
                      <div className="p-3 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] rounded-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">73%</div>
                        <div className="text-sm text-gray-600">Temps gagné</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#82BC6C]/20 to-[#CF6E3F]/20 rounded-xl border border-[#82BC6C]/30">
                      <div className="p-3 bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">2.5x</div>
                        <div className="text-sm text-gray-600">Plus de conversions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Redesigned */}
      <section id="mission" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: 'linear-gradient(to left, rgba(114, 176, 204, 0.08), rgba(130, 188, 108, 0.04), transparent)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(207, 110, 63, 0.12)' }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(130, 188, 108, 0.12)' }}></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 px-6 py-3 rounded-full mb-8 border-2 border-[#72B0CC]/30">
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#72B0CC' }}>Notre mission</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-8 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Nous ne vendons pas de la <span style={{ color: '#72B0CC' }}>technologie</span>.<br />
              Nous créons des <span style={{ color: '#CF6E3F' }}>émotions</span>.
            </h2>

            <p className="text-xl text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
              Chaque showroom devrait faire briller les yeux. Chaque réunion devrait déborder d'idées. Chaque projet devrait susciter l'enthousiasme dès le premier jour.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-16 max-w-3xl mx-auto">
              Nous accompagnons les professionnels de l'aménagement, de la construction et du retail dans une transformation simple mais radicale : faire de leurs espaces des lieux où la technologie disparaît au profit de l'expérience pure.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 rounded-2xl border-2 border-[#72B0CC]/20">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">500+</div>
                <div className="text-sm text-gray-700 font-medium">Espaces transformés</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 rounded-2xl border-2 border-[#CF6E3F]/20">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">98%</div>
                <div className="text-sm text-gray-700 font-medium">Clients satisfaits</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 rounded-2xl border-2 border-[#82BC6C]/20">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">15+</div>
                <div className="text-sm text-gray-700 font-medium">Années d'expertise</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 rounded-2xl border-2 border-[#72B0CC]/20">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] mb-2">24/7</div>
                <div className="text-sm text-gray-700 font-medium">Support dédié</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section - Complete Redesign */}
      <section id="offres" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(207, 110, 63, 0.15)' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(130, 188, 108, 0.15)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white shadow-lg px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-[#72B0CC]" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Nos solutions</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Cinq façons de <span style={{ color: '#72B0CC' }}>révolutionner</span><br />
              votre expérience client
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des technologies qui disparaissent pour laisser place à l'essentiel : l'émotion, l'engagement, la conversion.
            </p>
          </div>

          <div className="space-y-8">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  activeOffer === index ? 'ring-4 ring-[#72B0CC]/20' : ''
                }`}
                onMouseEnter={() => setActiveOffer(index)}
                onMouseLeave={() => setActiveOffer(null)}
              >
                <div className={`absolute inset-0 ${offer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative z-10 p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    {/* Icon & Title */}
                    <div className="flex-shrink-0 lg:w-80">
                      <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${offer.color} text-white mb-4 transform group-hover:scale-110 transition-transform duration-500`}>
                        {offer.icon}
                      </div>
                      <h3 className="text-3xl font-medium mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {offer.title}
                      </h3>
                      <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${offer.color}`}>
                        {offer.stats}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                          {offer.hook}
                        </h4>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          {offer.pain}
                        </p>
                      </div>

                      <div className="border-l-4 border-[#82BC6C] pl-6 py-4 bg-green-50/50 rounded-r-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-[#82BC6C]"></div>
                          <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#82BC6C' }}>
                            {offer.solution}
                          </span>
                        </div>
                        <p className="text-lg text-gray-800 font-medium leading-relaxed">
                          {offer.benefit}
                        </p>
                      </div>

                      <button className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                        Découvrir cette solution
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      {/* Before/After Video Slider */}
                      <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative h-[500px] bg-gray-900 select-none">
                          {/* Before Video (Left side) */}
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - sliderPositions[index]}% 0 0)` }}
                          >
                            {offer.beforeVideo ? (
                              <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              >
                                <source src={offer.beforeVideo} type="video/mp4" />
                              </video>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                <div className="text-center p-8">
                                  <div className="text-white/50 text-sm mb-4">Vidéo "AVANT" à venir</div>
                                  <p className="text-white/70 text-sm">
                                    Salle de réunion anarchique :<br />
                                    Câbles emmêlés, difficultés de connexion,<br />
                                    temps perdu, frustration
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Before Label */}
                            <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl">
                              AVANT
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
                              <p className="text-sm font-medium leading-relaxed">
                                {offer.beforeLabel}
                              </p>
                            </div>
                          </div>

                          {/* After Video (Right side) */}
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `inset(0 0 0 ${sliderPositions[index]}%)` }}
                          >
                            {offer.afterVideo ? (
                              <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                              >
                                <source src={offer.afterVideo} type="video/mp4" />
                              </video>
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${offer.color} flex items-center justify-center`}>
                                <div className="text-center p-8">
                                  <div className="text-white/90 text-sm mb-4">Vidéo "APRÈS" à venir</div>
                                  <p className="text-white font-medium text-sm">
                                    Salle de réunion moderne :<br />
                                    Écran collaboratif élégant, connexion instantanée,<br />
                                    espace zen et lumineux, équipe productive
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* After Label */}
                            <div className="absolute top-6 right-6 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl" style={{ backgroundColor: '#82BC6C' }}>
                              APRÈS
                            </div>

                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg">
                              <p className="text-sm font-bold text-gray-900 leading-relaxed">
                                {offer.afterLabel}
                              </p>
                            </div>
                          </div>

                          {/* Slider Handle */}
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-30"
                            style={{ left: `${sliderPositions[index]}%` }}
                          >
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-200">
                              <div className="flex gap-0.5">
                                <ChevronRight className="w-5 h-5 text-gray-700 transform rotate-180" />
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                              </div>
                            </div>
                          </div>

                          {/* Slider Input */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPositions[index]}
                            onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                            aria-label="Faites glisser pour comparer avant et après"
                          />

                          {/* Instruction Label */}
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
                            <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-xl">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18m-4 0l4-4m-4 4l4 4" />
                              </svg>
                              Glissez pour comparer
                            </div>
                          </div>
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

      {/* Blog Section */}
      <section id="blog" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(114, 176, 204, 0.08)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(130, 188, 108, 0.08)' }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 px-6 py-3 rounded-full mb-8 border-2 border-[#72B0CC]/30">
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#72B0CC' }}>Notre Blog</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Découvrez nos <span style={{ color: '#72B0CC' }}>réalisations</span><br />
              et nos <span style={{ color: '#CF6E3F' }}>expertises</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des success stories inspirantes et des articles pour transformer votre expérience client
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 - Case Study */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Monitor className="w-20 h-20 text-white opacity-30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#72B0CC' }}>
                    Installation Client
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Showroom Automobile : De la brochure papier à l'expérience immersive
                </h3>

                <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="text-xs font-bold text-red-600 uppercase mb-2">Situation avant</div>
                  <p className="text-sm text-gray-700">
                    Catalogues papier coûteux, informations rapidement obsolètes, clients qui repartent sans documentation
                  </p>
                </div>

                <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4" style={{ borderColor: '#82BC6C' }}>
                  <div className="text-xs font-bold uppercase mb-2" style={{ color: '#82BC6C' }}>Après Projectview</div>
                  <p className="text-sm text-gray-700">
                    Tables tactiles interactives, configuration en temps réel, +250% d'engagement client
                  </p>
                </div>

                <Link to="/article/showroom-automobile" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#72B0CC' }}>
                  Lire l'étude de cas
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Article 2 - Case Study */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="w-20 h-20 text-white opacity-30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#CF6E3F' }}>
                    Installation Client
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#CF6E3F] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Promoteur Immobilier : Vendre sur plan avec la VR
                </h3>

                <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="text-xs font-bold text-red-600 uppercase mb-2">Situation avant</div>
                  <p className="text-sm text-gray-700">
                    Difficultés de projection, 40% de modifications en cours de chantier, délais rallongés
                  </p>
                </div>

                <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4" style={{ borderColor: '#82BC6C' }}>
                  <div className="text-xs font-bold uppercase mb-2" style={{ color: '#82BC6C' }}>Après Projectview</div>
                  <p className="text-sm text-gray-700">
                    Visite VR immersive, validation avant construction, -67% de modifications, clients confiants
                  </p>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#CF6E3F' }}>
                  Lire l'étude de cas
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Article 3 - Article informatif */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 text-white opacity-30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#82BC6C' }}>
                    Article Informatif
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#82BC6C] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  5 signes qu'il est temps de moderniser votre showroom
                </h3>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Vos clients comparent en ligne avant de venir. Votre espace physique doit offrir une expérience qu'ils ne peuvent pas avoir sur internet. Découvrez les signaux d'alerte.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Expérience client</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Digital</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Showroom</span>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#82BC6C' }}>
                  Lire l'article
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Article 4 - Case Study */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tv className="w-20 h-20 text-white opacity-30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#72B0CC' }}>
                    Installation Client
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Enseigne Retail : L'affichage dynamique qui booste les ventes
                </h3>

                <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="text-xs font-bold text-red-600 uppercase mb-2">Situation avant</div>
                  <p className="text-sm text-gray-700">
                    Affiches statiques, promotions non actualisées, clients qui passent sans s'arrêter
                  </p>
                </div>

                <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4" style={{ borderColor: '#82BC6C' }}>
                  <div className="text-xs font-bold uppercase mb-2" style={{ color: '#82BC6C' }}>Après Projectview</div>
                  <p className="text-sm text-gray-700">
                    Contenus animés attractifs, mise à jour en temps réel, +340% d'attention captée
                  </p>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#72B0CC' }}>
                  Lire l'étude de cas
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Article 5 - Article informatif */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#CF6E3F] to-[#82BC6C] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="w-20 h-20 text-white opacity-30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#CF6E3F' }}>
                    Article Informatif
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#CF6E3F] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ROI des technologies immersives : Ce que disent les chiffres
                </h3>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Tables tactiles, VR, affichage dynamique : au-delà de l'effet "wow", quel est le retour sur investissement réel ? Analyse basée sur nos 500+ installations.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">ROI</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Innovation</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Business</span>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#CF6E3F' }}>
                  Lire l'article
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>

            {/* Article 6 - Case Study */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-[#82BC6C] to-[#72B0CC] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="w-20 h-20 text-white opacity-30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#82BC6C' }}>
                    Installation Client
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#82BC6C] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Cabinet d'Architecture : L'IA au service de la conception
                </h3>

                <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="text-xs font-bold text-red-600 uppercase mb-2">Situation avant</div>
                  <p className="text-sm text-gray-700">
                    Recherches documentaires chronophages, temps perdu sur des questions récurrentes
                  </p>
                </div>

                <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4" style={{ borderColor: '#82BC6C' }}>
                  <div className="text-xs font-bold uppercase mb-2" style={{ color: '#82BC6C' }}>Après Projectview</div>
                  <p className="text-sm text-gray-700">
                    Assistant IA formé sur leurs projets, 10h/semaine gagnées, focus sur la création
                  </p>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#82BC6C' }}>
                  Lire l'étude de cas
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-10 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Voir tous les articles
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-8 animate-pulse" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à créer des expériences<br />qui marquent les esprits ?
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Discutons de votre projet. Sans engagement, sans jargon technique. Juste une conversation sur ce que vous voulez accomplir et comment nous pouvons y arriver ensemble.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              Demander une démo personnalisée
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="tel:+33000000000"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] transition-all duration-300"
            >
              Appelez-nous maintenant
            </a>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Réponse sous 24h · Démo gratuite · Sans engagement
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#72B0CC' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#82BC6C' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#CF6E3F' }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 pb-16 border-b border-white/10">
            {/* Company Info */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-1 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="text-3xl font-medium tracking-tight text-white">PROJECT</span>
                <span className="text-3xl font-light tracking-tight transition-colors duration-1000" style={{ color: logoColor }}>VIEW</span>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                La technologie au service de l'émotion. Transformons ensemble vos espaces en expériences mémorables qui captivent, engagent et convertissent.
              </p>

              {/* Social proof */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">500+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Projets</div>
                </div>
                <div className="w-px h-12" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">98%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Satisfaction</div>
                </div>
                <div className="w-px h-12" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">15+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Ans</div>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="lg:col-span-2">
              <h4 className="font-bold mb-6 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Solutions</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Écrans Collaboratifs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Affichage Dynamique
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Tables Tactiles
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Bureau d'Étude VR
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Assistant IA
                  </a>
                </li>
              </ul>
            </div>

            {/* Entreprise */}
            <div className="lg:col-span-2">
              <h4 className="font-bold mb-6 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Entreprise</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#mission" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Blog & Réalisations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Actualités
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Carrières
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="font-bold mb-6 text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>Contactez-nous</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Email</div>
                  <a href="mailto:contact@projectview.fr" className="text-white hover:underline text-sm" style={{ color: '#72B0CC' }}>
                    contact@projectview.fr
                  </a>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Téléphone</div>
                  <a href="tel:+33000000000" className="text-white hover:underline text-sm">
                    +33 X XX XX XX XX
                  </a>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Localisation</div>
                  <span className="text-white text-sm">Lyon, France</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Projectview. Tous droits réservés.
            </div>

            <div className="flex items-center gap-6 flex-wrap justify-center">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Mentions légales</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ProjectviewWebsite;
