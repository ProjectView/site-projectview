import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, TrendingUp, Users, Sparkles, Eye, Award, ChevronRight } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleShowroomAuto = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top on component mount
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

      {/* Hero Section de l'article */}
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
              Étude de cas
            </span>
            <span className="text-gray-500 text-sm">Secteur Automobile</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Showroom Automobile : De la brochure papier à l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">expérience immersive</span>
          </h1>

          {/* Sous-titre accrocheur */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Comment un concessionnaire automobile a transformé son showroom en véritable espace d'expérience, multipliant par 2.5 son taux de conversion
          </p>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>15 janvier 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>8 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Équipe Projectview</span>
            </div>
          </div>

          {/* Résultats clés en aperçu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">+250%</div>
              <div className="text-sm text-gray-600 font-medium">Engagement client</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">2.5x</div>
              <div className="text-sm text-gray-600 font-medium">Taux de conversion</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">-40%</div>
              <div className="text-sm text-gray-600 font-medium">Coûts d'impression</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image principale - SLOT PHOTO HERO */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Eye className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">📸 PHOTO HERO</p>
              <p className="text-sm opacity-80 mt-2">Vue d'ensemble du showroom transformé avec tables tactiles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal de l'article */}
      <article className="max-w-4xl mx-auto px-6 mb-32">

        {/* Introduction - Le contexte */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Le défi : Un showroom qui <span className="text-[#CF6E3F]">endort</span> plutôt qu'il n'inspire
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Quand Jean-Marc, directeur d'un important concessionnaire automobile multi-marques en région lyonnaise, nous a contactés en septembre 2024, son constat était sans appel : <strong>"Nos clients passent 10 minutes maximum dans le showroom, consultent leur téléphone, et repartent avec une pile de brochures qu'ils ne liront jamais."</strong>
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Le showroom, pourtant moderne et bien situé, souffrait de maux typiques du secteur automobile traditionnel :
          </p>

          {/* Box "Avant" avec problèmes */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">AVANT</span>
              Les symptômes d'un showroom dépassé
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Catalogues obsolètes :</strong> 15 000€ par an d'impression, informations périmées dès leur sortie d'imprimerie (nouveau modèle, changement de tarif...)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Expérience passive :</strong> Les clients regardent les véhicules exposés, mais ne peuvent pas explorer les options, les couleurs ou les configurations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Temps d'attente frustrant :</strong> Un seul vendeur disponible pour 5 clients = clients qui repartent sans avoir été servis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Absence de wow effect :</strong> Dans un marché où Tesla et les marques premium misent sur l'expérience, ce showroom ressemblait... à tous les autres</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl">
            <p className="text-lg text-gray-800 italic">
              <strong>"Je voyais bien que nos concurrents investissaient dans le digital, mais je ne savais pas par où commencer. Je ne voulais pas de gadgets, je voulais quelque chose qui transforme vraiment l'expérience de mes clients."</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">— Jean-Marc, Directeur du concessionnaire</p>
          </div>
        </section>

        {/* SLOT PHOTO - Showroom avant */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 PHOTO AVANT</p>
                <p className="text-sm opacity-80 mt-2">Showroom traditionnel : brochures papier, clients en attente, ambiance statique</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Le showroom avant transformation : fonctionnel mais sans âme</p>
        </section>

        {/* La solution apportée */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Notre approche : Transformer le showroom en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">terrain de jeu</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Après une phase d'audit et de co-conception avec Jean-Marc et son équipe commerciale, nous avons déployé une solution sur-mesure en trois temps :
          </p>

          {/* Cards des solutions */}
          <div className="space-y-6 mb-8">
            {/* Solution 1 */}
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] p-4 rounded-xl flex-shrink-0">
                  <span className="text-3xl">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Tables tactiles de configuration
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Quatre tables tactiles 43 pouces stratégiquement positionnées dans le showroom. Chaque table permet aux clients de :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Explorer l'ensemble de la gamme, même les véhicules non exposés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Configurer leur véhicule idéal (couleur, finition, options) avec un rendu 3D haute qualité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Comparer plusieurs modèles côte à côte</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Calculer leur financement en temps réel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>S'envoyer leur configuration par email ou SMS</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Solution 2 */}
            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] p-4 rounded-xl flex-shrink-0">
                  <span className="text-3xl">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Mur d'affichage dynamique
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Un mur LED de 3x2 mètres à l'entrée du showroom qui affiche en temps réel :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Les nouveautés et promotions du moment (actualisables en 30 secondes depuis le back-office)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Des vidéos immersives des véhicules en action</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Des témoignages clients filmés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                      <span>Les événements du concessionnaire (journées portes ouvertes, essais...)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Solution 3 */}
            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] p-4 rounded-xl flex-shrink-0">
                  <span className="text-3xl">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Système de gestion centralisé
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Une plateforme web intuitive qui permet à l'équipe du concessionnaire de mettre à jour tous les contenus (prix, disponibilités, visuels, promotions) instantanément sur l'ensemble des écrans et tables tactiles. Fini les allers-retours avec l'imprimeur, les erreurs de tarifs, ou les brochures obsolètes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLOT PHOTO - Installation */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-square bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">📸 INSTALLATION</p>
                  <p className="text-xs opacity-80 mt-2">Table tactile en action</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-square bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">📸 MUR LED</p>
                  <p className="text-xs opacity-80 mt-2">Affichage dynamique</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Les nouvelles installations : immersives et interactives</p>
        </section>

        {/* Déploiement */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Le déploiement : <span className="text-[#72B0CC]">Rapide et sans interruption</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            L'une des grandes craintes de Jean-Marc était de devoir fermer le showroom pendant les travaux. Nous avons donc orchestré le déploiement en deux phases :
          </p>

          <div className="bg-gray-50 p-8 rounded-2xl mb-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-[#72B0CC] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Semaine 1-2 : Préparation et installation technique</h4>
                  <p className="text-gray-700">Installation du câblage, du réseau, et du mur LED en dehors des heures d'ouverture (soirées et week-end). Impact zéro sur l'activité commerciale.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-[#CF6E3F] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Semaine 3 : Installation des tables tactiles et formation</h4>
                  <p className="text-gray-700">Mise en place des quatre tables tactiles pendant les heures ouvrées (devenues elles-mêmes un sujet de curiosité pour les clients présents) + formation de l'équipe commerciale sur 2 jours.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-[#82BC6C] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Semaine 4 : Lancement et ajustements</h4>
                  <p className="text-gray-700">Inauguration officielle du "nouveau" showroom avec une journée portes ouvertes. Notre équipe est restée sur place la première semaine pour ajuster les contenus et accompagner les équipes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl">
            <p className="text-lg text-gray-800 italic">
              <strong>"En 3 semaines, mon showroom a fait un bond de 10 ans en avant. Et le plus fou, c'est qu'on n'a pas perdu une seule vente pendant l'installation."</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">— Jean-Marc, Directeur du concessionnaire</p>
          </div>
        </section>

        {/* Les résultats */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les résultats : <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F]">Au-delà de toutes les attentes</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Trois mois après le lancement, nous avons analysé les données avec Jean-Marc. Les chiffres parlent d'eux-mêmes :
          </p>

          {/* Grille de résultats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Résultat 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#82BC6C]/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] p-3 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#82BC6C]">+250%</div>
                  <div className="text-sm text-gray-600">Temps passé dans le showroom</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Les clients passent désormais en moyenne <strong>35 minutes</strong> contre 10 minutes auparavant. Ils explorent, configurent, comparent... et surtout, ils ne regardent plus leur téléphone.
              </p>
            </div>

            {/* Résultat 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#CF6E3F]/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] p-3 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CF6E3F]">2.5x</div>
                  <div className="text-sm text-gray-600">Taux de conversion</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Le taux de conversion showroom (visite → essai → achat) est passé de <strong>8% à 20%</strong>. Les clients qui configurent leur véhicule sur les tables tactiles ont 3x plus de chances de passer commande.
              </p>
            </div>

            {/* Résultat 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#72B0CC]/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] p-3 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#82BC6C]">+180%</div>
                  <div className="text-sm text-gray-600">Partage sur réseaux sociaux</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Les clients photographient leur configuration sur les tables tactiles et la partagent massivement. Le showroom est devenu un lieu "instagrammable", générant du <strong>marketing gratuit</strong>.
              </p>
            </div>

            {/* Résultat 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#82BC6C]/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] p-3 rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#72B0CC]">-40%</div>
                  <div className="text-sm text-gray-600">Coûts marketing</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Fini les 15 000€ annuels de brochures papier. Les économies d'impression permettent de <strong>rentabiliser l'investissement en moins de 2 ans</strong>.
              </p>
            </div>
          </div>

          {/* Témoignage résultats */}
          <div className="bg-gradient-to-br from-[#82BC6C]/20 to-[#72B0CC]/20 p-8 rounded-2xl border-2 border-[#82BC6C]/40">
            <p className="text-xl text-gray-800 italic mb-4">
              <strong>"Le plus incroyable, c'est l'effet sur mes équipes. Avant, ils devaient répéter les mêmes infos 50 fois par jour. Maintenant, les clients arrivent avec leur configuration déjà faite sur la table tactile. Les vendeurs peuvent se concentrer sur le conseil et la relation humaine. Tout le monde y gagne."</strong>
            </p>
            <p className="text-gray-600">— Jean-Marc, 3 mois après le lancement</p>
          </div>
        </section>

        {/* SLOT PHOTO - Résultats / Clients satisfaits */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-[#82BC6C] to-[#72B0CC] flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 CLIENTS EN ACTION</p>
                <p className="text-sm opacity-80 mt-2">Clients utilisant les tables tactiles avec enthousiasme</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Le showroom transformé : clients engagés et équipe épanouie</p>
        </section>

        {/* Les leçons apprises */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Ce que nous avons appris
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-[#72B0CC]">1. La technologie doit être invisible</h3>
              <p className="text-gray-700 leading-relaxed">
                Les meilleures installations sont celles qu'on ne remarque pas. Les clients ne pensent pas "je touche un écran tactile", ils pensent "je configure la voiture de mes rêves". La technologie n'est qu'un moyen, l'expérience est la finalité.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-[#CF6E3F]">2. La formation est aussi importante que l'installation</h3>
              <p className="text-gray-700 leading-relaxed">
                Sans une équipe commerciale formée et convaincue, les plus beaux outils restent inexploités. Nous avons passé autant de temps à former les vendeurs qu'à installer le matériel. Résultat : ils sont devenus les meilleurs ambassadeurs du projet.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-[#82BC6C]">3. Le contenu fait la différence</h3>
              <p className="text-gray-700 leading-relaxed">
                Des tables tactiles avec des photos basse résolution et des informations incomplètes ne valent rien. Nous avons travaillé main dans la main avec Jean-Marc pour créer des contenus de qualité : photos HD, vidéos immersives, fiches techniques détaillées. C'est ce contenu premium qui fait la différence.
              </p>
            </div>
          </div>
        </section>

        {/* Conclusion et CTA */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] p-12 rounded-3xl text-white text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Et si votre showroom était le prochain ?
            </h2>
            <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Que vous soyez dans l'automobile, l'immobilier, l'ameublement ou tout autre secteur où l'expérience client fait la différence, nous pouvons transformer votre espace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                className="inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Demander une démo
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] transition-all duration-300"
              >
                Contactez-nous
              </button>
            </div>
            <p className="text-sm opacity-75 mt-6">
              Audit gratuit de votre espace · Devis personnalisé sous 48h · ROI garanti
            </p>
          </div>
        </section>

        {/* Articles suggérés */}
        <section>
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Vous aimerez aussi
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Article suggéré 1 */}
            <a href="#" className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC]"></div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#CF6E3F] uppercase">VR Immobilier</span>
                <h4 className="text-lg font-bold mt-2 group-hover:text-[#CF6E3F] transition-colors">
                  Vendre sur plan avec la réalité virtuelle
                </h4>
              </div>
            </a>

            {/* Article suggéré 2 */}
            <a href="#" className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F]"></div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#82BC6C] uppercase">ROI & Chiffres</span>
                <h4 className="text-lg font-bold mt-2 group-hover:text-[#82BC6C] transition-colors">
                  Le vrai ROI des technologies immersives
                </h4>
              </div>
            </a>

            {/* Article suggéré 3 */}
            <a href="#" className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-40 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C]"></div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#72B0CC] uppercase">Guide pratique</span>
                <h4 className="text-lg font-bold mt-2 group-hover:text-[#72B0CC] transition-colors">
                  5 signes qu'il est temps de moderniser votre showroom
                </h4>
              </div>
            </a>
          </div>
        </section>
      </article>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ArticleShowroomAuto;
