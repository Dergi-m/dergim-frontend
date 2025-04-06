'use client';

import { ClientError } from '@/modules/error/client-error';

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
};

/**
 * Represent a {@link https://nextjs.org/docs/app/api-reference/file-conventions/error error} file to render UI when a requested page errors
 */
export default function ErrorPage({ error }: ErrorPageProps) {
  return <ClientError error={error} />;
}
