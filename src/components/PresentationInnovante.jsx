import React, { useState } from 'react';
import { Menu, X, ChevronRight, Presentation, Eye, Monitor, Hand, TrendingUp, ArrowRight, Table2, Sparkles, Box, Glasses } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const PresentationInnovante = () => {
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#82BC6C]/10 to-[#CF6E3F]/10 px-6 py-3 rounded-full mb-8">
              <Presentation className="w-5 h-5 text-[#82BC6C]" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>Solutions de Présentation Innovante</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-medium mb-8 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Arrêtez de présenter,<br />
              <span className="bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent">faites vivre l'expérience</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Vos clients ne regardent plus, ils expérimentent. Transformez chaque présentation en immersion mémorable qui convertit et convainc.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#solutions" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Découvrir nos solutions
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full font-medium border-2 border-gray-200 hover:border-[#82BC6C] hover:text-[#82BC6C] transition-all duration-300">
                Demander une démo
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center p-8 bg-gradient-to-br from-[#82BC6C]/5 to-[#CF6E3F]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent mb-2">89%</div>
              <div className="text-gray-600">de mémorisation</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#CF6E3F]/5 to-[#72B0CC]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#CF6E3F] to-[#72B0CC] bg-clip-text text-transparent mb-2">-67%</div>
              <div className="text-gray-600">de modifications</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent mb-2">+450%</div>
              <div className="text-gray-600">d'engagement</div>
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
                Vos clients hochent la tête... <span className="text-[#82BC6C]">mais ne se projettent pas</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>Les catalogues restent fermés, les plans 2D créent le doute, les PowerPoint endorment. Vos clients écoutent mais n'imaginent pas.</p>
                <p>"Je ne suis pas sûr de la couleur..." "Ça va vraiment rentrer dans cet espace ?" "J'aurais voulu voir ça avant..."</p>
                <p className="font-semibold text-gray-800">Résultat : hésitations, modifications coûteuses et opportunités perdues. La différence entre voir et vouloir.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 rounded-3xl flex items-center justify-center">
                <Eye className="w-32 h-32 text-[#82BC6C] opacity-20" />
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
              L'immersion qui <span className="bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent">convertit et convainc</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des technologies qui transforment la présentation en expérience vécue
            </p>
          </div>

          <div className="space-y-16">
            {/* Solution 1: Écrans Tactiles Showroom */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#82BC6C]/10 to-[#CF6E3F]/10 px-4 py-2 rounded-full mb-6">
                  <Monitor className="w-4 h-4 text-[#82BC6C]" />
                  <span className="text-sm font-medium">Écrans Tactiles Showroom</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Explorez vos produits comme jamais
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Transformez votre showroom en expérience interactive. Vos clients explorent, découvrent et se projettent en totale autonomie. Le catalogue 2D appartient au passé.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Hand className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Navigation intuitive et tactile</strong>
                      <p className="text-gray-600">Zoomez, pivotez, explorez chaque détail d'un simple geste</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#CF6E3F] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Catalogue produits immersif</strong>
                      <p className="text-gray-600">Photos HD, vidéos 360°, fiches techniques interactives</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Box className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Personnalisation en temps réel</strong>
                      <p className="text-gray-600">Changez couleurs, options, finitions instantanément</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-video bg-gradient-to-br from-[#82BC6C]/20 to-[#CF6E3F]/20 rounded-3xl flex items-center justify-center">
                  <Monitor className="w-24 h-24 text-[#82BC6C]" />
                </div>
              </div>
            </div>

            {/* Solution 2: Tables Tactiles */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-video bg-gradient-to-br from-[#CF6E3F]/20 to-[#72B0CC]/20 rounded-3xl flex items-center justify-center">
                  <Table2 className="w-24 h-24 text-[#CF6E3F]" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#CF6E3F]/10 to-[#72B0CC]/10 px-4 py-2 rounded-full mb-6">
                  <Table2 className="w-4 h-4 text-[#CF6E3F]" />
                  <span className="text-sm font-medium">Tables Tactiles Collaboratives</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Configurez en temps réel, ensemble
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Rassemblez vos clients autour d'une table interactive. Configurez, personnalisez, décidez ensemble. La collaboration qui transforme l'hésitation en décision.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Hand className="w-6 h-6 text-[#CF6E3F] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Multi-utilisateurs simultanés</strong>
                      <p className="text-gray-600">Jusqu'à 10 personnes peuvent interagir en même temps</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Box className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Configurateur 3D intégré</strong>
                      <p className="text-gray-600">Créez, modifiez, visualisez en 3D temps réel</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Export instantané</strong>
                      <p className="text-gray-600">Envoyez le projet par email ou QR code en un clic</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Solution 3: VR/AR */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/10 to-[#82BC6C]/10 px-4 py-2 rounded-full mb-6">
                  <Glasses className="w-4 h-4 text-[#72B0CC]" />
                  <span className="text-sm font-medium">Réalité Virtuelle</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Visitez des espaces avant construction
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Immersion totale dans vos projets. Marchez dans des bâtiments non construits, changez matériaux et couleurs en direct, ressentez les volumes. La VR qui élimine le doute.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Glasses className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Immersion à 360°</strong>
                      <p className="text-gray-600">Visitez virtuellement chaque pièce, chaque détail</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Eye className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Échelle 1:1 réaliste</strong>
                      <p className="text-gray-600">Ressentez les vraies dimensions, les vraies proportions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#CF6E3F] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Modifications en temps réel</strong>
                      <p className="text-gray-600">Changez finitions, mobilier, éclairage instantanément</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-video bg-gradient-to-br from-[#72B0CC]/20 to-[#82BC6C]/20 rounded-3xl flex items-center justify-center">
                  <Glasses className="w-24 h-24 text-[#72B0CC]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#82BC6C]/5 via-[#CF6E3F]/5 to-[#72B0CC]/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Les bénéfices <span className="bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent">mesurables</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Mémorisation maximale</h3>
              <p className="text-gray-600">89% de mémorisation vs 20% avec une présentation classique</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Box className="w-12 h-12 text-[#CF6E3F] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Modifications réduites</h3>
              <p className="text-gray-600">-67% de demandes de modifications post-signature</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Sparkles className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Engagement décuplé</h3>
              <p className="text-gray-600">+450% d'engagement client pendant la présentation</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Eye className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Projection facilitée</h3>
              <p className="text-gray-600">Vos clients visualisent concrètement leur projet</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Hand className="w-12 h-12 text-[#CF6E3F] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Autonomie client</h3>
              <p className="text-gray-600">Exploration libre et personnalisée de vos offres</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Conversion améliorée</h3>
              <p className="text-gray-600">Cycle de vente raccourci, décisions plus rapides</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Idéal pour <span className="bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent">tous les secteurs</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#82BC6C]/5 to-[#CF6E3F]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Automobile</h3>
              <p className="text-gray-600">Configurez véhicules et options en showroom interactif</p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/5 to-[#72B0CC]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Immobilier</h3>
              <p className="text-gray-600">Visitez appartements et maisons avant construction</p>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Retail & Luxe</h3>
              <p className="text-gray-600">Présentez collections et produits de façon immersive</p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/5 to-[#CF6E3F]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Architecture</h3>
              <p className="text-gray-600">Faites visiter vos projets avant la première pierre</p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/5 to-[#72B0CC]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Aménagement</h3>
              <p className="text-gray-600">Personnalisez cuisines, salles de bains en temps réel</p>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Formation</h3>
              <p className="text-gray-600">Simulez environnements et situations complexes en VR</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-[#82BC6C]/5 to-[#CF6E3F]/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer vos <span className="bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] bg-clip-text text-transparent">présentations</span> ?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Découvrez comment nos solutions immersives révolutionnent l'expérience de vos clients
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/#contact" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#82BC6C] to-[#CF6E3F] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Demander une démo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="/" className="inline-flex items-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full font-medium border-2 border-gray-200 hover:border-[#82BC6C] hover:text-[#82BC6C] transition-all duration-300">
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

export default PresentationInnovante;


