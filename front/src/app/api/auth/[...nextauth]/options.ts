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
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user = token.user as CustomUser;
      }
      return session;
    }
  },
  providers: [
    Credentials({
      name: "Welcome Back",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(LOGIN_URL, credentials);
          if (data?.user) {
            return data.user;
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
