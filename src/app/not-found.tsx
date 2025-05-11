import { ServerError } from '@/modules/error/server-error';

/**
 * Represent a {@link https://nextjs.org/docs/app/api-reference/file-conventions/not-found not-found} file to render UI when a requested page could not be found
 * or when {@link https://nextjs.org/docs/app/api-reference/functions/not-found notFound} function is thrown.
 */
export default async function NotFoundPage() {
  return <ServerError notFound />;
}
