import Link from 'next/link';
import Layout from '../components/Layout';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import Card, { CardAttributes } from '../server/models/card';

import Upvote from '../server/models/upvote';
import { Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';

import CardGrid from '../components/CardGrid';

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

      <CardGrid cardList={cards}></CardGrid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let cards = await Card.findAll({
    attributes: {
      include: [
        [
          Sequelize.literal(`(
                    SELECT COUNT(*)::int
                    FROM upvotes
                    WHERE
                        upvotes."CardId"= "Card".id
                    AND
                        upvotes."deleted"= false
                )`),
          'upvoteCount',
        ],
        [
          Sequelize.literal(`(
                    SELECT COUNT(*)::int
                    FROM collected
                    WHERE
                        collected."CardId"= "Card".id
                    AND
                        collected."deleted"= false
                )`),
          'collectedCount',
        ],
        ...(session
          ? [
              [
                Sequelize.literal(`(
                      SELECT count(*)::int
                      FROM upvotes
                      WHERE
                          upvotes."CardId"= "Card".id
                      AND
                          upvotes."user_id"= '${session.id}'
                      AND
                          upvotes."deleted" = false

                  )`),
                'userUpvoteCount',
              ] as [Literal, string],
            ]
          : null),
        ...(session
          ? [
              [
                Sequelize.literal(`(
                      SELECT count(*)::int
                      FROM collected
                      WHERE
                          collected."CardId"= "Card".id
                      AND
                          collected."user_id"= '${session.id}'
                      AND
                          collected."deleted" = false

                  )`),
                'userCollectedCount',
              ] as [Literal, string],
            ]
          : null),
      ],
    },
    include: [Upvote],
  });

  cards = JSON.parse(JSON.stringify(cards));

  console.log(cards);

  return {
    props: { cards, session }, // will be passed to the page component as props
  };

  // {
  //   cards: [
  //     {
  //       cardId: 'dfgfd',
  //       count: 2,
  //     },
  //   ];
  // }
  // card['Upvotes.id']
}
