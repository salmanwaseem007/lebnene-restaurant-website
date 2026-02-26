import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContactInfo, MenuPhoto, UserProfile, UserRole } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

type PhotoUpload = {
  id: string;
  blob: ExternalBlob;
  name: string;
};

// Menu Photos
export function useGetMenuPhotos(language: 'es' | 'en') {
  const { actor, isFetching } = useActor();

  return useQuery<MenuPhoto[]>({
    queryKey: ['menuPhotos', language],
    queryFn: async () => {
      if (!actor) return [];
      const photos = language === 'es' ? await actor.getMenuPhotosES() : await actor.getMenuPhotosEN();
      // Backend already returns sorted by displayOrder, but ensure it client-side too
      return photos.sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMenuPhoto(language: 'es' | 'en') {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blob, name }: PhotoUpload) => {
      if (!actor) throw new Error('Actor not available');
      return language === 'es' ? actor.addMenuPhotoES(id, blob, name) : actor.addMenuPhotoEN(id, blob, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPhotos', language] });
    },
  });
}

export function useAddMenuPhotos(language: 'es' | 'en') {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photos: PhotoUpload[]) => {
      if (!actor) throw new Error('Actor not available');
      return language === 'es' ? actor.addMenuPhotosES(photos) : actor.addMenuPhotosEN(photos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPhotos', language] });
    },
  });
}

export function useDeleteMenuPhoto(language: 'es' | 'en') {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return language === 'es' ? actor.deleteMenuPhotoES(id) : actor.deleteMenuPhotoEN(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPhotos', language] });
    },
  });
}

export function useReorderMenuPhotos(language: 'es' | 'en') {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!actor) throw new Error('Actor not available');
      return language === 'es' ? actor.reorderMenuPhotosES(newOrder) : actor.reorderMenuPhotosEN(newOrder);
    },
    onMutate: async (newOrder) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['menuPhotos', language] });

      // Snapshot the previous value
      const previousPhotos = queryClient.getQueryData<MenuPhoto[]>(['menuPhotos', language]);

      // Optimistically update to the new value based on displayOrder
      if (previousPhotos) {
        const reorderedPhotos = newOrder
          .map((id, index) => {
            const photo = previousPhotos.find(p => p.id === id);
            if (photo) {
              // Update displayOrder to match new position
              return { ...photo, displayOrder: BigInt(index) };
            }
            return undefined;
          })
          .filter((photo): photo is MenuPhoto => photo !== undefined);
        
        queryClient.setQueryData(['menuPhotos', language], reorderedPhotos);
      }

      // Return a context object with the snapshotted value
      return { previousPhotos };
    },
    onError: (err, newOrder, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPhotos) {
        queryClient.setQueryData(['menuPhotos', language], context.previousPhotos);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ['menuPhotos', language] });
    },
  });
}

// Contact Info
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newInfo: ContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(newInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// User Role
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// Get all users (for admin panel)
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ principalId: string; role: UserRole }>>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      // This is a mock implementation since the backend doesn't have a getAllUsers method
      // In a real implementation, you would need to add this method to the backend
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
