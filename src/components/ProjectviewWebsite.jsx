import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Monitor, Tv, Table2, Compass, Bot, Sparkles, Zap, Eye, Radio, Users, Presentation, Gamepad2, RefreshCcw, Trophy, Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

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
  const [gameRound, setGameRound] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeOptions, setChallengeOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [streak, setStreak] = useState(0);
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const canvasRef = useRef(null);

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

  // Hero counter animations - trigger on page load
  useEffect(() => {
    // Animate hero stats immediately on mount
    const timer = setTimeout(() => {
      animateCounter('engagement', 340, 1500);
      animateCounter('timesSaved', 73, 1500);
      animateCounter('conversions', 2.5, 1500);
    }, 500); // Small delay for smoother experience

    return () => clearTimeout(timer);
  }, []);

  // Mission section counter animations - trigger on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && counters.projects === 0) {
            animateCounter('projects', 500, 2000);
            animateCounter('satisfaction', 98, 1500);
            animateCounter('years', 8, 1000);
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

  const trustBrands = [
    {
      name: "Derichebourg",
      logo: "/logos/Derichebourg logo .png",
      sector: "Services & Industrie",
      gradient: "from-[#72B0CC] to-[#82BC6C]",
      solution: "Solutions collaboratives pour la coordination des équipes terrain",
      impact: "Efficacité opérationnelle accrue de 45%"
    },
    {
      name: "SOA Architectes",
      logo: "/logos/SOA logo.png",
      sector: "Architecture",
      gradient: "from-[#CF6E3F] to-[#72B0CC]",
      solution: "Présentations immersives VR pour les projets architecturaux",
      impact: "Validation client 2x plus rapide"
    },
    {
      name: "Econergie France",
      logo: "/logos/econergie france.png",
      sector: "Énergie & Transition",
      gradient: "from-[#72B0CC] to-[#CF6E3F]",
      solution: "Showroom énergie avec démonstrations interactives",
      impact: "+85% d'engagement prospects"
    },
    {
      name: "Gemme Concept",
      logo: "/logos/gemme concept.jpeg",
      sector: "Design & Innovation",
      gradient: "from-[#CF6E3F] to-[#82BC6C]",
      solution: "Espaces de conception collaborative",
      impact: "Créativité et productivité boostées"
    },
    {
      name: "GP Energies",
      logo: "/logos/gp-energies.png",
      sector: "Énergie",
      gradient: "from-[#72B0CC] to-[#82BC6C]",
      solution: "Outils de présentation pour solutions énergétiques",
      impact: "Taux de conversion +60%"
    },
    {
      name: "Groupe ITP",
      logo: "/logos/logo grouoe itp.jpeg",
      sector: "Ingénierie",
      gradient: "from-[#72B0CC] to-[#82BC6C]",
      solution: "War room technique pour coordination projets",
      impact: "Délais réduits de 30%"
    },
    {
      name: "Murgier",
      logo: "/logos/murgier logo.png",
      sector: "BTP & Construction",
      gradient: "from-[#72B0CC] to-[#CF6E3F]",
      solution: "Présentations chantier en réalité virtuelle",
      impact: "Validation projets accélérée"
    },
    {
      name: "Xavier Laurent",
      logo: "/logos/xavier laurent rond.jpg",
      sector: "Conseil & Stratégie",
      gradient: "from-[#CF6E3F] to-[#82BC6C]",
      solution: "Espaces de conseil augmentés",
      impact: "Impact conseil maximisé"
    },
    {
      name: "Xerox",
      logo: "/logos/xerox.png",
      sector: "Technologie & Services",
      gradient: "from-[#72B0CC] to-[#82BC6C]",
      solution: "Solutions d'affichage dynamique multi-sites",
      impact: "Communication unifiée à l'échelle"
    }
  ];

  const activeBrand = trustBrands[activeBrandIndex] || null;


  const challengePool = [
    {
      brand: "Leroy Merlin",
      clue: "Cette enseigne veut transformer ses corners rénovation en expériences interactives.",
      answer: "Solutions de Présentation Innovante",
      gradient: "from-[#72B0CC] to-[#82BC6C]"
    },
    {
      brand: "Accor Live Limitless",
      clue: "Dans leurs hôtels, chaque lobby doit devenir un hub digital inspirant et vivant.",
      answer: "Affichage Dynamique / Interactif",
      gradient: "from-[#CF6E3F] to-[#72B0CC]"
    },
    {
      brand: "Décathlon",
      clue: "Les coachs veulent co-créer des parcours clients avec les équipes en magasin.",
      answer: "Solutions de Collaboration",
      gradient: "from-[#82BC6C] to-[#CF6E3F]"
    },
    {
      brand: "Renault",
      clue: "Le constructeur souhaite configurer ses modèles en immersion totale avant l'essai.",
      answer: "Solutions de Présentation Innovante",
      gradient: "from-[#72B0CC] to-[#CF6E3F]"
    },
    {
      brand: "Galeries Lafayette",
      clue: "Une vitrine doit pouvoir se réinventer en temps réel selon les collections du moment.",
      answer: "Affichage Dynamique / Interactif",
      gradient: "from-[#CF6E3F] to-[#82BC6C]"
    },
    {
      brand: "La Poste",
      clue: "Le réseau logistique cherche un assistant disponible pour guider clients et conseillers.",
      answer: "Assistant IA Personnalisé",
      gradient: "from-[#72B0CC] to-[#82BC6C]"
    },
    {
      brand: "Bouygues Immobilier",
      clue: "Présenter un programme sur plan ne suffit plus, il faut le vivre avant signature.",
      answer: "Solutions de Présentation Innovante",
      gradient: "from-[#82BC6C] to-[#72B0CC]"
    },
    {
      brand: "EDF",
      clue: "Des équipes réparties partout doivent piloter des projets complexes en direct.",
      answer: "Solutions de Collaboration",
      gradient: "from-[#CF6E3F] to-[#72B0CC]"
    }
  ];

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const setupGameRound = () => {
    const nextChallenge = challengePool[Math.floor(Math.random() * challengePool.length)];
    const alternativeAnswers = [
      ...new Set(
        challengePool
          .map((challenge) => challenge.answer)
          .filter((answer) => answer !== nextChallenge.answer)
      )
    ];
    const options = shuffleArray([
      nextChallenge.answer,
      ...shuffleArray(alternativeAnswers).slice(0, 2)
    ]);

    setCurrentChallenge(nextChallenge);
    setChallengeOptions(options);
    setSelectedOption(null);
    setGameStatus(null);
  };

  useEffect(() => {
    setupGameRound();
  }, [gameRound]);

  const handleGuess = (option) => {
    if (!currentChallenge || gameStatus === 'correct') {
      return;
    }

    setSelectedOption(option);

    if (option === currentChallenge.answer) {
      setGameStatus('correct');
      setStreak((prev) => prev + 1);
      setTimeout(() => {
        setGameRound((prev) => prev + 1);
      }, 1200);
    } else {
      setGameStatus('wrong');
      setStreak(0);
    }
  };

  const handleSkip = () => {
    setGameStatus(null);
    setSelectedOption(null);
    setStreak(0);
    setGameRound((prev) => prev + 1);
  };

  const offers = [
    {
      icon: <Radio className="w-16 h-16" />,
      title: "Affichage Dynamique & Interactif",
      hook: "Vos affiches statiques ? Ignorées. Vos produits phares ? Inaperçus.",
      pain: "Dans un océan de sollicitations visuelles, votre communication se noie.",
      solution: "L'affichage qui capte et engage",
      benefitList: [
        "💡 Dynamique : Contenus animés, actualisés en temps réel, programmés selon votre audience",
        "✋ Interactif : Déposez un objet, déclenchez une expérience. Touchez l'écran, accédez à l'info",
        "🏪 Showrooms retail : Vos produits se présentent eux-mêmes",
        "📋 Communication interne : Informations légales accessibles d'un geste"
      ],
      impact: "340% d'engagement en plus. Chaque point de contact devient mémorable.",
      stats: "+340% d'engagement",
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
      benefitList: [
        "📹 Écrans visio tout-en-un prêts à l'emploi",
        "📡 Systèmes de partage d'écran sans fil ultra-simplifiés",
        "⚡ Connectez-vous en un geste, partagez instantanément",
        "🤝 Collaborez naturellement, la technologie suit votre rythme"
      ],
      impact: "73% de temps gagné en réunion. Concentrez-vous sur l'essentiel.",
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
      hook: "Arrêtez de présenter, Donnez vie à vos projets",
      pain: "Vos clients hochent la tête pendant que vous parlez, mais ne se projettent pas. Les catalogues restent fermés, les plans 2D créent le doute, les PowerPoint endorment. Résultat : hésitations et modifications coûteuses.",
      solution: "L'immersion qui convertit et convainc",
      benefitList: [
        "📱 Écrans tactiles en showroom pour explorer vos produits",
        "🤝 Table tactile de négociation pour co-créer avec vos clients",
        "🥽 VR pour visiter des espaces avant construction",
        "✨ Vos clients ne regardent plus, ils vivent leur projet"
      ],
      impact: "89% de mémorisation • 67% de modifications en moins. La différence entre voir et vouloir.",
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
      hook: "Une prise en charge immédiate disponible 24/7, pour chaque utilisateur",
      pain: "Vos équipes répondent aux mêmes questions, cherchent les mêmes infos, perdent un temps précieux. Pendant ce temps, des opportunités s'évaporent et vos clients attendent.",
      solution: "L'intelligence qui libère votre temps et développe votre business",
      benefitList: [
        "⚡ Réponses instantanées, 24/7 sans interruption",
        "🎯 Recommandations personnalisées selon chaque client",
        "🔄 Processus automatisés qui libèrent vos équipes",
        "🧠 Votre IA connaît vos produits, comprend vos clients, ne dort jamais"
      ],
      impact: "10h gagnées par semaine. Libérez vos équipes pour la relation humaine.",
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
          <div className="flex items-center">
            <Logo size="lg" />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#accueil" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Accueil</a>
            <a href="#offres" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Solutions</a>
            <a href="#mission" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Expertise</a>
            <a href="#blog" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Blog</a>
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
            >
              Contact
            </button>
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
              <button
                onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                className="block w-full text-center bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Parallax Layers */}
      <section ref={heroRef} id="accueil" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        {/* Subtle gradient background overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC]/[0.25] via-transparent via-40% to-[#82BC6C]/[0.25] blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#CF6E3F]/[0.15] via-60% to-transparent blur-2xl" />
        </div>

        {/* Parallax background layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Layer 1 - Slowest */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)`
            }}
          >
            <div className="absolute top-[10%] right-[15%] w-64 h-64 rounded-full bg-[#72B0CC] opacity-[0.08] blur-3xl" />
            <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-[#82BC6C] opacity-[0.08] blur-3xl" />
          </div>

          {/* Layer 2 - Medium */}
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -4}px, ${mousePosition.y * -4}px)`
            }}
          >
            <div className="absolute top-[30%] left-[20%] w-48 h-48 rounded-full bg-[#CF6E3F] opacity-[0.12] blur-2xl" />
            <div className="absolute bottom-[30%] right-[25%] w-56 h-56 rounded-full bg-[#72B0CC] opacity-[0.1] blur-2xl" />
          </div>

          {/* Layer 3 - Fastest - Geometric shapes */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px) rotate(${mousePosition.x * 2}deg)`
            }}
          >
            {/* Hexagons */}
            <div className="absolute top-[15%] right-[30%] w-24 h-24 opacity-[0.05]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: '#72B0CC' }} />
            <div className="absolute bottom-[25%] left-[35%] w-32 h-32 opacity-[0.04]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: '#82BC6C' }} />
            <div className="absolute top-[45%] right-[20%] w-20 h-20 opacity-[0.06]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: '#CF6E3F' }} />
          </div>

          {/* Floating lines with parallax */}
          <div
            className="absolute inset-0 transition-transform duration-400 ease-out"
            style={{
              transform: `translate(${mousePosition.x * -6}px, ${mousePosition.y * -6}px)`
            }}
          >
            <svg className="absolute top-[20%] left-[15%] w-64 h-2 opacity-10" preserveAspectRatio="none">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#72B0CC" strokeWidth="2" />
            </svg>
            <svg className="absolute bottom-[35%] right-[20%] w-48 h-2 opacity-10" preserveAspectRatio="none">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#CF6E3F" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32">
          {/* Split layout with offset */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left column - Main content */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div
                className="inline-block mb-8 transition-transform duration-300"
                style={{
                  transform: `translateX(${mousePosition.x * 2}px)`
                }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/10 to-[#82BC6C]/10 border border-[#72B0CC]/20 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#72B0CC] animate-pulse" />
                  <span className="text-sm font-semibold text-gray-800">Innovation · Expérience · Impact</span>
                </div>
              </div>

              {/* Main title with character reveal */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.15]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <div className="overflow-hidden">
                  <div
                    className="transition-transform duration-500"
                    style={{
                      transform: `translateY(${mousePosition.y * -1}px)`
                    }}
                  >
                    <span className="block text-gray-900">La technologie</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div
                    className="transition-transform duration-500"
                    style={{
                      transform: `translateY(${mousePosition.y * -2}px)`
                    }}
                  >
                    <span className="block text-gray-900">au service de</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div
                    className="transition-transform duration-500"
                    style={{
                      transform: `translateY(${mousePosition.y * -3}px)`
                    }}
                  >
                    <span className="block hero-emotion-animation">
                      l'émotion
                    </span>
                  </div>
                </div>
              </h1>

              <style jsx>{`
                .hero-emotion-animation {
                  background: linear-gradient(
                    120deg,
                    #72B0CC 0%,
                    #72B0CC 33%,
                    #CF6E3F 33%,
                    #CF6E3F 66%,
                    #82BC6C 66%,
                    #82BC6C 100%
                  );
                  background-size: 300% 100%;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  animation: emotion-gradient-shift 6s ease-in-out infinite;
                }

                @keyframes emotion-gradient-shift {
                  0%, 100% {
                    background-position: 0% 50%;
                  }
                  33% {
                    background-position: 50% 50%;
                  }
                  66% {
                    background-position: 100% 50%;
                  }
                }
              `}</style>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
                Nous transformons vos espaces physiques en environnements interactifs qui captivent, engagent et convertissent.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#offres"
                  className="group relative inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold overflow-hidden transition-all duration-300 hover:pr-10"
                >
                  <span className="relative z-10">Découvrir nos solutions</span>
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-6" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
                <button
                  onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                  className="inline-flex items-center gap-3 bg-white border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  Prendre contact
                </button>
              </div>
            </div>

            {/* Right column - Floating stats cards with tilt effect */}
            <div className="lg:col-span-5 relative" ref={statsRef}>
              <div className="space-y-6">
                {[
                  {
                    icon: <Eye className="w-8 h-8" />,
                    value: counters.engagement,
                    suffix: '%',
                    prefix: '+',
                    label: 'Engagement client',
                    gradient: 'from-[#72B0CC] to-[#82BC6C]',
                    delay: 0
                  },
                  {
                    icon: <Zap className="w-8 h-8" />,
                    value: counters.timesSaved,
                    suffix: '%',
                    prefix: '',
                    label: 'Temps gagné',
                    gradient: 'from-[#CF6E3F] to-[#72B0CC]',
                    delay: 0.1
                  },
                  {
                    icon: <Sparkles className="w-8 h-8" />,
                    value: counters.conversions,
                    suffix: 'x',
                    prefix: '',
                    label: 'Plus de conversions',
                    gradient: 'from-[#82BC6C] to-[#CF6E3F]',
                    delay: 0.2
                  }
                ].map((stat, index) => {
                  // Calculate tilt based on mouse position
                  const tiltX = (mousePosition.y - 0) * (index === 1 ? 3 : -3);
                  const tiltY = (mousePosition.x - 0) * (index === 0 ? -3 : 3);

                  return (
                    <div
                      key={index}
                      className="group relative"
                      style={{
                        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${index * 10}px)`,
                        transition: 'transform 0.3s ease-out',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Card */}
                      <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        {/* Gradient accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-t-2xl`} />

                        {/* Content */}
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg`}>
                            {stat.icon}
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                              {stat.prefix}{stat.value}{stat.suffix}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {stat.label}
                            </div>
                          </div>
                        </div>

                        {/* Hover glow */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Decorative element */}
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#72B0CC]/20 to-[#82BC6C]/20 blur-2xl -z-10 transition-transform duration-700"
                style={{
                  transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 animate-bounce-subtle">
          <span className="text-xs font-medium uppercase tracking-wider">Découvrir</span>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </div>
      </section>

      {/* Mission Section - Redesigned */}
      <section ref={statsRef} id="mission" className="py-32 bg-white relative overflow-hidden" data-animate>
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
                <div className="text-sm text-gray-700 font-medium">Expérience clients</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 rounded-2xl border-2 border-[#CF6E3F]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.6s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2 group-hover:scale-125 transition-transform duration-300">{counters.satisfaction}%</div>
                <div className="text-sm text-gray-700 font-medium">Satisfaction client</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 rounded-2xl border-2 border-[#82BC6C]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.7s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2 group-hover:scale-125 transition-transform duration-300">{counters.years}+</div>
                <div className="text-sm text-gray-700 font-medium">Années d'expertise</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 rounded-2xl border-2 border-[#72B0CC]/20 hover:scale-110 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.8s' }}>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] mb-2 group-hover:scale-125 transition-transform duration-300">24/7</div>
                <div className="text-sm text-gray-700 font-medium">Prise en charge via IA</div>
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
              Des technologies qui disparaissent pour laisser place à l'essentiel : l'émotion, l'engagement, l'échange.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up ${
                  activeOffer === index ? 'ring-4 ring-[#72B0CC]/20' : ''
                }`}
                style={{ animationDelay: `${0.1 * index}s` }}
                onMouseEnter={() => setActiveOffer(index)}
                onMouseLeave={() => setActiveOffer(null)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${offer.color} text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      {offer.icon}
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${offer.color} shadow-md`}>
                      {offer.stats}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[#72B0CC] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {offer.title}
                  </h3>

                  {/* Hook */}
                  <p className="text-lg font-semibold text-gray-900 mb-4 leading-snug">
                    {offer.hook}
                  </p>

                  {/* Pain point */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {offer.pain}
                  </p>

                  {/* Solution Section */}
                  <div className="bg-gradient-to-r from-[#72B0CC]/5 to-[#82BC6C]/5 rounded-xl p-4 mb-4 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#72B0CC]" />
                      <span className="text-sm font-bold uppercase tracking-wide text-[#72B0CC]">
                        {offer.solution}
                      </span>
                    </div>

                    {/* Benefits list */}
                    <div className="space-y-2">
                      {offer.benefitList && offer.benefitList.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[#82BC6C] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Impact highlight */}
                    {offer.impact && (
                      <div className="mt-4 pt-3 border-t border-[#82BC6C]/20">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-[#82BC6C]" />
                          <span className="text-sm font-semibold text-gray-800">{offer.impact}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={offer.link}
                    className="group/btn inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 relative overflow-hidden w-full"
                  >
                    <span className="relative z-10">En savoir plus</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#82BC6C] to-[#72B0CC] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="confiance" className="py-32 bg-gradient-to-b from-white via-[#f6f9fb] to-white relative overflow-hidden" data-animate>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#72B0CC]/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-20 right-0 w-96 h-96 bg-[#CF6E3F]/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-[#82BC6C]/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-6 py-3 rounded-full mb-8 border-2 border-[#72B0CC]/20 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <Sparkles className="w-5 h-5 text-[#72B0CC]" />
              <span className="text-sm font-bold uppercase tracking-wide text-gray-700">Ils nous font confiance</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Des marques exigeantes <span style={{ color: '#72B0CC' }} className="inline-block hover:scale-110 transition-transform duration-300">sélectionnent</span><br />
              Projectview pour sublimer leurs expériences
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Retail, hôtellerie, industrie ou services : partout, nos dispositifs immersifs deviennent des moments mémorables.
            </p>
          </div>

          {/* Layout 2/3 - 1/3 */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Grille de logos - 2/3 largeur */}
            <div className="w-full lg:w-2/3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {trustBrands.map((brand, index) => (
                  <div
                    key={index}
                    className={`group relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                      activeBrandIndex === index ? 'ring-4 ring-[#72B0CC]/30 scale-105' : ''
                    }`}
                    onClick={() => setActiveBrandIndex(index)}
                    style={{
                      animation: `float ${4 + index * 0.2}s ease-in-out infinite`,
                      animationDelay: `${index * 0.1}s`,
                      animationDuration: `${4 + index * 0.2}s`
                    }}
                  >
                    <div className="aspect-video flex items-center justify-center p-3">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fiche d'information statique - 1/3 largeur */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
              {activeBrand && (
                <div className="bg-white/90 backdrop-blur-lg rounded-[32px] border border-white/60 shadow-[0_40px_80px_rgba(31,41,55,0.12)] p-8 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-3 bg-[#72B0CC]/10 text-[#1f2937] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide">
                      <Sparkles className="w-4 h-4 text-[#72B0CC]" />
                      Projet signature
                    </div>
                    <div className="font-semibold text-xs text-gray-500 uppercase tracking-widest">
                      {activeBrand.sector}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#72B0CC] mb-2">
                      {activeBrand.name}
                    </p>
                    <h3 className="text-2xl font-semibold text-gray-900 leading-snug" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {activeBrand.solution}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-[#72B0CC]/10 via-white to-[#CF6E3F]/10 border border-[#72B0CC]/15 p-5 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      Impact mesuré
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      <span className="font-semibold text-[#CF6E3F]">{activeBrand.impact}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-gray-500">
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#72B0CC]/10 text-[#1f2937]">
                      <Sparkles className="w-3 h-3 text-[#72B0CC]" />
                      Expérience immersive
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#CF6E3F]/10 text-[#1f2937]">
                      <Zap className="w-3 h-3 text-[#CF6E3F]" />
                      Engagement boosté
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#82BC6C]/10 text-[#1f2937]">
                      <Users className="w-3 h-3 text-[#82BC6C]" />
                      Adoption équipes
                    </span>
                  </div>
                </div>
              )}
            </div>
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
            {/* Article - Guide Réunions */}
            <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="h-48 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: '#72B0CC' }}>
                    Article Informatif
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Les 5 erreurs qui font perdre du temps en réunion
                </h3>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Départs chaotiques, objectifs flous, participants passifs : transformez vos réunions en leviers d’efficacité grâce à quelques bonnes pratiques et à ProjectView.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Collaboration</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Réunions</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">Productivité</span>
                </div>

                <Link to="/article/erreurs-reunion" className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#72B0CC' }}>
                  Lire l'article
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </article>

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
          </div>

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-10 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 relative overflow-hidden animate-pulse-glow"
            >
              <span className="relative z-10">Voir tous les articles</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-32 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] opacity-90"></div>
          <div
            className="absolute inset-0 opacity-70 mix-blend-screen animate-gradient-orbit"
            style={{
              background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.15) 0deg, rgba(255,255,255,0) 90deg, rgba(255,255,255,0.2) 180deg, rgba(255,255,255,0) 270deg, rgba(255,255,255,0.15) 360deg)'
            }}
          ></div>
          <div className="absolute -top-32 left-1/4 w-72 h-72 bg-gradient-to-br from-white/50 via-white/10 to-transparent rounded-full blur-3xl opacity-60 animate-orb-drift"></div>
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-gradient-to-br from-white/40 via-white/10 to-transparent rounded-full blur-[140px] opacity-70 animate-orb-drift-delayed"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 mix-blend-soft-light"></div>
        </div>
        <div className="absolute inset-0 bg-black/35"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-3xl md:text-5xl font-medium mb-6 leading-tight animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Et si vous n'étiez qu'à une conversation<br />de l'aboutissement de votre projet ?
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Notre IA est là pour vous accompagner peu importe votre secteur d'activité. Testez-la maintenant en cliquant en bas à droite.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Parler à notre IA maintenant</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <a
              href="tel:+33000000000"
              className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Appelez-nous maintenant
            </a>
          </div>

          <p className="mt-8 text-sm opacity-75 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Réponse <span className="line-through opacity-50">sous 24h</span> <span className="font-bold text-[#82BC6C] opacity-100 text-base">IMMÉDIATE</span> · Démo gratuite · Sans engagement
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
              <div className="flex items-center mb-6">
                <Logo size="lg" />
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                La technologie au service de l'émotion. Transformons ensemble vos espaces en expériences mémorables qui captivent, engagent et convertissent.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mb-8">
                <a
                  href="https://www.facebook.com/Team.ProjectView"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#72B0CC] flex items-center justify-center transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/company/projectview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#72B0CC] flex items-center justify-center transition-all duration-300 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.tiktok.com/@projectview_vr?_t=ZN-90aoz32J9R1&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#72B0CC] flex items-center justify-center transition-all duration-300 group"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/projectview_vr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#72B0CC] flex items-center justify-center transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.youtube.com/@projectview3892"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#72B0CC] flex items-center justify-center transition-all duration-300 group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              </div>

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
                  <div className="text-2xl font-bold text-white mb-1">8+</div>
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
                  <button
                    onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    Contact
                  </button>
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
                  <a href="tel:+33777300658" className="text-white hover:underline text-sm">
                    0 777 300 658
                  </a>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Localisation</div>
                  <div className="text-white text-sm">
                    <div>18 rue Jules Ferry</div>
                    <div>69360, St Symphorien d'Ozon</div>
                  </div>
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


