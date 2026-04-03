import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { authOptions } from "./auth";

/**
 * Extracts user's ID from a standard web session or a signed bearer JWT.
 * This allows web and mobile clients to use the same protected API endpoints.
 */
export async function getUserIdFromRequest(req: Request) {
  // 1. Try browser-based session (NextAuth)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  // 2. Try signed bearer token (mobile/native clients)
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const jwt = await getToken({
      req: req as never,
      secret,
    });

    if (jwt?.id && typeof jwt.id === "string") {
      return jwt.id;
    }
  } catch (error) {
    console.error("[AUTH_HELPER] Failed to verify bearer token:", error);
  }

  return null;
}
