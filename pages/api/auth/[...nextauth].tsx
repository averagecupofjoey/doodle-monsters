import nextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

export default nextAuth({
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'email', placeholder: 'enter email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: (credentials) => {
        //database look up here
        if (
          credentials.username === 'john@test.com' &&
          credentials.password === 'test'
        ) {
          return {
            id: 2,
            name: 'John',
            email: 'John@test.com',
          };
        }
        // login failed
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        //first time jwt callback is run, user object is available
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  secret: 'test',
  jwt: {
    secret: 'test',
  },
  pages: {
    signIn: '/login',
  },
});
