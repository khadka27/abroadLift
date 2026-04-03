import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import { hashOtpCode } from "./phoneVerification";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!AUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required for secure JWT sessions.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.otp) {
          throw new Error("Please enter your email/username and OTP.");
        }

        const identifier = credentials.identifier.trim().toLowerCase();

        // Try email first, then username
        let user = await prisma.user.findUnique({
          where: { email: identifier },
        });

        if (!user) {
          user = await prisma.user.findUnique({
            where: { username: identifier },
          });
        }

        if (!user) {
          throw new Error("No account found with that email or username.");
        }

        const inputHash = hashOtpCode(credentials.otp);
        const isOtpValid =
          user.otpCodeHash &&
          user.otpExpiresAt &&
          inputHash === user.otpCodeHash &&
          user.otpExpiresAt.getTime() > Date.now();

        if (!isOtpValid) {
          throw new Error(
            "Invalid or expired OTP code. Please request a new one.",
          );
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            phoneVerified: true,
            otpCodeHash: null,
            otpExpiresAt: null,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: AUTH_SECRET,
};
