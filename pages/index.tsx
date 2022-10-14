import Layout from '../components/Layout';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import { CardAttributes } from '../server/models/card';

import Upvote from '../server/models/upvote';

import CardGrid from '../components/CardGrid';

import getCards from '../data/homecards';

interface UpvoteProps {
  upvoteCount: number;
  userUpvoteCount?: number;
  upvoteDeleted: boolean | null;
  Upvotes: Upvote[];
}

interface IndexPageProps {
  cards: (CardAttributes & UpvoteProps)[];
}

export default function IndexPage({ cards }: IndexPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <Layout title='Home | Next.js + TypeScript Example'>
      {session ? (
        <div className='profileTop'>
          <button onClick={() => signOut()}>Log Out</button>
        </div>
      ) : (
        <button
          onClick={() => {
            router.push('/api/auth/signin');
          }}
        >
          Sign In
        </button>
      )}

      <CardGrid cardList={cards}></CardGrid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let cards = await getCards(session);

  cards = JSON.parse(JSON.stringify(cards));

  return {
    props: { cards, session }, // will be passed to the page component as props
  };
}
