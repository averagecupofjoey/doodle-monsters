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
// import { Sequelize, where } from 'sequelize/types';
import { Sequelize } from 'sequelize';

interface IndexPageProps {
  cards: CardAttributes[];
  sessionProps: any;
}

export default function IndexPage({ cards, sessionProps }: IndexPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('session', session, status);
  console.log('*****', sessionProps);

  console.log(cards[0]);

  async function checkSession() {
    const sessionProps = await getSession();
    console.log('here we goooo', sessionProps);
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

      <Group position='center'>
        <Button onClick={() => setOpened(true)}>
          Open modal with carousel
        </Button>
        <Button onClick={() => setCardNum(2)}>Card Position 2</Button>
      </Group>

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
                  currentUserId={sessionProps ? sessionProps.id : 'nothing'}
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
              currentUserId={sessionProps ? sessionProps.id : 'nothing'}
            ></CompletedCard>
          );
        })}
      </SimpleGrid>
      {/* {for(let i = 0; i<cards.length; i++){}} */}
      {console.log(cards.length)}
      {/* {for(let i=0; i<cards.length; i++){

      }} */}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let cards = await Card.findAll({
    // attributes: {
    //   include: [
    //     [Sequelize.fn('COUNT', Sequelize.col('Upvote.id')), 'upvoteCount'],
    //   ],
    // },
    include: [Upvote],
    // raw: true,
  });

  // const cards = cardsData.map((card) => card.get({ plain: true }));
  // const cards = cardsData.toJSON()

  cards = JSON.parse(JSON.stringify(cards));

  const sessionProps = await getSession(context);

  // cards.map(async (card) => {
  //   const upvotes = await Upvote.count;
  // });
  // const upvotes = await Upvote.count({
  //   where: { card_id: '1c011ea2-613a-4af9-b22d-7c21660f2dc2' },
  // });

  // console.log('here are the upvotes', upvotes);

  return {
    props: { cards, sessionProps }, // will be passed to the page component as props
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
