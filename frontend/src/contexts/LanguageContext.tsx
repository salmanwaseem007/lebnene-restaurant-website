import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'lebnene-language';

// Translation object
const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.menu': 'Menú',
    'nav.contact': 'Contacto',
    'nav.privacy': 'Política de Privacidad',
    'nav.openMenu': 'Abrir menú',
    'nav.closeMenu': 'Cerrar menú',
    'nav.mobileNav': 'Menú de navegación móvil',
    
    // Home Page
    'home.hero.subtitle': 'Deliciosos Shawarmas y Clásicos de Street-Food.',
    'home.hero.viewMenu': 'Ver Menú',
    'home.description.title': 'Comida callejera libanesa',
    'home.description.p1': 'Bienvenido a Lebnéne, donde la tradición y el sabor se encuentran para brindarte una experiencia culinaria libanesa auténtica y memorable.',
    'home.description.p2': 'En nuestro restaurante, nos enorgullecemos de ofrecer una amplia variedad de platos libaneses, preparados con las recetas más auténticas y los ingredientes más frescos.',
    'home.description.p3': 'Desde los deliciosos mezzes, como el hummus y el tabbouleh, hasta especialidades a la parrilla y postres exquisitos, cada bocado es una celebración de los ricos sabores y aromas del Líbano.',
    'home.delivery.title': 'Servicios de Entrega a Domicilio',
    'home.delivery.orderVia': 'Pedir a través de',
    'home.contact.title': 'Detalles de Contacto',
    'home.contact.email': 'Correo Electrónico',
    'home.contact.phone': 'Teléfono',
    'home.locations.title': 'Nuestras Ubicaciones',
    'home.locations.branch1': 'Sucursal 1',
    'home.locations.branch2': 'Sucursal 2',
    'home.locations.viewMap': 'Ver en mapa',
    'home.hours.title': 'Horario de Apertura',
    'home.hours.schedule': 'De jueves a martes (15:00 - 23:30). Cerrado los miércoles.',
    'home.hours.note': 'Los horarios pueden variar en días festivos.',
    
    // Menu Page
    'menu.title': 'Nuestro Menú',
    'menu.orderWhatsApp': 'Pedir por WhatsApp',
    'menu.loading': 'Cargando...',
    'menu.empty': 'Fotos del menú próximamente.',
    'menu.previous': 'Imagen anterior',
    'menu.next': 'Siguiente imagen',
    'menu.viewImage': 'Ver imagen',
    
    // Contact Page
    'contact.title': 'Contacto',
    'contact.subtitle': 'Estamos aquí para servirte',
    'contact.loading': 'Cargando información de contacto...',
    'contact.error': 'No se pudo cargar la información de contacto.',
    'contact.whatsapp': 'Número de WhatsApp',
    'contact.email': 'Correo Electrónico',
    'contact.directions.title': 'Cómo Llegar',
    'contact.locations.branch1': 'Sucursal 1',
    'contact.locations.branch2': 'Sucursal 2',
    'contact.locations.viewMap': 'Ver en mapa',
    'contact.hours.title': 'Horario de Apertura',
    'contact.hours.schedule': 'De jueves a martes (15:00 - 23:30). Cerrado los miércoles.',
    'contact.hours.note': 'Los horarios pueden variar en días festivos.',
    
    // Privacy Page
    'privacy.title': 'Política de Privacidad',
    'privacy.updated': 'Última actualización: Diciembre 2025',
    'privacy.intro.title': 'Introducción',
    'privacy.intro.text': 'En Lebnene, nos comprometemos a proteger su privacidad y garantizar la seguridad de su información personal. Esta política de privacidad explica qué datos recopilamos, cómo los utilizamos y cuáles son sus derechos respecto a su información personal.',
    'privacy.data.title': 'Datos Recopilados',
    'privacy.data.intro': 'Nuestro sitio web recopila información limitada para proporcionar nuestros servicios:',
    'privacy.data.cookies': 'Cookies funcionales:',
    'privacy.data.cookiesText': 'Utilizamos cookies para recordar sus preferencias de consentimiento y mejorar su experiencia de navegación.',
    'privacy.data.contact': 'Información de contacto:',
    'privacy.data.contactText': 'Cuando se comunica con nosotros a través de WhatsApp o correo electrónico, recopilamos la información que usted nos proporciona voluntariamente.',
    'privacy.data.location': 'Datos de ubicación:',
    'privacy.data.locationText': 'Utilizamos Google Maps para mostrar nuestra ubicación. Google puede recopilar datos según su propia política de privacidad.',
    'privacy.purpose.title': 'Propósito del Tratamiento de Datos',
    'privacy.purpose.intro': 'Utilizamos la información recopilada para los siguientes propósitos:',
    'privacy.purpose.1': 'Proporcionar y mejorar nuestros servicios de restaurante',
    'privacy.purpose.2': 'Responder a sus consultas y solicitudes',
    'privacy.purpose.3': 'Mostrar información de ubicación y horarios de apertura',
    'privacy.purpose.4': 'Recordar sus preferencias de cookies',
    'privacy.purpose.5': 'Cumplir con obligaciones legales',
    'privacy.cookies.title': 'Cookies y Tecnologías Similares',
    'privacy.cookies.intro': 'Nuestro sitio web utiliza cookies para mejorar su experiencia:',
    'privacy.cookies.essential': 'Cookies esenciales:',
    'privacy.cookies.essentialText': 'Necesarias para el funcionamiento básico del sitio web, incluyendo el almacenamiento de su preferencia de consentimiento de cookies.',
    'privacy.cookies.thirdParty': 'Cookies de terceros:',
    'privacy.cookies.thirdPartyText': 'Google Maps puede establecer cookies para proporcionar funcionalidad de mapas. Consulte la',
    'privacy.cookies.googlePolicy': 'política de privacidad de Google',
    'privacy.cookies.forMore': 'para más información.',
    'privacy.cookies.manage': 'Puede gestionar sus preferencias de cookies en cualquier momento eliminando las cookies de su navegador o ajustando la configuración de su navegador.',
    'privacy.thirdParty.title': 'Servicios de Terceros',
    'privacy.thirdParty.intro': 'Nuestro sitio web integra los siguientes servicios de terceros:',
    'privacy.thirdParty.maps': 'Google Maps:',
    'privacy.thirdParty.mapsText': 'Para mostrar nuestra ubicación y proporcionar direcciones. Google puede recopilar datos de uso según su política de privacidad.',
    'privacy.thirdParty.whatsapp': 'WhatsApp:',
    'privacy.thirdParty.whatsappText': 'Los enlaces a WhatsApp le redirigen a la aplicación o sitio web de WhatsApp, que está sujeto a la política de privacidad de Meta.',
    'privacy.rights.title': 'Derechos del Usuario',
    'privacy.rights.intro': 'De acuerdo con el Reglamento General de Protección de Datos (RGPD), usted tiene los siguientes derechos:',
    'privacy.rights.access': 'Derecho de acceso:',
    'privacy.rights.accessText': 'Puede solicitar información sobre los datos personales que tenemos sobre usted',
    'privacy.rights.rectification': 'Derecho de rectificación:',
    'privacy.rights.rectificationText': 'Puede solicitar la corrección de datos inexactos',
    'privacy.rights.erasure': 'Derecho de supresión:',
    'privacy.rights.erasureText': 'Puede solicitar la eliminación de sus datos personales',
    'privacy.rights.objection': 'Derecho de oposición:',
    'privacy.rights.objectionText': 'Puede oponerse al procesamiento de sus datos personales',
    'privacy.rights.portability': 'Derecho de portabilidad:',
    'privacy.rights.portabilityText': 'Puede solicitar una copia de sus datos en formato estructurado',
    'privacy.rights.withdraw': 'Derecho a retirar el consentimiento:',
    'privacy.rights.withdrawText': 'Puede retirar su consentimiento en cualquier momento',
    'privacy.rights.exercise': 'Para ejercer cualquiera de estos derechos, póngase en contacto con nosotros a través de los datos de contacto proporcionados en nuestra',
    'privacy.rights.contactPage': 'página de contacto',
    'privacy.security.title': 'Seguridad de los Datos',
    'privacy.security.text': 'Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro.',
    'privacy.retention.title': 'Retención de Datos',
    'privacy.retention.text': 'Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política de privacidad, a menos que la ley requiera o permita un período de retención más largo.',
    'privacy.changes.title': 'Cambios en esta Política',
    'privacy.changes.text': 'Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o por razones legales. Le notificaremos cualquier cambio significativo publicando la nueva política en esta página con una fecha de actualización revisada.',
    'privacy.contact.title': 'Contacto',
    'privacy.contact.text': 'Si tiene preguntas, inquietudes o solicitudes relacionadas con esta política de privacidad o el tratamiento de sus datos personales, no dude en contactarnos:',
    'privacy.footer': 'Esta política de privacidad se rige por las leyes de España y el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.',
    
    // Cookie Consent
    'cookie.message': 'Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Al continuar navegando, acepta nuestro uso de cookies.',
    'cookie.readPolicy': 'Leer Política de Privacidad',
    'cookie.accept': 'Aceptar',
    'cookie.reject': 'Rechazar',
    'cookie.close': 'Cerrar banner',
    
    // Footer
    'footer.builtWith': 'Built with',
    'footer.using': 'using',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.mobileNav': 'Mobile navigation menu',
    
    // Home Page
    'home.hero.subtitle': 'Delicious Shawarmas and Street-Food Classics.',
    'home.hero.viewMenu': 'View Menu',
    'home.description.title': 'Lebanese Street Food',
    'home.description.p1': 'Welcome to Lebnéne, where tradition and flavor come together to bring you an authentic and memorable Lebanese culinary experience.',
    'home.description.p2': 'In our restaurant, we take pride in offering a wide variety of Lebanese dishes, prepared with the most authentic recipes and the freshest ingredients.',
    'home.description.p3': 'From delicious mezzes such as hummus and tabbouleh to grilled specialties and exquisite desserts, every bite is a celebration of Lebanon\'s rich flavors and aromas.',
    'home.delivery.title': 'Delivery Services',
    'home.delivery.orderVia': 'Order via',
    'home.contact.title': 'Contact Details',
    'home.contact.email': 'Email',
    'home.contact.phone': 'Phone',
    'home.locations.title': 'Our Locations',
    'home.locations.branch1': 'Branch 1',
    'home.locations.branch2': 'Branch 2',
    'home.locations.viewMap': 'View on map',
    'home.hours.title': 'Opening Hours',
    'home.hours.schedule': 'Thursday to Tuesday (3:00 PM - 11:30 PM). Closed on Wednesdays.',
    'home.hours.note': 'Hours may vary on holidays.',
    
    // Menu Page
    'menu.title': 'Our Menu',
    'menu.orderWhatsApp': 'Order via WhatsApp',
    'menu.loading': 'Loading...',
    'menu.empty': 'Menu photos coming soon.',
    'menu.previous': 'Previous image',
    'menu.next': 'Next image',
    'menu.viewImage': 'View image',
    
    // Contact Page
    'contact.title': 'Contact',
    'contact.subtitle': 'We are here to serve you',
    'contact.loading': 'Loading contact information...',
    'contact.error': 'Could not load contact information.',
    'contact.whatsapp': 'WhatsApp Number',
    'contact.email': 'Email',
    'contact.directions.title': 'Get Directions',
    'contact.locations.branch1': 'Branch 1',
    'contact.locations.branch2': 'Branch 2',
    'contact.locations.viewMap': 'View on map',
    'contact.hours.title': 'Opening Hours',
    'contact.hours.schedule': 'Thursday to Tuesday (3:00 PM - 11:30 PM). Closed on Wednesdays.',
    'contact.hours.note': 'Hours may vary on holidays.',
    
    // Privacy Page
    'privacy.title': 'Privacy Policy',
    'privacy.updated': 'Last updated: December 2025',
    'privacy.intro.title': 'Introduction',
    'privacy.intro.text': 'At Lebnene, we are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains what data we collect, how we use it, and what your rights are regarding your personal information.',
    'privacy.data.title': 'Data Collected',
    'privacy.data.intro': 'Our website collects limited information to provide our services:',
    'privacy.data.cookies': 'Functional cookies:',
    'privacy.data.cookiesText': 'We use cookies to remember your consent preferences and improve your browsing experience.',
    'privacy.data.contact': 'Contact information:',
    'privacy.data.contactText': 'When you communicate with us via WhatsApp or email, we collect the information you voluntarily provide.',
    'privacy.data.location': 'Location data:',
    'privacy.data.locationText': 'We use Google Maps to display our location. Google may collect data according to its own privacy policy.',
    'privacy.purpose.title': 'Purpose of Data Processing',
    'privacy.purpose.intro': 'We use the collected information for the following purposes:',
    'privacy.purpose.1': 'Provide and improve our restaurant services',
    'privacy.purpose.2': 'Respond to your inquiries and requests',
    'privacy.purpose.3': 'Display location information and opening hours',
    'privacy.purpose.4': 'Remember your cookie preferences',
    'privacy.purpose.5': 'Comply with legal obligations',
    'privacy.cookies.title': 'Cookies and Similar Technologies',
    'privacy.cookies.intro': 'Our website uses cookies to improve your experience:',
    'privacy.cookies.essential': 'Essential cookies:',
    'privacy.cookies.essentialText': 'Necessary for the basic functioning of the website, including storing your cookie consent preference.',
    'privacy.cookies.thirdParty': 'Third-party cookies:',
    'privacy.cookies.thirdPartyText': 'Google Maps may set cookies to provide map functionality. Please see',
    'privacy.cookies.googlePolicy': "Google's privacy policy",
    'privacy.cookies.forMore': 'for more information.',
    'privacy.cookies.manage': 'You can manage your cookie preferences at any time by deleting cookies from your browser or adjusting your browser settings.',
    'privacy.thirdParty.title': 'Third-Party Services',
    'privacy.thirdParty.intro': 'Our website integrates the following third-party services:',
    'privacy.thirdParty.maps': 'Google Maps:',
    'privacy.thirdParty.mapsText': 'To display our location and provide directions. Google may collect usage data according to its privacy policy.',
    'privacy.thirdParty.whatsapp': 'WhatsApp:',
    'privacy.thirdParty.whatsappText': 'WhatsApp links redirect you to the WhatsApp application or website, which is subject to Meta\'s privacy policy.',
    'privacy.rights.title': 'User Rights',
    'privacy.rights.intro': 'In accordance with the General Data Protection Regulation (GDPR), you have the following rights:',
    'privacy.rights.access': 'Right of access:',
    'privacy.rights.accessText': 'You can request information about the personal data we have about you',
    'privacy.rights.rectification': 'Right of rectification:',
    'privacy.rights.rectificationText': 'You can request the correction of inaccurate data',
    'privacy.rights.erasure': 'Right of erasure:',
    'privacy.rights.erasureText': 'You can request the deletion of your personal data',
    'privacy.rights.objection': 'Right to object:',
    'privacy.rights.objectionText': 'You can object to the processing of your personal data',
    'privacy.rights.portability': 'Right to data portability:',
    'privacy.rights.portabilityText': 'You can request a copy of your data in a structured format',
    'privacy.rights.withdraw': 'Right to withdraw consent:',
    'privacy.rights.withdrawText': 'You can withdraw your consent at any time',
    'privacy.rights.exercise': 'To exercise any of these rights, please contact us through the contact information provided on our',
    'privacy.rights.contactPage': 'contact page',
    'privacy.security.title': 'Data Security',
    'privacy.security.text': 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of Internet transmission or electronic storage is 100% secure.',
    'privacy.retention.title': 'Data Retention',
    'privacy.retention.text': 'We retain your personal information only for as long as necessary to fulfill the purposes described in this privacy policy, unless a longer retention period is required or permitted by law.',
    'privacy.changes.title': 'Changes to this Policy',
    'privacy.changes.text': 'We may update this privacy policy periodically to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by posting the new policy on this page with a revised update date.',
    'privacy.contact.title': 'Contact',
    'privacy.contact.text': 'If you have questions, concerns, or requests related to this privacy policy or the processing of your personal data, please do not hesitate to contact us:',
    'privacy.footer': 'This privacy policy is governed by the laws of Spain and the European Union General Data Protection Regulation (GDPR).',
    
    // Cookie Consent
    'cookie.message': 'We use cookies to improve your experience on our website. By continuing to browse, you accept our use of cookies.',
    'cookie.readPolicy': 'Read Privacy Policy',
    'cookie.accept': 'Accept',
    'cookie.reject': 'Reject',
    'cookie.close': 'Close banner',
    
    // Footer
    'footer.builtWith': 'Built with',
    'footer.using': 'using',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored === 'en' || stored === 'es') ? stored : 'es';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

