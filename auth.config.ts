import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user, token }: { session: any, user: any, token: any }) {
      if (session.user) {
        session.user.id = token.sub;
        session.token = token
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user;
      }
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  session: {
    strategy: "jwt", // 使用 JWT 策略
    maxAge: 30 * 24 * 60 * 60, // 30 天
    updateAge: 24 * 60 * 60, // 24 小时
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;