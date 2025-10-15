import React, { useState } from 'react';
import { Menu, X, ChevronRight, Wifi, CheckCircle, Share2, Users, TrendingUp, ArrowRight, Clock, Zap, Video } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const SolutionsCollaboration = () => {
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/10 to-[#82BC6C]/10 px-6 py-3 rounded-full mb-8">
              <Users className="w-5 h-5 text-[#72B0CC]" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>Solutions de Collaboration</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-medium mb-8 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Et si vos réunions<br />
              <span className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent">devenaient enfin productives</span> ?
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Fini les pertes de temps avec des câbles incompatibles et des connexions compliquées. La collaboration sans friction commence ici.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#solutions" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
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
            <div className="text-center p-8 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent mb-2">73%</div>
              <div className="text-gray-600">de temps gagné en réunion</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#82BC6C]/5 to-[#72B0CC]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#82BC6C] to-[#72B0CC] bg-clip-text text-transparent mb-2">&lt;30s</div>
              <div className="text-gray-600">pour démarrer une réunion</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 rounded-3xl">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent mb-2">Zéro</div>
              <div className="text-gray-600">câble nécessaire</div>
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
                Combien de minutes perdez-vous <span className="text-[#72B0CC]">à chaque réunion</span> ?
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>Chaque minute perdue en connexion est une opportunité manquée. Câbles incompatibles, partages d'écran compliqués, visioconférences chaotiques.</p>
                <p>"Attendez, j'ai un problème de son..." "Quelqu'un voit mon écran ?" "Il me faut l'adaptateur..."</p>
                <p className="font-semibold text-gray-800">Vos équipes méritent mieux. La technologie doit suivre votre rythme, pas l'inverse.</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 rounded-3xl flex items-center justify-center">
                <Clock className="w-32 h-32 text-[#72B0CC] opacity-20" />
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
              La collaboration <span className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent">sans friction</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions pensées pour simplifier votre quotidien et maximiser votre productivité
            </p>
          </div>

          <div className="space-y-16">
            {/* Solution 1: Écrans Visio */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC]/10 to-[#82BC6C]/10 px-4 py-2 rounded-full mb-6">
                  <Video className="w-4 h-4 text-[#72B0CC]" />
                  <span className="text-sm font-medium">Écrans Visio Tout-en-Un</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Prêts à l'emploi en moins de 30 secondes
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Caméra, micro, haut-parleurs et écran intégrés. Une seule solution complète pour toutes vos visioconférences. Zéro configuration, 100% efficacité.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Configuration instantanée</strong>
                      <p className="text-gray-600">Allumez et lancez votre réunion, c'est tout</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Video className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Qualité professionnelle</strong>
                      <p className="text-gray-600">4K, audio crystal clear, cadrage automatique intelligent</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Compatible toutes plateformes</strong>
                      <p className="text-gray-600">Teams, Zoom, Google Meet, Webex : tout fonctionne</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="aspect-video bg-gradient-to-br from-[#72B0CC]/20 to-[#82BC6C]/20 rounded-3xl flex items-center justify-center">
                  <Video className="w-24 h-24 text-[#72B0CC]" />
                </div>
              </div>
            </div>

            {/* Solution 2: Partage d'écran sans fil */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="aspect-video bg-gradient-to-br from-[#82BC6C]/20 to-[#72B0CC]/20 rounded-3xl flex items-center justify-center">
                  <Wifi className="w-24 h-24 text-[#82BC6C]" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#82BC6C]/10 to-[#72B0CC]/10 px-4 py-2 rounded-full mb-6">
                  <Wifi className="w-4 h-4 text-[#82BC6C]" />
                  <span className="text-sm font-medium">Partage d'Écran Sans Fil</span>
                </div>
                <h3 className="text-3xl font-medium mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Partagez en un clic, sans aucun câble
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Fini la chasse aux adaptateurs et aux câbles HDMI. Connectez-vous instantanément depuis n'importe quel appareil et partagez votre écran sans friction.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Wifi className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">100% sans fil</strong>
                      <p className="text-gray-600">Aucun câble, aucun adaptateur nécessaire</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Share2 className="w-6 h-6 text-[#72B0CC] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Multi-utilisateurs simultanés</strong>
                      <p className="text-gray-600">Jusqu'à 4 écrans affichés en même temps</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-[#82BC6C] flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-gray-800">Connexion ultra-rapide</strong>
                      <p className="text-gray-600">Un clic et vous êtes connecté</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#72B0CC]/5 via-[#82BC6C]/5 to-[#72B0CC]/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Les bénéfices <span className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent">immédiats</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Clock className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Temps précieux récupéré</h3>
              <p className="text-gray-600">73% de temps gagné sur les problèmes techniques en réunion</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Simplicité extrême</h3>
              <p className="text-gray-600">Moins de 30 secondes pour démarrer une réunion productive</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Productivité maximale</h3>
              <p className="text-gray-600">Concentrez-vous sur le contenu, pas sur la technique</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Users className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Collaboration fluide</h3>
              <p className="text-gray-600">Partagez et collaborez naturellement, sans barrière technique</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#72B0CC] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Zéro formation</h3>
              <p className="text-gray-600">Si intuitif que personne n'a besoin d'être formé</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <Video className="w-12 h-12 text-[#82BC6C] mb-4" />
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>Qualité pro garantie</h3>
              <p className="text-gray-600">Image 4K, son cristallin, expérience premium</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Parfait pour <span className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent">tous vos usages</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Salles de réunion</h3>
              <p className="text-gray-600 mb-4">Transformez vos espaces de réunion en hubs de collaboration ultra-efficaces</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#72B0CC]" /> Visio haute qualité</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#72B0CC]" /> Partage d'écran instantané</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#72B0CC]" /> Multi-participants</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/5 to-[#72B0CC]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Espaces de coworking</h3>
              <p className="text-gray-600 mb-4">Offrez une expérience de collaboration premium à vos utilisateurs</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#82BC6C]" /> Sans installation complexe</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#82BC6C]" /> Compatible BYOD</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#82BC6C]" /> Plug & Play</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Salles de formation</h3>
              <p className="text-gray-600 mb-4">Facilitez l'apprentissage avec des outils de collaboration modernes</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#72B0CC]" /> Partage multi-écrans</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#72B0CC]" /> Formation hybride</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#72B0CC]" /> Enregistrement intégré</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/5 to-[#72B0CC]/5 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bureaux flexibles</h3>
              <p className="text-gray-600 mb-4">Adaptez-vous au travail hybride avec des solutions flexibles</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#82BC6C]" /> Équipes distribuées</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#82BC6C]" /> Hot desking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#82BC6C]" /> Configuration flexible</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à révolutionner vos <span className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] bg-clip-text text-transparent">réunions</span> ?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Découvrez comment nos solutions de collaboration peuvent transformer votre productivité
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/#contact" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-8 py-4 rounded-full font-medium hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
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

export default SolutionsCollaboration;


