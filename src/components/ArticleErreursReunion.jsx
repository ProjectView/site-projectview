import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Target,
  Wifi,
  Sparkles,
  ScreenShare,
  MessageCircle,
  Video,
  Share2,
  CheckCircle2,
  FileText,
  Mail,
} from 'lucide-react';
import Chatbot from './Chatbot';
import Logo from './Logo';

const ArticleErreursReunion = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl py-3' : 'bg-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-[#72B0CC] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour</span>
            </Link>
          </div>

          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <button
            onClick={() => window.dispatchEvent(new Event('openChatbot'))}
            className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-2 rounded-full hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium"
          >
            Nous contacter
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#72B0CC' }} />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: '#82BC6C' }} />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#82BC6C]/20 to-[#72B0CC]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-6 border border-[#82BC6C]/30">
            <Sparkles className="w-4 h-4" style={{ color: '#82BC6C' }} />
            <span className="text-sm font-medium text-gray-800">Guide Pratique</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Les 5 erreurs qui font perdre du temps en réunion (et comment les éviter)
          </h1>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            Les réunions devraient faire avancer les projets. Pourtant, elles se transforment trop souvent en marathons inefficaces, perturbés par la technique, le flou des objectifs et un manque d’engagement.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed">
            Bonne nouvelle : ces problèmes ne sont pas une fatalité. En identifiant les erreurs les plus fréquentes, vous pouvez transformer vos réunions en véritables leviers d’efficacité et de collaboration.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>7 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Équipe Projectview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 pb-28">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 text-lg">
            Voici les 5 erreurs qui font perdre un temps précieux en réunion, et surtout, comment les éviter durablement.
          </p>
        </div>

        <div className="mt-12 space-y-20">
          {/* 1. Débuts chaotiques */}
          <section id="erreur-1" className="group">
            <header className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Des débuts chaotiques à cause des branchements et réglages techniques
              </h2>
            </header>

            <div className="bg-orange-50 border-l-4 border-[#CF6E3F] rounded-r-xl p-6 mb-6">
              <p className="text-gray-800">
                Qui n’a jamais cherché le bon câble HDMI, redémarré un projecteur ou réglé le son pendant de longues minutes ? En moyenne, une réunion sur trois commence avec un retard technique — soit des dizaines d’heures perdues sur l’année.
              </p>
            </div>

            <div className="p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#72B0CC] font-semibold">
                <ScreenShare className="w-5 h-5" />
                <span>Comment éviter cette erreur</span>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Adoptez une solution de partage d’écran sans fil pour éliminer les câbles et adaptateurs.</li>
                <li>Privilégiez un écran collaboratif comme ProjectView pour connecter PC, Mac ou smartphone en un clic, sans installation.</li>
                <li>Testez la connexion avant l’arrivée des participants pour une mise en route instantanée.</li>
              </ul>
            </div>
          </section>

          {/* 2. Objectif flou */}
          <section id="erreur-2" className="group">
            <header className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Un manque de clarté sur l’objectif de la réunion</h2>
            </header>

            <p className="text-gray-700 mb-4">
              Beaucoup de réunions s’étirent parce qu’on ne sait plus pourquoi on est là. Sans ordre du jour clair, les discussions dérivent et les décisions se repoussent.
            </p>

            <div className="p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#72B0CC] font-semibold">
                <Target className="w-5 h-5" />
                <span>Comment éviter cette erreur</span>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Définissez l’objectif concret, les décisions attendues et la durée maximale.</li>
                <li>Affichez l’ordre du jour sur un tableau blanc interactif dès le début.</li>
                <li>Avec ProjectView, annotez directement à l’écran et gardez la trace des notes.</li>
              </ul>
            </div>
          </section>

          {/* 3. Participants passifs */}
          <section id="erreur-3" className="group">
            <header className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Des participants passifs ou déconnectés</h2>
            </header>

            <p className="text-gray-700 mb-4">
              Une seule personne parle pendant 45 minutes pendant que les autres consultent leurs mails : l’absence d’interactivité fait chuter l’attention et la productivité.
            </p>

            <div className="p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#72B0CC] font-semibold">
                <MessageCircle className="w-5 h-5" />
                <span>Comment éviter cette erreur</span>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Impliquez les participants : dessins, annotations et réactions sur le tableau blanc numérique.</li>
                <li>Utilisez ProjectView pour travailler à plusieurs sur le même écran tactile et partager les notes instantanément.</li>
              </ul>
            </div>
          </section>

          {/* 4. Problèmes audio/vidéo */}
          <section id="erreur-4" className="group">
            <header className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#72B0CC] to-[#CF6E3F] text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Des problèmes audio ou vidéo en visioconférence</h2>
            </header>

            <p className="text-gray-700 mb-4">
              Dans les organisations hybrides, la visio est devenue la norme. Micro saturé, caméra floue ou son qui coupe : ces problèmes techniques cassent le rythme et l’engagement.
            </p>

            <div className="p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#72B0CC] font-semibold">
                <Video className="w-5 h-5" />
                <span>Comment éviter cette erreur</span>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Préférez une solution tout‑en‑un avec caméra 4K, micro longue portée et haut‑parleurs intégrés.</li>
                <li>Avec ProjectView, lancez Teams, Zoom ou Google Meet directement depuis l’écran, sans dépendre du matériel de chacun.</li>
                <li>Astuce rythme : désignez un « gardien du temps » pour respecter la durée.</li>
              </ul>
            </div>
          </section>

          {/* 5. Aucune trace des décisions */}
          <section id="erreur-5" className="group">
            <header className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#82BC6C] to-[#72B0CC] text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold">5</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">Aucune trace des décisions ou des actions à suivre</h2>
            </header>

            <p className="text-gray-700 mb-4">
              Sortir d’une réunion sans savoir qui fait quoi ni quand, c’est la garantie de refaire la même réunion la semaine suivante.
            </p>

            <div className="p-6 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#72B0CC] font-semibold">
                <FileText className="w-5 h-5" />
                <span>Comment éviter cette erreur</span>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Formalisez les décisions en direct sur l’écran collaboratif.</li>
                <li>Utilisez la sauvegarde et le partage instantané pour envoyer le compte rendu à tous.</li>
                <li>Sur ProjectView, enregistrez et exportez les notes en un clic (e‑mail, Teams, Google Drive, etc.).</li>
              </ul>
            </div>
          </section>

          {/* Conclusion & CTA */}
          <section className="mt-6">
            <div className="bg-gradient-to-br from-[#F0FAF3] to-white border rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                En résumé : une réunion efficace, c’est aussi un bon outil
              </h3>
              <p className="text-gray-700 mb-4">
                Organiser de bonnes réunions n’est pas qu’une question de méthode : c’est aussi une question d’environnement. Un matériel fluide, intuitif et tout‑en‑un élimine une grande partie des pertes de temps.
              </p>
              <ul className="grid md:grid-cols-3 gap-4">
                <li className="flex items-center gap-2"><Share2 className="w-5 h-5 text-[#72B0CC]" /> Partage d’écran sans fil</li>
                <li className="flex items-center gap-2"><Wifi className="w-5 h-5 text-[#82BC6C]" /> Tableau blanc interactif</li>
                <li className="flex items-center gap-2"><Video className="w-5 h-5 text-[#CF6E3F]" /> Visioconférence tout‑en‑un</li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] text-white px-6 py-3 rounded-full font-medium hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" /> Demander une démo ProjectView
                </button>
                <button
                  onClick={() => window.dispatchEvent(new Event('openChatbot'))}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Mail className="w-5 h-5" /> Être recontacté
                </button>
              </div>
            </div>
          </section>
        </div>
      </article>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ArticleErreursReunion;


