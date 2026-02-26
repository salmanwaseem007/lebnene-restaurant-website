import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhotoGalleryManager from './PhotoGalleryManager';

export default function MenuPhotosTab() {
  const [previewLang, setPreviewLang] = useState<'es' | 'en'>('es');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Fotos del Menú</CardTitle>
          <CardDescription>
            Administra las fotos del menú en español e inglés. Las imágenes se convierten automáticamente a formato WebP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/5">
              <h3 className="text-lg font-semibold mb-4 text-primary">Fotos en Español</h3>
              <PhotoGalleryManager language="es" />
            </div>

            <div className="border-2 border-accent/20 rounded-lg p-6 bg-accent/5">
              <h3 className="text-lg font-semibold mb-4 text-accent-foreground">Fotos en Inglés</h3>
              <PhotoGalleryManager language="en" />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Vista Previa Admin</h3>
            <Tabs value={previewLang} onValueChange={(v) => setPreviewLang(v as 'es' | 'en')}>
              <TabsList>
                <TabsTrigger value="es">Español</TabsTrigger>
                <TabsTrigger value="en">Inglés</TabsTrigger>
              </TabsList>
              <TabsContent value="es">
                <PhotoGalleryManager language="es" previewOnly />
              </TabsContent>
              <TabsContent value="en">
                <PhotoGalleryManager language="en" previewOnly />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
