import { useGetContactInfo } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, Clock } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const { t } = useLanguage();

  // Hard-coded branch addresses
  const benalmadenaUrl = 'https://www.google.com/maps/dir/?api=1&destination=Av.+Antonio+Machado,+32,+29630+Benalmádena,+Málaga';
  const fuengirolaUrl = 'https://www.google.com/maps/dir/?api=1&destination=Paseo+Maritimo+Rey+de+España+125,+Fuengirola,+Málaga';

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">{t('contact.loading')}</p>
        </div>
      </main>
    );
  }

  if (!contactInfo) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">{t('contact.error')}</p>
        </div>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/${contactInfo.whatsappNumber.replace(/\s+/g, '')}`;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-12">
        {/* Page Title */}
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-center mb-2">{t('contact.title')}</h1>
          <p className="text-center text-muted-foreground">{t('contact.subtitle')}</p>
        </header>

        {/* Contact Information Cards */}
        <section className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SiWhatsapp className="h-5 w-5 text-green-600" />
                {t('contact.whatsapp')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
                aria-label={`${t('contact.whatsapp')}: ${contactInfo.whatsappNumber}`}
              >
                {contactInfo.whatsappNumber}
              </a>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('contact.email')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline font-medium break-all"
                aria-label={`${t('contact.email')}: ${contactInfo.email}`}
              >
                {contactInfo.email}
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Branch Locations Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-center">{t('contact.directions.title')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Benalmádena Branch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('contact.locations.branch1')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={benalmadenaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium text-sm cursor-pointer inline-block"
                  aria-label={`${t('contact.locations.branch1')} - Av. Antonio Machado, 32, 29630 Benalmádena, Málaga`}
                >
                  Av. Antonio Machado, 32, 29630 Benalmádena, Málaga
                </a>
              </CardContent>
            </Card>

            {/* Fuengirola Branch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('contact.locations.branch2')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={fuengirolaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium text-sm cursor-pointer inline-block"
                  aria-label={`${t('contact.locations.branch2')} - Paseo Maritimo Rey de España 125, Fuengirola, Málaga`}
                >
                  Paseo Maritimo Rey de España 125, Fuengirola, Málaga
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Opening Hours */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-center">
                <Clock className="h-5 w-5" />
                {t('contact.hours.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-sm">{t('contact.hours.schedule')}</p>
              <p className="text-sm text-muted-foreground italic">
                {t('contact.hours.note')}
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
