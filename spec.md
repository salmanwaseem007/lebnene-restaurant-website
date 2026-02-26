# Lebnene Restaurant Management Application

## Overview
A restaurant management application for "Lebnene" with public pages and an admin panel for managing menu photos and contact information. The application supports multilingual functionality (Spanish/English) for all public pages.

## Application Structure

### Authentication System
- **Internet Identity Integration**: Extended session duration of 1 week (7 days) before automatic timeout or re-login is required
- **Session Persistence**: User identity credentials stored securely in localStorage for up to 7 days with automatic restoration on page load
- **Session Management**: Clear handling of session expiration with users remaining logged in for up to one week unless they explicitly log out
- **Global Authentication**: Session extension applied across all pages using Internet Identity authentication
- **Access Control Compatibility**: Maintains existing admin panel access control and non-admin user flows
- **Domain Compatibility**: Internet Identity alternative origins configuration file at `.well-known/ii-alternative-origins` in public directory containing JSON with alternativeOrigins array for "https://www.lebnene.es" and "https://lebnene.es"
- **CORS Configuration**: Backend configured for production domains `https://www.lebnene.es` and `https://lebnene.es` with proper origin authorization for Internet Identity authentication

### Build Configuration
- **Development Mode**: Vite build configuration with `minify: false` in build options to enable full React stack traces and debugging
- **Error Handling**: React errors handled gracefully with console logging without interrupting user interface
- **Static Assets**: Ensure `.well-known` directory and contents are included in build output for proper Internet Identity domain compatibility

### SEO Configuration
- **Static File Routing**: Configure frontend routing and server to serve `sitemap.xml` and `robots.txt` as static assets directly from the `public/` directory, bypassing all React route handling, header/footer rendering, and layout components
- **Raw Content Delivery**: Ensure requests to `/sitemap.xml` and `/robots.txt` return only their raw content without HTML layout or 404 routing overrides
- **Public Accessibility**: Both files must be publicly accessible at `https://lebnene.es/sitemap.xml` and `https://lebnene.es/robots.txt` while maintaining all existing React page routing for other paths
- **Sitemap**: Create `sitemap.xml` file in the `public/` directory with proper XML formatting containing URLs for `/`, `/menu`, `/contact`, and `/privacy` with appropriate metadata
- **Robots.txt**: Create `robots.txt` file in the `public/` directory allowing all search engines and linking to sitemap at `https://lebnene.es/sitemap.xml`
- **HTML Meta Tags**: Update `<head>` section of `frontend/index.html` with Spanish SEO meta tags:
  - `<title>`: "Lebnéne | Auténtica Comida Libanesa y Mediterránea en Benalmádena"
  - `<meta name="description">` describing authentic Lebanese food experience
  - `<meta name="keywords">` including relevant Spanish search terms
  - `<meta name="robots" content="index, follow">`
  - `<link rel="canonical" href="https://lebnene.es/">`
- **Meta Tag Management**: Replace any existing conflicting `<meta>` or `<title>` tags in `frontend/index.html` with the provided SEO tags
- **Validation**: Ensure sitemap and robots.txt syntax follows SEO best practices and can be detected by search engines
- **HTML Compliance**: All homepage head elements properly formatted and encoded for HTML compliance
- **Structured Data**: Add Restaurant Schema JSON-LD structured data to `frontend/index.html` within the `<head>` section for Google Rich Results optimization:
  - `<script type="application/ld+json">` block containing Restaurant schema
  - `@context`: "https://schema.org"
  - `@type`: "Restaurant"
  - `name`: "Lebnéne"
  - `url`: "https://lebnene.es"
  - `telephone`: "+34 664 88 95 35"
  - `address`: Complete address object for Av. Antonio Machado, 32, Benalmádena, Málaga 29630, Spain
  - `servesCuisine`: Array including "Lebanese", "Mediterranean", "Middle Eastern", "Halal", "Street Food"
  - `menu`: "https://lebnene.es/menu"
  - `acceptsReservations`: true
  - `openingHours`: "Thursday to Tuesday 15:00-23:30"
  - `image`: "https://i.imgur.com/tS4vXFk.jpeg"
  - `hasMenuSection`: Array of MenuItem objects including "Fattoush", "Tabulé", "Hummus", "Shawarma", "Baklava"
  - **JSON-LD Validation**: Ensure proper indentation, valid JSON syntax, and compliance with Google's structured data requirements
  - **SEO Integration**: Structured data complements existing meta tags without conflicts

### Multilingual Support
- **Language Toggle**: Flag-based or ES/EN toggle button in the common header, visible on all non-admin pages
  - **Mobile-Friendly**: Responsive design with proper touch targets and ARIA accessibility attributes
  - **Default Language**: Spanish (ES)
  - **Persistence**: User language preference saved in localStorage and applied across all pages
  - **Dynamic Content**: All frontend text (titles, buttons, labels, paragraphs) updates based on selected language
- **Translation System**: Lightweight i18n implementation using JSON translation files or context-based approach
- **Admin Panel**: Remains English-only and unaffected by language toggle

### Public Pages
- **Header/Footer Layout**: All public pages include a responsive navigation header with restaurant name "Lebnene" and links to "Inicio"/"Home", "Menú"/"Menu", "Contacto"/"Contact", "Política de Privacidad"/"Privacy Policy", plus language toggle, and a simple footer with the same links
  - **Desktop Navigation**: Horizontal navigation links with language toggle
  - **Mobile Navigation**: Hamburger icon that toggles a dropdown menu with smooth slide/fade animation, includes language toggle, closes on outside click or link selection, includes ARIA accessibility attributes
    - **Close Icon Functionality**: X icon inside dropdown with proper `onClick` handler to close the dropdown using the same `isDropdownOpen` state
    - **Outside Click Handling**: `useEffect` event listeners to close dropdown when clicking outside the menu area
    - **Link Click Behavior**: All navigation links close the dropdown when clicked
    - **Transition Animations**: Proper slide/fade animations when opening and closing the dropdown
    - **Accessibility**: Close button includes `aria-label="Cerrar menú"` for screen readers
    - **Icon Toggle**: Clean visibility toggle between hamburger (open) and close (X) icons based on dropdown state
    - **Mobile-Friendly**: Correct behavior across all screen sizes with proper touch targets
- **Inicio/Home**: Home page with hero section, restaurant description, delivery services section, contact details, and location map
- **Menú/Menu**: Menu page with integrated photo gallery displaying menu photos based on selected language
- **Contacto/Contact**: Contact page with restaurant information and branch locations
- **Política de Privacidad/Privacy Policy**: Privacy policy page with detailed privacy information
- **Floating WhatsApp Button**: Bottom-right corner button visible on all pages, opens WhatsApp using backend phone number
- **Cookie Consent Banner**: Global banner appearing at bottom of all pages (except `/admin` and `/privacy`), inside small unobtrusive container with max width `xl`, featuring "Aceptar"/"Accept" and "Rechazar"/"Reject" buttons, link to privacy policy, and localStorage persistence to prevent reappearance after user decision

### Home Page Content
- **Hero Section**: Full-width background image using the generated hero background image with semi-transparent overlay and centered white text
  - Title: "Lebnéne" (same in both languages)
  - Subtitle: "Deliciosos Shawarmas y Clásicos de Street-Food." / "Delicious Shawarmas and Street-Food Classics."
  - WhatsApp number (from backend contact info) with WhatsApp icon, clickable link to `https://wa.me/WHATSAPP_NUMBER`
  - "Ver Menú"/"View Menu" button linking to `/menu`
- **Restaurant Description**: "Comida callejera libanesa"/"Lebanese Street Food" section with heading and three descriptive paragraphs, centered layout
  - **Spanish Content**:
    - Heading: "Comida callejera libanesa"
    - Paragraph 1: "Bienvenido a Lebnéne, donde la tradición y el sabor se encuentran para brindarte una experiencia culinaria libanesa auténtica y memorable."
    - Paragraph 2: "En nuestro restaurante, nos enorgullecemos de ofrecer una amplia variedad de platos libaneses, preparados con las recetas más auténticas y los ingredientes más frescos."
    - Paragraph 3: "Desde los deliciosos mezzes, como el hummus y el tabbouleh, hasta especialidades a la parrilla y postres exquisitos, cada bocado es una celebración de los ricos sabores y aromas del Líbano."
  - **English Content**:
    - Heading: "Lebanese Street Food"
    - Paragraph 1: "Welcome to Lebnéne, where tradition and flavor come together to bring you an authentic and memorable Lebanese culinary experience."
    - Paragraph 2: "In our restaurant, we take pride in offering a wide variety of Lebanese dishes, prepared with the most authentic recipes and the freshest ingredients."
    - Paragraph 3: "From delicious mezzes such as hummus and tabbouleh to grilled specialties and exquisite desserts, every bite is a celebration of Lebanon's rich flavors and aromas."
- **Delivery Services Section**: "🚚 Servicios de Entrega a Domicilio"/"🚚 Delivery Services" positioned above contact details section
  - **Layout**: Centered within max width `4xl` with consistent heading style
  - **Three Delivery Services**: Horizontally arranged on desktop (3 equal-width columns), vertically stacked on mobile
    - **Glovo**: Logo image `https://i.imgur.com/i3dJkEq.png`, links to `https://glovoapp.com/es/es/torremolinos-benalmadena-churriana/stores/lebnene-torremolinos-benalmadena-churriana`
    - **Just Eat**: Logo image `https://i.imgur.com/oWRJIbq.png`, links to `https://www.just-eat.es/restaurants-lebnene-benalmadena`
    - **Uber Eats**: Logo image `https://i.imgur.com/O8fkyXt.png`, links to `https://www.ubereats.com/es/store/lebnene-lebanese-street-food/gxhyhs4EXjCTME7PXoqnCg`
  - **Logo Container Features**:
    - Fixed aspect ratio preventing stretching/distortion using `object-fit: contain`
    - Fixed container dimensions with consistent height and width across all service cards
    - Opens links in new tab when clicked
    - Hover scaling effect for interactivity
    - Borders, padding, and subtle shadows matching existing card styling
    - Appropriate alt text for accessibility
    - **Mobile Safari Optimization**: 
      - `touch-action: manipulation` to disable iOS Safari default tap zoom behavior
      - `-webkit-user-drag: none` to prevent unwanted image drag/expand behavior
      - Constrained image sizes within card containers to prevent overflow or oversized rendering
      - Uniform card sizing with consistent height, width, and aspect ratio for balanced grid layout
  - **Responsive Design**: Tap-friendly on mobile devices with consistent spacing and layout, fully responsive across mobile and desktop views without disrupting layout or link functionality
- **Contact Details Section**: "Detalles de Contacto"/"Contact Details" displaying backend contact information
  - **Top Row**: Two horizontal cards for WhatsApp phone and email
    - **WhatsApp Card**: Phone number with WhatsApp icon, clickable link opening WhatsApp (`https://wa.me/WHATSAPP_NUMBER`)
    - **Email Card**: Email with clickable mailto link
  - **Middle Section**: "🏠 Nuestras Ubicaciones"/"🏠 Our Locations" heading followed by two branch location cards
    - **Benalmádena Card**: Title "Sucursal 1"/"Branch 1", clickable address "Av. Antonio Machado, 32, 29630 Benalmádena, Málaga" opening Google Maps (`https://www.google.com/maps/dir/?api=1&destination=Av.+Antonio+Machado,+32,+29630+Benalmádena,+Málaga`)
    - **Fuengirola Card**: Title "Sucursal 2"/"Branch 2", clickable address "Paseo Maritimo Rey de España 125, Fuengirola, Málaga" opening Google Maps (`https://www.google.com/maps/dir/?api=1&destination=Paseo+Maritimo+Rey+de+España+125,+Fuengirola,+Málaga`)
  - **Bottom Section**: Single full-width card displaying hard-coded opening hours
    - **Spanish**: "De jueves a martes (15:00 - 23:30). Cerrado los miércoles."
    - **English**: "Thursday to Tuesday (3:00 PM - 11:30 PM). Closed on Wednesdays."
    - **Note**: "Los horarios pueden variar en días festivos."/"Hours may vary on holidays."
  - **Responsive Layout**: Cards arranged in responsive grid (2 columns desktop, 1 mobile) with consistent styling, icon spacing, and hover effects on clickable links
  - **Address Link Styling**: Clickable addresses styled with distinct link color, underline on hover, cursor pointer, maintaining existing typography and sufficient contrast for accessibility
  - **Accessibility**: Proper ARIA attributes and semantic HTML structure

### Menu Page Content
- **Layout**: Uses common header/footer layout with centered container (`max-w-7xl mx-auto px-4`) and semantic HTML structure
- **WhatsApp Order Link**: "Pedir por WhatsApp"/"Order via WhatsApp" link above gallery, clickable to `https://wa.me/WHATSAPP_NUMBER` with WhatsApp icon
- **Photo Gallery**: Displays menu photos based on selected language, sorted by displayOrder ascending
  - **Language-Based Loading**: 
    - Spanish (ES): Load photos from `menuPhotosES`
    - English (EN): Load photos from `menuPhotosEN`
  - **Dynamic Switching**: Gallery automatically refreshes when language is changed
  - **Main Image Display**: Large image with `object-fit: contain` and fade transition effects
  - **Thumbnail Strip**: Horizontal scrollable thumbnails beneath main image showing small previews of all menu photos for selected language, with highlighted current image (border or opacity change)
  - **Navigation Controls**: "<" (Left) and ">" (Right) icon buttons without text, with wrap-around functionality
  - **Mobile Gestures**: Swipe support for image navigation on touch devices
  - **Simple Lightbox Feature**: Clicking main image opens a basic lightbox displaying only the selected image without zoom functionality
    - **Basic Display**: Shows the selected image in a modal overlay with dark background
    - **Close Functionality**: Click outside image or on close button to dismiss lightbox
    - **Keyboard Support**: ESC key closes the lightbox
    - **Responsive Design**: Image scales appropriately for different screen sizes
    - **Smooth Transitions**: Fade in/out animations when opening and closing
    - **No Zoom Components**: Does not include PinchZoom or SafePinchZoom components
    - **Touch and Desktop Compatibility**: Works across all device types with simple click/tap interactions
    - **State Management**: Basic lightbox state management without complex zoom handling
  - **Performance**: Lazy loading for all images with optional fade/slide animations
- **Empty State**: Shows localized message when no images available
  - Spanish: "Fotos del menú próximamente."
  - English: "Menu photos coming soon."
- **Styling**: Consistent with existing design, minimal additional styling

### Contact Page Content
- **Layout**: Uses common header/footer layout with centered container (`max-w-7xl mx-auto px-4`) and semantic HTML structure
- **Contact Information Display**: Fetches and displays backend contact data with localized labels
  - **Número de WhatsApp/WhatsApp Number**: Clickable link to `https://wa.me/WHATSAPP_NUMBER` with WhatsApp icon
  - **Correo Electrónico/Email**: Clickable `mailto:` link
- **Branch Locations Section**: "Cómo Llegar"/"Get Directions" heading followed by branch location cards
  - **Benalmádena Card**: Title "Sucursal 1"/"Branch 1", clickable address "Av. Antonio Machado, 32, 29630 Benalmádena, Málaga" opening Google Maps (`https://www.google.com/maps/dir/?api=1&destination=Av.+Antonio+Machado,+32,+29630+Benalmádena,+Málaga`)
  - **Fuengirola Card**: Title "Sucursal 2"/"Branch 2", clickable address "Paseo Maritimo Rey de España 125, Fuengirola, Málaga" opening Google Maps (`https://www.google.com/maps/dir/?api=1&destination=Paseo+Maritimo+Rey+de+España+125,+Fuengirola,+Málaga`)
- **Opening Hours**: Single section displaying hard-coded opening hours
  - **Spanish**: "De jueves a martes (15:00 - 23:30). Cerrado los miércoles."
  - **English**: "Thursday to Tuesday (3:00 PM - 11:30 PM). Closed on Wednesdays."
  - **Card Design**: Consistent with other contact cards (icon, spacing, typography)
  - **Note**: "Los horarios pueden variar en días festivos"/"Hours may vary on holidays"
- **Address Link Styling**: Clickable addresses styled with distinct link color, underline on hover, cursor pointer, maintaining existing typography and sufficient contrast for accessibility
- **Mobile-First Design**: Responsive layout maintaining current CSS styling consistency with same card structure and responsiveness as Home Page, ensuring mobile touch targets are large enough

### Privacy Policy Page Content (/privacy)
- **Layout**: Uses common header/footer layout with centered container (`max-w-7xl mx-auto px-4`) and semantic HTML structure
- **Content Sections**: Localized text explaining privacy practices
  - **Datos recopilados/Data Collected**: Information about data collection practices
  - **Propósito/Purpose**: Purpose of data collection including functional cookies and analysis
  - **Derechos del usuario/User Rights**: User rights regarding their data
  - **Cookie consent information**: Details about cookie usage and consent
  - **Google Maps cookies**: Appropriate mention of third-party cookies from Google Maps integration
- **Mobile-Friendly Layout**: Responsive design consistent with other pages
- **Cookie Banner**: Disabled on this page to avoid interference with privacy policy reading

### Admin Panel (/admin)
- **No header/footer**: Uses semantic HTML structure in centered container
- **Authentication**: Internet Identity login required with extended 7-day session duration
- **Session Management**: Secure credential storage and restoration for up to one week
- **Access Control**: Only admin users can access; others see "Acceso denegado" message
- **Language**: Remains English-only, unaffected by language toggle
- **Three main tabs** (no nested routes):

#### Tab 1: Fotos del Menú
- **Two separate sections**:
  - **Fotos en Español**: Manages menuPhotosES array
  - **Fotos en Inglés**: Manages menuPhotosEN array
- **Image Operations**: Upload (Subir), Delete (Eliminar), Move Up (Subir), Move Down (Bajar)
- **Display Order Management**: Photos displayed and managed based on displayOrder field
  - **Photo Sorting**: All photos displayed sorted by displayOrder ascending in both admin preview and management interface
  - **Reordering Logic**: 
    - "Subir" (Move Up) swaps displayOrder values between selected photo and the one above it (lower displayOrder) with boundary checks
    - "Bajar" (Move Down) swaps displayOrder values between selected photo and the one below it (higher displayOrder) with boundary checks
  - **ID-Based Operations**: Use photo IDs for reordering operations instead of array indices
  - **Backend Communication**: Send arrays of photo IDs in new order to backend reordering functions
  - **Boundary Checks**: Disable "Subir" button for first photo (lowest displayOrder), disable "Bajar" button for last photo (highest displayOrder)
  - **Visual Feedback**: Buttons visually disabled (opacity/color change) when at boundaries, smooth transition animations when items change position
  - **Real-time Synchronization**: Photo order updates immediately sync with backend through displayOrder-based reordering APIs and trigger re-render of admin preview
  - **Gallery Updates**: Admin preview and Menu page display reflect new sequence order instantly across both languages
  - **State Management**: Preserve lazy loading, preview, and bulk upload behaviors while maintaining proper displayOrder-based ordering functionality
  - **Separate Array Management**: Independent reordering for menuPhotosES and menuPhotosEN arrays with accurate displayOrder update propagation
- **Icon-Only Buttons**: "Subir" and "Bajar" buttons display only icons with appropriate aria-label attributes for accessibility
- **Bulk Upload Support**: File input elements support multiple file selection with `multiple` attribute for both Spanish and English sections
- **Upload Processing**: Subir button processes all selected images in a single request, converting each to WebP format before uploading to backend with automatic displayOrder assignment
- **Image Processing**: Convert uploads to WebP format before saving
- **Display Features**: Lazy loading and optional animations
- **Admin Preview**: Toggle between Spanish and English galleries, both sorted by displayOrder

#### Tab 2: Información de Contacto
- **Editable Form Fields**:
  - Restaurant name
  - WhatsApp number
  - Email
- **Default Data**:
  - Phone: +34 664 88 95 35
  - Email: lebnene.streetfood@gmail.com
- **Form Validation**: Email format, phone format
- **Save Button**: "Guardar Cambios" to persist changes

#### Tab 3: Gestión de Usuarios Admin
- **Principal ID Display**: Show logged-in user's Internet Identity Principal ID with copy-to-clipboard
- **Add Admin Section**: Input field for Principal ID with add button (plus icon)
- **Principal ID Validation**: Format validation and duplicate prevention
- **Users Table**: Columns for "ID Principal", "Rol Actual", "Acciones"
- **User Actions**: Promote ("Ascender") and demote ("Degradar") buttons
- **Search and Filter**: Search by Principal ID, filter by role
- **Protection**: Prevent demoting the last remaining admin
- **Notifications**: Success/error messages for user management actions

## Backend Data Storage
- **Menu Photos**: Two arrays (menuPhotosES, menuPhotosEN) storing MenuPhoto objects with displayOrder field for ordering support
- **MenuPhoto Type**: Includes displayOrder field of type Nat for sequential ordering
- **Contact Information**: Restaurant name, WhatsApp phone number, and email
- **Admin Users**: Principal IDs and roles for access control
- **Authentication Sessions**: Extended session management supporting 7-day duration with secure credential handling

## Backend Operations
- **Image Management**: Store, retrieve, reorder, and delete menu photos with support for bulk uploads and displayOrder assignment
- **Photo Ordering**: 
  - Automatic displayOrder assignment in addMenuPhotoES and addMenuPhotoEN functions with sequential values
  - Bulk upload functions (addMenuPhotosES and addMenuPhotosEN) assign incremental displayOrder values
  - Reordering functions (reorderMenuPhotosES and reorderMenuPhotosEN) accept arrays of photo IDs and update displayOrder based on position
  - Retrieval functions (getMenuPhotosES and getMenuPhotosEN) return photos sorted by displayOrder ascending
- **Contact Data**: Save and retrieve restaurant name, phone number, and email
- **User Management**: Add, remove, promote, and demote admin users
- **Authentication**: Verify admin access permissions with extended 7-day session support
- **Session Management**: Handle extended Internet Identity sessions with secure credential persistence and restoration
- **CORS Configuration**: All query and update methods include proper CORS headers for production domains
  - `Access-Control-Allow-Origin` set to `https://www.lebnene.es` and `https://lebnene.es`
  - `Access-Control-Allow-Methods` set to `GET, POST, OPTIONS`
  - `Access-Control-Allow-Headers` including `Content-Type, Authorization`
  - `Access-Control-Allow-Credentials` set to `true`
- **Origin Authorization**: Backend accepts Internet Identity authentication requests from production domains to prevent unauthorized or no data returned errors

## Design Requirements
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Typography**: Clean and readable fonts with proper hierarchy
- **Accessibility**: ARIA attributes for mobile navigation, language toggle, and interactive elements including clickable address and phone links, plus aria-label attributes for icon-only reordering buttons
- **Performance**: Lazy loading for maps and images where appropriate
- **Cookie Consent**: Non-blocking display with mobile-friendly text and buttons, minimal styling reusing existing CSS
- **Language Toggle**: Minimal additional styling, consistent with existing design system
- **Link Consistency**: Address and phone links maintain consistent styling and accessibility between HomePage and ContactPage

## Language Requirements
- **UI Content**: All text in Spanish and English with dynamic switching
- **Code**: Variable names, comments, and code in English
- **Admin Panel**: English-only interface
