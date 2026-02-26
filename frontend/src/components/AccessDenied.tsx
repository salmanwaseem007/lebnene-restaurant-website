import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './LoginButton';

export default function AccessDenied() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toString() || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(principalId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Acceso Denegado</CardTitle>
          </div>
          <CardDescription>No tienes permisos para acceder al panel de administración</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Tu ID Principal:</p>
            <div className="flex gap-2">
              <code className="flex-1 p-2 bg-muted rounded text-xs break-all">{principalId}</code>
              <Button size="icon" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600">¡Copiado!</p>}
          </div>
          <p className="text-sm text-muted-foreground">
            Comparte este ID con un administrador para solicitar acceso.
          </p>
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
}
