import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Données manquantes");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) throw new Error("Utilisateur non trouvé");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordCorrect) throw new Error("Mot de passe incorrect");

        return user;
      },
    }),
  ],
  callbacks: {
    // On injecte les infos utiles dans le token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // Ajoute un champ 'role' dans ton schéma Prisma
        token.groupId = (user as any).groupId;
      }
      return token;
    },
    // On rend ces infos accessibles côté client/serveur via la session
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).groupId = token.groupId;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
