import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
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
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your email/username and password.");
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

        if (!user?.password) {
          throw new Error("No account found with that email or username.");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password. Please try again.");
        }

        // --- OTP VERIFICATION ---
        // If the user has a code but isn't verified, verify them now
        if (credentials.otp && !user.phoneVerified) {
          const inputHash = hashOtpCode(credentials.otp);

          if (inputHash === user.otpCodeHash) {
            // Mark as verified in DB
            await prisma.user.update({
              where: { id: user.id },
              data: {
                phoneVerified: true,
                otpCodeHash: null,
                otpExpiresAt: null,
              },
            });
            // Update local user object
            user.phoneVerified = true;
          } else {
            throw new Error("Invalid OTP code. Please check and try again.");
          }
        }

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
