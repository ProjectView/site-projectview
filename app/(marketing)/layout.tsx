import { NoiseOverlay } from '@/components/ui/NoiseOverlay';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { ChatWidget } from '@/components/chatbot/ChatWidget';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <NoiseOverlay />
      <Navbar />
      <div id="main-content">
        {children}
      </div>
      <Footer />
      <ChatWidget />
    </>
  );
}
