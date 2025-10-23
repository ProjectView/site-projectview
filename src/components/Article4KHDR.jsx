import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, Eye, Award, ChevronRight, Zap } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const Article4KHDR = () => {
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
              <Link to="/#offres" className="block font-medium">Solutions</Link>
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
              Comparatif Technique
            </span>
            <span className="text-gray-500 text-sm">Résolution & Couleur</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            4K vs FHD : Faut-il vraiment investir ? Un <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">guide pratique</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Quand le 4K vaut l'investissement, quand FHD suffit, et pourquoi le HDR change vraiment la donne
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>26 janvier 2025</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>10 min de lecture</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>Équipe Projectview</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">4x</div>
              <div className="text-sm text-gray-600 font-medium">Plus de pixels en 4K</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">1 billion</div>
              <div className="text-sm text-gray-600 font-medium">Nuances HDR</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">65"+</div>
              <div className="text-sm text-gray-600 font-medium">Minimum pour 4K</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Eye className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">📸 PHOTO HERO</p>
              <p className="text-sm opacity-80 mt-2">Écran 4K HDR avec reproduction couleur exceptionnelle</p>
            </div>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 mb-32">

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Décrypter les <span className="text-[#72B0CC]">chiffres</span> : FHD, 2K, 4K, 8K
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Commençons par les bases. La résolution, c'est le nombre de pixels affichés. Plus il y en a, plus l'image est nette - mais attention, seulement si vous êtes assez loin de l'écran pour que votre œil bénéficie de cette finesse.
          </p>

          <div className="space-y-4 bg-gradient-to-br from-[#72B0CC]/5 to-[#82BC6C]/5 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-bold">Full HD (1080p)</p><p className="text-sm text-gray-700">1920×1080 pixels</p></div>
              <p className="text-gray-700 font-semibold">Standard depuis 2008</p>
            </div>
            <div className="flex items-start justify-between gap-4 pt-4 border-t border-[#72B0CC]/20">
              <div><p className="font-bold">2K (1440p)</p><p className="text-sm text-gray-700">2560×1440 pixels</p></div>
              <p className="text-gray-700 font-semibold">Niche professionnelle</p>
            </div>
            <div className="flex items-start justify-between gap-4 pt-4 border-t border-[#72B0CC]/20">
              <div><p className="font-bold">4K (2160p)</p><p className="text-sm text-gray-700">3840×2160 pixels</p></div>
              <p className="text-gray-700 font-semibold">La norme aujourd'hui 65"+</p>
            </div>
            <div className="flex items-start justify-between gap-4 pt-4 border-t border-[#72B0CC]/20">
              <div><p className="font-bold">8K (4320p)</p><p className="text-sm text-gray-700">7680×4320 pixels</p></div>
              <p className="text-gray-700 font-semibold">Avenir (peu de contenu)</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Quand vous <span className="text-[#CF6E3F]">voyez vraiment</span> la différence
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Voici l'important : vous ne remarquez les pixels que si vous êtes trop près de l'écran. C'est la "distance de vision critique".
          </p>

          <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30 mb-8">
            <h3 className="text-xl font-bold mb-4">Règle d'or : Distance = 1.5 x la diagonale de l'écran</h3>
            <div className="space-y-3 text-gray-700">
              <div>• Écran 55" en FHD ? Asseyez-vous à 3.5 m minimum pour ne pas voir les pixels</div>
              <div>• Écran 55" en 4K ? Vous pouvez vous asseoir à 2.5 m sans remarquer la pixelisation</div>
              <div>• Écran 75" en FHD ? Pixelisation visible dès 2 m - mauvais choix</div>
              <div>• Écran 75" en 4K ? Excellent à toute distance de salle de réunion normale</div>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            <strong>Conclusion simple :</strong> Pour un écran 55" ou moins, FHD suffit amplement. Au-delà de 65", le 4K devient quasi obligatoire pour éviter la pixelisation.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            HDR : Le vrai <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">changement</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Vous pouvez avoir une résolution 4K magnifique, mais si les couleurs sont fades et le contraste médiocre, ça ne sert à rien. C'est où le HDR intervient.
          </p>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3">HDR = High Dynamic Range</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Non content de montrer plus de pixels, le HDR affiche aussi plus de niveaux de luminosité et de nuances. Là où un écran SDR (standard) affiche 16 millions de couleurs, un écran HDR en affiche 1 milliard.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm font-bold text-gray-900 mb-2">Exemple concret :</p>
                <p className="text-sm text-gray-700">Un coucher de soleil en SDR : une dégradation terne orange-rouge. En HDR : des centaines de nuances, du doré au rouge vif, avec des contrastes explosifs.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <h3 className="text-xl font-bold mb-3">L'impact professionnel</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                  <span><strong>Données et graphiques :</strong> Les contrastes forts entre séries rendent les données plus lisibles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                  <span><strong>Présentations vidéo :</strong> Les vidéos en 4K HDR (Netflix, YouTube) transcendent littéralement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#82BC6C] flex-shrink-0 mt-0.5" />
                  <span><strong>Design et créatif :</strong> Les designers et architectes voient leurs rendus exactement comme prévu</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            La matrice de <span className="text-[#82BC6C]">décision</span>
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-[#72B0CC] rounded-xl p-4">
              <p className="font-bold text-gray-900">43-55" + réunions standard → FHD suffisant</p>
              <p className="text-sm text-gray-600">Budgets limités, documents partagés, appels vidéo</p>
            </div>

            <div className="border-2 border-[#CF6E3F] rounded-xl p-4">
              <p className="font-bold text-gray-900">65"+ + contenu riche → 4K sans HDR</p>
              <p className="text-sm text-gray-600">Showrooms, présentations, espaces collaboratifs premium</p>
            </div>

            <div className="border-2 border-[#82BC6C] rounded-xl p-4">
              <p className="font-bold text-gray-900">75"+ + contenus vidéo/créatifs → 4K + HDR</p>
              <p className="text-sm text-gray-600">Agences créatives, cinéma d'entreprise, prestige</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">décider</span> ?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            4K ou FHD ? HDR ou pas ? Demandez-vous simplement : quelle est la distance moyenne de vision ? Quel type de contenu ? Quel budget ? Les bonnes réponses vous donneront la réponse.
          </p>
        </section>

      </article>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Choisir le bon écran pour vos besoins</h2>
          <p className="text-xl mb-12 opacity-95">Besoin de conseils ? Nos experts vous guident vers la meilleure résolution.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => window.dispatchEvent(new Event('openChatbot'))} className="group inline-flex items-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:scale-110 transition-all">
              <span>Obtenir une recommandation</span>
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

export default Article4KHDR;
