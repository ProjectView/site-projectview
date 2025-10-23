import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, CheckCircle, Eye, Award, ChevronRight, Monitor, Zap, TrendingUp } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleEcransTactiles = () => {
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
            <span className="text-gray-500 text-sm">Technologie & Innovation</span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les écrans tactiles : De la <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">résistance à la capacité</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Comprendre les technologies tactiles, leur évolution et comment choisir l'écran adapté à vos besoins professionnels
          </p>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>20 janvier 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>10 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Équipe Projectview</span>
            </div>
          </div>

          {/* Stats clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white rounded-2xl shadow-xl border-2 border-[#72B0CC]/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] mb-2">50+ ans</div>
              <div className="text-sm text-gray-600 font-medium">D'évolution technologique</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] mb-2">2 types</div>
              <div className="text-sm text-gray-600 font-medium">De technologies principales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] mb-2">99.9%</div>
              <div className="text-sm text-gray-600 font-medium">De précision tactile</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image hero */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-20 relative z-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
          <div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Monitor className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium">📸 PHOTO HERO</p>
              <p className="text-sm opacity-80 mt-2">Écran tactile haute résolution en salle de réunion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <article className="max-w-4xl mx-auto px-6 mb-32">

        {/* Section 1 : Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Pourquoi les écrans tactiles sont devenus <span className="text-[#72B0CC]">indispensables</span> en environnement professionnel
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Depuis les premiers prototypes en 1971 jusqu'aux écrans haute résolution d'aujourd'hui, la technologie tactile a transformé notre façon de communiquer et de collaborer. Dans les salles de réunion, les showrooms et les espaces de travail modernes, un écran tactile n'est plus un gadget : c'est un levier de productivité.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Mais toutes les technologies tactiles ne se valent pas. Résistive, capacitive, infrarouge... comment naviguer ce dédale technique pour faire le bon choix ?
          </p>

          <div className="bg-blue-50 border-l-4 border-[#72B0CC] p-6 rounded-r-xl mb-8">
            <p className="text-lg text-gray-800 italic">
              <strong>"Un bon écran tactile amplifie la collaboration. Un mauvais écran tue l'engagement en 30 secondes."</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">— Constat de notre équipe après 500+ installations</p>
          </div>
        </section>

        {/* Section 2 : Histoire et évolution */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Une brève histoire de la technologie <span className="text-[#CF6E3F]">tactile</span>
          </h2>

          <div className="space-y-8">
            <div className="border-l-4 border-[#72B0CC] pl-8 pb-8">
              <h3 className="text-xl font-bold mb-3">1971 - Les débuts (Technologie résistive)</h3>
              <p className="text-gray-700 leading-relaxed">
                Le premier écran tactile, créé par Sam Hurst, était une simple couche résistive : deux membranes conductrices qui se touchent quand on appuie. Simple, robuste, peu onéreux. Mais peu précis et avec un temps de réponse lent.
              </p>
            </div>

            <div className="border-l-4 border-[#82BC6C] pl-8 pb-8">
              <h3 className="text-xl font-bold mb-3">2007 - Révolution (Technologie capacitive)</h3>
              <p className="text-gray-700 leading-relaxed">
                L'iPhone arrive et révolutionne tout. La technologie capacitive détecte l'électricité du corps humain, permettant du multi-touch fluide et haute résolution. Les écrans tactiles deviennent intuitifs et responsifs.
              </p>
            </div>

            <div className="border-l-4 border-[#CF6E3F] pl-8">
              <h3 className="text-xl font-bold mb-3">2020-2025 - Maturité (Hybrides et avancées)</h3>
              <p className="text-gray-700 leading-relaxed">
                Aujourd'hui, les meilleures solutions professionnelles combinent capacitif, infrarouge et détection optique pour une précision maximale avec gants, accessoires, ou même sans contact.
              </p>
            </div>
          </div>
        </section>

        {/* PHOTO : Évolution technologique */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 PHOTO : Évolution des écrans tactiles</p>
                <p className="text-sm opacity-80 mt-2">Comparaison visuelle : ancien écran résistif vs moderne capacitif</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">L'évolution remarquable de la précision et de la réactivité sur 50 ans</p>
        </section>

        {/* Section 3 : Comment ça marche */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Comprendre les 3 technologies <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">tactiles principales</span>
          </h2>

          <div className="space-y-6 mb-8">
            {/* Technologie 1 : Résistive */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-8 rounded-2xl border-2 border-red-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Technologie Résistive
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Fonctionnement :</strong> Deux membranes conductrices séparées par une couche spacer. Quand vous appuyez, les deux se touchent et créent un circuit fermé.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Fonctionne avec gants</li>
                    <li>• Très peu cher</li>
                    <li>• Robuste et durable</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">❌ Inconvénients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Pas de multi-touch</li>
                    <li>• Temps de réponse lent</li>
                    <li>• Perte de 25% de luminosité</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">💼 Cas d'usage : Petites installations, environnements industriels, budgets limités</p>
            </div>

            {/* Technologie 2 : Capacitive */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Technologie Capacitive
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Fonctionnement :</strong> Une grille de capteurs détecte l'électricité du corps humain. Pas de contact physique nécessaire - juste la proximité suffit.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Multi-touch fluide</li>
                    <li>• Excellente précision</li>
                    <li>• Image très claire</li>
                    <li>• Haute responsivité</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">❌ Inconvénients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Ne fonctionne pas avec gants</li>
                    <li>• Plus onéreux</li>
                    <li>• Sensible aux interférences</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">💼 Cas d'usage : Salles de réunion, showrooms, espaces collaboratifs - la norme professionnelle</p>
            </div>

            {/* Technologie 3 : Infrarouge */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-8 rounded-2xl border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Technologie Infrarouge (IR)
              </h3>
              <p className="text-gray-800 leading-relaxed mb-4">
                <strong>Fonctionnement :</strong> Une matrice de LED infrarouge crée une grille optique. Tout objet qui traverse cette grille est détecté - avec ou sans contact direct.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">✅ Avantages</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Fonctionne avec gants</li>
                    <li>• Très précis (1mm)</li>
                    <li>• Détecte tout objet</li>
                    <li>• Pas d'interférences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">❌ Inconvénients</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Coût très élevé</li>
                    <li>• Sensible à la lumière ambiante forte</li>
                    <li>• Installation complexe</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">💼 Cas d'usage : Installations premium, grands formats, environnements spécialisés</p>
            </div>
          </div>
        </section>

        {/* PHOTO : Comparaison technologique */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-purple-300 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 INFOGRAPHIE : Comparaison des 3 technologies</p>
                <p className="text-sm opacity-80 mt-2">Matrice de coût, précision, temps de réponse</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Chaque technologie a ses forces et faiblesses selon votre contexte</p>
        </section>

        {/* Section 4 : Critères de choix */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Comment choisir votre écran ? Un <span className="text-[#82BC6C]">guide pratique</span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Le choix d'un écran tactile dépend de 5 facteurs clés. Voici comment les évaluer :
          </p>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] text-white px-3 py-1 rounded-full text-sm">1</span>
                La taille et le format
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Les grandes salles</strong> (30+ personnes) demandent 75" minimum. <strong>Les petites réunions</strong> se contentent de 43-55". <strong>Les showrooms</strong> bénéficient de formats géants (85"+) ou d'une batterie de petits écrans coordonnés.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#72B0CC]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] text-white px-3 py-1 rounded-full text-sm">2</span>
                La résolution et la luminosité
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>4K</strong> est obligatoire pour les écrans 65"+ (sinon, pixelisation visible). <strong>La luminosité minimum</strong> doit être 400 nits pour une salle bien éclairée. En situation outdoor, visez 800+ nits.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#82BC6C]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] text-white px-3 py-1 rounded-full text-sm">3</span>
                Le contexte d'utilisation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Gants obligatoires ?</strong> (industrie, construction) → Optez pour infrarouge ou résistif. <strong>Environnement stérile ?</strong> (médical) → Capacitif fermeture hermétique. <strong>Utilisation intensive 24/7 ?</strong> → Renforcez la ventilation et préférez les éléments de qualité.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#CF6E3F]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] text-white px-3 py-1 rounded-full text-sm">4</span>
                Le type de contenu
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Contenu vidéo haute qualité ?</strong> → 4K HDR + 60Hz minimum. <strong>Diagrammes et documents ?</strong> → FHD suffit. <strong>Multiples utilisateurs simultanés ?</strong> → Multi-touch capacitif indispensable.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#CF6E3F]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#CF6E3F]/30">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="bg-gradient-to-br from-[#CF6E3F] to-[#82BC6C] text-white px-3 py-1 rounded-full text-sm">5</span>
                Le budget et la longévité
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Pensez en <strong>coût total de propriété sur 5-7 ans</strong>. Un écran capacitif à 8 000€ peut être plus rentable qu'un écran résistif à 3 000€ s'il dure 2x plus longtemps et demande moins de maintenance.
              </p>
            </div>
          </div>
        </section>

        {/* PHOTO : Tableau de sélection */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-video bg-gradient-to-br from-yellow-200 to-orange-400 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">📸 TABLEAU : Matrice de sélection</p>
                <p className="text-sm opacity-80 mt-2">Comparaison résistif vs capacitif vs infrarouge sur tous les critères</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center mt-3">Un outil pour faire le bon choix selon vos contraintes</p>
        </section>

        {/* Section 5 : Conclusion et CTA */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#72B0CC] to-[#82BC6C]">salle de réunion</span> ?
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Un écran tactile performant ne change pas juste l'affichage : il change l'énergie de la pièce, l'engagement des participants et l'efficacité des réunions. Mais choisir le bon n'est pas trivial.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Chez Projectview, nous avons installé plus de 500 écrans tactiles dans des contextes très variés. Nous savons ce qui marche, ce qui dure, et ce qui transforme vraiment.
          </p>

          <div className="bg-gradient-to-br from-[#72B0CC]/10 to-[#82BC6C]/10 p-8 rounded-2xl border-2 border-[#72B0CC]/30 mb-8">
            <p className="text-gray-800 italic mb-4">
              "Vous n'êtes jamais sûr quel écran choisir ? C'est normal. Les décisions d'investissement tactile sont complexes. Laissez nos experts vous guider."
            </p>
            <p className="text-sm text-gray-600">— Conseil issu de 8 ans d'expertise en installations collaboratives</p>
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
            Trouvez l'écran tactile parfait pour votre espace
          </h2>

          <p className="text-xl md:text-xl mb-12 opacity-95 max-w-2xl mx-auto">
            Nos experts vous aident à naviguer les options techniques et à trouver la solution idéale pour vos besoins.
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

export default ArticleEcransTactiles;
