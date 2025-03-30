import 'server-only';

import { z } from 'zod';

async function readStream(stream: ReadableStream | null): Promise<string> {
  let result = '';

  if (stream) {
    const reader = stream.getReader();
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      if (value) {
        result += new TextDecoder().decode(value); // Decode the value to a string
      }
    }
  }
  return result;
}

export type RequestVoidResponse = {
  ok: boolean;
  headers: Headers;
  statusCode: number;
  statusText: string;
};

export type RequestJsonResponse<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  body: z.infer<T>;
} & RequestVoidResponse;

export type RequestVoidOptions = {
  url: string | URL;
} & RequestInit;

type RequestDataOptions<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  schema: T;
} & RequestVoidOptions;

export type RequestOptions = RequestDataOptions | RequestVoidOptions;

export type RequestResponse<TOptions extends RequestOptions> =
  TOptions extends RequestDataOptions<infer TSchema>
    ? RequestJsonResponse<TSchema>
    : TOptions extends RequestVoidOptions
      ? RequestVoidResponse
      : never;

/**
 * Sends an HTTP request using fetch but with optional schema handling
 * @param options
 * @returns
 */
export async function request<T extends RequestOptions>(options: T) {
  const { url, ...opts } = options;

  const response = await fetch(url, opts);

  const contentType = response.headers.get('Content-Type') || '';

  if (!contentType.includes('application/json')) {
    // if the response body is not a javascript object promise, we don't want to proceed
    return {
      ok: response.ok,
      statusCode: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: await readStream(response.body),
    } as RequestResponse<T>;
  }

  // If we have a schema we read the response as json and parse it
  if ('schema' in options) {
    const data = await response.json();
    const body = await options.schema.parseAsync(data);

    return {
      ok: response.ok,
      statusCode: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body,
    } as RequestResponse<T>;
  }

  return {
    ok: response.ok,
    statusCode: response.status,
    statusText: response.statusText,
    headers: response.headers,
    body: await readStream(response.body),
  } as RequestResponse<T>;
}
