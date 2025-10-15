import React, { useState } from 'react';
import { Menu, X, ChevronRight, Radio, Monitor, Smartphone, Sparkles, Zap, Eye, TrendingUp, ArrowRight } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';
import EspaceCommunication from '../../Images/Espace communication.jpg';
import AffichageRue from '../../Images/affichage rue.png';
import NFCSystem from '../../Images/nfc system.png';

const AffichageDynamique = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />

            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-[#72B0CC] transition-colors">Accueil</a>
              <a href="/#solutions" className="text-gray-700 hover:text-[#72B0CC] transition-colors">Solutions</a>
              <a href="/#about" className="text-gray-700 hover:text-[#72B0CC] transition-colors">À propos</a>
              <a href="/#contact" className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Contact
              </a>
            </div>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="/" className="block text-gray-700 hover:text-[#72B0CC] transition-colors">Accueil</a>
              <a href="/#solutions" className="block text-gray-700 hover:text-[#72B0CC] transition-colors">Solutions</a>
              <a href="/#about" className="block text-gray-700 hover:text-[#72B0CC] transition-colors">À propos</a>
              <a href="/#contact" className="block bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-lg transition-all text-center">
                Contact
              </a>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#CF6E3F]/10 to-[#72B0CC]/10 px-6 py-3 rounded-full mb-8">
              <Radio className="w-5 h-5 text-[#CF6E3F]" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>Affichage Dynamique & Interactif</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-medium mb-8 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Captez l'attention,<br />
              <span className="bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] bg-clip-text text-transparent">créez l'engagement</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Dans un monde saturé d'écrans, votre message mérite d'être vu. Transformez chaque point de contact en expérience mémorable avec nos solutions d'affichage dynamique et interactif.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#solutions" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Découvrir nos solutions
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full font-medium border-2 border-gray-200 hover:border-[#72B0CC] hover:text-[#72B0CC] transition-all duration-300">
                Demander une démo
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-8 bg-gradient-to-br from-[#CF6E3F]/5 to-[#72B0CC]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] bg-clip-text text-transparent mb-2">+340%</div>
              <div className="text-gray-600">d'engagement client</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-600">Communication active</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#82BC6C]/5 to-[#CF6E3F]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent mb-2">-65%</div>
              <div className="text-gray-600">Coûts d'impression</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Votre espace communique-t-il <span className="text-[#CF6E3F]">vraiment</span> avec vos clients ?
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>Dans un monde saturé d'écrans, votre message reste invisible. Les supports statiques ne captent plus l'attention, ils la perdent.</p>
                <p>Pendant ce temps, vos produits phares passent inaperçus, vos promotions ne sont pas vues, et vos clients ne reçoivent pas l'information dont ils ont besoin au bon moment.</p>
                <p className="font-semibold text-gray-800">Le résultat ? Des opportunités manquées et un retour sur investissement décevant.</p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={EspaceCommunication}
                  alt="Espace communication"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              L'impact visuel qui <span className="bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] bg-clip-text text-transparent">capte et engage</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos solutions d'affichage dynamique transforment chaque point de contact en expérience mémorable
            </p>
          </div>

          <div className="space-y-16">
            {/* Solution 1: Écrans Publicitaires */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#CF6E3F]/10 to-[#72B0CC]/10 px-4 py-2 rounded-full mb-6">
                  <Monitor className="w-4 h-4 text-[#CF6E3F]" />
                  <span className="text-sm font-medium">Écrans Publicitaires Animés</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Des contenus qui captent le regard
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Fini les affichages statiques ignorés. Nos écrans publicitaires diffusent des contenus dynamiques, animés et parfaitement synchronisés avec vos objectifs commerciaux.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#CF6E3F] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Contenus personnalisables en temps réel</strong>
                      <p className="text-gray-600">Adaptez vos messages selon l'heure, la saison ou l'événement en cours</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Gestion centralisée et simplifiée</strong>
                      <p className="text-gray-600">Pilotez tous vos écrans depuis une seule interface intuitive</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Analytics et performance</strong>
                      <p className="text-gray-600">Mesurez l'impact de vos campagnes avec des données précises</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="rounded-3xl overflow-hidden shadow-lg h-56 sm:h-64 md:h-80 lg:h-[420px]">
                  <img
                    src={AffichageRue}
                    alt="Affichage rue"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Solution 2: Système NFC */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="rounded-3xl overflow-hidden shadow-lg h-56 sm:h-64 md:h-80 lg:h-[420px]">
                  <img
                    src={NFCSystem}
                    alt="Syst��me NFC"
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/10 to-[#82BC6C]/10 px-4 py-2 rounded-full mb-6">
                  <Smartphone className="w-4 h-4 text-[#72B0CC]" />
                  <span className="text-sm font-medium">Système NFC Interactif</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Mettez vos produits en avant d'un simple geste
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Transformez la découverte produit en expérience interactive. Vos clients approchent leur smartphone, et accèdent instantanément à toutes les informations dont ils ont besoin.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Accès instantané aux informations</strong>
                      <p className="text-gray-600">Fiches techniques, vidéos, avis clients : tout à portée de main</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Expérience enrichie et mémorable</strong>
                      <p className="text-gray-600">Créez un lien direct entre vos produits et vos clients</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-[#CF6E3F] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Collecte de données précieuses</strong>
                      <p className="text-gray-600">Comprenez quels produits suscitent le plus d'intérêt</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#CF6E3F]/5 via-[#72B0CC]/5 to-[#82BC6C]/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Les bénéfices <span className="bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] bg-clip-text text-transparent">concrets</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Eye className="w-12 h-12 text-[#CF6E3F] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Attention captée</h3>
              <p className="text-gray-600">+340% d'engagement client grâce à des contenus dynamiques et pertinents</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Agilité maximale</h3>
              <p className="text-gray-600">Mettez à jour vos contenus en quelques clics, sans frais d'impression</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>ROI mesurable</h3>
              <p className="text-gray-600">Suivez précisément l'impact de vos campagnes avec nos analytics</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="w-12 h-12 text-[#CF6E3F] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Expérience moderne</h3>
              <p className="text-gray-600">Offrez une image innovante et technologique à votre marque</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Monitor className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Économies réelles</h3>
              <p className="text-gray-600">-65% de coûts d'impression et de logistique</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Smartphone className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Interactivité</h3>
              <p className="text-gray-600">Créez un lien direct entre vos produits et vos clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer votre <span className="bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] bg-clip-text text-transparent">communication</span> ?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Découvrez comment nos solutions d'affichage dynamique peuvent révolutionner votre expérience client
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/#contact" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Demander une démo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="/" className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full font-medium border-2 border-gray-200 hover:border-[#72B0CC] hover:text-[#72B0CC] transition-all duration-300">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Projectview
              </div>
              <p className="text-gray-400">Transformez votre expérience client avec nos solutions innovantes</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/solutions/affichage-dynamique" className="hover:text-[#72B0CC] transition-colors">Affichage Dynamique</a></li>
                <li><a href="/solutions/collaboration" className="hover:text-[#72B0CC] transition-colors">Collaboration</a></li>
                <li><a href="/solutions/presentation-innovante" className="hover:text-[#72B0CC] transition-colors">Présentation Innovante</a></li>
                <li><a href="/solutions/assistant-ia" className="hover:text-[#72B0CC] transition-colors">Assistant IA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/#about" className="hover:text-[#72B0CC] transition-colors">À propos</a></li>
                <li><a href="/#contact" className="hover:text-[#72B0CC] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#72B0CC] transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-[#72B0CC] transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Projectview. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default AffichageDynamique;


