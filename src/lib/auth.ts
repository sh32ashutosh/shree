import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/account/login",
    error: "/account/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isAdmin: { label: "Is Admin", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { adminProfile: true },
        });

        if (!user || !user.password) return null;
        if (user.status !== "ACTIVE") return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        // For admin login, verify they have an admin role
        if (credentials.isAdmin === "true") {
          const adminRoles: UserRole[] = [
            "SUPER_ADMIN",
            "STORE_MANAGER",
            "PRODUCT_MANAGER",
            "INVENTORY_MANAGER",
            "ORDER_MANAGER",
            "CUSTOMER_SUPPORT",
            "ANALYST",
          ];
          if (!adminRoles.includes(user.role)) {
            return null;
          }
          // Update last login
          if (user.adminProfile) {
            await prisma.adminProfile.update({
              where: { userId: user.id },
              data: {
                lastLogin: new Date(),
                loginCount: { increment: 1 },
              },
            });
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      // Log admin sign ins
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (dbUser && dbUser.role !== "CUSTOMER") {
        await prisma.auditLog.create({
          data: {
            actorId: user.id,
            actorName: user.name || user.email,
            actorRole: dbUser.role,
            action: "ADMIN_LOGIN",
            entityType: "Session",
            details: JSON.stringify({ email: user.email }),
          },
        });
      }
    },
  },
});

