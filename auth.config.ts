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
      const isOnCms = nextUrl.pathname.startsWith('/cms');
      
      if (isOnDashboard) return isLoggedIn;
      if (isOnCms) return true; // 已登录/未登录都可访问，按需调整
      if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
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