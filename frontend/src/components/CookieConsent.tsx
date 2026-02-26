import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const COOKIE_CONSENT_KEY = 'lebnene-cookie-consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 fade-in-20">
      <div className="mx-auto max-w-xl bg-background border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 text-sm">
            <p className="mb-2">{t('cookie.message')}</p>
            <Link
              to="/privacidad"
              className="text-primary hover:underline font-medium"
            >
              {t('cookie.readPolicy')}
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-6 w-6"
            onClick={handleReject}
            aria-label={t('cookie.close')}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleAccept}
            size="sm"
            className="flex-1"
          >
            {t('cookie.accept')}
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {t('cookie.reject')}
          </Button>
        </div>
      </div>
    </div>
  );
}
