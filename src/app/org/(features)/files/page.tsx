'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import {
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/modules/ui/button';
import { Card, CardContent } from '@/modules/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import { Input } from '@/modules/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table';

// File type interface
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accepted file types
  const acceptedFileTypes = '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx';

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;

    if (!uploadedFiles || uploadedFiles.length === 0) return;

    // Process each uploaded file
    Array.from(uploadedFiles).forEach((file) => {
      // Check if file type is allowed
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const isAccepted = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'].includes(
        fileExtension
      );

      if (!isAccepted) {
        toast.warning('Invalid file type', {
          description: `${file.name} is not an accepted file type.`,
        });
        return;
      }

      // Create a new file item
      const newFile: FileItem = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
      };

      // Add to files state
      setFiles((prev) => [...prev, newFile]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast('Files uploaded', {
      description: 'Your files have been successfully uploaded.',
    });
  };

  // Handle file deletion
  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    toast('File deleted', {
      description: 'The file has been removed from the system.',
    });
  };

  // Handle file export/download
  const handleExportFile = (file: FileItem) => {
    // In a real application, this would trigger a download from your storage
    toast('File export initiated', {
      description: `Downloading ${file.name}...`,
    });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    if (type.includes('image')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileTextIcon className="h-5 w-5 text-blue-700" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">File Management</h1>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-96">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
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
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Import Files
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Files</DialogTitle>
                <DialogDescription>Choose the format to export your files.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <Button
                  onClick={() =>
                    toast('Export initiated', {
                      description: 'Exporting all files as ZIP...',
                    })
                  }
                >
                  Export as ZIP
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast('Export initiated', {
                      description: 'Generating file list as CSV...',
                    })
                  }
                >
                  Export File List as CSV
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {files.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileIcon className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-medium">No files uploaded</h3>
            <p className="text-muted-foreground mb-4">
              Upload files to start managing your journal documents
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <UploadIcon className="mr-2 h-4 w-4" />
              Import Files
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Type</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{getFileIcon(file.type)}</TableCell>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{file.uploadDate.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleExportFile(file)}
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <TrashIcon className="text-destructive h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              Confirm Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">Accepted File Types</h2>
        <div className="flex flex-wrap gap-2">
          <div className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm">
            <ImageIcon className="h-4 w-4" />
            <span>Images (JPG, PNG, GIF)</span>
          </div>
          <div className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm">
            <FileTextIcon className="h-4 w-4" />
            <span>PDF</span>
          </div>
          <div className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm">
            <FileTextIcon className="h-4 w-4" />
            <span>Word (DOC, DOCX)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
