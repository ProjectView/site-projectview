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
            <svg
              width="150"
              height="67"
              viewBox="0 0 648 290"
              className="transition-all duration-1000"
              style={{ fill: '#1f2937' }}
            >
              <path d="M0.102701 2.2667C0.502701 4.40003 3.16937 4.6667 29.1694 5.0667L57.7027 5.33336L61.436 8.93337C66.3694 13.7334 66.636 22.1334 61.9694 27.6L58.7694 31.3334L29.5694 32L0.502701 32.6667L0.102701 53.8667C-0.163965 72.8 -0.030632 74.9334 1.96937 74.1334C3.03603 73.7334 4.36937 73.3334 4.63603 73.3334C4.9027 73.3334 5.16937 65.2 5.16937 55.3334V37.3334H30.636C51.3027 37.3334 56.9027 36.9334 60.636 35.2C73.436 29.0667 73.836 8.53336 61.3027 2.00003C58.1027 0.400029 51.836 2.86785e-05 28.5027 2.86785e-05C1.7027 2.86785e-05 -0.297299 0.133362 0.102701 2.2667Z"/>
              <path d="M96.1026 34.9333C96.5026 67.0667 96.6359 70 98.9026 70.4C101.036 70.8 101.169 68.5333 101.169 38.1333V5.33334H127.569C152.503 5.33334 154.103 5.46667 157.036 8.13334C163.436 14.1333 163.703 22.4 157.703 28.1333C154.636 30.9333 152.769 31.4667 140.236 32L126.236 32.6667L145.836 54C156.636 65.7333 165.703 75.6 165.969 75.8667C166.236 76.1333 166.503 74.6667 166.503 72.5333C166.503 69.4667 163.436 65.4667 152.103 53.3333L137.836 38L146.503 37.3333C151.303 36.9333 156.503 35.8667 158.236 34.9333C166.103 30.4 169.036 16.8 163.836 8.4C159.169 0.533338 156.503 4.17963e-06 124.503 4.17963e-06H95.8359L96.1026 34.9333Z"/>
              <path d="M216.636 1.33338C207.836 4.00005 198.236 13.4667 194.636 23.0667C193.836 25.2 193.169 30.5334 193.169 35.0667C193.169 65.7334 228.902 81.6 251.436 60.9334C259.569 53.4667 263.036 45.7334 262.902 34.6667C262.902 20.1334 255.302 8.66671 241.836 2.53338C236.102 -0.133288 223.436 -0.666622 216.636 1.33338ZM240.636 7.46671C247.169 10.6667 255.436 20.1334 257.169 26.8C259.969 36.9334 256.369 50 248.902 56.9334C231.836 72.9334 203.569 64.1334 198.636 41.3334C195.702 27.7334 202.236 14.4 215.169 7.60005C220.502 4.80005 234.769 4.66671 240.636 7.46671Z"/>
              <path d="M320.369 2.13344C320.769 3.33344 321.169 4.53344 321.169 4.80011C321.169 5.06677 328.636 5.33344 337.836 5.33344H354.503V22.1334C354.503 42.9334 353.036 48.1334 345.169 56.1334C333.036 68.2668 315.036 68.2668 302.903 56.1334C297.836 51.2001 294.503 44.1334 294.503 38.8001C294.503 35.6001 293.969 34.6668 291.836 34.6668C285.969 34.6668 289.969 49.4668 298.369 58.9334C310.769 73.0668 333.303 74.0001 347.436 60.9334C357.969 51.2001 359.036 47.8668 359.569 22.2668L360.103 0.000110273H339.836C321.836 0.000110273 319.703 0.266773 320.369 2.13344Z"/>
              <path d="M385.169 35.3332V70.6665H420.502C454.902 70.6665 455.836 70.5332 455.836 67.9998C455.836 65.4665 454.902 65.3332 423.169 65.3332H390.502V51.3332V37.3332H423.169C454.902 37.3332 455.836 37.1998 455.836 34.6665C455.836 32.1332 454.902 31.9998 423.169 31.9998H390.502V18.6665V5.33317H424.369C453.969 5.33317 458.369 5.0665 459.036 3.19983C459.436 1.99983 459.836 0.799834 459.836 0.533167C459.836 0.2665 443.036 -0.000166446 422.502 -0.000166446H385.169V35.3332Z"/>
              <path d="M502.502 2.80002C475.702 14.9334 474.102 51.4667 499.836 65.8667L507.169 70L532.236 70.4C557.169 70.9334 557.436 70.9334 555.969 68.2667C554.636 65.7334 553.036 65.4667 530.636 65.0667L506.769 64.6667L501.036 60.6667C491.836 54.1334 487.436 46.8 486.769 36.9334C486.369 29.8667 486.769 27.6 490.102 21.3334C492.502 16.8 496.102 12.5334 499.702 10L505.436 6.00002L528.636 5.60002C550.502 5.20002 551.836 5.06668 551.836 2.53335C551.836 0.13335 550.769 2.07279e-05 530.236 2.07279e-05C511.302 2.07279e-05 507.702 0.400017 502.502 2.80002Z"/>
              <path d="M577.436 2.26685C577.836 4.40018 579.836 4.66685 594.236 5.06685L610.503 5.46685V40.1335C610.503 71.3335 610.77 74.9335 612.636 74.1335C613.836 73.7335 615.036 73.3335 615.303 73.3335C615.57 73.3335 615.836 58.0002 615.836 39.3335V5.33352H631.836C646.903 5.33352 647.836 5.20018 647.836 2.66685C647.836 0.133517 646.903 0.000183303 612.37 0.000183303C579.436 0.000183303 577.036 0.133517 577.436 2.26685Z"/>
              <path d="M179.169 99.3333C170.636 107.733 179.969 121.467 191.169 116.8C196.769 114.4 199.036 110.4 197.969 104.533C196.236 95.9999 185.436 92.9333 179.169 99.3333Z"/>
              <path d="M4.76902 137.333C2.90236 138.8 1.03569 141.867 0.502356 144C-0.297644 147.6 3.96902 154.533 43.8357 215.067C68.2357 251.867 89.969 283.733 92.1024 285.733C95.4357 288.933 96.9024 289.467 100.236 288.8C102.502 288.4 105.436 287.067 106.636 285.867C107.969 284.667 123.836 261.2 142.102 233.6L175.169 183.467L175.836 233.067C176.502 282.133 176.502 282.667 179.436 285.6C183.836 290 191.302 289.6 195.302 284.8L198.502 281.2V211.2V141.2L195.169 138C191.169 133.867 182.236 133.333 179.169 136.933C178.102 138.267 159.969 165.067 138.902 196.533C117.702 228 99.969 253.733 99.3024 253.867C98.6357 253.867 81.3024 229.067 60.9024 198.667C40.5024 168.267 22.2357 141.333 20.5024 138.933C16.369 133.867 10.1024 133.2 4.76902 137.333Z"/>
              <path d="M231.303 137.6C225.57 142.667 225.97 150.934 232.236 154.667C236.37 157.2 239.17 157.334 323.303 157.334H410.236L425.17 191.6C433.303 210.534 445.836 239.467 452.903 255.734C463.703 280.8 466.503 285.867 469.57 287.6C473.97 289.734 480.103 288.934 482.77 285.734C483.703 284.534 494.503 259.867 506.77 230.8C519.036 201.734 529.436 178 529.836 178C530.37 178 541.303 202.267 554.37 232C577.703 285.2 578.103 286 582.77 287.734C586.77 289.334 588.236 289.334 591.303 287.734C594.77 286.134 597.57 279.734 621.436 218C636.103 180.134 647.836 148 647.836 145.6C647.836 139.6 642.903 134.667 636.503 134.667C628.236 134.667 630.77 129.467 598.37 212.934C591.436 230.667 585.436 244.8 585.036 244.267C584.503 243.734 574.103 220.267 561.836 192C547.97 160 538.236 139.467 536.236 137.6C532.236 134 525.17 133.734 522.103 137.067C520.77 138.4 509.836 163.2 497.703 192.134C485.436 221.067 475.17 245.067 474.636 245.6C474.236 246.134 463.436 222.4 450.636 192.934C437.97 163.467 426.37 138.267 424.903 136.934C422.37 134.8 415.836 134.667 328.37 134.667H234.636L231.303 137.6Z"/>
              <path d="M231.303 198.8L227.836 201.467V242.133C227.836 280.667 227.969 282.8 230.503 285.333C231.969 286.8 234.503 288.267 236.103 288.667C237.836 289.067 279.569 289.2 328.903 289.067L418.769 288.667L421.969 284.933C426.103 280.133 426.103 274.533 421.969 269.733L418.769 266L333.969 265.6L249.169 265.333V242V218.667H324.636H400.103L403.969 214.8C406.236 212.4 407.836 209.467 407.836 207.333C407.836 205.2 406.236 202.267 403.969 199.867L400.103 196H317.436C235.969 196 234.769 196 231.303 198.8Z"/>
            </svg>
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

