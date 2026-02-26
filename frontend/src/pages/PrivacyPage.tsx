import { Link } from '@tanstack/react-router';
import { useLanguage } from '../contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('privacy.title')}</h1>
          <p className="text-muted-foreground mb-8">{t('privacy.updated')}</p>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.intro.title')}</h2>
              <p className="leading-relaxed">{t('privacy.intro.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.data.title')}</h2>
              <p className="leading-relaxed mb-3">{t('privacy.data.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>{t('privacy.data.cookies')}</strong> {t('privacy.data.cookiesText')}
                </li>
                <li>
                  <strong>{t('privacy.data.contact')}</strong> {t('privacy.data.contactText')}
                </li>
                <li>
                  <strong>{t('privacy.data.location')}</strong> {t('privacy.data.locationText')}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.purpose.title')}</h2>
              <p className="leading-relaxed mb-3">{t('privacy.purpose.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.purpose.1')}</li>
                <li>{t('privacy.purpose.2')}</li>
                <li>{t('privacy.purpose.3')}</li>
                <li>{t('privacy.purpose.4')}</li>
                <li>{t('privacy.purpose.5')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.cookies.title')}</h2>
              <p className="leading-relaxed mb-3">{t('privacy.cookies.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>{t('privacy.cookies.essential')}</strong> {t('privacy.cookies.essentialText')}
                </li>
                <li>
                  <strong>{t('privacy.cookies.thirdParty')}</strong> {t('privacy.cookies.thirdPartyText')}{' '}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t('privacy.cookies.googlePolicy')}
                  </a>{' '}
                  {t('privacy.cookies.forMore')}
                </li>
              </ul>
              <p className="leading-relaxed mt-3">{t('privacy.cookies.manage')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.thirdParty.title')}</h2>
              <p className="leading-relaxed mb-3">{t('privacy.thirdParty.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>{t('privacy.thirdParty.maps')}</strong> {t('privacy.thirdParty.mapsText')}
                </li>
                <li>
                  <strong>{t('privacy.thirdParty.whatsapp')}</strong> {t('privacy.thirdParty.whatsappText')}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.rights.title')}</h2>
              <p className="leading-relaxed mb-3">{t('privacy.rights.intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>{t('privacy.rights.access')}</strong> {t('privacy.rights.accessText')}</li>
                <li><strong>{t('privacy.rights.rectification')}</strong> {t('privacy.rights.rectificationText')}</li>
                <li><strong>{t('privacy.rights.erasure')}</strong> {t('privacy.rights.erasureText')}</li>
                <li><strong>{t('privacy.rights.objection')}</strong> {t('privacy.rights.objectionText')}</li>
                <li><strong>{t('privacy.rights.portability')}</strong> {t('privacy.rights.portabilityText')}</li>
                <li><strong>{t('privacy.rights.withdraw')}</strong> {t('privacy.rights.withdrawText')}</li>
              </ul>
              <p className="leading-relaxed mt-3">
                {t('privacy.rights.exercise')}{' '}
                <Link to="/contacto" className="text-primary hover:underline">
                  {t('privacy.rights.contactPage')}
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.security.title')}</h2>
              <p className="leading-relaxed">{t('privacy.security.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.retention.title')}</h2>
              <p className="leading-relaxed">{t('privacy.retention.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.changes.title')}</h2>
              <p className="leading-relaxed">{t('privacy.changes.text')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
              <p className="leading-relaxed">{t('privacy.contact.text')}</p>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">Lebnene</p>
                <p>Av. Antonio Machado, 32, 29630 Benalmádena, Málaga</p>
                <p>Email: lebnene.streetfood@gmail.com</p>
                <p>WhatsApp: +34 664 88 95 35</p>
              </div>
            </section>

            <section className="border-t pt-8">
              <p className="text-sm text-muted-foreground">{t('privacy.footer')}</p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
