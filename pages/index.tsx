import Link from 'next/link';
import Layout from '../components/Layout';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';

export default function IndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('session', session, status);
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
