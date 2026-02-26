import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { Heart, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import FloatingWhatsAppButton from './FloatingWhatsAppButton';
import CookieConsent from './CookieConsent';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useLanguage();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/contacto', label: t('nav.contact') },
    { to: '/privacidad', label: t('nav.privacy') },
  ];

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  const handleLinkClick = () => {
    handleCloseMenu();
  };

  const handleToggleMenu = () => {
    if (mobileMenuOpen) {
      handleCloseMenu();
    } else {
      setMobileMenuOpen(true);
    }
  };

  // Check if we're on the privacy page
  const isPrivacyPage = location.pathname === '/privacidad';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Lebnene
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-primary"
                activeProps={{ className: 'text-primary' }}
              >
                {link.label}
              </Link>
            ))}
            <LanguageToggle />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={handleToggleMenu}
            aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            id="mobile-menu"
            className={`md:hidden border-t bg-background/95 backdrop-blur transition-all duration-200 ${
              isClosing
                ? 'animate-out slide-out-to-top-2 fade-out-20'
                : 'animate-in slide-in-from-top-2 fade-in-20'
            }`}
            role="navigation"
            aria-label={t('nav.mobileNav')}
          >
            <div className="container py-4">
              {/* Close button inside dropdown */}
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseMenu}
                  aria-label={t('nav.closeMenu')}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary hover:bg-muted rounded-md"
                    activeProps={{ className: 'text-primary bg-muted' }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 py-2">
                  <LanguageToggle />
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/40">
        <div className="container py-8">
          <nav className="flex flex-wrap justify-center gap-6 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-center text-sm text-muted-foreground">
            © 2025. {t('footer.builtWith')} <Heart className="inline h-4 w-4 text-red-500" /> {t('footer.using')}{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <FloatingWhatsAppButton />
      
      {/* Show cookie consent banner on all pages except privacy page */}
      {!isPrivacyPage && <CookieConsent />}
    </div>
  );
}
