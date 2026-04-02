import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Extracts student's user ID from standard session OR mobile bearer token.
 * This helper allows the mobile app (using dummy bearer tokens) and the 
 * web app (using next-auth cookies) to use the same private API endpoints.
 */
export async function getUserIdFromRequest(req: Request) {
  // 1. Try browser-based session (NextAuth)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  // 2. Try mobile bearer token (Authorization header)
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const tokenStr = authHeader.substring(7); // "Bearer " is 7 chars
    
    // Check if it's our "mobile_" prefixed dummy token
    if (tokenStr.startsWith("mobile_")) {
      try {
        const base64Data = tokenStr.substring(7); // "mobile_" is 7 chars
        const decoded = JSON.parse(Buffer.from(base64Data, 'base64').toString());
        if (decoded && decoded.id) {
          return decoded.id;
        }
      } catch (error) {
        console.error("[AUTH_HELPER] Failed to parse mobile token:", error);
      }
    }
  }

  return null;
}
