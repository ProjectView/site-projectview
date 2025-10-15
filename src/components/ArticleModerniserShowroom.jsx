import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, TrendingDown, Clock, Users, Eye, Smartphone, Calendar } from 'lucide-react';
import Chatbot from './Chatbot';

const ArticleModerniserShowroom = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const signes = [
    {
      number: "1",
      icon: <TrendingDown className="w-12 h-12" />,
      title: "Vos clients passent... et repartent sans rien acheter",
      color: "from-[#CF6E3F] to-[#72B0CC]",
      symptoms: [
        "Taux de conversion en baisse progressive",
        "Temps moyen de visite qui diminue",
        "Les clients consultent leur smartphone plus que vos produits",
        "\"Je vais réfléchir\" devient la réponse par défaut"
      ],
      why: "Vos clients comparent en ligne avant de venir. Votre espace physique doit offrir une expérience qu'ils ne peuvent pas avoir sur internet. S'ils trouvent votre showroom moins informatif que votre site web ou celui de vos concurrents, ils n'ont aucune raison d'acheter chez vous.",
      solution: "Transformez votre showroom en expérience interactive. Tables tactiles pour explorer l'intégralité de votre catalogue, configurateurs 3D pour personnaliser les produits en temps réel, écrans dynamiques qui racontent l'histoire de vos produits. Donnez-leur une raison de rester.",
      stat: "Les showrooms modernisés observent une augmentation de 250% du temps moyen de visite et +47% de taux de conversion.",
      cta: "Découvrez nos solutions pour showrooms interactifs"
    },
    {
      number: "2",
      icon: <Clock className="w-12 h-12" />,
      title: "Vos supports marketing sont obsolètes avant même d'être imprimés",
      color: "from-[#72B0CC] to-[#82BC6C]",
      symptoms: [
        "Budget catalogues entre 20 000€ et 80 000€ par an",
        "Nouveaux produits non présentés pendant des mois",
        "Modifications de prix = stock de catalogues à jeter",
        "Informations différentes entre le site et le showroom"
      ],
      why: "Votre catalogue papier est déjà périmé le jour de sa livraison. Chaque lancement produit, chaque ajustement de prix, chaque nouvelle promotion crée un décalage entre votre communication physique et digitale. Résultat : confusion client et crédibilité écornée.",
      solution: "Affichage dynamique et tables tactiles pilotés depuis le cloud. Mettez à jour tous vos supports en même temps, partout, en quelques clics. Nouveau produit le matin ? Il est présenté à midi. Promotion flash ? Elle démarre à l'instant exact sur tous vos écrans.",
      stat: "Économie moyenne : 65 000€/an sur les coûts d'impression et de mise à jour des supports papier.",
      cta: "Calculez vos économies avec l'affichage dynamique"
    },
    {
      number: "3",
      icon: <Users className="w-12 h-12" />,
      title: "Vos vendeurs passent leur temps à répondre aux mêmes questions de base",
      color: "from-[#82BC6C] to-[#CF6E3F]",
      symptoms: [
        "\"C'est quoi la différence entre ces deux modèles ?\" x100 par jour",
        "Vendeurs saturés, clients qui attendent",
        "Impossibilité de se concentrer sur le conseil à forte valeur",
        "Les clients repartent avec des questions non répondues"
      ],
      why: "Votre équipe commerciale devrait être là pour conseiller, challenger, accompagner les décisions complexes. Pas pour réciter des fiches techniques qu'un écran interactif pourrait afficher en 3 secondes. Chaque minute perdue sur une question basique est une opportunité de vente consultative manquée.",
      solution: "Bornes tactiles en libre-service avec comparateurs produits, filtres intelligents, fiches techniques complètes. Vidéos explicatives, vues 360°, configurateurs. Les clients trouvent les réponses basiques eux-mêmes, votre équipe intervient pour la vraie valeur ajoutée.",
      stat: "70% d'autonomie client = équipe commerciale recentrée sur 30% de conseil à haute valeur. ROI : panier moyen +35%.",
      cta: "Libérez le potentiel de votre équipe commerciale"
    },
    {
      number: "4",
      icon: <Eye className="w-12 h-12" />,
      title: "Vous n'avez aucune idée de ce qui intéresse vraiment vos clients",
      color: "from-[#CF6E3F] to-[#82BC6C]",
      symptoms: [
        "Aucune donnée sur les produits consultés vs achetés",
        "Méconnaissance des parcours clients en magasin",
        "Décisions merchandising basées sur l'intuition",
        "Impossible de prouver le ROI de vos investissements showroom"
      ],
      why: "Votre e-commerce vous dit tout : pages vues, taux de rebond, parcours d'achat, abandons panier. Votre showroom physique ? Silence radio. Vous investissez des dizaines de milliers d'euros dans un espace sans savoir ce qui fonctionne, ce qui attire, ce qui convertit.",
      solution: "Technologies interactives avec analytics intégrés. Heatmaps d'interaction sur tables tactiles, mesure du temps passé par zone, produits les plus configurés, taux d'interaction par support. Enfin de la data actionnable pour optimiser votre espace et votre offre.",
      stat: "Les showrooms data-driven ajustent leur merchandising 4x plus vite et augmentent leur CA/m² de 28% en moyenne.",
      cta: "Transformez votre showroom en machine à insights"
    },
    {
      number: "5",
      icon: <Smartphone className="w-12 h-12" />,
      title: "L'expérience en ligne de vos concurrents est meilleure que votre showroom physique",
      color: "from-[#72B0CC] to-[#CF6E3F]",
      symptoms: [
        "Clients qui viennent voir en vrai puis commandent en ligne ailleurs",
        "\"C'est moins cher sur Amazon\" (alors que vos prix sont identiques)",
        "Perte de parts de marché face à des pure players",
        "Sentiment que votre showroom est un show-room, plus un point de vente"
      ],
      why: "La vraie concurrence n'est plus le magasin d'en face. C'est l'expérience fluide, personnalisée et immédiate qu'offrent les géants du digital. Si votre showroom physique ne dépasse pas cette expérience, il devient juste un endroit pour toucher le produit avant de l'acheter moins cher en ligne.",
      solution: "Créez une expérience phygitale impossible à reproduire en ligne. Réalité virtuelle pour projeter les produits chez le client, configurateurs géants collaboratifs pour concevoir à plusieurs, intelligence artificielle pour recommandations ultra-personnalisées. Faites de votre espace physique un avantage compétitif, pas un boulet.",
      stat: "68% des clients sont prêts à payer plus cher pour une expérience showroom exceptionnelle vs achat en ligne standard.",
      cta: "Reprenez l'avantage sur le digital"
    }
  ];

  const callToAction = {
    title: "Combien de ces 5 signes reconnaissez-vous ?",
    sections: [
      {
        score: "0-1 signe",
        text: "Vous êtes dans le top 10% des showrooms modernes. Restez à la pointe.",
        color: "text-[#82BC6C]"
      },
      {
        score: "2-3 signes",
        text: "Vous tenez encore le coup, mais vos concurrents modernisent. C'est le moment d'agir.",
        color: "text-[#CF6E3F]"
      },
      {
        score: "4-5 signes",
        text: "Code rouge. Chaque mois qui passe creuse l'écart avec le marché. L'urgence est là.",
        color: "text-red-600"
      }
    ]
  };

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-lg shadow-xl py-3">
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
            Audit gratuit
          </button>
        </div>
      </nav>

      {/* Hero Article */}
      <section className="relative pt-32 pb-20 overflow-hidden" style={{ backgroundColor: '#f0f9ff' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(130, 188, 108, 0.3)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(114, 176, 204, 0.25)' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#82BC6C]/20 to-[#72B0CC]/20 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-8 border border-[#82BC6C]/30 animate-fade-in-up">
            <Sparkles className="w-4 h-4" style={{ color: '#82BC6C' }} />
            <span className="text-sm font-medium text-gray-800">Article Informatif</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight animate-fade-in-up" style={{ fontFamily: 'Montserrat, sans-serif', animationDelay: '0.1s' }}>
            5 signes qu'il est temps de <span style={{ color: '#82BC6C' }}>moderniser</span><br />
            votre showroom
          </h1>

          <div className="flex items-center gap-6 text-gray-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">8 min de lecture</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">Expert Showroom</span>
            </div>
          </div>

          <p className="text-xl text-gray-700 leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Vos clients comparent en ligne avant de venir. Votre espace physique doit offrir une expérience qu'ils ne peuvent pas avoir sur internet. Sinon, vous devenez un simple showroom... pour Amazon.
          </p>

          <p className="text-lg text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Voici les 5 signaux d'alerte qui indiquent que votre showroom est en train de perdre sa raison d'être. Et surtout, comment y remédier avant qu'il ne soit trop tard.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-20">
            {signes.map((signe, index) => (
              <article
                key={index}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
                id={`signe-${signe.number}`}
              >
                {/* Header du signe */}
                <div className="flex items-start gap-6 mb-8">
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${signe.color} text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {signe.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-[#72B0CC] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {signe.title}
                    </h2>
                  </div>
                </div>

                {/* Symptômes */}
                <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Symptômes reconnaissables
                  </h3>
                  <ul className="space-y-3">
                    {signe.symptoms.map((symptom, i) => (
                      <li key={i} className="text-gray-700 flex items-start gap-3">
                        <span className="text-red-500 font-bold mt-1">×</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pourquoi c'est grave */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#CF6E3F]"></span>
                    Pourquoi c'est plus grave que vous ne le pensez
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {signe.why}
                  </p>
                </div>

                {/* La solution */}
                <div className="bg-gradient-to-br from-[#82BC6C]/10 to-[#72B0CC]/10 border-l-4 border-[#82BC6C] rounded-r-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#82BC6C]"></span>
                    La solution moderne
                  </h3>
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    {signe.solution}
                  </p>
                </div>

                {/* Statistique clé */}
                <div className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] rounded-2xl p-6 text-white mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                      {signe.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed font-medium">
                        <strong>Chiffre clé :</strong> {signe.stat}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < signes.length - 1 && (
                  <div className="mt-12 pt-12 border-t-2 border-gray-200"></div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Score Section */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float" style={{ backgroundColor: 'rgba(130, 188, 108, 0.15)' }}></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float-delayed" style={{ backgroundColor: 'rgba(114, 176, 204, 0.15)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {callToAction.title}
            </h2>
            <p className="text-xl text-gray-600">
              Faites le test honnêtement. Votre diagnostic en 30 secondes.
            </p>
          </div>

          <div className="space-y-6">
            {callToAction.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-[#72B0CC] hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="flex items-center gap-6">
                  <div className={`text-4xl font-bold ${section.color}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {section.score}
                  </div>
                  <p className="text-lg text-gray-700 flex-1">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="audit" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#72B0CC] via-[#82BC6C] to-[#CF6E3F]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-8 animate-bounce-subtle" />

          <h2 className="text-4xl md:text-6xl font-medium mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Obtenez un audit gratuit<br />
            de votre showroom
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Un expert Projectview visite votre espace, identifie les points de friction, et vous remet un plan d'action concret avec ROI estimé. Sans engagement. Juste de la valeur.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => window.dispatchEvent(new Event('openChatbot'))}
              className="group inline-flex items-center justify-center gap-3 bg-white text-[#72B0CC] px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl transform hover:-translate-y-3 hover:scale-110 transition-all duration-300"
            >
              Réserver mon audit gratuit
              <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-lg border-2 border-white text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-white hover:text-[#72B0CC] hover:scale-110 transform hover:-translate-y-3 transition-all duration-300"
            >
              Retour à l'accueil
            </Link>
          </div>

          <p className="mt-8 text-sm opacity-75">
            Audit sur site · Recommandations personnalisées · Chiffrage détaillé · Sans engagement
          </p>
        </div>
      </section>

      {/* Articles similaires */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Articles similaires
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/solutions/tables-tactiles"
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#72B0CC] hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#72B0CC] transition-colors">
                Tables Tactiles : le guide complet
              </h4>
              <p className="text-gray-600 text-sm">
                Transformez votre showroom en expérience interactive
              </p>
            </Link>

            <Link
              to="/article/showroom-automobile"
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#CF6E3F] hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CF6E3F] to-[#72B0CC] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#CF6E3F] transition-colors">
                Cas client : Showroom Automobile
              </h4>
              <p className="text-gray-600 text-sm">
                De la brochure papier à l'expérience immersive
              </p>
            </Link>

            <Link
              to="/solutions/bureau-etude-vr"
              className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#82BC6C] hover:scale-105"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#82BC6C] to-[#CF6E3F] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-[#82BC6C] transition-colors">
                VR : vendez avant de construire
              </h4>
              <p className="text-gray-600 text-sm">
                Comment la VR transforme la vente de projets
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ArticleModerniserShowroom;
