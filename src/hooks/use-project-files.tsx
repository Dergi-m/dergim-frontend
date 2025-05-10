'use client';

import { useRef, useState } from 'react';
import { FileIcon, FileTextIcon, ImageIcon, Presentation, Table } from 'lucide-react';

import { FileItem } from '@/lib/schema/file-item';

export function useProjectFiles() {
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function getFileIcon(type: string) {
    if (type.includes('image')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileTextIcon className="h-5 w-5 text-blue-700" />;
    } else if (type.includes('excel') || type.includes('xlsx')) {
      return <Table className="h-5 w-5 text-green-500" />;
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
      return <Presentation className="h-5 w-5 text-orange-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function filterFiles(files: FileItem[], query: string) {
    if (!query) return files;

    return files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase()));
  }

  return {
    searchQuery,
    setSearchQuery,
    fileInputRef,
    getFileIcon,
    formatFileSize,
    filterFiles,
  };
}
