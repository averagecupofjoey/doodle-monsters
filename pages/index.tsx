import Link from 'next/link';
import Layout from '../components/Layout';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import Card, { CardAttributes } from '../server/models/card';

import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../components/CompletedCard';
import { useState, useCallback, useEffect } from 'react';
import { Button, Modal, Group } from '@mantine/core';
import { Carousel, useAnimationOffsetEffect, Embla } from '@mantine/carousel';
import Upvote from '../server/models/upvote';
import { Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';

interface UpvoteProps {
  upvoteCount: number;
  userUpvote: number;
  Upvotes: Upvote[];
}

interface IndexPageProps {
  cards: (CardAttributes & UpvoteProps)[];
}

export default function IndexPage({ cards }: IndexPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('session', session, status);

  console.log(cards[2]);

  async function checkSession() {
    const session = await getSession();
    console.log('here we goooo', session);
  }

  const TRANSITION_DURATION = 200;
  const [opened, setOpened] = useState(false);
  const [embla, setEmbla] = useState(null);
  const [cardNum, setCardNum] = useState(0);

  const handleClick = useCallback(() => {
    if (!embla) return;
  }, [embla, setCardNum]);

  useAnimationOffsetEffect(embla, TRANSITION_DURATION);

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

      {/* <Group position='center'>
        <Button onClick={() => setOpened(true)}>
          Open modal with carousel
        </Button>
        <Button onClick={() => setCardNum(2)}>Card Position 2</Button>
      </Group> */}

      <Modal
        opened={opened}
        size='300px'
        padding={0}
        transitionDuration={TRANSITION_DURATION}
        withCloseButton={false}
        onClose={() => setOpened(false)}
      >
        <Carousel loop getEmblaApi={setEmbla} initialSlide={cardNum}>
          {cards.map((card) => {
            return (
              <Carousel.Slide>
                <CompletedCard
                  monsterName={card.monsterName}
                  username={card.userName}
                  img={card.img}
                  desc={card.desc}
                  monsterType={card.monsterType}
                  cardId={card.id}
                  creatorId={card.userId}
                  currentUserId={session ? session.id : 'nothing'}
                  upvoteCount={card.upvoteCount}
                ></CompletedCard>
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Modal>

      <SimpleGrid cols={2}>
        {cards.map((card, idx) => {
          return (
            <CompletedCard
              onClick={() => {
                setCardNum(idx);
                setOpened(true);
              }}
              monsterName={card.monsterName}
              username={null}
              img={card.img}
              desc={card.desc}
              monsterType={card.monsterType}
              creatorId={card.userId}
              cardId={card.id}
              upvoteCount={card.upvoteCount}
              currentUserId={session ? session.id : 'nothing'}
            ></CompletedCard>
          );
        })}
      </SimpleGrid>
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
                )`),
          'upvoteCount',
        ],
        ...(session
          ? [
              [
                Sequelize.literal(`(
                    SELECT COUNT(*)::int
                    FROM upvotes
                    WHERE
                        upvotes."CardId"= "Card".id
                    AND
                        upvotes."user_id"= '${session.id}'
                    AND
                        upvotes."deleted" = false

                )`),
                'userUpvote',
              ] as [Literal, string],
            ]
          : null),
      ],
    },
    include: [Upvote],
  });

  cards = JSON.parse(JSON.stringify(cards));

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
