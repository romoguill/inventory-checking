// Note: `useUploadThing` is IMPORTED FROM YOUR CODEBASE using the `generateReactHelpers` function
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/lib/uploadthing/uploadthing';
import { generateReactHelpers, useDropzone } from '@uploadthing/react';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { generateClientDropzoneAccept } from 'uploadthing/client';

const a = generateReactHelpers();

function UploadImages() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing('imageUploader', {
    onClientUploadComplete: () => {
      alert('uploaded successfully!');
    },
    onUploadError: () => {
      alert('error occurred while uploading');
    },
    onUploadBegin: () => {
      alert('upload has begun');
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className='border-2 border-dashed border-dashboard-border p-3'
    >
      <input {...getInputProps()} />

      {!files.length ? (
        <div className='flex flex-col items-center cursor-pointer'>
          <Upload />
          <p className='text-sm mt-4'>Drag image or click to upload</p>
        </div>
      ) : (
        <div className='flex flex-col gap-3 items-center'>
          <PreviewImage file={files[0]} />
          <Button
            className='bg-dashboard-accent rounded-sm hover:bg-dashboard-accent/90 h-6'
            size='sm'
          >
            Confirm upload
          </Button>
        </div>
      )}
      <div></div>
    </div>
  );
}

export default UploadImages;

function PreviewImage({ file }: { file: File }) {
  return (
    <Image
      width={150}
      height={150}
      src={URL.createObjectURL(file)}
      alt='Image to upload'
      className='object-cover rounded-sm'
    />
  );
}
