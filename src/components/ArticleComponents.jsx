import React from 'react';
import { CheckCircle, AlertCircle, Lightbulb, TrendingUp, Users, Award, Zap, Target } from 'lucide-react';

// Composant pour encart coloré avec numéro (type 1-4)
export const NumberedCard = ({ number, title, color = 'blue', children }) => {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100/50 border-blue-200',
    green: 'from-green-50 to-green-100/50 border-green-200',
    orange: 'from-orange-50 to-orange-100/50 border-orange-200',
    red: 'from-red-50 to-red-100/50 border-red-200',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200',
  };

  const bgColor = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-8 rounded-2xl border-2 mb-6`}>
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
        <span className={`${bgColor[color]} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}>
          {number}
        </span>
        {title}
      </h3>
      <div className="text-gray-800">{children}</div>
    </div>
  );
};

// Composant pour stat/métrique
export const StatCard = ({ icon: Icon, label, value, color = '#72B0CC' }) => {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-100 text-center hover:shadow-lg transition-shadow">
      <div className="flex justify-center mb-3">
        {Icon && <Icon className="w-8 h-8" style={{ color }} />}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
};

// Composant pour stats en grille
export const StatsGrid = ({ children }) => {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {children}
    </div>
  );
};

// Composant pour encart de citation avec fond coloré
export const HighlightBox = ({ type = 'info', children }) => {
  const typeStyles = {
    success: 'bg-green-50 border-l-4 border-green-500',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500',
    error: 'bg-red-50 border-l-4 border-red-500',
    info: 'bg-blue-50 border-l-4 border-blue-500',
  };

  return (
    <div className={`${typeStyles[type]} p-6 rounded-r-xl mb-8`}>
      {children}
    </div>
  );
};

// Composant pour comparaison avant/après
export const ComparisonCard = ({ title, before, after, color = 'blue' }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50',
  };

  return (
    <div className={`border-2 ${colorClasses[color]} p-8 rounded-2xl mb-6`}>
      <h3 className="text-xl font-bold mb-6">{title}</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-red-500">✗</span> Avant
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {before.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-green-500">✓</span> Après
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {after.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Composant pour timeline/évolution
export const TimelineItem = ({ year, title, description, color = '#72B0CC' }) => {
  return (
    <div className="border-l-4 pl-8 pb-8" style={{ borderColor: color }}>
      <h3 className="text-xl font-bold mb-3">{year} - {title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
};

// Composant pour bénéfices/avantages
export const BenefitsGrid = ({ benefits }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {benefits.map((benefit, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#72B0CC] transition-colors">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <h3 className="font-bold text-gray-900">{benefit.title}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

// Composant pour CTA interne
export const CTABox = ({ title, description, buttonText, icon: Icon }) => {
  return (
    <div className="bg-gradient-to-r from-[#72B0CC] to-[#82BC6C] rounded-2xl p-8 text-white mb-12">
      <div className="flex items-start gap-4">
        {Icon && <Icon className="w-8 h-8 flex-shrink-0" />}
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="opacity-90 mb-4">{description}</p>
          <button className="bg-white text-[#72B0CC] font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-shadow">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default {
  NumberedCard,
  StatCard,
  StatsGrid,
  HighlightBox,
  ComparisonCard,
  TimelineItem,
  BenefitsGrid,
  CTABox,
};
