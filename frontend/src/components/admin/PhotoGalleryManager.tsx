import { useRef, useState } from 'react';
import { useGetMenuPhotos, useAddMenuPhotos, useDeleteMenuPhoto, useReorderMenuPhotos } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { ExternalBlob, MenuPhoto } from '../../backend';

interface PhotoGalleryManagerProps {
  language: 'es' | 'en';
  previewOnly?: boolean;
}

type PhotoUpload = {
  id: string;
  blob: ExternalBlob;
  name: string;
};

export default function PhotoGalleryManager({ language, previewOnly = false }: PhotoGalleryManagerProps) {
  const { data: photos = [], isLoading } = useGetMenuPhotos(language);
  const { mutate: addPhotos, isPending: isAdding } = useAddMenuPhotos(language);
  const { mutate: deletePhoto } = useDeleteMenuPhoto(language);
  const { mutate: reorderPhotos, isPending: isReordering } = useReorderMenuPhotos(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFileCount, setSelectedFileCount] = useState<number>(0);
  const [movingPhotoId, setMovingPhotoId] = useState<string | null>(null);

  // Sort photos by displayOrder to ensure consistency
  const sortedPhotos = [...photos].sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder));

  const convertToWebP = async (file: File): Promise<Uint8Array<ArrayBuffer>> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          async (blob) => {
            if (blob) {
              const arrayBuffer = await blob.arrayBuffer();
              resolve(new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          'image/webp',
          0.9
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadProgress(0);
      setSelectedFileCount(files.length);

      const photoPromises: Promise<PhotoUpload>[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const photoPromise = (async () => {
          const webpBytes = await convertToWebP(file);
          const blob = ExternalBlob.fromBytes(webpBytes).withUploadProgress((percentage) => {
            // Calculate overall progress based on all files
            const fileProgress = percentage / files.length;
            const baseProgress = (i / files.length) * 100;
            setUploadProgress(Math.round(baseProgress + fileProgress));
          });

          const id = `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            id,
            blob,
            name: file.name,
          };
        })();

        photoPromises.push(photoPromise);
      }

      const photosToUpload = await Promise.all(photoPromises);

      addPhotos(photosToUpload, {
        onSettled: () => {
          setUploadProgress(0);
          setSelectedFileCount(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
      });
    } catch (error) {
      console.error('Error converting images:', error);
      setUploadProgress(0);
      setSelectedFileCount(0);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta foto?')) {
      deletePhoto(id);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0 || isReordering) return;
    
    const photoId = sortedPhotos[index].id;
    setMovingPhotoId(photoId);
    
    // Create new array with swapped elements using photo IDs
    const newOrder = [...sortedPhotos];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    
    // Send array of photo IDs in new order to backend
    reorderPhotos(newOrder.map(p => p.id), {
      onSettled: () => {
        // Clear moving state after animation
        setTimeout(() => setMovingPhotoId(null), 300);
      },
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedPhotos.length - 1 || isReordering) return;
    
    const photoId = sortedPhotos[index].id;
    setMovingPhotoId(photoId);
    
    // Create new array with swapped elements using photo IDs
    const newOrder = [...sortedPhotos];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    
    // Send array of photo IDs in new order to backend
    reorderPhotos(newOrder.map(p => p.id), {
      onSettled: () => {
        // Clear moving state after animation
        setTimeout(() => setMovingPhotoId(null), 300);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (previewOnly) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {sortedPhotos.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-8">No hay fotos disponibles</p>
        ) : (
          sortedPhotos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border">
              <img
                src={photo.blob.getDirectURL()}
                alt={photo.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isAdding}
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={isAdding}>
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo {selectedFileCount > 1 ? `${selectedFileCount} fotos` : 'foto'}... {uploadProgress > 0 && `${uploadProgress}%`}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Subir Fotos
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPhotos.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No hay fotos. Sube la primera foto del menú.
          </p>
        ) : (
          sortedPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className={`relative group aspect-square rounded-lg overflow-hidden border transition-all duration-300 ${
                movingPhotoId === photo.id ? 'ring-2 ring-primary scale-105 shadow-lg' : ''
              }`}
            >
              <img
                src={photo.blob.getDirectURL()}
                alt={photo.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || isReordering}
                  aria-label="Subir"
                  className={`transition-all ${index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sortedPhotos.length - 1 || isReordering}
                  aria-label="Bajar"
                  className={`transition-all ${index === sortedPhotos.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(photo.id)}
                  aria-label="Eliminar"
                  disabled={isReordering}
                  className="hover:scale-110 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
