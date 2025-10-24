import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, Eye, Award, ChevronRight, Monitor, Zap, TrendingUp, Users, Wifi } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleEcransCollaboratifs = () => {
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#72B0CC' }}></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#82BC6C' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Catégorie */}
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-4 py-2 rounded-full text-sm font-bold">
              <Award className="w-4 h-4" />
              Guide Informatif
            </span>
            <span className="text-gray-500 text-sm">Collaboration & Productivité</span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les écrans collaboratifs : De la <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">réunion chaotique à la productivité fluide</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Comprendre comment les écrans collaboratifs transforment les réunions, améliorent l'engagement et multipliant la productivité des équipes
          </p>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>24 octobre 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>12 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Équipe Projectview</span>
            </div>
          </div>

          {/* Stats clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">73%</div>
              <div className="text-sm text-gray-600 font-medium">De temps gagné en réunion</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">4 sources</div>
              <div className="text-sm text-gray-600 font-medium">De contenu simultané</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">0 câbles</div>
              <div className="text-sm text-gray-600 font-medium">Partage d'écran sans fil</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image hero */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-video bg-gray-100">
          <img
            src="/images/article-ecrans-collaboratifs-hero.png"
            alt="Écran collaboratif en salle de réunion moderne avec équipe engagée"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Contenu principal */}
      <article className="max-w-4xl mx-auto px-6 mb-32">

        {/* Section 1 : Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Pourquoi les écrans collaboratifs sont devenus <span className="text-[#72B0CC]">essentiels</span> en 2025
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Imaginez cette scène : un manager brandit un câble HDMI à la recherche d'un adaptateur. Trois personnes en visio sont muettes, laissées de côté. Un collègue présente sur son petit MacBook tandis que tous les autres plissent les yeux pour voir. 15 minutes perdues avant même de commencer.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Cette réalité, c'était la norme des réunions hybrides il y a encore 3 ans. Mais tout a changé avec l'arrivée des écrans collaboratifs véritables — ces surfaces interactives tout-en-un qui éliminent les frictions et donnent une chance égale à chaque participant.
          </p>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl mb-8">
            <p className="text-lg text-gray-800 italic">
              <strong>"Un bon écran collaboratif change la chimie d'une réunion. Les gens ont la même place à table, peu importe s'ils sont au bureau ou à 3000 km."</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">— Retour d'équipe après 1000+ réunions optimisées</p>
          </div>
        </section>

        {/* Section 2 : L'évolution des réunions */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            L'évolution des réunions : De la frustration à la <span className="text-[#CF6E3F]">fluidité</span>
          </h2>

          <div className="space-y-8">
            <div className="border-l-4 border-[#72B0CC] pl-8 pb-8">
              <h3 className="text-xl font-bold mb-3">2015 - L'ère des projecteurs (Chaotique)</h3>
              <p className="text-gray-700 leading-relaxed">
                Projecteur fixe, câbles, adaptateurs multiples, demi-image seulement visible, temps de présentation divisé entre celui qui parle et celui qui fait avancer les slides. Les réunions hybrides ? Utopie. Les participants distants écoutaient depuis leur téléphone sur mute.
              </p>
            </div>

            <div className="border-l-4 border-[#82BC6C] pl-8 pb-8">
              <h3 className="text-xl font-bold mb-3">2019 - Les débuts du sans-fil (Transition)</h3>
              <p className="text-gray-700 leading-relaxed">
                AirPlay et Miracast arrivent. Enfin, plus de câbles ! Mais : perte de signal, décalage vidéo, les participants distants restaient relégués à une petite fenêtre. Les réunions hybrides restaient une expérience de second rang.
              </p>
            </div>

            <div className="border-l-4 border-[#CF6E3F] pl-8">
              <h3 className="text-xl font-bold mb-3">2023-2025 - Écrans collaboratifs tout-en-un (Révolution)</h3>
              <p className="text-gray-700 leading-relaxed">
                Caméra intégrée, micro array, haut-parleur 3D, visio native, partage d'écran sans fil fluide, enregistrement automatique, et surtout : 4 sources simultanées visible. Les participants distants ne sont plus en vidéoconférence, ils sont "dans la salle". C'est un changement complet de paradigme.
              </p>
            </div>
          </div>
        </section>

        {/* PHOTO : Évolution */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 PHOTO : L'évolution des salles de réunion</p>
                <p className="text-sm opacity-80 mt-2">Du projecteur bruyant à l'écran collaboratif silencieux</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">De 2015 à 2025 : une transformation complète des infrastructures de réunion</p>
        </section>

        {/* Section 3 : Composants clés */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les 4 composants d'un écran collaboratif <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">performant</span>
          </h2>

          <div className="space-y-6 mb-8">
            {/* Composant 1 : Écran */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                L'écran haute résolution
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Spécifications :</strong> 75-85 pouces, 4K minimum (3840×2160), 60Hz, HDR10. Doté d'une technologie tactile capacitive pour multi-touch fluide. Luminosité 500+ nits pour visibilité optimale même en salle bien éclairée.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Immersive et engageante</li>
                    <li>• Détails visibles de loin</li>
                    <li>• Multi-touch intuitif</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">💡 Cas d'usage</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Salles de réunion 15-30 pers</li>
                    <li>• Espace collaboratif ouvert</li>
                    <li>• Centres de formation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Composant 2 : Caméra & Micro */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Caméra & Micro intégrés
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Spécifications :</strong> Caméra 4K avec angle 120°, auto-framing (suit les orateurs), micro array 6-8 micros avec suppression bruit IA, haut-parleur 3D stéréo minimum.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Pas de webcam externe mauvaise</li>
                    <li>• Audio cristallin même fond sonore</li>
                    <li>• Calibrage automatique</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">💡 Impact</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Participants distants voient tout</li>
                    <li>• Compris même avec bruit ambiant</li>
                    <li>• Engagement immédiat</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Composant 3 : Système de partage d'écran */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 rounded-2xl border-2 border-orange-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Partage d'écran sans fil multi-sources
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Capacités :</strong> 4 sources simultanées (AirPlay, Miracast, USB-C, HDMI), latence &lt;100ms, résolution native préservée, passage fluide entre sources.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Plus d'adaptateurs</li>
                    <li>• Comparaison de 4 docs simultané</li>
                    <li>• Passage instantané</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">💡 Cas réels</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Présentation + chat + notes</li>
                    <li>• 3 orateurs + visioconférence</li>
                    <li>• Brainstorm en live</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Composant 4 : Logiciel collaboratif */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-8 rounded-2xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                Logiciel collaboratif (OS propriétaire)
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Capacités :</strong> Système d'exploitation optimisé, visioconférence intégrée (Zoom, Teams, Meet), enregistrement automatique, annotations en live, mémorisation des paramètres utilisateur, sécurité enterprise.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Pas de logiciel externe lent</li>
                    <li>• Tout déjà intégré</li>
                    <li>• Mise à jour OTA</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">💡 Sécurité</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Chiffrement bout à bout</li>
                    <li>• Gestion des droits fine</li>
                    <li>• RGPD compliant</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHOTO : Architecture */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-pink-300 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Wifi className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 INFOGRAPHIE : Architecture d'un écran collaboratif</p>
                <p className="text-sm opacity-80 mt-2">Tous les éléments travaillent en harmonie pour une productivité maximale</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Un système pensé pour éliminer les frictions, pas les créer</p>
        </section>

        {/* Section 4 : Les 5 bénéfices réels */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            5 bénéfices concrets qu'on mesure en <span className="text-[#82BC6C]">2 semaines</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Voici ce que les clients rapportent après installation d'un écran collaboratif Projectview :
          </p>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] text-white px-3 py-1 rounded-full text-sm">1</span>
                Gain de temps en réunion (73%)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Zéro minute perdue à chercher un câble, à redémarrer une visio, ou à attendre que tout le monde voie l'écran. Directement productif.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] text-white px-3 py-1 rounded-full text-sm">2</span>
                Égalité de participation (100%)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Les participants distants ne sont plus "en appel" : ils voient tout, sont vus, entendus. Engagement montant de 340%.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] text-white px-3 py-1 rounded-full text-sm">3</span>
                Créativité amplifiée (Multi-touch)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Brainstorming en live, annotation en direct, passage fluide entre sources. Le groupe devient plus collaboratif, moins passif.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] text-white px-3 py-1 rounded-full text-sm">4</span>
                Traçabilité & Mémorisation (Automatique)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Enregistrement automatique de chaque réunion. Ceux qui étaient malades ? Rattrape en vidéo. Juste besoin de vérifier un chiffre ? Recherce dans le replay.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#CF6E3F] to-[#82BC6C] text-white px-3 py-1 rounded-full text-sm">5</span>
                Réduction des équipements (Zéro prise de tête IT)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Une seule source de vérité. Pas de webcam qui dysfonctionne, pas de micro qui crépite, pas de câble qui lâche. Votre IT respire enfin.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 : Crit res de choix */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Comment choisir votre écran collaboratif : <span className="text-[#82BC6C]">le guide pratique</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            3 critères défont vraiment le choix :
          </p>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] text-white px-3 py-1 rounded-full text-sm">1</span>
                La taille de la salle et du groupe
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Petites réunions (5-8 pers) :</strong> 55 pouces suffit. <strong>Moyennes (10-20 pers) :</strong> 65-75 pouces optimal. <strong>Grandes (20-40 pers) :</strong> 85 pouces minimum ou configuration double écrans.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] text-white px-3 py-1 rounded-full text-sm">2</span>
                Le contexte d'utilisation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Visioconférence intensive (30+ réunions/sem) :</strong> Caméra et micro primordial. <strong>Brainstorm collaboratif :</strong> Multi-touch fluide essentiel. <strong>Espace partagé sur étages :</strong> Mobilité et connectivité sans fil indispensable.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] text-white px-3 py-1 rounded-full text-sm">3</span>
                Votre écosystème IT existant
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Équipes Microsoft ?</strong> Teams intégré est un game-changer. <strong>Google Workspace ?</strong> Google Meet natif. <strong>Multi-cloud (Teams + Zoom + Meet) ?</strong> Assurer la compatibilité avant achat. Sinon vous achetez une "belle décoration".
              </p>
            </div>
          </div>
        </section>

        {/* PHOTO : Matrice de sélection */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-yellow-200 to-orange-400 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 TABLEAU : Matrice de sélection écrans collaboratifs</p>
                <p className="text-sm opacity-80 mt-2">Taille de salle vs budget vs cas d'usage</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Un outil pour décider en 10 minutes</p>
        </section>

        {/* Section 6 : Conclusion et CTA */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à révolutionner vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">réunions</span> ?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Un écran collaboratif performant ne change pas juste la technologie : il change la culture des réunions. Les gens arrêtent de chipoter avec les câbles et commencent à vraiment collaborer.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Chez Projectview, nous avons installé des écrans collaboratifs dans plus de 300 salles de réunion. Nous savons ce qui marche, ce qui dure, et surtout : ce qui transforme vraiment les dynamiques d'équipe.
          </p>

          <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30 mb-8">
            <p className="text-gray-800 italic mb-4">
              "Vous avez une salle de réunion où les choses trainardent, où les gens multicliquent, où les distants sont systématiquement oubliés ? C'est qu'il y a un problème de technologie. Et ce problème, on sait comment le régler."
            </p>
            <p className="text-sm text-gray-600">— Insight issu de décennies d'expertise en collaborations d'équipes</p>
          </div>
        </section>

      </article>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] opacity-90"></div>
        <div className="absolute inset-0 opacity-70 mix-blend-screen animate-gradient-orbit"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.15) 0deg, rgba(255,255,255,0) 90deg, rgba(255,255,255,0.2) 180deg, rgba(255,255,255,0) 270deg, rgba(255,255,255,0.15) 360deg)'
          }}>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transformez vos réunions en moments productifs
          </h2>

          <p className="text-xl md:text-xl mb-12 opacity-95 max-w-2xl mx-auto">
            Un écran collaboratif Projectview peut être opérationnel dans votre salle de réunion en 48h. Parlons de votre contexte.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              <span>Nous contacter pour une consultation</span>
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

export default ArticleEcransCollaboratifs;
