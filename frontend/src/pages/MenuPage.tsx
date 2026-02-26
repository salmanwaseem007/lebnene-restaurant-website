import { useState, useEffect, useRef } from 'react';
import { useGetMenuPhotos, useGetContactInfo } from '../hooks/useQueries';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export default function MenuPage() {
  const { language, t } = useLanguage();
  const { data: menuPhotos = [], isLoading: photosLoading } = useGetMenuPhotos(language);
  const { data: contactInfo } = useGetContactInfo();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMountedRef = useRef(true);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Sort photos by displayOrder for consistent display
  const sortedPhotos = [...menuPhotos].sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder));

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset current index when language changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [language]);

  // Convert blobs to URLs
  useEffect(() => {
    if (sortedPhotos.length > 0) {
      const urls = sortedPhotos.map((photo) => photo.blob.getDirectURL());
      setImageUrls(urls);
    } else {
      setImageUrls([]);
    }
  }, [sortedPhotos]);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      }
    };

    if (lightboxOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const goToPrevious = () => {
    if (!isMountedRef.current) return;
    setCurrentIndex((prev) => (prev === 0 ? sortedPhotos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!isMountedRef.current) return;
    setCurrentIndex((prev) => (prev === sortedPhotos.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMountedRef.current) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMountedRef.current) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!isMountedRef.current || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  const handleOpenLightbox = () => {
    if (!isMountedRef.current) return;
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    if (!isMountedRef.current) return;
    setLightboxOpen(false);
  };

  const whatsappNumber = contactInfo?.whatsappNumber?.replace(/\s/g, '') || '';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('menu.title')}</h1>
          {whatsappNumber && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline"
            >
              <SiWhatsapp className="h-5 w-5" />
              {t('menu.orderWhatsApp')}
            </a>
          )}
        </header>

        <main>
          {photosLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : sortedPhotos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">{t('menu.empty')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Image Display */}
              <div
                className="relative bg-muted rounded-lg overflow-hidden"
                style={{ minHeight: '500px' }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={imageUrls[currentIndex]}
                    alt={sortedPhotos[currentIndex]?.name || `Menu photo ${currentIndex + 1}`}
                    className="max-w-full max-h-[600px] object-contain cursor-pointer transition-opacity duration-300"
                    onClick={handleOpenLightbox}
                    loading="lazy"
                  />
                </div>

                {/* Navigation Buttons - Icon Only */}
                <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={goToPrevious}
                    className="pointer-events-auto shadow-lg h-12 w-12"
                    aria-label={t('menu.previous')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={goToNext}
                    className="pointer-events-auto shadow-lg h-12 w-12"
                    aria-label={t('menu.next')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2">
                  {imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-border hover:border-primary/50'
                      }`}
                      aria-label={`${t('menu.viewImage')} ${index + 1}`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Counter */}
              <div className="text-center text-sm text-muted-foreground">
                {currentIndex + 1} / {sortedPhotos.length}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Simple Lightbox - No Zoom */}
      {lightboxOpen && imageUrls[currentIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseLightbox}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 z-10"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image Container */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrls[currentIndex]}
              alt={sortedPhotos[currentIndex]?.name || `Menu photo ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
