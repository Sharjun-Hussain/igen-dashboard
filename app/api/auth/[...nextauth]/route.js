import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const LARAVEL_TOKEN_EXPIRES_IN = 86400; // 86400 seconds = 24 hours

export const authOptions = {
    session: {
        strategy: "jwt",

        // **CRITICAL:** Set the session maxAge to match your token's expiry
        // This will force the user to re-authenticate when the token expires.
        // This is the simplest strategy without a refresh token.
        maxAge: LARAVEL_TOKEN_EXPIRES_IN,
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                const responseData = await res.json();

                // Check for API-level success (based on *your* JSON)
                if (responseData.status !== "success" || !res.ok) {
                    console.error("Failed to login:", responseData.message);
                    return null;
                }

                const user = responseData.data.user;
                const token = responseData.data.auth_token;

                // 3. Return the object NextAuth.js needs.
                // This object is passed to the `jwt` callback.
                return {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    usertype: user.user_type,
                    canlogin: user.can_login,
                    email: user.email,
                    profileImage: user.profile_image,
                    accessToken: token,
                    roles: user.roles || [],
                };
            },
        }),
    ],

    // 4. Configure Callbacks
    callbacks: {
        /**
         * @param  {object}  token     Decrypted JSON Web Token
         * @param  {object}  user      The object returned from the `authorize` function
         */
        async jwt({ token, user }) {
            // `user` is only available on the initial sign-in
            if (user) {
                token.accessToken = user.accessToken;
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.profileImage,
                    usertype: user.usertype,
                    canlogin: user.canlogin,
                    roles: user.roles || [],
                };

                // Fetch permissions from /me endpoint
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`,
                            Accept: "application/json",
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === "success" && data.data?.user) {
                            const userData = data.data.user;
                            token.user = {
                                ...token.user,
                                roles: userData.roles || [],
                                // Flatten permissions if needed, or keep structure. 
                                // Based on user request, permissions are nested in roles.
                                // We might want to aggregate them for easier checking.
                                // For now, storing as is.
                            };
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user permissions:", error);
                }
            }
            return token;
        },

        /**
         * @param  {object}  session   Session object
         * @param  {object}  token     Decrypted JSON Web Token (from `jwt` callback)
         */
        async session({ session, token }) {
            // Pass the access token and user info to the client-side session
            session.accessToken = token.accessToken;
            session.user = token.user;

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };