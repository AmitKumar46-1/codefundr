import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google'; // ✅ import Google
import connectDb from '@/db/connectDb';
import User from '@/models/User';

export const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    GoogleProvider({   // ✅ Add Google Provider here
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "github"||account.provider === "google") {
        await connectDb();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            name: user.name || user.email.split("@")[0],
            email: user.email,
            username: user.email.split("@")[0],
            Coverpic: "https://res.cloudinary.com/dqj1x8v2h/image/upload/v1709308700/coverpic.png",
            createdAt: new Date(),
            updatedAt: new Date()
          });
          await newUser.save();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      await connectDb();

      // Use token.email to find latest data
      const dbUser = await User.findOne({ email: token.email || user?.email }).lean();

      if (dbUser) {
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.username = dbUser.username;
      }

      return token;
    },

    async session({ session, token }) {
      // Inject token values into session
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.username = token.username;

      return session;
    },
  }
});

export { authoptions as GET, authoptions as POST }
