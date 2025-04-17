// import { getBackendAccessToken } from '@/server/lib/backend/auth';

import { cookies } from 'next/headers';

import 'server-only';

import { z, ZodError } from 'zod';

const BackendError = z.object({
  MessageId: z.number(),
  Message: z.string(),
  Messages: z
    .object({
      Key: z.string(),
      Value: z.string(),
    })
    .array(),
});
type BackendError = z.infer<typeof BackendError>;

export type BackendErrorResponse =
  | {
      success: false;
      error: BackendError | ZodError;
      headers: Headers;
      statusCode: number;
    }
  | {
      success: false;
      error: Error;
    };

export type BackendVoidResponse =
  | {
      success: true;
      headers: Headers;
      statusCode: number;
    }
  | BackendErrorResponse;

export type BackendJsonResponse<T extends z.ZodTypeAny = z.ZodTypeAny> =
  | {
      success: true;
      data: z.infer<T>;
      headers: Headers;
      statusCode: number;
    }
  | BackendErrorResponse;

type Primitive = string | boolean | number;

export type BackendRequestVoidOptions = {
  url: string;
  query?: Record<string, Primitive | Primitive[] | null | undefined>;
} & RequestInit;

type BackendRequestDataOptions<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  schema: T;
} & BackendRequestVoidOptions;

export type BackendRequestOptions = BackendRequestDataOptions | BackendRequestVoidOptions;

export type BackendResponse<TOptions extends BackendRequestOptions> =
  TOptions extends BackendRequestDataOptions<infer TSchema>
    ? BackendJsonResponse<TSchema>
    : TOptions extends BackendRequestVoidOptions
      ? BackendVoidResponse
      : never;

export async function norceRequest<T extends BackendRequestOptions>(options: T) {
  try {
    const { url, query, ...opts } = options;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const requestUrl = new URL(url, process.env.BACKEND_API_URL);

    // Append query params if defined
    if (query != null) {
      Object.entries(query)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value != null)
        .forEach(([key, value]) => {
          if (!Array.isArray(value)) {
            return void requestUrl.searchParams.set(key, String(value));
          }

          value.forEach((val) => requestUrl.searchParams.append(key, String(val)));
        });
    }
    const response = await fetch(requestUrl, {
      ...opts,
      headers: {
        ...opts.headers,
        'authorization': `Bearer ${accessToken}`,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      const result = await BackendError.safeParseAsync(errorData);

      return {
        success: false,
        statusCode: response.status,
        headers: response.headers,
        error: result.success ? result.data : null,
      } as BackendResponse<T>;
    }

    if (!('schema' in options)) {
      return {
        success: true,
        statusCode: response.status,
        headers: response.headers,
      } as BackendResponse<T>;
    }

    // If we have a schema we read the response as json and parse it
    const body = await response.json();
    const result = await options.schema.safeParseAsync(body);

    if (!result.success) {
      return {
        success: false,
        statusCode: response.status,
        headers: response.headers,
        // error: result?.error,
      } as BackendResponse<T>;
    }

    return {
      success: true,
      statusCode: response.status,
      headers: response.headers,
      data: result.data,
    } as BackendResponse<T>;
  } catch (ex) {
    const error = ex instanceof Error ? ex : new Error(String(ex));

    return {
      success: false,
      error,
    } as BackendResponse<T>;
  }
}

export async function test() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  return accessToken;
}
