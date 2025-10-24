import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Monitor, Sparkles, Tv, Table2, Compass, Menu, X, Users } from 'lucide-react';
import Logo from './Logo';

const BlogPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const articles = [
    {
      id: 'interactivite',
      title: 'NFC, gestes, détection : L\'interactivité sans contact',
      description: 'Découvrez comment les écrans modernes amplifient l\'engagement avec la détection de mouvements, les tags NFC et la reconnaissance de gestes.',
      category: 'Innovation',
      categoryColor: '#72B0CC',
      tags: ['Interactivité', 'NFC', 'Engagement'],
      gradient: 'from-[#72B0CC] to-[#82BC6C]',
      icon: <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/interactivite',
      date: '2025-01-28'
    },
    {
      id: '4k-hdr',
      title: '4K vs FHD : Faut-il vraiment investir ? Un guide pratique',
      description: 'Quand le 4K vaut l\'investissement, quand FHD suffit, et pourquoi le HDR change vraiment la donne.',
      category: 'Comparatif Technique',
      categoryColor: '#CF6E3F',
      tags: ['4K', 'Résolution', 'HDR'],
      gradient: 'from-[#CF6E3F] to-[#72B0CC]',
      icon: <Monitor className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/4k-hdr',
      date: '2025-01-26'
    },
    {
      id: 'videoconference-integree',
      title: 'La visioconférence intégrée : Finir avec les réunions hybrides compliquées',
      description: 'Comment les écrans tout-en-un transforment l\'équité entre participants en salle et à distance.',
      category: 'Réunions Hybrides',
      categoryColor: '#82BC6C',
      tags: ['Visioconférence', 'Hybride', 'Collaboration'],
      gradient: 'from-[#82BC6C] to-[#CF6E3F]',
      icon: <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/videoconference-integree',
      date: '2025-01-24'
    },
    {
      id: 'wireless-casting',
      title: 'Partage d\'écran sans fil : Finissez avec les câbles',
      description: 'AirPlay, Miracast, Google Cast : comment fonctionnent ces technologies et laquelle choisir pour des réunions fluides.',
      category: 'Connectivité',
      categoryColor: '#72B0CC',
      tags: ['Wireless', 'Partage', 'Technologie'],
      gradient: 'from-[#72B0CC] to-[#82BC6C]',
      icon: <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/wireless-casting',
      date: '2025-01-22'
    },
    {
      id: 'ecrans-tactiles',
      title: 'Les écrans tactiles : De la résistance à la capacité',
      description: 'Comprendre les technologies tactiles, leur évolution et comment choisir l\'écran adapté à vos besoins professionnels.',
      category: 'Guide Informatif',
      categoryColor: '#CF6E3F',
      tags: ['Tactile', 'Technologie', 'Écrans'],
      gradient: 'from-[#CF6E3F] to-[#72B0CC]',
      icon: <Monitor className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/ecrans-tactiles',
      date: '2025-01-20'
    },
    {
      id: 'erreurs-reunion',
      title: 'Les 5 erreurs qui font perdre du temps en réunion',
      description: 'Départs chaotiques, objectifs flous, participants passifs : transformez vos réunions en leviers d\'efficacité grâce à quelques bonnes pratiques et à ProjectView.',
      category: 'Article Informatif',
      categoryColor: '#72B0CC',
      tags: ['Collaboration', 'Réunions', 'Productivité'],
      gradient: 'from-[#72B0CC] to-[#82BC6C]',
      icon: <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/erreurs-reunion',
      date: '2024-01-15'
    },
    {
      id: 'showroom-auto',
      title: 'Showroom Automobile : De la brochure papier à l\'expérience immersive',
      description: 'Découvrez comment un concessionnaire automobile a transformé son showroom avec des tables tactiles et des configurateurs 3D.',
      beforeText: 'Catalogues papier coûteux, informations rapidement obsolètes, clients qui repartent sans documentation',
      afterText: 'Tables tactiles interactives, configurations 3D en temps réel, expérience client premium qui fidélise',
      category: 'Installation Client',
      categoryColor: '#72B0CC',
      tags: ['Automotive', 'Tables Tactiles', 'ROI'],
      gradient: 'from-[#72B0CC] to-[#82BC6C]',
      icon: <Monitor className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/showroom-automobile',
      date: '2024-01-10'
    },
    {
      id: 'immobilier-vr',
      title: 'Promoteur Immobilier : Vendre sur plan avec la VR',
      description: 'Comment un promoteur immobilier a augmenté ses pré-ventes de 40% grâce à la réalité virtuelle.',
      category: 'Success Story',
      categoryColor: '#CF6E3F',
      tags: ['Immobilier', 'VR', 'Innovation'],
      gradient: 'from-[#CF6E3F] to-[#72B0CC]',
      icon: <Compass className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '#',
      date: '2024-01-08'
    },
    {
      id: 'moderniser-showroom',
      title: '5 signes qu\'il est temps de moderniser votre showroom',
      description: 'Découvrez les indicateurs clés qui montrent qu\'il est temps d\'investir dans des technologies immersives.',
      category: 'Guide Pratique',
      categoryColor: '#82BC6C',
      tags: ['Showroom', 'Digital', 'Stratégie'],
      gradient: 'from-[#82BC6C] to-[#CF6E3F]',
      icon: <Table2 className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/moderniser-showroom',
      date: '2024-01-05',
      image: '/images/article-moderniser-showroom-hero.png'
    },
    {
      id: 'affichage-retail',
      title: 'Affichage dynamique : Booster vos ventes en retail',
      description: 'Les meilleures pratiques pour utiliser l\'affichage dynamique et augmenter le trafic en magasin.',
      category: 'Étude de Cas',
      categoryColor: '#72B0CC',
      tags: ['Retail', 'Affichage', 'Marketing'],
      gradient: 'from-[#72B0CC] to-[#82BC6C]',
      icon: <Tv className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '#',
      date: '2024-01-03'
    },
    {
      id: 'roi-tech-immersive',
      title: 'ROI des technologies immersives : Les chiffres clés',
      description: 'Analyse détaillée du retour sur investissement des solutions immersives en entreprise.',
      category: 'Analyse',
      categoryColor: '#CF6E3F',
      tags: ['ROI', 'Analytics', 'Business'],
      gradient: 'from-[#CF6E3F] to-[#72B0CC]',
      icon: <Sparkles className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '#',
      date: '2024-01-01'
    },
    {
      id: 'ecrans-collaboratifs',
      title: 'Les écrans collaboratifs : De la réunion chaotique à la productivité fluide',
      description: 'Comprendre comment les écrans collaboratifs transforment les réunions, améliorent l\'engagement et multiplient la productivité des équipes',
      category: 'Guide Informatif',
      categoryColor: '#72B0CC',
      tags: ['Collaboration', 'Productivité', 'Réunions'],
      gradient: 'from-[#72B0CC] to-[#82BC6C]',
      icon: <Users className="w-20 h-20 text-white opacity-30 group-hover:opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />,
      link: '/article/ecrans-collaboratifs',
      date: '2025-10-24',
      image: '/images/article-ecrans-collaboratifs-hero.png'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-transparent py-6'}`}>
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
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
            >
              Contact
            </button>
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
              <button
                onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                className="block w-full text-center bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-white blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full mb-8 border-2 border-white/30">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Notre Blog</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-medium mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Réalisations, Expertises<br />& Inspirations
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos success stories, nos conseils d'experts et les dernières tendances en technologies immersives
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-pointer"
              >
                <div className={`relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-gradient-to-br ${article.gradient}`} style={{ aspectRatio: '16/9' }}>
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {article.icon}
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: article.categoryColor }}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <Link to={article.link} className="block hover:no-underline">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors cursor-pointer" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {article.title}
                    </h3>
                  </Link>

                  {article.beforeText && article.afterText ? (
                    <>
                      <div className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <div className="text-xs font-bold text-red-600 uppercase mb-2">Situation avant</div>
                        <p className="text-sm text-gray-700">{article.beforeText}</p>
                      </div>

                      <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4" style={{ borderColor: '#82BC6C' }}>
                        <div className="text-xs font-bold uppercase mb-2" style={{ color: '#82BC6C' }}>Après Projectview</div>
                        <p className="text-sm text-gray-700">{article.afterText}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {article.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={article.link}
                    className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                    style={{ color: article.categoryColor }}
                  >
                    Lire l'article
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer votre espace ?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Découvrez comment nos solutions peuvent révolutionner votre expérience client
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event('openChatbot'))}
            className="inline-flex items-center gap-3 bg-white text-[#72B0CC] px-10 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300"
          >
            <span>Contactez-nous</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
