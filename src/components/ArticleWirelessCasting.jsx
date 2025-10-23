import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, Eye, Award, ChevronRight, Wifi, Zap, TrendingUp } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleWirelessCasting = () => {
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
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-4 py-2 rounded-full text-sm font-bold">
              <Award className="w-4 h-4" />
              Guide Informatif
            </span>
            <span className="text-gray-500 text-sm">Technologie & Connectivité</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Partage d'écran sans fil : Finissez avec les <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">câbles</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            AirPlay, Miracast, Google Cast : comment fonctionnent ces technologies et laquelle choisir pour des réunions fluides
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>22 janvier 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>9 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Équipe Projectview</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">-300%</div>
              <div className="text-sm text-gray-600 font-medium">Moins de câbles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">100ms</div>
              <div className="text-sm text-gray-600 font-medium">Latence quasi nulle</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">8 appareils</div>
              <div className="text-sm text-gray-600 font-medium">Peuvent se connecter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image hero */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Wifi className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">📸 PHOTO HERO</p>
              <p className="text-sm opacity-80 mt-2">Partage d'écran sans fil en action - aucun câble</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <article className="max-w-4xl mx-auto px-6 mb-32">

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Le <span className="text-[#72B0CC]">cauchemar</span> des réunions modernes : les câbles
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Vous avez déjà vécu cette scène : vous arrivez en réunion avec votre laptop, regardez l'écran géant, puis...  où est l'adaptateur HDMI ? Qui a l'USB-C ? Pourquoi le MacBook ne marche pas avec ce câble ?
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Les câbles sont le symptôme d'une époque révolue. Aujourd'hui, les meilleures salles de réunion capables d'accueillir 10 personnes qui veulent chacun partager leur écran en 5 secondes utilisent le partage sans fil.
          </p>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl mb-8">
            <p className="text-lg text-gray-800 italic">
              <strong>"Une réunion qui commence par 'attendez, je cherche le bon câble' est une réunion qui a déjà perdu son élan."</strong>
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les 3 protocoles <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">dominants</span>
          </h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                AirPlay (Apple)
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Fonctionnement :</strong> Technologie propriétaire d'Apple utilisant Wi-Fi direct pour envoyer l'écran d'un Mac, iPad ou iPhone vers un écran compatible.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Très fluide (latence 30-50ms)</li>
                    <li>• Sécurisé (authentification)</li>
                    <li>• Intégré nativement iOS/macOS</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">❌ Inconvénients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Exclusif aux appareils Apple</li>
                    <li>• Nécessite Wi-Fi dédié performant</li>
                    <li>• Pas de multi-écran simultané (officiel)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                Miracast (Microsoft/Intel)
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Fonctionnement :</strong> Standard ouvert basé sur Wi-Fi Direct. Windows, Android et certains appareils Linux supportent nativement Miracast.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Standard ouvert</li>
                    <li>• Fonctionne sur Windows, Android</li>
                    <li>• Latence faible (50-100ms)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">❌ Inconvénients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Moins fluide qu'AirPlay</li>
                    <li>• Compatibilité inégale</li>
                    <li>• Configuration parfois complexe</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-8 rounded-2xl border-2 border-red-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                Google Cast / Chromecast
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Fonctionnement :</strong> Protocole propriétaire Google offrant une intégration avec Chrome, Chromebooks et appareils Google. Plus large que juste le casting d'écran.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Très largement compatible</li>
                    <li>• Excellent pour contenu web</li>
                    <li>• Streaming audio/vidéo fluide</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">❌ Inconvénients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Latence plus élevée (200-300ms)</li>
                    <li>• Moins adapté au gaming/interactif</li>
                    <li>• Pas optimal pour réunion collaborative</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 TABLEAU : Comparaison des protocoles</p>
                <p className="text-sm opacity-80 mt-2">Latence, compatibilité, qualité vidéo - side by side</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Chaque protocole excelle dans un contexte différent</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Comment le wireless casting <span className="text-[#82BC6C]">transforme</span> les réunions
          </h2>

          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#72B0CC]" />
                Instantanéité
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Pas d'attente "je cherche le câble". Chacun se connecte en 2 secondes. La réunion peut démarrer immédiatement.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#CF6E3F]" />
                Fluidité collaborative
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Plusieurs utilisateurs peuvent switcher rapidement. Alice partage son écran, puis c'est au tour de Bob, puis de Claire. Zéro friction.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#82BC6C]" />
                Inclusivité
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Tout le monde avec un ordinateur portable, un téléphone ou une tablette peut participer. Aucun équipement spécial nécessaire.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quelle technologie pour votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">salle</span> ?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Le choix dépend surtout de votre écosystème d'appareils et de vos besoins en latence :
          </p>

          <div className="space-y-4 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#72B0CC]">→</span>
              <div>
                <p className="font-bold text-gray-900">Salle avec majorité Apple ?</p>
                <p className="text-gray-700">AirPlay. Simple, fluide, rapide.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#CF6E3F]">→</span>
              <div>
                <p className="font-bold text-gray-900">Équipe Microsoft + quelques Mac ?</p>
                <p className="text-gray-700">Solution hybride : Miracast pour Windows + AirPlay pour Mac. L'écran professionnel doit supporter les deux.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#82BC6C]">→</span>
              <div>
                <p className="font-bold text-gray-900">Besoin de présenter via navigateur ?</p>
                <p className="text-gray-700">Google Cast excelle pour afficher des slides en ligne, YouTube, Google Meet, etc.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#72B0CC]">→</span>
              <div>
                <p className="font-bold text-gray-900">Réunions très interactives + gaming ?</p>
                <p className="text-gray-700">Privilégiez AirPlay (latence la plus basse). Miracast en second choix.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-yellow-200 to-orange-400 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 CAS D'USAGE</p>
                <p className="text-sm opacity-80 mt-2">Exemples de configurations réelles et performantes</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Solutions testées et validées en vraies conditions</p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            L'avenir du partage d'écran : <span className="text-[#82BC6C]">sans friction</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Les trois protocoles (AirPlay, Miracast, Google Cast) coexistent et continueront de dominer. Mais les meilleures salles de réunion de demain supporteront les trois nativement. C'est ce qui fait toute la différence : pouvoir accueillir n'importe quel appareil, n'importe quel utilisateur, sans friction technologique.
          </p>

          <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30 mb-8">
            <p className="text-gray-800 italic mb-4">
              "Chez Projectview, nos écrans gèrent AirPlay, Miracast ET Google Cast. C'est la vraie différence : la flexibilité."
            </p>
          </div>
        </section>

      </article>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] opacity-90"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transformez vos réunions avec le wireless casting
          </h2>

          <p className="text-xl md:text-xl mb-12 opacity-95 max-w-2xl mx-auto">
            Plus de câbles, plus d'attentes. Juste la collaboration fluide qu'il faut.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              <span>Configurer le wireless casting</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Voir autres articles
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ArticleWirelessCasting;
