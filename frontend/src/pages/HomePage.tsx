import { useGetContactInfo } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { MapPin, Mail, Clock } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const { t } = useLanguage();

  const whatsappNumber = contactInfo?.whatsappNumber || '';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  // Hard-coded branch addresses
  const benalmadenaUrl = 'https://www.google.com/maps/dir/?api=1&destination=Av.+Antonio+Machado,+32,+29630+Benalmádena,+Málaga';
  const fuengirolaUrl = 'https://www.google.com/maps/dir/?api=1&destination=Paseo+Maritimo+Rey+de+España+125,+Fuengirola,+Málaga';

  // Delivery service data
  const deliveryServices = [
    {
      name: 'Glovo',
      logo: 'https://i.imgur.com/i3dJkEq.png',
      url: 'https://glovoapp.com/es/es/torremolinos-benalmadena-churriana/stores/lebnene-torremolinos-benalmadena-churriana',
    },
    {
      name: 'Just Eat',
      logo: 'https://i.imgur.com/oWRJIbq.png',
      url: 'https://www.just-eat.es/restaurants-lebnene-benalmadena',
    },
    {
      name: 'Uber Eats',
      logo: 'https://i.imgur.com/O8fkyXt.png',
      url: 'https://www.ubereats.com/es/store/lebnene-lebanese-street-food/gxhyhs4EXjCTME7PXoqnCg',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://i.imgur.com/tS4vXFk.jpeg)' }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container text-center text-white space-y-6 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Lebnéne</h1>
          <p className="text-xl md:text-2xl font-medium">
            {t('home.hero.subtitle')}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-48 mx-auto bg-white/20" />
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg hover:text-[#25D366] transition-colors"
              aria-label={`${t('home.contact.phone')}: ${whatsappNumber}`}
            >
              <SiWhatsapp className="h-6 w-6" />
              <span>{whatsappNumber}</span>
            </a>
          )}
          <div className="pt-4">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/menu">{t('home.hero.viewMenu')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Restaurant Description */}
      <section className="container py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            {t('home.description.title')}
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>{t('home.description.p1')}</p>
            <p>{t('home.description.p2')}</p>
            <p>{t('home.description.p3')}</p>
          </div>
        </div>
      </section>

      {/* Delivery Services Section */}
      <section className="bg-muted/20 py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              🚚 {t('home.delivery.title')}
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {deliveryServices.map((service) => (
                <a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  aria-label={`${t('home.delivery.orderVia')} ${service.name}`}
                >
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <CardContent className="p-6 flex items-center justify-center h-[180px] sm:h-[160px] md:h-[180px]">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={service.logo}
                          alt={`${service.name} logo`}
                          className="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none delivery-logo"
                          style={{
                            touchAction: 'manipulation',
                            userSelect: 'none',
                          } as React.CSSProperties}
                          loading="lazy"
                          draggable="false"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="bg-muted/40 py-16">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {t('home.contact.title')}
          </h2>

          {isLoading ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : contactInfo ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Top Row: WhatsApp and Email */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Phone/WhatsApp */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SiWhatsapp className="h-5 w-5 text-green-600" />
                      {t('home.contact.phone')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium text-sm"
                      aria-label={`${t('home.contact.phone')}: ${contactInfo.whatsappNumber}`}
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
                      {t('home.contact.email')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-primary hover:underline font-medium break-all text-sm"
                      aria-label={`${t('home.contact.email')}: ${contactInfo.email}`}
                    >
                      {contactInfo.email}
                    </a>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Section: Branch Locations */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center">
                  🏠 {t('home.locations.title')}
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Benalmádena Branch */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {t('home.locations.branch1')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={benalmadenaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-sm cursor-pointer inline-block"
                        aria-label={`${t('home.locations.branch1')} - Av. Antonio Machado, 32, 29630 Benalmádena, Málaga`}
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
                        {t('home.locations.branch2')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={fuengirolaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium text-sm cursor-pointer inline-block"
                        aria-label={`${t('home.locations.branch2')} - Paseo Maritimo Rey de España 125, Fuengirola, Málaga`}
                      >
                        Paseo Maritimo Rey de España 125, Fuengirola, Málaga
                      </a>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Section: Opening Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center">
                    <Clock className="h-5 w-5" />
                    {t('home.hours.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm">{t('home.hours.schedule')}</p>
                  <p className="text-sm text-muted-foreground italic">
                    {t('home.hours.note')}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
