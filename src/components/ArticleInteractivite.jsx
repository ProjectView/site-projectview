import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, Eye, Award, ChevronRight, Zap } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleInteractivite = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/"><Logo size="lg" /></Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#accueil" className="hover:text-[#72B0CC] font-medium">Accueil</Link>
            <Link to="/#offres" className="hover:text-[#72B0CC] font-medium">Solutions</Link>
            <Link to="/#mission" className="hover:text-[#72B0CC] font-medium">Expertise</Link>
            <Link to="/blog" className="hover:text-[#72B0CC] font-medium">Blog</Link>
            <Link to="/#contact" className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full font-medium">Contact</Link>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 border-t">
            <div className="px-6 py-6 space-y-4">
              <Link to="/#accueil" className="block font-medium">Accueil</Link>
              <Link to="/blog" className="block font-medium">Blog</Link>
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
              Innovation
            </span>
            <span className="text-gray-500 text-sm">Engagement & Technologie</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            NFC, gestes, détection : L'interactivité <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">sans contact</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Comment les écrans modernes amplifient l'engagement avec la détection de mouvements, les tags NFC et la reconnaissance de gestes
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>28 janvier 2025</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>8 min de lecture</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>Équipe Projectview</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">+300%</div>
              <div className="text-sm text-gray-600 font-medium">Engagement accru</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">0ms</div>
              <div className="text-sm text-gray-600 font-medium">Latence NFC</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">10 appareils</div>
              <div className="text-sm text-gray-600 font-medium">Simultanément</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Zap className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">📸 PHOTO HERO</p>
              <p className="text-sm opacity-80 mt-2">Écran interactif détectant gestes et NFC</p>
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 mb-32">

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Au-delà du simple <span className="text-[#72B0CC]">tactile</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Un écran tactile, c'est basique maintenant. Mais une véritable expérience interactive ? Elle engage sans besoin de contact direct. Les clients s'approchent, font un geste, posent leur téléphone contre le verre... et boom, quelque chose se passe. C'est magique.
          </p>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl mb-8">
            <p className="text-lg text-gray-800 italic">
              <strong>"L'interactivité sans contact = 3x plus de dwell time (temps passé devant l'écran) = 3x plus de chance de conversion."</strong>
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les 3 technologies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">clés</span>
          </h2>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">1</span>
                NFC (Near Field Communication)
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Qu'est-ce que c'est :</strong> Technologie de communication sans contact sur courte distance (5-10cm). Quand quelqu'un approche un smartphone ou une badge NFC, l'écran détecte et déclenche une action.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">Cas d'usage réel :</p>
                <p className="text-sm text-gray-700">Un client s'approche d'une présentation en showroom avec son téléphone. Il passe le téléphone près du logo Projectview → L'écran lance automatiquement une vidéo HD, envoie au client ses contact details par mail, propose un RDV.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">2</span>
                Détection de mouvement et gestes
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Qu'est-ce que c'est :</strong> Caméra + IA détectant les mouvements du corps ou des mains. Faire un geste suffit pour naviguer, valider, ou appeler une fonction.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">Cas d'usage réel :</p>
                <p className="text-sm text-gray-700">Un visiteur s'approche d'un affichage dynamique. L'écran le détecte → affiche un contenu. Il lève la main → vidéo démarre. Il fait un geste "balayer" → navigation vers la vidéo suivante. Zéro contact requis.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-8 rounded-2xl border-2 border-red-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center">3</span>
                Détection d'objet / Proximité
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Qu'est-ce que c'est :</strong> Capteurs IR ou caméra 3D détectant qu'un objet (ou un produit) est posé sur l'écran ou à proximité. Déclenche une interaction.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">Cas d'usage réel :</p>
                <p className="text-sm text-gray-700">Client en magasin. Il pose un produit sur une table tactile interactive → L'écran reconnaît le code-barre par image, affiche infos produit, prix, avis clients, vidéo démo. Wow factor = 100%.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 EXEMPLES : 5 cas d'usage transformants</p>
                <p className="text-sm opacity-80 mt-2">Showrooms, retail, hôtellerie, événementiel</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Pourquoi c'est <span className="text-[#82BC6C]">transformant</span>
          </h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-6 rounded-2xl border-2 border-[#72B0CC]/30">
              <p className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#72B0CC] flex-shrink-0 mt-0.5" />
                Wow factor immédiat
              </p>
              <p className="text-sm text-gray-700">Les gens ne s'attendent pas à une interaction sans contact. C'est mémorable.</p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-6 rounded-2xl border-2 border-[#CF6E3F]/30">
              <p className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#CF6E3F] flex-shrink-0 mt-0.5" />
                Plus d'hygiène
              </p>
              <p className="text-sm text-gray-700">Post-COVID, beaucoup préfèrent ne pas toucher les écrans. NFC + gestes = solution idéale.</p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-6 rounded-2xl border-2 border-[#82BC6C]/30">
              <p className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                Données riches
              </p>
              <p className="text-sm text-gray-700">Chaque interaction (NFC scan, geste reconnu) est loggée. Vous comprenez vraiment l'engagement.</p>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 p-6 rounded-2xl border-2 border-[#72B0CC]/30">
              <p className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-[#72B0CC] flex-shrink-0 mt-0.5" />
                Conversions +40%
              </p>
              <p className="text-sm text-gray-700">Nos clients constatent régulièrement une augmentation du taux de conversion avec interactivité avancée.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quel écran pour quelle <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">interaction</span> ?
          </h2>

          <div className="space-y-4 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#72B0CC]">→</span>
              <div>
                <p className="font-bold text-gray-900">Showroom/Retail : NFC + Gestes</p>
                <p className="text-sm text-gray-700">Outil idéal pour reconnaissance produit et navigation fluide</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#CF6E3F]">→</span>
              <div>
                <p className="font-bold text-gray-900">Hôtellerie/Événementiel : Détection de mouvement</p>
                <p className="text-sm text-gray-700">L'écran se "réveille" quand quelqu'un s'approche, engage via gestes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-[#82BC6C]">→</span>
              <div>
                <p className="font-bold text-gray-900">Réunions collaboratives : Tactile + détection</p>
                <p className="text-sm text-gray-700">Combinez tactile traditionnel pour la prise de notes avec détection pour l'engagement à distance</p>
              </div>
            </div>
          </div>
        </section>

      </article>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Transformez l'expérience avec l'interactivité avancée</h2>
          <p className="text-xl mb-12 opacity-95">NFC, gestes, détection de mouvement. C'est le futur de l'engagement.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => window.dispatchEvent(new Event('openChatbot'))} className="group inline-flex items-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:scale-110 transition-all">
              <span>Demander une démo</span>
              <ChevronRight className="w-6 h-6" />
            </button>
            <Link to="/blog" className="inline-flex items-center gap-3 bg-white/10 border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] transition-all">
              Retour au blog
            </Link>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default ArticleInteractivite;
