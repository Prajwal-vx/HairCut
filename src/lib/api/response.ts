import { NextResponse } from "next/server";
import { ApiError } from "./errors";

export interface ApiResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

/**
 * Returns a standardized JSON success response.
 */
export function jsonSuccess<T extends Record<string, unknown>>(
  data: T,
  options?: ApiResponseOptions
): NextResponse {
  return NextResponse.json(
    { success: true, ...data },
    { status: options?.status ?? 200, headers: options?.headers }
  );
}

/**
 * Returns a standardized JSON error response.
 */
export function jsonError(
  message: string,
  statusCode = 400,
  code?: string,
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code ? { code } : {}),
    },
    { status: statusCode, headers }
  );
}

/**
 * Converts any caught error into a standardized NextResponse.
 */
export function handleError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    const headers: Record<string, string> = {};
    if ("retryAfterSeconds" in error && typeof error.retryAfterSeconds === "number") {
      headers["Retry-After"] = error.retryAfterSeconds.toString();
    }
    return jsonError(error.message, error.statusCode, error.code, headers);
  }

  const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
  return jsonError(message, 500, "INTERNAL_SERVER_ERROR");
}

/**
 * Safely parses and validates JSON body from a Request object.
 */
export async function parseJsonBody<T = Record<string, unknown>>(
  req: Request,
  maxBytes = 16384
): Promise<T> {
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > maxBytes) {
    throw new ApiError("Payload too large.", 413, "PAYLOAD_TOO_LARGE");
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ApiError("Invalid JSON body structure.", 400, "INVALID_BODY");
    }
    return body as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Invalid or malformed JSON payload.", 400, "MALFORMED_JSON");
  }
}
