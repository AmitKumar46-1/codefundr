import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import connectDb from '@/db/connectDb';
import User from '@/models/User';

// ✅ Export just the options first
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'github' || account.provider === 'google') {
        await connectDb();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            name: user.name || user.email.split('@')[0],
            email: user.email,
            username: user.email.split('@')[0],
            Coverpic: 'https://res.cloudinary.com/dqj1x8v2h/image/upload/v1709308700/coverpic.png',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await newUser.save();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      await connectDb();
      const dbUser = await User.findOne({ email: token.email || user?.email }).lean();

      if (dbUser) {
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.username = dbUser.username;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.username = token.username;
      return session;
    },
  },
};

// ✅ Then create the handler
const handler = NextAuth(authOptions);

// ✅ Export the handler + the options
export { handler as GET, handler as POST };
