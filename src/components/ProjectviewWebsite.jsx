import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight, Monitor, Tv, Table2, Compass, Bot, Sparkles, Zap, Eye, Radio, Users, Presentation, Gamepad2, RefreshCcw, Trophy } from 'lucide-react';
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

  const trustBrands = [
    {
      name: "Leroy Merlin",
      sector: "Retail & Showroom",
      initials: "LM",
      gradient: "from-[#72B0CC] to-[#82BC6C]",
      solution: "Tables tactiles & configurateurs VR pour les univers rénovation",
      impact: "+180% de conversion des visites en projets accompagnés"
    },
    {
      name: "Accor Live Limitless",
      sector: "Hospitality",
      initials: "ALL",
      gradient: "from-[#CF6E3F] to-[#72B0CC]",
      solution: "Parcours interactifs & signage dynamique dans les lobbies premium",
      impact: "+65% d'interactions qualifiées avec les conciergeries"
    },
    {
      name: "Décathlon",
      sector: "Sport & Expérience",
      initials: "DEC",
      gradient: "from-[#82BC6C] to-[#CF6E3F]",
      solution: "Studios collaboratifs pour co-créer des séances & équipements sur-mesure",
      impact: "Temps de préparation divisé par 3 pour les coachs"
    },
    {
      name: "Renault",
      sector: "Automobile",
      initials: "RN",
      gradient: "from-[#72B0CC] to-[#CF6E3F]",
      solution: "Configurateurs immersifs 3D & VR pour les centres d'essai",
      impact: "+220% d'engagement sur les finitions premium"
    },
    {
      name: "Galeries Lafayette",
      sector: "Retail Premium",
      initials: "GL",
      gradient: "from-[#CF6E3F] to-[#82BC6C]",
      solution: "Vitrines connectées pilotées en temps réel depuis le siège",
      impact: "Mise à jour à la volée de 80 vitrines en simultané"
    },
    {
      name: "La Poste",
      sector: "Service & Réseau",
      initials: "LP",
      gradient: "from-[#72B0CC] to-[#82BC6C]",
      solution: "Assistant IA qui guide agents & usagers sur les services clés",
      impact: "-40% de temps d'attente et NPS en forte hausse"
    },
    {
      name: "Bouygues Immobilier",
      sector: "Immobilier & VR",
      initials: "BI",
      gradient: "from-[#82BC6C] to-[#72B0CC]",
      solution: "Salles de vente immersives avec projection et maquettes digitales",
      impact: "Décisions accélérées, 2 signatures sur 3 dès la première visite"
    },
    {
      name: "EDF",
      sector: "Innovation & Industrie",
      initials: "EDF",
      gradient: "from-[#CF6E3F] to-[#72B0CC]",
      solution: "War room connectée pour coordonner les équipes terrains",
      impact: "-30% sur les délais de réponse aux incidents critiques"
    }
  ];

  const activeBrand = trustBrands[activeBrandIndex] || null;

  // Interactive Constellation with Drag & Drop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrame;
    let time = 0;
    let draggingIndexRef = null;
    let dragOffset = { x: 0, y: 0 };

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setCanvasSize();

    // Positions des logos en constellation (réparties de manière organique)
    const getRadius = () => {
      const width = canvas.offsetWidth;
      if (width < 640) return 100;
      if (width < 1024) return 140;
      return 180;
    };

    const brandPositions = trustBrands.map((_, index) => {
      const angle = (index / trustBrands.length) * Math.PI * 2;
      const baseRadius = getRadius();
      const radius = baseRadius + Math.sin(angle * 3) * (baseRadius * 0.28);
      return {
        x: canvas.offsetWidth / 2 + Math.cos(angle) * radius,
        y: canvas.offsetHeight / 2 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5, // Vélocité pour mouvement organique
        vy: (Math.random() - 0.5) * 0.5,
        pulseOffset: Math.random() * Math.PI * 2
      };
    });

    // Particules qui voyagent le long des connexions
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const from = Math.floor(Math.random() * trustBrands.length);
      let to = Math.floor(Math.random() * trustBrands.length);
      while (to === from) to = Math.floor(Math.random() * trustBrands.length);

      particles.push({
        from,
        to,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005
      });
    }

    // Trouver les 3 plus proches voisins
    const findClosestNeighbors = (index) => {
      const pos1 = brandPositions[index];
      if (!pos1) return [];

      const distances = trustBrands
        .map((_, j) => {
          if (index === j) return null;
          const pos2 = brandPositions[j];
          if (!pos2) return null;
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          return { index: j, dist: Math.sqrt(dx * dx + dy * dy) };
        })
        .filter(d => d !== null)
        .sort((a, b) => a.dist - b.dist);

      return distances.slice(0, 3);
    };

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Mouvement organique des bulles (sauf si en cours de drag)
      brandPositions.forEach((pos, i) => {
        if (draggingIndexRef === i) return;

        // Mouvement fluide et organique
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Rebond sur les bords avec padding
        const padding = 50;
        if (pos.x < padding || pos.x > canvas.offsetWidth - padding) pos.vx *= -1;
        if (pos.y < padding || pos.y > canvas.offsetHeight - padding) pos.vy *= -1;

        // Friction douce
        pos.vx *= 0.99;
        pos.vy *= 0.99;

        // Ajout d'une légère force aléatoire pour éviter l'immobilité
        pos.vx += (Math.random() - 0.5) * 0.02;
        pos.vy += (Math.random() - 0.5) * 0.02;

        // Limiter la vitesse
        const maxSpeed = 1.5;
        const speed = Math.sqrt(pos.vx ** 2 + pos.vy ** 2);
        if (speed > maxSpeed) {
          pos.vx = (pos.vx / speed) * maxSpeed;
          pos.vy = (pos.vy / speed) * maxSpeed;
        }
      });

      // Dessiner les connexions aux 3 plus proches
      trustBrands.forEach((_, i) => {
        const pos1 = brandPositions[i];
        if (!pos1) return;

        const closestNeighbors = findClosestNeighbors(i);

        closestNeighbors.forEach(({ index: j }) => {
          const pos2 = brandPositions[j];
          if (!pos2) return;

          // Ligne avec gradient
          const gradient = ctx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
          const isHovered = hoveredBrand === i || hoveredBrand === j;
          const isDragging = draggingIndexRef === i || draggingIndexRef === j;

          if (isDragging) {
            gradient.addColorStop(0, 'rgba(114, 176, 204, 0.6)');
            gradient.addColorStop(1, 'rgba(207, 110, 63, 0.6)');
          } else if (isHovered) {
            gradient.addColorStop(0, 'rgba(114, 176, 204, 0.4)');
            gradient.addColorStop(1, 'rgba(207, 110, 63, 0.4)');
          } else {
            gradient.addColorStop(0, 'rgba(114, 176, 204, 0.15)');
            gradient.addColorStop(1, 'rgba(207, 110, 63, 0.15)');
          }

          ctx.beginPath();
          ctx.moveTo(pos1.x, pos1.y);
          ctx.lineTo(pos2.x, pos2.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = isDragging ? 3 : (isHovered ? 2 : 1);
          ctx.stroke();
        });
      });

      // Dessiner et animer les particules
      particles.forEach(particle => {
        particle.progress += particle.speed;
        if (particle.progress > 1) {
          particle.progress = 0;
          particle.from = Math.floor(Math.random() * trustBrands.length);
          particle.to = Math.floor(Math.random() * trustBrands.length);
          while (particle.to === particle.from) {
            particle.to = Math.floor(Math.random() * trustBrands.length);
          }
        }

        const from = brandPositions[particle.from];
        const to = brandPositions[particle.to];
        if (!from || !to) return;

        const x = from.x + (to.x - from.x) * particle.progress;
        const y = from.y + (to.y - from.y) * particle.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(114, 176, 204, 0.7)';
        ctx.fill();
      });

      // Dessiner les nœuds (logos)
      brandPositions.forEach((pos, i) => {
        if (!pos) return;

        const isHovered = hoveredBrand === i;
        const isDragging = draggingIndexRef === i;
        const pulseScale = 1 + Math.sin(time * 2 + pos.pulseOffset) * 0.05;
        const baseSize = canvas.offsetWidth < 640 ? 26 : 34;
        const radius = isDragging ? baseSize + 12 : (isHovered ? baseSize + 8 : baseSize * pulseScale);

        // Glow effect pour hover et drag
        if (isHovered || isDragging) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + (isDragging ? 20 : 15), 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(pos.x, pos.y, radius, pos.x, pos.y, radius + (isDragging ? 20 : 15));
          glowGradient.addColorStop(0, isDragging ? 'rgba(114, 176, 204, 0.5)' : 'rgba(114, 176, 204, 0.3)');
          glowGradient.addColorStop(1, 'rgba(114, 176, 204, 0)');
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Cercle principal
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        const brand = trustBrands[i];
        const nodeGradient = ctx.createLinearGradient(
          pos.x - radius, pos.y - radius,
          pos.x + radius, pos.y + radius
        );

        const gradientColors = brand.gradient.includes('from-[#72B0CC]')
          ? ['rgba(114, 176, 204, 0.95)', 'rgba(130, 188, 108, 0.95)']
          : brand.gradient.includes('from-[#CF6E3F]')
          ? ['rgba(207, 110, 63, 0.95)', 'rgba(114, 176, 204, 0.95)']
          : ['rgba(130, 188, 108, 0.95)', 'rgba(207, 110, 63, 0.95)'];

        nodeGradient.addColorStop(0, gradientColors[0]);
        nodeGradient.addColorStop(1, gradientColors[1]);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Bordure
        ctx.strokeStyle = isDragging ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = isDragging ? 3 : 2;
        ctx.stroke();

        // Initiales
        ctx.fillStyle = 'white';
        const fontSize = canvas.offsetWidth < 640 ? (isDragging ? '14px' : (isHovered ? '12px' : '10px')) : (isDragging ? '18px' : (isHovered ? '16px' : '14px'));
        ctx.font = `bold ${fontSize} Montserrat, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(brand.initials, pos.x, pos.y);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    // Gestion du drag & drop
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const getTouchPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    };

    const findBrandAtPosition = (x, y) => {
      const baseSize = canvas.offsetWidth < 640 ? 26 : 34;
      for (let i = 0; i < brandPositions.length; i++) {
        const pos = brandPositions[i];
        const dx = x - pos.x;
        const dy = y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < baseSize + 8) {
          return i;
        }
      }
      return null;
    };

    const handleMouseDown = (e) => {
      const mousePos = getMousePos(e);
      const brandIndex = findBrandAtPosition(mousePos.x, mousePos.y);
      if (brandIndex !== null) {
        draggingIndexRef = brandIndex;
        dragOffset = {
          x: mousePos.x - brandPositions[brandIndex].x,
          y: mousePos.y - brandPositions[brandIndex].y
        };
        canvas.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e) => {
      const mousePos = getMousePos(e);

      if (draggingIndexRef !== null) {
        brandPositions[draggingIndexRef].x = mousePos.x - dragOffset.x;
        brandPositions[draggingIndexRef].y = mousePos.y - dragOffset.y;
        brandPositions[draggingIndexRef].vx = 0;
        brandPositions[draggingIndexRef].vy = 0;
      } else {
        const brandIndex = findBrandAtPosition(mousePos.x, mousePos.y);
        if (brandIndex !== null) {
          setHoveredBrand(brandIndex);
          setActiveBrandIndex(brandIndex);
          canvas.style.cursor = 'grab';
        } else if (hoveredBrand !== null) {
          setHoveredBrand(null);
          canvas.style.cursor = 'default';
        }
      }
    };

    const handleMouseUp = () => {
      if (draggingIndexRef !== null) {
        // Ajouter une petite vélocité basée sur le dernier mouvement
        draggingIndexRef = null;
        canvas.style.cursor = 'default';
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touchPos = getTouchPos(e);
      const brandIndex = findBrandAtPosition(touchPos.x, touchPos.y);
      if (brandIndex !== null) {
        draggingIndexRef = brandIndex;
        setHoveredBrand(brandIndex);
        setActiveBrandIndex(brandIndex);
        dragOffset = {
          x: touchPos.x - brandPositions[brandIndex].x,
          y: touchPos.y - brandPositions[brandIndex].y
        };
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (draggingIndexRef !== null) {
        const touchPos = getTouchPos(e);
        brandPositions[draggingIndexRef].x = touchPos.x - dragOffset.x;
        brandPositions[draggingIndexRef].y = touchPos.y - dragOffset.y;
        brandPositions[draggingIndexRef].vx = 0;
        brandPositions[draggingIndexRef].vy = 0;
      }
    };

    const handleTouchEnd = () => {
      if (draggingIndexRef !== null) {
        draggingIndexRef = null;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    animate();

    const handleResize = () => {
      setCanvasSize();
      const newBaseRadius = getRadius();
      brandPositions.forEach((pos, index) => {
        const angle = (index / trustBrands.length) * Math.PI * 2;
        const radius = newBaseRadius + Math.sin(angle * 3) * (newBaseRadius * 0.28);
        pos.x = canvas.offsetWidth / 2 + Math.cos(angle) * radius;
        pos.y = canvas.offsetHeight / 2 + Math.sin(angle) * radius;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, [trustBrands, hoveredBrand]);

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
          <div className="flex items-center">
            <svg
              width="150"
              height="67"
              viewBox="0 0 648 290"
              className="transition-all duration-1000"
              style={{ fill: logoColor }}
            >
              <path d="M0.102701 2.2667C0.502701 4.40003 3.16937 4.6667 29.1694 5.0667L57.7027 5.33336L61.436 8.93337C66.3694 13.7334 66.636 22.1334 61.9694 27.6L58.7694 31.3334L29.5694 32L0.502701 32.6667L0.102701 53.8667C-0.163965 72.8 -0.030632 74.9334 1.96937 74.1334C3.03603 73.7334 4.36937 73.3334 4.63603 73.3334C4.9027 73.3334 5.16937 65.2 5.16937 55.3334V37.3334H30.636C51.3027 37.3334 56.9027 36.9334 60.636 35.2C73.436 29.0667 73.836 8.53336 61.3027 2.00003C58.1027 0.400029 51.836 2.86785e-05 28.5027 2.86785e-05C1.7027 2.86785e-05 -0.297299 0.133362 0.102701 2.2667Z"/>
              <path d="M96.1026 34.9333C96.5026 67.0667 96.6359 70 98.9026 70.4C101.036 70.8 101.169 68.5333 101.169 38.1333V5.33334H127.569C152.503 5.33334 154.103 5.46667 157.036 8.13334C163.436 14.1333 163.703 22.4 157.703 28.1333C154.636 30.9333 152.769 31.4667 140.236 32L126.236 32.6667L145.836 54C156.636 65.7333 165.703 75.6 165.969 75.8667C166.236 76.1333 166.503 74.6667 166.503 72.5333C166.503 69.4667 163.436 65.4667 152.103 53.3333L137.836 38L146.503 37.3333C151.303 36.9333 156.503 35.8667 158.236 34.9333C166.103 30.4 169.036 16.8 163.836 8.4C159.169 0.533338 156.503 4.17963e-06 124.503 4.17963e-06H95.8359L96.1026 34.9333Z"/>
              <path d="M216.636 1.33338C207.836 4.00005 198.236 13.4667 194.636 23.0667C193.836 25.2 193.169 30.5334 193.169 35.0667C193.169 65.7334 228.902 81.6 251.436 60.9334C259.569 53.4667 263.036 45.7334 262.902 34.6667C262.902 20.1334 255.302 8.66671 241.836 2.53338C236.102 -0.133288 223.436 -0.666622 216.636 1.33338ZM240.636 7.46671C247.169 10.6667 255.436 20.1334 257.169 26.8C259.969 36.9334 256.369 50 248.902 56.9334C231.836 72.9334 203.569 64.1334 198.636 41.3334C195.702 27.7334 202.236 14.4 215.169 7.60005C220.502 4.80005 234.769 4.66671 240.636 7.46671Z"/>
              <path d="M320.369 2.13344C320.769 3.33344 321.169 4.53344 321.169 4.80011C321.169 5.06677 328.636 5.33344 337.836 5.33344H354.503V22.1334C354.503 42.9334 353.036 48.1334 345.169 56.1334C333.036 68.2668 315.036 68.2668 302.903 56.1334C297.836 51.2001 294.503 44.1334 294.503 38.8001C294.503 35.6001 293.969 34.6668 291.836 34.6668C285.969 34.6668 289.969 49.4668 298.369 58.9334C310.769 73.0668 333.303 74.0001 347.436 60.9334C357.969 51.2001 359.036 47.8668 359.569 22.2668L360.103 0.000110273H339.836C321.836 0.000110273 319.703 0.266773 320.369 2.13344Z"/>
              <path d="M385.169 35.3332V70.6665H420.502C454.902 70.6665 455.836 70.5332 455.836 67.9998C455.836 65.4665 454.902 65.3332 423.169 65.3332H390.502V51.3332V37.3332H423.169C454.902 37.3332 455.836 37.1998 455.836 34.6665C455.836 32.1332 454.902 31.9998 423.169 31.9998H390.502V18.6665V5.33317H424.369C453.969 5.33317 458.369 5.0665 459.036 3.19983C459.436 1.99983 459.836 0.799834 459.836 0.533167C459.836 0.2665 443.036 -0.000166446 422.502 -0.000166446H385.169V35.3332Z"/>
              <path d="M502.502 2.80002C475.702 14.9334 474.102 51.4667 499.836 65.8667L507.169 70L532.236 70.4C557.169 70.9334 557.436 70.9334 555.969 68.2667C554.636 65.7334 553.036 65.4667 530.636 65.0667L506.769 64.6667L501.036 60.6667C491.836 54.1334 487.436 46.8 486.769 36.9334C486.369 29.8667 486.769 27.6 490.102 21.3334C492.502 16.8 496.102 12.5334 499.702 10L505.436 6.00002L528.636 5.60002C550.502 5.20002 551.836 5.06668 551.836 2.53335C551.836 0.13335 550.769 2.07279e-05 530.236 2.07279e-05C511.302 2.07279e-05 507.702 0.400017 502.502 2.80002Z"/>
              <path d="M577.436 2.26685C577.836 4.40018 579.836 4.66685 594.236 5.06685L610.503 5.46685V40.1335C610.503 71.3335 610.77 74.9335 612.636 74.1335C613.836 73.7335 615.036 73.3335 615.303 73.3335C615.57 73.3335 615.836 58.0002 615.836 39.3335V5.33352H631.836C646.903 5.33352 647.836 5.20018 647.836 2.66685C647.836 0.133517 646.903 0.000183303 612.37 0.000183303C579.436 0.000183303 577.036 0.133517 577.436 2.26685Z"/>
              <path d="M179.169 99.3333C170.636 107.733 179.969 121.467 191.169 116.8C196.769 114.4 199.036 110.4 197.969 104.533C196.236 95.9999 185.436 92.9333 179.169 99.3333Z"/>
              <path d="M4.76902 137.333C2.90236 138.8 1.03569 141.867 0.502356 144C-0.297644 147.6 3.96902 154.533 43.8357 215.067C68.2357 251.867 89.969 283.733 92.1024 285.733C95.4357 288.933 96.9024 289.467 100.236 288.8C102.502 288.4 105.436 287.067 106.636 285.867C107.969 284.667 123.836 261.2 142.102 233.6L175.169 183.467L175.836 233.067C176.502 282.133 176.502 282.667 179.436 285.6C183.836 290 191.302 289.6 195.302 284.8L198.502 281.2V211.2V141.2L195.169 138C191.169 133.867 182.236 133.333 179.169 136.933C178.102 138.267 159.969 165.067 138.902 196.533C117.702 228 99.969 253.733 99.3024 253.867C98.6357 253.867 81.3024 229.067 60.9024 198.667C40.5024 168.267 22.2357 141.333 20.5024 138.933C16.369 133.867 10.1024 133.2 4.76902 137.333Z"/>
              <path d="M231.303 137.6C225.57 142.667 225.97 150.934 232.236 154.667C236.37 157.2 239.17 157.334 323.303 157.334H410.236L425.17 191.6C433.303 210.534 445.836 239.467 452.903 255.734C463.703 280.8 466.503 285.867 469.57 287.6C473.97 289.734 480.103 288.934 482.77 285.734C483.703 284.534 494.503 259.867 506.77 230.8C519.036 201.734 529.436 178 529.836 178C530.37 178 541.303 202.267 554.37 232C577.703 285.2 578.103 286 582.77 287.734C586.77 289.334 588.236 289.334 591.303 287.734C594.77 286.134 597.57 279.734 621.436 218C636.103 180.134 647.836 148 647.836 145.6C647.836 139.6 642.903 134.667 636.503 134.667C628.236 134.667 630.77 129.467 598.37 212.934C591.436 230.667 585.436 244.8 585.036 244.267C584.503 243.734 574.103 220.267 561.836 192C547.97 160 538.236 139.467 536.236 137.6C532.236 134 525.17 133.734 522.103 137.067C520.77 138.4 509.836 163.2 497.703 192.134C485.436 221.067 475.17 245.067 474.636 245.6C474.236 246.134 463.436 222.4 450.636 192.934C437.97 163.467 426.37 138.267 424.903 136.934C422.37 134.8 415.836 134.667 328.37 134.667H234.636L231.303 137.6Z"/>
              <path d="M231.303 198.8L227.836 201.467V242.133C227.836 280.667 227.969 282.8 230.503 285.333C231.969 286.8 234.503 288.267 236.103 288.667C237.836 289.067 279.569 289.2 328.903 289.067L418.769 288.667L421.969 284.933C426.103 280.133 426.103 274.533 421.969 269.733L418.769 266L333.969 265.6L249.169 265.333V242V218.667H324.636H400.103L403.969 214.8C406.236 212.4 407.836 209.467 407.836 207.333C407.836 205.2 406.236 202.267 403.969 199.867L400.103 196H317.436C235.969 196 234.769 196 231.303 198.8Z"/>
            </svg>
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

          <div className="relative grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
            <div className="relative w-full max-w-4xl mx-auto lg:mx-0">
              <div className="absolute -top-24 -left-16 w-72 h-72 bg-[#72B0CC]/15 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-[#CF6E3F]/15 rounded-full blur-3xl"></div>

              <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  style={{ touchAction: 'none' }}
                />

                {/* Légende interactive */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-white/60 max-w-[90%]">
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    <span className="font-semibold text-[#72B0CC]">
                      <span className="hidden sm:inline">Déplacez</span>
                      <span className="sm:hidden">Bougez</span>
                    </span> les logos pour les repositionner • Les connexions s'adaptent aux 3 plus proches
                  </p>
                </div>
              </div>
            </div>

            {activeBrand && (
              <div className="w-full lg:max-w-xl">
                <div className="bg-white/90 backdrop-blur-lg rounded-[32px] border border-white/60 shadow-[0_40px_80px_rgba(31,41,55,0.12)] p-10 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-3 bg-[#72B0CC]/10 text-[#1f2937] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide">
                      <Sparkles className="w-4 h-4 text-[#72B0CC]" />
                      Projet signature
                    </div>
                    <div className="font-semibold text-sm text-gray-500 uppercase tracking-widest">
                      {activeBrand.sector}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-[#72B0CC] mb-2">
                      {activeBrand.name}
                    </p>
                    <h3 className="text-3xl font-semibold text-gray-900 leading-snug" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {activeBrand.solution}
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-r from-[#72B0CC]/10 via-white to-[#CF6E3F]/10 border border-[#72B0CC]/15 p-6 text-left">
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                      Impact mesuré
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      <span className="font-semibold text-[#CF6E3F]">{activeBrand.impact}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-gray-500">
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#72B0CC]/10 text-[#1f2937]">
                      <Sparkles className="w-4 h-4 text-[#72B0CC]" />
                      Expérience immersive
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#CF6E3F]/10 text-[#1f2937]">
                      <Zap className="w-4 h-4 text-[#CF6E3F]" />
                      Engagement boosté
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#82BC6C]/10 text-[#1f2937]">
                      <Users className="w-4 h-4 text-[#82BC6C]" />
                      Adoption équipes
                    </span>
                  </div>
                </div>
              </div>
            )}
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
              <div className="flex items-center mb-6">
                <svg
                  width="180"
                  height="81"
                  viewBox="0 0 648 290"
                  className="transition-all duration-1000"
                  style={{ fill: logoColor }}
                >
                  <path d="M0.102701 2.2667C0.502701 4.40003 3.16937 4.6667 29.1694 5.0667L57.7027 5.33336L61.436 8.93337C66.3694 13.7334 66.636 22.1334 61.9694 27.6L58.7694 31.3334L29.5694 32L0.502701 32.6667L0.102701 53.8667C-0.163965 72.8 -0.030632 74.9334 1.96937 74.1334C3.03603 73.7334 4.36937 73.3334 4.63603 73.3334C4.9027 73.3334 5.16937 65.2 5.16937 55.3334V37.3334H30.636C51.3027 37.3334 56.9027 36.9334 60.636 35.2C73.436 29.0667 73.836 8.53336 61.3027 2.00003C58.1027 0.400029 51.836 2.86785e-05 28.5027 2.86785e-05C1.7027 2.86785e-05 -0.297299 0.133362 0.102701 2.2667Z"/>
                  <path d="M96.1026 34.9333C96.5026 67.0667 96.6359 70 98.9026 70.4C101.036 70.8 101.169 68.5333 101.169 38.1333V5.33334H127.569C152.503 5.33334 154.103 5.46667 157.036 8.13334C163.436 14.1333 163.703 22.4 157.703 28.1333C154.636 30.9333 152.769 31.4667 140.236 32L126.236 32.6667L145.836 54C156.636 65.7333 165.703 75.6 165.969 75.8667C166.236 76.1333 166.503 74.6667 166.503 72.5333C166.503 69.4667 163.436 65.4667 152.103 53.3333L137.836 38L146.503 37.3333C151.303 36.9333 156.503 35.8667 158.236 34.9333C166.103 30.4 169.036 16.8 163.836 8.4C159.169 0.533338 156.503 4.17963e-06 124.503 4.17963e-06H95.8359L96.1026 34.9333Z"/>
                  <path d="M216.636 1.33338C207.836 4.00005 198.236 13.4667 194.636 23.0667C193.836 25.2 193.169 30.5334 193.169 35.0667C193.169 65.7334 228.902 81.6 251.436 60.9334C259.569 53.4667 263.036 45.7334 262.902 34.6667C262.902 20.1334 255.302 8.66671 241.836 2.53338C236.102 -0.133288 223.436 -0.666622 216.636 1.33338ZM240.636 7.46671C247.169 10.6667 255.436 20.1334 257.169 26.8C259.969 36.9334 256.369 50 248.902 56.9334C231.836 72.9334 203.569 64.1334 198.636 41.3334C195.702 27.7334 202.236 14.4 215.169 7.60005C220.502 4.80005 234.769 4.66671 240.636 7.46671Z"/>
                  <path d="M320.369 2.13344C320.769 3.33344 321.169 4.53344 321.169 4.80011C321.169 5.06677 328.636 5.33344 337.836 5.33344H354.503V22.1334C354.503 42.9334 353.036 48.1334 345.169 56.1334C333.036 68.2668 315.036 68.2668 302.903 56.1334C297.836 51.2001 294.503 44.1334 294.503 38.8001C294.503 35.6001 293.969 34.6668 291.836 34.6668C285.969 34.6668 289.969 49.4668 298.369 58.9334C310.769 73.0668 333.303 74.0001 347.436 60.9334C357.969 51.2001 359.036 47.8668 359.569 22.2668L360.103 0.000110273H339.836C321.836 0.000110273 319.703 0.266773 320.369 2.13344Z"/>
                  <path d="M385.169 35.3332V70.6665H420.502C454.902 70.6665 455.836 70.5332 455.836 67.9998C455.836 65.4665 454.902 65.3332 423.169 65.3332H390.502V51.3332V37.3332H423.169C454.902 37.3332 455.836 37.1998 455.836 34.6665C455.836 32.1332 454.902 31.9998 423.169 31.9998H390.502V18.6665V5.33317H424.369C453.969 5.33317 458.369 5.0665 459.036 3.19983C459.436 1.99983 459.836 0.799834 459.836 0.533167C459.836 0.2665 443.036 -0.000166446 422.502 -0.000166446H385.169V35.3332Z"/>
                  <path d="M502.502 2.80002C475.702 14.9334 474.102 51.4667 499.836 65.8667L507.169 70L532.236 70.4C557.169 70.9334 557.436 70.9334 555.969 68.2667C554.636 65.7334 553.036 65.4667 530.636 65.0667L506.769 64.6667L501.036 60.6667C491.836 54.1334 487.436 46.8 486.769 36.9334C486.369 29.8667 486.769 27.6 490.102 21.3334C492.502 16.8 496.102 12.5334 499.702 10L505.436 6.00002L528.636 5.60002C550.502 5.20002 551.836 5.06668 551.836 2.53335C551.836 0.13335 550.769 2.07279e-05 530.236 2.07279e-05C511.302 2.07279e-05 507.702 0.400017 502.502 2.80002Z"/>
                  <path d="M577.436 2.26685C577.836 4.40018 579.836 4.66685 594.236 5.06685L610.503 5.46685V40.1335C610.503 71.3335 610.77 74.9335 612.636 74.1335C613.836 73.7335 615.036 73.3335 615.303 73.3335C615.57 73.3335 615.836 58.0002 615.836 39.3335V5.33352H631.836C646.903 5.33352 647.836 5.20018 647.836 2.66685C647.836 0.133517 646.903 0.000183303 612.37 0.000183303C579.436 0.000183303 577.036 0.133517 577.436 2.26685Z"/>
                  <path d="M179.169 99.3333C170.636 107.733 179.969 121.467 191.169 116.8C196.769 114.4 199.036 110.4 197.969 104.533C196.236 95.9999 185.436 92.9333 179.169 99.3333Z"/>
                  <path d="M4.76902 137.333C2.90236 138.8 1.03569 141.867 0.502356 144C-0.297644 147.6 3.96902 154.533 43.8357 215.067C68.2357 251.867 89.969 283.733 92.1024 285.733C95.4357 288.933 96.9024 289.467 100.236 288.8C102.502 288.4 105.436 287.067 106.636 285.867C107.969 284.667 123.836 261.2 142.102 233.6L175.169 183.467L175.836 233.067C176.502 282.133 176.502 282.667 179.436 285.6C183.836 290 191.302 289.6 195.302 284.8L198.502 281.2V211.2V141.2L195.169 138C191.169 133.867 182.236 133.333 179.169 136.933C178.102 138.267 159.969 165.067 138.902 196.533C117.702 228 99.969 253.733 99.3024 253.867C98.6357 253.867 81.3024 229.067 60.9024 198.667C40.5024 168.267 22.2357 141.333 20.5024 138.933C16.369 133.867 10.1024 133.2 4.76902 137.333Z"/>
                  <path d="M231.303 137.6C225.57 142.667 225.97 150.934 232.236 154.667C236.37 157.2 239.17 157.334 323.303 157.334H410.236L425.17 191.6C433.303 210.534 445.836 239.467 452.903 255.734C463.703 280.8 466.503 285.867 469.57 287.6C473.97 289.734 480.103 288.934 482.77 285.734C483.703 284.534 494.503 259.867 506.77 230.8C519.036 201.734 529.436 178 529.836 178C530.37 178 541.303 202.267 554.37 232C577.703 285.2 578.103 286 582.77 287.734C586.77 289.334 588.236 289.334 591.303 287.734C594.77 286.134 597.57 279.734 621.436 218C636.103 180.134 647.836 148 647.836 145.6C647.836 139.6 642.903 134.667 636.503 134.667C628.236 134.667 630.77 129.467 598.37 212.934C591.436 230.667 585.436 244.8 585.036 244.267C584.503 243.734 574.103 220.267 561.836 192C547.97 160 538.236 139.467 536.236 137.6C532.236 134 525.17 133.734 522.103 137.067C520.77 138.4 509.836 163.2 497.703 192.134C485.436 221.067 475.17 245.067 474.636 245.6C474.236 246.134 463.436 222.4 450.636 192.934C437.97 163.467 426.37 138.267 424.903 136.934C422.37 134.8 415.836 134.667 328.37 134.667H234.636L231.303 137.6Z"/>
                  <path d="M231.303 198.8L227.836 201.467V242.133C227.836 280.667 227.969 282.8 230.503 285.333C231.969 286.8 234.503 288.267 236.103 288.667C237.836 289.067 279.569 289.2 328.903 289.067L418.769 288.667L421.969 284.933C426.103 280.133 426.103 274.533 421.969 269.733L418.769 266L333.969 265.6L249.169 265.333V242V218.667H324.636H400.103L403.969 214.8C406.236 212.4 407.836 209.467 407.836 207.333C407.836 205.2 406.236 202.267 403.969 199.867L400.103 196H317.436C235.969 196 234.769 196 231.303 198.8Z"/>
                </svg>
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
