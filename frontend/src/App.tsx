import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminPage from './pages/AdminPage';
import { LanguageProvider } from './contexts/LanguageContext';

const queryClient = new QueryClient();

// Root route with Layout
const rootRoute = createRootRoute({
  component: Layout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contacto',
  component: ContactPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacidad',
  component: PrivacyPage,
});

// Admin route without Layout
const adminRootRoute = createRootRoute({
  component: () => <AdminPage />,
});

const adminRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/admin',
  component: AdminPage,
});

// Create router with public routes
const publicRouteTree = rootRoute.addChildren([indexRoute, menuRoute, contactRoute, privacyRoute]);
const publicRouter = createRouter({ routeTree: publicRouteTree });

// Create router with admin route
const adminRouteTree = adminRootRoute.addChildren([adminRoute]);
const adminRouter = createRouter({ routeTree: adminRouteTree });

// Combine routers
const routeTree = rootRoute.addChildren([indexRoute, menuRoute, contactRoute, privacyRoute, adminRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
