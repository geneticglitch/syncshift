import { User } from "next-auth";
import NextAuth, { NextAuthOptions } from "next-auth"
import { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { authenticate_user, handle_google_login } from "@/app/api/auth/[...nextauth]/server_actions"

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      display_name: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    display_name?: string;
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('OAuth environment variables are not set.');
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: 'Sign in',
      credentials: {
        email: { label: 'Email', type: 'email'},
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const user = await authenticate_user(credentials.email, credentials.password);
        if (user) {
          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
          };
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === 'google') {
        const google_user = await handle_google_login(account, profile);
        if (google_user) {
          user.id = google_user.id;
          user.name = google_user.name;
          user.email = google_user.email;
          return true;
        }
        return false; 
      }
      return true; 
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };