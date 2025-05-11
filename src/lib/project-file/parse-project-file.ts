import { BackendFile, FileItem } from '@/lib/schema/file-item';

export function createFileItem(fileItem: FileItem) {
  return fileItem;
}

export function parseFileItems(files: BackendFile[]): FileItem[] {
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
