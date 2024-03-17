// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/lib/uploadthing/uploadthing';
import { generateReactHelpers, useDropzone } from '@uploadthing/react';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { ClientUploadedFileData } from 'uploadthing/types';

interface UploadImagesProps {
  handleImageUrlAfterUpload: (url: string) => void;
}

function UploadImages({ handleImageUrlAfterUpload }: UploadImagesProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFinished, setIsUploadingFinished] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setIsUploadingFinished(true);
      handleImageUrlAfterUpload(res[0].url);
    },
    onUploadError: () => {
      toast.error("Couldn't upload file. Try again later");
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const removeFile = () => {
    setFiles([]);
  };

  if (!files.length) {
    return (
      <div
        {...getRootProps()}
        className='border-2 border-dashed border-dashboard-border p-3 relative'
      >
        <input {...getInputProps()} />

        <div className='flex flex-col items-center cursor-pointer'>
          <Upload />
          <p className='text-sm mt-4'>Drag image or click to upload</p>
        </div>

        <div></div>
      </div>
    );
  }

  if (!isUploading && !isUploadingFinished) {
    return (
      <div className='flex flex-col gap-3 items-center border-2 border-dashed border-dashboard-border p-3 w-full'>
        <PreviewImage
          file={files[0]}
          removeFile={removeFile}
          startUpload={startUpload}
        />
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className='w-full flex items-center justify-center'>
        <Loader2 className='animate-spin mt-8' size={40} />
      </div>
    );
  }

  if (isUploadingFinished) {
    toast.success('Image uploaded');
    return null;
  }
}

export default UploadImages;

interface PreviewImage {
  file: File;
  removeFile: () => void;
  startUpload: (
    files: File[],
    input?: undefined
  ) => Promise<
    | ClientUploadedFileData<{
        url: string;
      }>[]
    | undefined
  >;
}

function PreviewImage({ file, removeFile, startUpload }: PreviewImage) {
  return (
    <div className='relative flex flex-col items-center gap-4 '>
      <X
        className='absolute -right-2 -top-2 rounded-full bg-red-500 hover:bg-red-400 grid place-items-center cursor-pointer'
        size={20}
        onClick={removeFile}
      />
      <Image
        width={150}
        height={150}
        src={URL.createObjectURL(file)}
        alt='Image to upload'
        className='object-cover rounded-sm'
      />
      <Button
        className='bg-green-600 rounded-sm hover:bg-green-600/90 h-6'
        size='sm'
        type='button'
        onClick={() => startUpload([file])}
      >
        Confirm upload
      </Button>
    </div>
  );
}
