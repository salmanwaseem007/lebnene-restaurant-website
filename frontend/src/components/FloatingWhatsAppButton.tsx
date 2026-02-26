import { MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { useGetContactInfo } from '../hooks/useQueries';

export default function FloatingWhatsAppButton() {
  const { data: contactInfo } = useGetContactInfo();

  if (!contactInfo?.whatsappNumber) return null;

  const whatsappNumber = contactInfo.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40"
      aria-label="Contactar por WhatsApp"
    >
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-[#25D366] hover:bg-[#20BA5A] text-white"
      >
        <SiWhatsapp className="h-7 w-7" />
      </Button>
    </a>
  );
}
