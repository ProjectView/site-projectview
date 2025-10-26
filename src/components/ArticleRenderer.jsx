import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Clock, User, ChevronRight, Sparkles } from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';
import ReactMarkdown from 'react-markdown';
import YAML from 'yaml';

const ArticleRenderer = ({ markdownContent, articleId }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [frontmatter, setFrontmatter] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Si markdownContent est fourni (import statique)
    if (markdownContent) {
      try {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdownContent.match(frontmatterRegex);

        if (match) {
          const fm = YAML.parse(match[1]);
          setFrontmatter(fm);
          setMarkdown(match[2]);
        } else {
          setMarkdown(markdownContent);
          setFrontmatter({ id: articleId || 'unknown', title: 'Article' });
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur parsing YAML:', error);
        setError('Erreur de parsing du YAML: ' + error.message);
        setLoading(false);
      }
    }
    // Sinon, charger dynamiquement via fetch
    else if (articleId) {
      const loadArticle = async () => {
        try {
          // Essayer de charger le fichier markdown
          const response = await fetch(`/articles/${articleId}.md`);
          if (!response.ok) {
            throw new Error(`Article not found: ${articleId}`);
          }
          const content = await response.text();

          const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
          const match = content.match(frontmatterRegex);

          if (match) {
            const fm = YAML.parse(match[1]);
            setFrontmatter(fm);
            setMarkdown(match[2]);
          } else {
            setMarkdown(content);
            setFrontmatter({ id: articleId, title: 'Article' });
          }
          setLoading(false);
        } catch (error) {
          console.error('Erreur loading article:', error);
          setError('Impossible de charger l\'article: ' + error.message);
          setLoading(false);
        }
      };
      loadArticle();
    }
  }, [markdownContent, articleId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <div className="text-center py-20">Chargement de l'article...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600"><p>Erreur: {error}</p></div>;
  }

  if (!frontmatter) {
    return <div className="text-center py-20 text-red-600"><p>Impossible d'afficher l'article</p></div>;
  }

  const categoryColorMap = {
    'Guide Informatif': '#72B0CC',
    'Guide Pratique': '#82BC6C',
    'Success Story': '#CF6E3F',
    'Étude de Cas': '#72B0CC',
    'Analyse': '#CF6E3F'
  };

  const categoryColor = frontmatter.categoryColor || categoryColorMap[frontmatter.category] || '#72B0CC';

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-white py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#accueil" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">
              Accueil
            </Link>
            <Link to="/#offres" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">
              Solutions
            </Link>
            <Link to="/#mission" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">
              Expertise
            </Link>
            <Link to="/blog" className="hover:text-[#72B0CC] transition-all duration-300 font-medium">
              Blog
            </Link>
            <Link
              to="/#contact"
              className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
            >
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
              <Link to="/#accueil" className="block hover:text-[#72B0CC] font-medium">
                Accueil
              </Link>
              <Link to="/#offres" className="block hover:text-[#72B0CC] font-medium">
                Solutions
              </Link>
              <Link to="/#mission" className="block hover:text-[#72B0CC] font-medium">
                Expertise
              </Link>
              <Link to="/blog" className="block hover:text-[#72B0CC] font-medium">
                Blog
              </Link>
              <Link to="/#contact" className="block text-center bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0">
          <div
            className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: categoryColor }}
          ></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#82BC6C' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Catégorie */}
          <div className="flex items-center gap-4 mb-6">
            <span
              className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: `linear-gradient(to right, ${categoryColor}, #82BC6C)` }}
            >
              <Sparkles className="w-4 h-4" />
              {frontmatter.category}
            </span>
            <span className="text-gray-500 text-sm">{frontmatter.tags?.join(' • ') || 'Article'}</span>
          </div>

          {/* Titre */}
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {frontmatter.title}
          </h1>

          {/* Métadonnées */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(frontmatter.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{frontmatter.author || 'Équipe Projectview'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Hero */}
      {frontmatter.imageHero && (
        <section className="max-w-4xl mx-auto px-6 -mt-8 mb-20 relative z-20">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-video bg-gray-100">
            <img
              src={frontmatter.imageHero}
              alt={frontmatter.title}
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Contenu principal */}
      <article className="max-w-4xl mx-auto px-6 mb-32">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }} {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-3xl md:text-4xl font-bold mb-6 mt-12 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }} {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mb-4 mt-8 text-gray-900" {...props} />,
              p: ({ node, ...props }) => <p className="text-lg text-gray-700 leading-relaxed mb-6" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700" {...props} />,
              li: ({ node, ...props }) => <li className="text-gray-700 ml-4" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 pl-6 py-4 my-6 text-gray-700 italic bg-blue-50 rounded-r-xl"
                  style={{ borderColor: categoryColor }}
                  {...props}
                />
              ),
              a: ({ node, ...props }) => <a className="text-[#72B0CC] hover:underline font-medium" {...props} />,
              img: ({ node, ...props }) => (
                <div className="my-8 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    className="w-full h-auto object-cover"
                    {...props}
                  />
                </div>
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props} />
                ) : (
                  <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-6" {...props} />
                ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border border-gray-300" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => <th className="border border-gray-300 bg-gray-100 p-3 text-left font-bold" {...props} />,
              td: ({ node, ...props }) => <td className="border border-gray-300 p-3" {...props} />,
              hr: ({ node, ...props }) => <hr className="my-8 border-t-2 border-gray-200" {...props} />,
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${categoryColor}, #82BC6C)` }}>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Prêt à transformer votre expérience ?
          </h2>

          <p className="text-xl md:text-xl mb-12 opacity-95 max-w-2xl mx-auto">
            Découvrez comment Projectview peut vous aider à créer des expériences immersives inoubliables.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              <span>Nous contacter</span>
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

export default ArticleRenderer;
