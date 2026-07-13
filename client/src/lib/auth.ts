import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import { hashOtpCode } from "./phoneVerification";
import bcrypt from "bcrypt";
import { sendWelcomeEmail, sendWelcomeBackEmail } from "./email";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!AUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required for secure JWT sessions.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Please enter your phone number and OTP.");
        }

        const phoneE164 = credentials.phone.trim();

        const user = await prisma.user.findUnique({
          where: { phoneE164 },
        });

        if (!user) {
          throw new Error("No account found with that phone number.");
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

        const isFirstVerification = !user.phoneVerified;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            phoneVerified: true,
            otpCodeHash: null,
            otpExpiresAt: null,
            lastLoginAt: new Date(),
          },
        });

        if (user.email) {
          if (isFirstVerification) {
            sendWelcomeEmail({
              to: user.email,
              name: user.name,
              username: user.username,
            }).catch((err) => {
              console.error("[AUTH] Welcome email error:", err);
            });
          } else {
            sendWelcomeBackEmail({
              to: user.email,
              name: user.name,
              role: user.role,
              userId: user.id,
            }).catch((err) => {
              console.error("[AUTH] Welcome back email error:", err);
            });
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
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your identifier and password.");
        }

        const identifier = credentials.identifier.trim();
        const lowerIdentifier = identifier.toLowerCase();

        // Find admin user by email, username, or phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: lowerIdentifier },
              { username: lowerIdentifier },
              { phoneE164: identifier },
              { phoneNumber: identifier },
            ],
            role: { in: ["ADMIN", "SUPERADMIN"] },
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials or unauthorized access.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials or unauthorized access.");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
          },
        });

        if (user.email) {
          sendWelcomeBackEmail({
            to: user.email,
            name: user.name,
            role: user.role,
            userId: user.id,
          }).catch((err) => {
            console.error("[AUTH_ADMIN] Welcome back email error:", err);
          });
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
