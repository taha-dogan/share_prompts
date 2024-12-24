import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDB();
      if (session?.user?.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          console.log("userId", session.user.id);
        }
      }
      return session;
    },

    async signIn({ profile }) {
      try {
        await connectToDB();
        console.log("Profile:", profile);

        const userExists = await User.findOne({ email: profile.email });
        console.log("User exists:", userExists);

        if (!userExists) {
          const username = profile.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          const newUser = await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
          });
          console.log("New user created:", newUser);
        } else {
          console.log("User already exists, no need to create a new one.");
        }

        return true;
      } catch (error) {
        console.log("Error in signIn callback:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
