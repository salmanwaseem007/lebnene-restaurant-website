import { Button } from '@/components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 border rounded-md p-1" role="group" aria-label="Language selector">
      <Button
        variant={language === 'es' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('es')}
        className="h-8 px-3 text-xs font-medium"
        aria-label="Español"
        aria-pressed={language === 'es'}
      >
        🇪🇸 ES
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="h-8 px-3 text-xs font-medium"
        aria-label="English"
        aria-pressed={language === 'en'}
      >
        🇬🇧 EN
      </Button>
    </div>
  );
}
