'use client';

import type React from 'react';
import { useMemo, useRef, useState } from 'react';
import { FileTextIcon, ImageIcon, LoaderCircle, SearchIcon, UploadIcon } from 'lucide-react';

import { parseFileItems } from '@/lib/project-file/parse-project-file';
import { FileItem } from '@/lib/schema/file-item';
import { useProjectFiles } from '@/hooks/use-project-files';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/contexts/session-context';
import { trpc } from '@/server/api/react';
import { Button } from '@/modules/ui/button';
import { Card, CardContent } from '@/modules/ui/card';
import { Input } from '@/modules/ui/input';
import { FilesContainer } from '@/app/tool/files/files-container';

export default function FilesPage() {
  const { projects, activeProject } = useSession();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { filterFiles } = useProjectFiles();
  const { toast } = useToast();

  const deleteMutation = trpc.page.files.deleteProjectFile.useMutation();

  const pfiles = trpc.page.files.getProjectFiles.useQuery({
    projectId: activeProject?.id || '',
  });

  // Accepted file types
  const acceptedFileTypes = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';

  // Handle file upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedFiles = e.target.files;

    if (!uploadedFiles || uploadedFiles.length === 0) return;
    // Process each uploaded file
    Array.from(uploadedFiles).forEach(async (file) => {
      // Check if file type is allowed
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const isAccepted = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'pdf',
        'doc',
        'docx',
        'ppt',
        'pptx',
        'xls',
        'xlsx',
      ].includes(fileExtension);

      if (!activeProject) return;

      if (!isAccepted) {
        toast({
          title: 'File type not accepted',
          description: `${file.name} is not an accepted file type.`,
          variant: 'destructive',
        });
        return;
      }

      console.log(file.size);

      if (file.size > 10 * 1000 * 1000) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the maximum file size of 10MB.`,
          variant: 'destructive',
        });
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', activeProject.id);

      const response = await fetch('/api/post-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) return;
      const id = crypto.randomUUID();

      // Create a new file item
      const newFile: FileItem = {
        id,
        blobName: `${id}.${file.name.split('.').pop()}`,
        name: file.name,
        type: file.type,
        updatedAt: new Date(),
      };

      if (response.ok) setFiles((prev) => [...prev, newFile]);
      toast({
        title: 'Files uploaded',
        description: `${file.name} has been successfully uploaded.`,
        variant: 'default',
      });
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Handle file deletion
  async function handleDeleteFile(fileId: string) {
    setLoading(true);
    const res = await deleteMutation.mutateAsync({
      fileId,
    });

    if (!res.success) {
      toast({
        title: 'Failed to delete file',
        description: res.message,
        variant: 'destructive',
      });

      return;
    }

    pfiles.refetch();

    setFiles((prev) => prev.filter((file) => file.id !== fileId));

    toast({
      title: 'File deleted',
      description: `File has been successfully deleted.`,
      variant: 'default',
    });
    setLoading(false);
  }

  async function handleDownloadFile(file: FileItem) {
    // In a real application, this would trigger a download from your storage
    const download = await fetch(`/api/download-file?blobName=${file.name}`, {
      method: 'GET',
    });

    if (!download.ok) {
      toast({
        title: 'Failed to download file',
        description: `Failed to download ${file.name}.`,
        variant: 'destructive',
      });

      return;
    }

    const blob = await download.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name; // or a more user-friendly filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download started',
      description: `Downloading ${file.name}...`,
      variant: 'default',
    });
  }

  useMemo(() => {
    if (!pfiles.isSuccess) return;

    const data = pfiles.data?.files;

    if (!data) return;

    const parsedFiles = parseFileItems(data);

    setFiles(parsedFiles);
  }, [pfiles.data?.files, pfiles.isSuccess]);

  // Filter files based on search query
  if (projects.length === 0) {
    return <div>{"You don't have a project yet :("}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">File Management</h1>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept={acceptedFileTypes}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Import Files
          </Button>
        </div>
      </div>
      {pfiles.isLoading || loading ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="mb-2 text-xl font-medium">Retrieving files</h3>
            <p className="mb-4 text-muted-foreground">
              Please wait while we fetch your files. This may take a moment.
            </p>
            <LoaderCircle className="size-20 animate-spin text-blue-600 ease-in-out" />
          </CardContent>
        </Card>
      ) : (
        <FilesContainer
          files={filterFiles(files, searchQuery)}
          fileInputRef={fileInputRef}
          handleDeleteFile={handleDeleteFile}
          handleDownloadFile={handleDownloadFile}
        />
      )}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">Accepted File Types</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
            <FileTextIcon className="h-4 w-4" />
            <span>PDF</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
            <FileTextIcon className="h-4 w-4" />
            <span>DOCS (DOC, DOCX)</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
            <FileTextIcon className="h-4 w-4" />
            <span>PowerPoint (PPT, PPTX)</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
            <FileTextIcon className="h-4 w-4" />
            <span>Excel (XLS, XLSX)</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
            <ImageIcon className="h-4 w-4" />
            <span>Images (JPG, JPEG, PNG, WEBP, GIF)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
