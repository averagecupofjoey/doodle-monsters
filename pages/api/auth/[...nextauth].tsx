import nextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import SequelizeAdapter from '@next-auth/sequelize-adapter';
import { Sequelize } from 'sequelize';
import User from '../../../server/models/user';

const sequelize = new Sequelize(
  process.env.NEXT_PUBLIC_PGSQL_DATABASE,
  process.env.NEXT_PUBLIC_PGSQL_USER,
  process.env.NEXT_PUBLIC_PGSQL_PASSWORD,
  { host: 'localhost', dialect: 'postgres' }
);

export default nextAuth({
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'enter email' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-ignore
      authorize: async (credentials) => {
        //database look up here

        try {
          const foundUser = await User.findOne({
            where: { email: credentials.email },
          });

          console.log('foundUser', foundUser);

          if (credentials.password === foundUser.getDataValue('password')) {
            // atom set with the user information here!########

            return {
              id: foundUser.getDataValue('id'),
              username: foundUser.getDataValue('username'),
              email: foundUser.getDataValue('email'),
            };
          } else {
            return null;
          }
        } catch (err) {
          console.error(err);
          return null;
        }

        // if (
        //   credentials.username === 'john@test.com' &&
        //   credentials.password === 'test'
        // ) {
        //   return {
        //     id: 2,
        //     name: 'John',
        //     email: 'John@test.com',
        //   };
        // }
        // // login failed
        // return null;
      },
    }),
  ],
  // adapter: SequelizeAdapter(sequelize),
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log('In JWT CALLBCK');
      console.log('USER IS:', user);
      console.log('TOKEN IS:', token);
      if (user) {
        //first time jwt callback is run, user object is available
        token.id = user.id;
      }
      return { ...token, ...user };
    },
    session: ({ session, token }) => {
      console.log('IN SESSION CALL BACK');
      console.log('Session is:', session);
      console.log('TOKEN IS:', token);
      if (token) {
        session.id = token.id;
        session.username = token.username;
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
