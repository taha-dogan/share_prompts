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
          // Safely assign id only if sessionUser is found
          session.user.id = sessionUser._id.toString();
          console.log("userId", session.user.id);
        }
      }
      return session;
    },

    async SignIn({ profile }) {
      try {
        await connectToDB();

        //check if user is already in the database
        const UserExists = await User.findOne({ email: profile.email });

        //if user is not exists, create a new user
        if (!UserExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
