/**
 * JSON-LD structured data components for SEO
 */

interface OrganizationJsonLdProps {
  url?: string;
}

export function OrganizationJsonLd({ url = 'https://projectview.fr' }: OrganizationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Projectview',
    url,
    logo: `${url}/logo.png`,
    description:
      'Nous transformons vos espaces physiques en environnements interactifs qui captivent, engagent et convertissent.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6 rue de Genève',
      addressLocality: 'Saint Priest',
      postalCode: '69800',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+33777300658',
      email: 'contact@projectview.fr',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  url: string;
}

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  url,
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Projectview',
      logo: {
        '@type': 'ImageObject',
        url: 'https://projectview.fr/logo.png',
      },
    },
    datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
