import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, Eye, Award, ChevronRight, Video, Zap, TrendingUp } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleVideoconferenceIntegree = () => {
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
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/"><Logo size="lg" /></Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#accueil" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Accueil</Link>
            <Link to="/#offres" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Solutions</Link>
            <Link to="/#mission" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Expertise</Link>
            <Link to="/blog" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">Blog</Link>
            <Link to="/#contact" className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium">Contact</Link>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
            <span className="text-gray-500 text-sm">Réunions Hybrides</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            La visioconférence intégrée : Finir avec les <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">réunions hybrides compliquées</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Comment les écrans tout-en-un transforment l'équité entre participants en salle et à distance
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>24 janvier 2025</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>8 min de lecture</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>Équipe Projectview</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">70%</div>
              <div className="text-sm text-gray-600 font-medium">Des réunions sont hybrides</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">4 appareils</div>
              <div className="text-sm text-gray-600 font-medium">Que vous n'avez plus besoin</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">1 écran</div>
              <div className="text-sm text-gray-600 font-medium">Pour tout contrôler</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">📸 PHOTO HERO</p>
              <p className="text-sm opacity-80 mt-2">Réunion hybride fluide avec visioconférence intégrée</p>
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 mb-32">

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Le <span className="text-[#72B0CC]">problème</span> des réunions hybrides traditionnelles
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Vous connaissez la scène : 5 personnes en salle, 3 sur Zoom. Mais la caméra reste fixe au fond de la pièce. Les gens assis devant elle dominent la conversation. Les autres ? Invisibles. Et le son ? Soit vous entendez les participants à distance, soit ceux en salle - rarement les deux équitablement.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">AVANT</span>
              Les symptômes
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Caméra unique :</strong> Seuls ceux près de la caméra sont visibles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Système de son mauvais :</strong> Écho, larsen, ou participants distants inaudibles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span><strong>Multiples appareils :</strong> Laptop + écran + caméra PTZ + micro externe</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les écrans tout-en-un : La <span className="text-[#82BC6C]">solution</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Les meilleures salles de réunion modernes abandonnent cette architecture compliquée pour un écran unique qui intègre :
          </p>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#72B0CC]" />
                Caméra HD haute sensibilité + angle large
              </h3>
              <p className="text-gray-700">Tous les participants en salle sont visibles, qu'ils soient assis près de l'écran ou au fond. La caméra s'adapte à la luminosité.</p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#CF6E3F]" />
                Microphone array avec suppression de bruit
              </h3>
              <p className="text-gray-700">Les mics captent la parole naturelle. L'IA élimine le bruit de climatisation et d'écho. Résultat : les participants distants entendent clairement.</p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#82BC6C]" />
                Haut-parleurs intégrés de qualité
              </h3>
              <p className="text-gray-700">Pas besoin de système audio externe. Les participants distants sont diffusés avec clarté dans toute la pièce.</p>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#72B0CC]" />
                Applis vidéo natives (Teams, Zoom, Google Meet)
              </h3>
              <p className="text-gray-700">Pas de laptop à connecter. L'écran lance directement votre réunion. Un seul clic pour démarrer.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 COMPARAISON : Avant / Après</p>
                <p className="text-sm opacity-80 mt-2">Setup traditionnel vs écran tout-en-un</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            L'impact réel : Plus que du <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">confort</span>
          </h2>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl mb-8">
            <p className="text-lg text-gray-800 italic mb-4">
              <strong>"Une réunion où tout le monde se voit et s'entend clairement, c'est une réunion 30% plus courte et 40% plus productive."</strong>
            </p>
            <p className="text-sm text-gray-600">— Étude Microsoft sur les réunions hybrides</p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Quand les appels vidéo sont fluides et équitables, la réunion elle-même devient meilleure. Les gens ne perdent pas 10 minutes à "tester le son" ou "me voyez-vous bien ?". Ils peuvent enfin se concentrer sur le sujet.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt pour une vraie <span className="text-[#82BC6C]">réunion hybride</span> ?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            L'infrastructure compte. Quand votre écran tout-en-un intègre caméra, micro, haut-parleur et logiciels de vidéo, vous transformez votre salle en espace vraiment collaboratif.
          </p>
        </section>

      </article>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] opacity-90"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mettez en place les réunions hybrides qui fonctionnent
          </h2>

          <p className="text-xl md:text-xl mb-12 opacity-95 max-w-2xl mx-auto">
            Nos experts vous aident à installer et configurer le setup idéal pour vos réunions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => window.dispatchEvent(new Event('openChatbot'))} className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300">
              <span>Consulter un expert</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link to="/blog" className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300">
              Retour au blog
            </Link>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default ArticleVideoconferenceIntegree;
