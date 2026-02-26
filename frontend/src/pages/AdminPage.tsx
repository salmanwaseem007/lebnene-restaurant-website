import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserRole, useGetCallerUserProfile } from '../hooks/useQueries';
import { UserRole } from '../backend';
import LoginButton from '../components/LoginButton';
import ProfileSetup from '../components/ProfileSetup';
import AdminPanel from '../components/AdminPanel';
import AccessDenied from '../components/AccessDenied';

export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;

  if (isInitializing || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Inicia sesión para continuar</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return <AdminPanel />;
}
