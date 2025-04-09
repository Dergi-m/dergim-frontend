'use client';

import NextErrorPage from 'next/error';

type ClientErrorProps = {
  error: Error & {
    digest?: string;
  };
};

/**
 * Represent a {@link https://nextjs.org/docs/app/api-reference/file-conventions/error error} file to render UI when a requested page errors
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClientError({ error }: ClientErrorProps) {
  return <NextErrorPage statusCode={500} />;
}
