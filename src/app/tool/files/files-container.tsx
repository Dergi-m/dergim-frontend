'use client';

import { RefObject } from 'react';
import { DownloadIcon, FileIcon, TrashIcon, UploadIcon } from 'lucide-react';

import { FileItem } from '@/lib/schema/file-item';
import { useProjectFiles } from '@/hooks/use-project-files';
import { Button } from '@/modules/ui/button';
import { Card, CardContent } from '@/modules/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/modules/ui/dropdown-menu';
import { ScrollArea } from '@/modules/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table';

type FilesContainerPropps = {
  files: FileItem[];
  fileInputRef: RefObject<HTMLInputElement>;
  handleDeleteFile: (fileId: string) => void;
  handleDownloadFile: (file: FileItem) => void;
};

export function FilesContainer({
  files,
  fileInputRef,
  handleDeleteFile,
  handleDownloadFile,
}: FilesContainerPropps) {
  const { getFileIcon } = useProjectFiles();

  return (
    <>
      {files.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileIcon className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-medium">No files uploaded</h3>
            <p className="mb-4 text-muted-foreground">
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
            <ScrollArea className="h-96 w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{getFileIcon(file.type)}</TableCell>
                      <TableCell className="max-w-32 truncate font-medium">{file.name}</TableCell>
                      <TableCell>{file.updatedAt.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadFile(file)}
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                              >
                                <TrashIcon className="h-4 w-4 text-destructive" />
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
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  );
}
