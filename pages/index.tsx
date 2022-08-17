import Link from 'next/link';
import Layout from '../components/Layout';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import Card, { CardAttributes } from '../server/models/card';

interface IndexPageProps {
  cards: CardAttributes[];
}

export default function IndexPage({ cards }: IndexPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  cards.forEach((card) => {
    // card.
  });

  console.log('session', session, status);

  // console.log(props);

  // axios
  //   .get('/api/loadcards')
  //   .then((response) => {
  //     console.log('we got the response!', response.data);
  //     const cards = response.data;
  //     return cards;
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });

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

export async function getServerSideProps(context) {
  const cards = await Card.findAll({
    raw: true,
  });

  return {
    props: { cards }, // will be passed to the page component as props
  };
}
