import { Button, Modal, Group, SimpleGrid } from '@mantine/core';
import { Carousel, useAnimationOffsetEffect, Embla } from '@mantine/carousel';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useState, useCallback, useEffect } from 'react';
import CompletedCard from './CompletedCard';

export default function CardGrid(props) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [embla, setEmbla] = useState(null);
  const [cardNum, setCardNum] = useState(0);
  const TRANSITION_DURATION = 200;
  useAnimationOffsetEffect(embla, TRANSITION_DURATION);
  return (
    <>
      <Modal
        opened={opened}
        size='300px'
        padding={0}
        transitionDuration={TRANSITION_DURATION}
        withCloseButton={false}
        onClose={() => setOpened(false)}
      >
        <Carousel loop getEmblaApi={setEmbla} initialSlide={cardNum}>
          {props.cardList.map((card, idx) => {
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
                  userUpvoteCount={card.userUpvoteCount}
                  cardIdx={idx}
                ></CompletedCard>
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Modal>

      <SimpleGrid cols={2}>
        {props.cardList.map((card, idx) => {
          console.log(idx, card);
          return (
            <CompletedCard
              key={idx}
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
              userUpvoteCount={card.userUpvoteCount}
              currentUserId={session ? session.id : 'nothing'}
              cardIdx={idx}
            ></CompletedCard>
          );
        })}
      </SimpleGrid>
    </>
  );
}
