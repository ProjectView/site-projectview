import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Monitor, Sparkles, Tv, Table2, Compass } from 'lucide-react';

const BlogPage = () => {
  const articles = [
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
      date: '2024-01-05'
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                <div className={`h-48 bg-gradient-to-br ${article.gradient} relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {article.icon}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold group-hover:scale-110 transition-transform duration-300" style={{ color: article.categoryColor }}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {article.title}
                  </h3>

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
          <Link
            to="/#contact"
            className="inline-flex items-center gap-3 bg-white text-[#72B0CC] px-10 py-4 rounded-full text-lg font-medium hover:shadow-2xl transform hover:-translate-y-2 hover:scale-110 transition-all duration-300"
          >
            <span>Contactez-nous</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
