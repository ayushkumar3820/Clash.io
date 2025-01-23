import { AuthOptions, ISODateString, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import Credentials from "next-auth/providers/credentials";
import { LOGIN_URL } from "@/lib/apiEndPoints";
import { NextAuthOptions } from "next-auth";

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string | null;
  email_verified_at?: Date | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.user = user as CustomUser;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: User;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
    async signIn({ user }) {
      const customUser = user as unknown as CustomUser;
      if (!customUser.email_verified_at) {
        throw new Error('Please verify your email first');
      }
      return true;
    },
  },
  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const { data } = await axios.post(LOGIN_URL, credentials);
          if (data?.data) {
            return {
              ...data.data,
              email_verified_at: data.data.email_verified_at ? new Date(data.data.email_verified_at) : null
            };
          }
          return null;
        } catch (error: any) {
          if (error.response?.data?.errors?.email) {
            throw new Error(error.response.data.errors.email);
          }
          throw new Error("Invalid credentials");
        }
      },
    }),
    // ...add more providers here
  ],
};
