import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuPhotosTab from './admin/MenuPhotosTab';
import ContactInfoTab from './admin/ContactInfoTab';
import UserManagementTab from './admin/UserManagementTab';
import LoginButton from './LoginButton';

export default function AdminPanel() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Panel de Administración - Lebnene</h1>
          <LoginButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Fotos del Menú</TabsTrigger>
            <TabsTrigger value="contact">Información de Contacto</TabsTrigger>
            <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="photos">
            <MenuPhotosTab />
          </TabsContent>

          <TabsContent value="contact">
            <ContactInfoTab />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTab />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-muted/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Panel de Administración - Lebnene Restaurant
          </p>
        </div>
      </footer>
    </div>
  );
}
