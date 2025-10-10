import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Monitor, Tv, Table2, Compass, Bot, Sparkles, Zap, Eye, Radio, Users, Presentation } from 'lucide-react';
import Chatbot from './Chatbot';

const ProjectviewWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const [logoColor, setLogoColor] = useState('#72B0CC');
  const [sliderPositions, setSliderPositions] = useState({
    0: 50, 1: 50, 2: 50, 3: 50
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSections, setVisibleSections] = useState({});
  const [counters, setCounters] = useState({
    engagement: 0,
    timesSaved: 0,
    conversions: 0,
    projects: 0,
    satisfaction: 0,
    years: 0
  });

  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logo color animation
  useEffect(() => {
    const colors = ['#72B0CC', '#CF6E3F', '#82BC6C'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % colors.length;
      setLogoColor(colors[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Counter animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && counters.engagement === 0) {
            animateCounter('engagement', 340, 1500);
            animateCounter('timesSaved', 73, 1500);
            animateCounter('conversions', 2.5, 1500);
            animateCounter('projects', 500, 2000);
            animateCounter('satisfaction', 98, 1500);
            animateCounter('years', 15, 1000);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [counters]);

  const animateCounter = (key, target, duration) => {
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCounters((prev) => ({ ...prev, [key]: target }));
        clearInterval(timer);
      } else {
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }
    }, duration / steps);
  };

  const handleSliderChange = (index, value) => {
    setSliderPositions(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const offers = [
    {
      icon: <Radio className="w-16 h-16" />,
      title: "Affichage Dynamique / Interactif",
      hook: "Votre espace communique-t-il vraiment avec vos clients ?",
      pain: "Dans un monde saturé d'écrans, votre message reste invisible. Les supports statiques ne captent plus l'attention, ils la perdent. Pendant ce temps, vos produits phares passent inaperçus.",
      solution: "L'impact visuel qui capte et engage",
      benefit: "Écrans publicitaires animés qui captent le regard, systèmes NFC pour mettre en avant vos produits d'un simple geste, contenus actualisables en temps réel. Transformez chaque point de contact en expérience mémorable.",
      stats: "+340% d'engagement client",
      color: "from-[#CF6E3F] to-[#72B0CC]",
      gradient: "bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10",
      beforeVideo: "URL_VIDEO_AFFICHAGE_STATIQUE.mp4",
      afterVideo: "URL_VIDEO_AFFICHAGE_DYNAMIQUE.mp4",
      beforeLabel: "Affichage traditionnel : supports papier figés, informations obsolètes",
      afterLabel: "Avec Projectview : écrans dynamiques, NFC interactif, engagement maximal",
      link: "/solutions/affichage-dynamique"
    },
    {
      icon: <Users className="w-16 h-16" />,
      title: "Solutions de Collaboration",
      hook: "Et si vos réunions devenaient enfin productives ?",
      pain: "Chaque minute perdue en connexion est une opportunité manquée. Câbles incompatibles, partages d'écran compliqués, visioconférences chaotiques. Vos équipes méritent mieux.",
      solution: "La collaboration sans friction",
      benefit: "Écrans visio tout-en-un prêts à l'emploi, systèmes de partage d'écran sans fil ultra-simplifiés. Connectez-vous en un geste, partagez instantanément, collaborez naturellement. La technologie qui suit votre rythme.",
      stats: "73% de temps gagné en réunion",
      color: "from-[#72B0CC] to-[#82BC6C]",
      gradient: "bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10",
      beforeVideo: "URL_VIDEO_REUNION_CHAOTIQUE.mp4",
      afterVideo: "URL_VIDEO_COLLABORATION_FLUIDE.mp4",
      beforeLabel: "Réunion classique : câbles, difficultés techniques, temps perdu",
      afterLabel: "Avec Projectview : visio intégrée, partage sans fil, collaboration fluide",
      link: "/solutions/collaboration"
    },
    {
      icon: <Presentation className="w-16 h-16" />,
      title: "Solutions de Présentation Innovante",
      hook: "Arrêtez de présenter. Faites vivre l'expérience.",
      pain: "Vos clients hochent la tête pendant que vous parlez, mais ne se projettent pas. Les catalogues restent fermés, les plans 2D créent le doute, les PowerPoint endorment. Résultat : hésitations et modifications coûteuses.",
      solution: "L'immersion qui convertit et convainc",
      benefit: "Écrans tactiles en showroom pour explorer vos produits, tables tactiles pour configurer en temps réel, VR pour visiter des espaces avant construction. Vos clients ne regardent plus, ils expérimentent. La différence entre voir et vouloir.",
      stats: "89% de mémorisation • -67% modifications",
      color: "from-[#82BC6C] to-[#CF6E3F]",
      gradient: "bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10",
      beforeVideo: "URL_VIDEO_PRESENTATION_CLASSIQUE.mp4",
      afterVideo: "URL_VIDEO_PRESENTATION_IMMERSIVE.mp4",
      beforeLabel: "Présentation passive : catalogues papier, plans 2D, clients spectateurs",
      afterLabel: "Avec Projectview : écrans tactiles, tables interactives, VR immersive",
      link: "/solutions/presentation-innovante"
    },
    {
      icon: <Bot className="w-16 h-16" />,
      title: "Assistant IA Personnalisé",
      hook: "Votre expert disponible 24/7, pour chaque client",
      pain: "Vos équipes répondent aux mêmes questions, cherchent les mêmes infos, perdent un temps précieux. Pendant ce temps, des opportunités s'évaporent et vos clients attendent.",
      solution: "L'intelligence qui libère votre temps",
      benefit: "Réponses instantanées, recommandations personnalisées, processus automatisés. Votre IA connaît vos produits, comprend vos clients, ne dort jamais. Libérez vos équipes pour ce qui compte vraiment : la relation humaine.",
      stats: "10h gagnées par semaine",
      color: "from-[#72B0CC] to-[#82BC6C]",
      gradient: "bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10",
      beforeVideo: "URL_VIDEO_TRAVAIL_MANUEL.mp4",
      afterVideo: "URL_VIDEO_ASSISTANT_IA.mp4",
      beforeLabel: "Travail traditionnel : recherches manuelles, questions répétitives",
      afterLabel: "Avec Projectview : IA intelligente, réponses instantanées, automatisation",
      link: "/solutions/assistant-ia"
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
      <section ref={heroRef} id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#f0f9ff' }}>
        {/* Animated background elements with parallax */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float transition-transform duration-300"
            style={{
              backgroundColor: 'rgba(114, 176, 204, 0.3)',
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed transition-transform duration-500"
            style={{
              backgroundColor: 'rgba(207, 110, 63, 0.25)',
              transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-float-slow transition-transform duration-700"
            style={{
              backgroundColor: 'rgba(130, 188, 108, 0.3)',
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
            }}
          ></div>
          <div
            className="absolute top-10 right-1/3 w-64 h-64 rounded-full blur-2xl animate-float transition-transform duration-400"
            style={{
              backgroundColor: 'rgba(114, 176, 204, 0.2)',
              transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)`
            }}
          ></div>
          <div
            className="absolute bottom-10 left-1/3 w-64 h-64 rounded-full blur-2xl animate-float-delayed transition-transform duration-600"
            style={{
              backgroundColor: 'rgba(207, 110, 63, 0.2)',
              transform: `translate(${-mousePosition.x * 1.2}px, ${-mousePosition.y * 1.2}px)`
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left" data-animate id="hero-content">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-8 border border-[#72B0CC]/30 animate-fade-in-up">
                <Sparkles className="w-4 h-4 animate-pulse" style={{ color: '#72B0CC' }} />
                <span className="text-sm font-medium text-gray-800">La nouvelle ère de l'expérience client</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-medium mb-6 leading-tight animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif', animationDelay: '0.2s' }}>
                La <span style={{ color: '#72B0CC' }} className="inline-block hover:scale-110 transition-transform duration-300">technologie</span><br />
                au service de<br />
                l'<span style={{ color: '#CF6E3F' }} className="inline-block hover:scale-110 transition-transform duration-300">émotion</span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                Chaque interaction compte. Chaque espace raconte une histoire. Transformons ensemble vos lieux en expériences inoubliables.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <a
                  href="#offres"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 animate-pulse-glow"
                >
                  Découvrez comment
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
                <a
                  href="#mission"
                  className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border-2 border-gray-200"
                  style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
                >
                  Notre expertise
                </a>
              </div>
            </div>

            <div className="relative mx-auto md:mx-0 max-w-md" ref={statsRef}>
              <div className="relative animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-3xl transform rotate-3 opacity-30 blur-xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] rounded-3xl transform -rotate-2 opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:rotate-0 transition-all duration-500 border-2 border-[#72B0CC]/20 hover:border-[#72B0CC]/40">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 rounded-xl border border-[#72B0CC]/30 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                      <div className="p-3 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">+{counters.engagement}%</div>
                        <div className="text-sm text-gray-600">Engagement client</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#CF6E3F]/20 to-[#72B0CC]/20 rounded-xl border border-[#CF6E3F]/30 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                      <div className="p-3 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{counters.timesSaved}%</div>
                        <div className="text-sm text-gray-600">Temps gagné</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#82BC6C]/20 to-[#CF6E3F]/20 rounded-xl border border-[#82BC6C]/30 hover:scale-105 transition-transform duration-300 cursor-pointer group">
                      <div className="p-3 bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{counters.conversions}x</div>
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
      <section id="mission" className="py-32 bg-white relative overflow-hidden" data-animate>
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: 'linear-gradient(to left, rgba(114, 176, 204, 0.08), rgba(130, 188, 108, 0.04), transparent)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(207, 110, 63, 0.12)' }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-2xl animate-float-delayed" style={{ backgroundColor: 'rgba(130, 188, 108, 0.12)' }}></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 px-6 py-3 rounded-full mb-8 border-2 border-[#72B0CC]/30 animate-scale-in">
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#72B0CC' }}>Notre mission</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-8 leading-tight animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif', animationDelay: '0.2s' }}>
              Nous ne vendons pas de la <span style={{ color: '#72B0CC' }} className="inline-block hover:scale-110 transition-transform duration-300">technologie</span>.<br />
              Nous créons des <span style={{ color: '#CF6E3F' }} className="inline-block hover:scale-110 transition-transform duration-300">émotions</span>.
            </h2>

            <p className="text-xl text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Chaque showroom devrait faire briller les yeux. Chaque réunion devrait déborder d'idées. Chaque projet devrait susciter l'enthousiasme dès le premier jour.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-16 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Nous accompagnons les professionnels de l'aménagement, de la construction et du retail dans une transformation simple mais radicale : faire de leurs espaces des lieux où la technologie disparaît au profit de l'expérience pure.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 rounded-2xl border-2 border-[#72B0CC]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.5s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2 group-hover:scale-125 transition-transform duration-300">{counters.projects}+</div>
                <div className="text-sm text-gray-700 font-medium">Espaces transformés</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 rounded-2xl border-2 border-[#CF6E3F]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.6s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2 group-hover:scale-125 transition-transform duration-300">{counters.satisfaction}%</div>
                <div className="text-sm text-gray-700 font-medium">Clients satisfaits</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 rounded-2xl border-2 border-[#82BC6C]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.7s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2 group-hover:scale-125 transition-transform duration-300">{counters.years}+</div>
                <div className="text-sm text-gray-700 font-medium">Années d'expertise</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 rounded-2xl border-2 border-[#72B0CC]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.8s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] mb-2 group-hover:scale-125 transition-transform duration-300">24/7</div>
                <div className="text-sm text-gray-700 font-medium">Support dédié</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section - Complete Redesign */}
      <section id="offres" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }} data-animate>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(207, 110, 63, 0.15)' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-float-slow" style={{ backgroundColor: 'rgba(130, 188, 108, 0.15)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white shadow-lg px-6 py-3 rounded-full mb-6 hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer animate-bounce-subtle">
              <Sparkles className="w-5 h-5 text-[#72B0CC] animate-pulse" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Nos solutions</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-6 animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Quatre façons de <span style={{ color: '#72B0CC' }} className="inline-block hover:scale-110 transition-transform duration-300">révolutionner</span><br />
              votre expérience client
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Des technologies qui disparaissent pour laisser place à l'essentiel : l'émotion, l'engagement, la conversion.
            </p>
          </div>

          <div className="space-y-8">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up ${
                  activeOffer === index ? 'ring-4 ring-[#72B0CC]/20 scale-105' : ''
                }`}
                style={{ animationDelay: `${0.1 * index}s` }}
                onMouseEnter={() => setActiveOffer(index)}
                onMouseLeave={() => setActiveOffer(null)}
              >
                <div className={`absolute inset-0 ${offer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative z-10 p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    {/* Icon & Title */}
                    <div className="flex-shrink-0 lg:w-80">
                      <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${offer.color} text-white mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                        {offer.icon}
                      </div>
                      <h3 className="text-3xl font-medium mb-3 group-hover:text-[#72B0CC] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {offer.title}
                      </h3>
                      <div className={`inline-block px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${offer.color} group-hover:scale-110 transition-transform duration-300 shadow-lg animate-pulse`}>
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

                      <Link
                        to={offer.link}
                        className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 relative overflow-hidden"
                      >
                        <span className="relative z-10">En savoir plus</span>
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#82BC6C] to-[#72B0CC] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-32 bg-white relative overflow-hidden" data-animate>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(114, 176, 204, 0.08)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(130, 188, 108, 0.08)' }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/20 to-[#82BC6C]/20 px-6 py-3 rounded-full mb-8 border-2 border-[#72B0CC]/30 hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer animate-bounce-subtle">
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: '#72B0CC' }}>Notre Blog</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-6 animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Découvrez nos <span style={{ color: '#72B0CC' }} className="inline-block hover:scale-110 transition-transform duration-300">réalisations</span><br />
              et nos <span style={{ color: '#CF6E3F' }} className="inline-block hover:scale-110 transition-transform duration-300">expertises</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Des success stories inspirantes et des articles pour transformer votre expérience client
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 - Case Study */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="h-48 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Monitor className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: '#72B0CC' }}>
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
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="h-48 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Compass className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
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
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="h-48 bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
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

                <Link to="/article/moderniser-showroom" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#82BC6C' }}>
                  Lire l'article
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

            {/* Article 4 - Case Study */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="h-48 bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tv className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
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
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="h-48 bg-gradient-to-br from-[#CF6E3F] to-[#82BC6C] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
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
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="h-48 bg-gradient-to-br from-[#82BC6C] to-[#72B0CC] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
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
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-10 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 relative overflow-hidden animate-pulse-glow"
            >
              <span className="relative z-10">Voir tous les articles</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-32 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] animate-shimmer" style={{ backgroundSize: '400% 400%' }}></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à créer des expériences<br />qui marquent les esprits ?
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discutons de votre projet. Sans engagement, sans jargon technique. Juste une conversation sur ce que vous voulez accomplir et comment nous pouvons y arriver ensemble.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Demander une démo personnalisée</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
            <a
              href="tel:+33000000000"
              className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Appelez-nous maintenant
            </a>
          </div>

          <p className="mt-8 text-sm opacity-75 animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
