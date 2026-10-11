import { NextResponse } from "next/server";
import { validateOrigin } from "@/lib/auth";
import { ForbiddenError } from "./errors";
import { handleError } from "./response";

type RouteHandler<TContext = unknown> = (
  req: Request,
  context: TContext
) => Promise<NextResponse | Response> | NextResponse | Response;

interface RouteOptions {
  requireCsrf?: boolean;
}

/**
 * Higher-order wrapper for Next.js App Router API routes.
 * Standardizes origin validation, error catching, and logging.
 */
export function createApiRoute<TContext = unknown>(
  handler: RouteHandler<TContext>,
  options?: RouteOptions
): (req: Request, context: TContext) => Promise<NextResponse | Response> {
  return async (req: Request, context: TContext) => {
    try {
      const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
      const shouldCheckCsrf = options?.requireCsrf ?? isMutation;

      if (shouldCheckCsrf && !validateOrigin(req)) {
        throw new ForbiddenError("Invalid origin.");
      }

      return await handler(req, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
