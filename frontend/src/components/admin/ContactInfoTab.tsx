import { useState, useEffect } from 'react';
import { useGetContactInfo, useUpdateContactInfo } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import type { ContactInfo } from '../../backend';

export default function ContactInfoTab() {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const { mutate: updateInfo, isPending } = useUpdateContactInfo();
  const [formData, setFormData] = useState<ContactInfo | null>(null);

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      updateInfo(formData);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Contacto</CardTitle>
        <CardDescription>Actualiza la información de contacto del restaurante</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
              <Input
                id="restaurantName"
                value={formData.restaurantName}
                onChange={(e) => handleChange('restaurantName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
