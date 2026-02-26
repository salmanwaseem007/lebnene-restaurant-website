import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAllUsers, useAssignUserRole } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Copy, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole } from '../../backend';
import { toast } from 'sonner';

export default function UserManagementTab() {
  const { identity } = useInternetIdentity();
  const { data: users = [], isLoading } = useGetAllUsers();
  const { mutate: assignRole, isPending } = useAssignUserRole();
  const [newPrincipalId, setNewPrincipalId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const currentPrincipal = identity?.getPrincipal().toString() || '';

  const handleCopyPrincipal = () => {
    navigator.clipboard.writeText(currentPrincipal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validatePrincipalId = (id: string): boolean => {
    try {
      Principal.fromText(id);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddUser = () => {
    if (!newPrincipalId.trim()) {
      toast.error('Por favor, ingresa un ID Principal');
      return;
    }

    if (!validatePrincipalId(newPrincipalId)) {
      toast.error('ID Principal inválido');
      return;
    }

    const principal = Principal.fromText(newPrincipalId);
    assignRole(
      { user: principal, role: UserRole.admin },
      {
        onSuccess: () => {
          toast.success('Usuario añadido como administrador');
          setNewPrincipalId('');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al añadir usuario');
        },
      }
    );
  };

  const handlePromote = (principalId: string) => {
    const principal = Principal.fromText(principalId);
    assignRole(
      { user: principal, role: UserRole.admin },
      {
        onSuccess: () => toast.success('Usuario ascendido a administrador'),
        onError: (error: any) => toast.error(error.message || 'Error al ascender usuario'),
      }
    );
  };

  const handleDemote = (principalId: string) => {
    const adminCount = users.filter((u) => u.role === UserRole.admin).length;
    if (adminCount <= 1) {
      toast.error('No se puede degradar al último administrador');
      return;
    }

    const principal = Principal.fromText(principalId);
    assignRole(
      { user: principal, role: UserRole.user },
      {
        onSuccess: () => toast.success('Usuario degradado a usuario regular'),
        onError: (error: any) => toast.error(error.message || 'Error al degradar usuario'),
      }
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.principalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tu ID Principal</CardTitle>
          <CardDescription>Este es tu identificador único en Internet Identity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <code className="flex-1 p-3 bg-muted rounded text-sm break-all">{currentPrincipal}</code>
            <Button size="icon" variant="outline" onClick={handleCopyPrincipal}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && <p className="text-xs text-green-600 mt-2">¡Copiado!</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Añadir Usuario Administrador</CardTitle>
          <CardDescription>Ingresa el ID Principal del usuario para otorgarle permisos de administrador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="principalId">ID Principal</Label>
              <Input
                id="principalId"
                value={newPrincipalId}
                onChange={(e) => setNewPrincipalId(e.target.value)}
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              />
            </div>
            <Button onClick={handleAddUser} disabled={isPending} className="mt-8">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>Gestiona los roles de los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ID Principal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="guest">Invitado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Principal</TableHead>
                  <TableHead>Rol Actual</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.principalId}>
                      <TableCell className="font-mono text-xs">{user.principalId}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === UserRole.admin ? 'default' : 'secondary'}>
                          {user.role === UserRole.admin ? 'Administrador' : user.role === UserRole.user ? 'Usuario' : 'Invitado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.role !== UserRole.admin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePromote(user.principalId)}
                              disabled={isPending}
                            >
                              <ArrowUp className="mr-1 h-3 w-3" />
                              Ascender
                            </Button>
                          )}
                          {user.role === UserRole.admin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDemote(user.principalId)}
                              disabled={isPending || user.principalId === currentPrincipal}
                            >
                              <ArrowDown className="mr-1 h-3 w-3" />
                              Degradar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
