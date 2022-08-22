import Link from 'next/link';
import Layout from '../components/Layout';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/dist/client/router';
import Card, { CardAttributes } from '../server/models/card';
import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../components/CompletedCard';
import { useState } from 'react';
import { Button, Modal, Group } from '@mantine/core';
import { Carousel, useAnimationOffsetEffect } from '@mantine/carousel';

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

  const TRANSITION_DURATION = 200;
  const [opened, setOpened] = useState(false);
  const [embla, setEmbla] = useState(null);

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
      <p>
        {/* <Link href='/about'>
          <a>About</a>
        </Link> */}
      </p>
      {/* {cards &&
        cards.forEach((card) => {
          console.log(card.monsterName);
          return <h1>{card.monsterName}</h1>;
        })} */}

      {/* <SimpleGrid cols={2}>
        {cards.map((card) => {
          return (
            <div>
              <img src={card.img}></img>
            </div>
          );
        })}
      </SimpleGrid> */}

      <Group position='center'>
        <Button onClick={() => setOpened(true)}>
          Open modal with carousel
        </Button>
      </Group>

      <Modal
        opened={opened}
        size='300px'
        padding={0}
        transitionDuration={TRANSITION_DURATION}
        withCloseButton={false}
        onClose={() => setOpened(false)}
      >
        <Carousel loop getEmblaApi={setEmbla}>
          {cards.map((card) => {
            return (
              <Carousel.Slide>
                <CompletedCard
                  monsterName={card.monsterName}
                  username={card.userName}
                  img={card.img}
                  desc={card.desc}
                  monsterType={card.monsterType}
                ></CompletedCard>
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Modal>

      <SimpleGrid cols={2}>
        {cards.map((card) => {
          return (
            <CompletedCard
              monsterName={card.monsterName}
              username={card.userName}
              img={card.img}
              desc={card.desc}
              monsterType={card.monsterType}
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
  const cards = await Card.findAll({
    raw: true,
  });

  return {
    props: { cards }, // will be passed to the page component as props
  };
}
