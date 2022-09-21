import Link from 'next/link';
import Layout from '../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Card, { CardAttributes } from '../../server/models/card';
import User from '../../server/models/user';
import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../../components/CompletedCard';
import { useSession, signOut, getSession } from 'next-auth/react';
import { Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import CardGrid from '../../components/CardGrid';

interface UpvoteProps {
  upvoteCount: number;
  userUpvoteCount?: number;
  // upvoteDeleted: boolean | null;
  // Upvotes: Upvote[];
}
interface ProfilePageProps {
  cards: (CardAttributes & UpvoteProps)[];
}

export default function ProfilePage({ cards }: ProfilePageProps) {
  const router = useRouter();
  const { profileName } = router.query;
  // console.log(cards);
  return (
    <Layout title='Profile page'>
      <Grid justify='space-between' align='center'>
        <Grid.Col span={4}>Profile Image</Grid.Col>
        <Grid.Col span={4}>Followers</Grid.Col>
        <Grid.Col span={4}>Following</Grid.Col>
      </Grid>
      <Grid grow justify='space-between' align='center'>
        <Grid.Col span={6}>
          <Button compact fullWidth>
            Created
          </Button>
        </Grid.Col>
        <Grid.Col span={6}>
          <Button compact fullWidth>
            Collected
          </Button>
        </Grid.Col>
      </Grid>
      <h1>This is {profileName} </h1>
      {/* <SimpleGrid cols={2}>
        {cards.map((card, idx) => {
          return (
            <CompletedCard
              monsterName={card.monsterName}
              username={null}
              img={card.img}
              desc={card.desc}
              monsterType={card.monsterType}
              creatorId={card.userId}
              cardId={card.id}
              upvoteCount={card.upvoteCount}
              userUpvoteCount={card.userUpvoteCount}
              cardIdx={idx}
            ></CompletedCard>
          );
        })}
      </SimpleGrid> */}
      <CardGrid cardList={cards} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const profileName = context.params.profileName;
  let cards = await Card.findAll({
    where: {
      userName: profileName,
    },
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
        ...(session
          ? [
              // [
              //   Sequelize.literal(`(
              //         SELECT COUNT(*)::int
              //         FROM upvotes
              //         WHERE
              //             upvotes."CardId"= "Card".id
              //         AND
              //             upvotes."user_id"= '${session.id}'
              //         AND
              //             upvotes."deleted" = false

              //     )`),
              //   'userUpvote',
              // ] as [Literal, string],
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
      ],
    },
    // include: [Upvote],
  });

  cards = JSON.parse(JSON.stringify(cards));

  return {
    props: { cards }, // will be passed to the page component as props
  };
}
