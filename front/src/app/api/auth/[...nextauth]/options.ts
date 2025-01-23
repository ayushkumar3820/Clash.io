import { AuthOptions, ISODateString, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import Credentials from "next-auth/providers/credentials";
import { LOGIN_URL } from "@/lib/apiEndPoints";

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
        token.user = user;
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
    }
  },
  providers: [
    Credentials({
      name: "Welcome Back",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(LOGIN_URL, credentials);
          
          if (data?.user) {
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              email_verified_at: data.user.email_verified_at
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
  ],
};
