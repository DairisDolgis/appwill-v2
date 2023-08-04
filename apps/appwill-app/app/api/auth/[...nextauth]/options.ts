import dbConnect from "apps/appwill-app/lib/dbConnect";
import type { NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/users";


export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                userName: {
                    label: "userName",
                    type: "text",
                    placeholder: "userName"
                },
                password: {
                    label: "password",
                    type: "password",
                    placeholder: "password"
                }
            },
            async authorize(credentials) {
                await dbConnect();
                const user = await User.findOne({ userName: credentials?.userName, password:  credentials?.password}, 'userName password');
                if (user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/signin"
    }
}