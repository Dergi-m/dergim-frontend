import { FileItem } from '@/lib/schema/file-item';

type RetrievedFile = {
  id: string;
  localFileUrl: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
};

export function createFileItem(fileItem: FileItem) {
  return fileItem;
}

export function parseFileItems(files: RetrievedFile[]): FileItem[] {
  const parsed = files.map((file) => {
    const { fileUrl, localFileUrl, updatedAt, id } = file;

    const url = fileUrl;
    const type = localFileUrl.split('.').pop() ?? '';
    const blobName = url.split('/').pop() ?? '';

    const item = createFileItem({
      id,
      name: localFileUrl,
      type,
      blobName,
      updatedAt: new Date(updatedAt),
    });
    return item;
  });

  return parsed;
}
