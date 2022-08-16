import Link from 'next/link';
import Layout from '../components/Layout';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import axios from 'axios';

export default function IndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('session', session, status);

  const getCards = () => {
    axios
      .get('/api/loadcards')
      .then((response) => {
        console.log('we got the response!', response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  getCards();
  return (
    <Layout title='Home | Next.js + TypeScript Example'>
      {session ? (
        <button onClick={() => signOut()}>Log Out</button>
      ) : (
        <button
          onClick={() => {
            router.push('/api/auth/signin');
          }}
        >
          Sign In
        </button>
      )}
      <h1>Home page</h1>
      <p>
        <Link href='/about'>
          <a>About</a>
        </Link>
      </p>
    </Layout>
  );
}
