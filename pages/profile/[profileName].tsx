import Link from 'next/link';
import Layout from '../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Card, { CardAttributes } from '../../server/models/card';
import Following from '../../server/models/following';
import User from '../../server/models/user';
import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../../components/CompletedCard';
import { useSession, signOut, getSession } from 'next-auth/react';
import { QueryTypes, Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import CardGrid from '../../components/CardGrid';

import { useState, useCallback, useEffect } from 'react';
import { dbConnection } from '../../server/database';

interface UpvoteProps {
  upvoteCount: number;
  userUpvoteCount?: number;
  // upvoteDeleted: boolean | null;
  // Upvotes: Upvote[];
}
interface ProfilePageProps {
  cards: (CardAttributes & UpvoteProps)[];
  collectedCards: (CardAttributes & UpvoteProps)[];
}

export default function ProfilePage({
  cards,
  collectedCards,
}: ProfilePageProps) {
  const [profileView, setProfileView] = useState('created');
  const router = useRouter();
  const { profileName } = router.query;

  console.log('######', collectedCards);

  return (
    <Layout title='Profile page'>
      <Grid justify='space-between' align='center'>
        <Grid.Col span={4}>Profile Image</Grid.Col>
        <Grid.Col span={4}>Followers</Grid.Col>
        <Grid.Col span={4}>Following</Grid.Col>
      </Grid>
      <Grid grow justify='space-between' align='center'>
        <Grid.Col span={6}>
          <Button compact fullWidth onClick={() => setProfileView('created')}>
            Created
          </Button>
        </Grid.Col>
        <Grid.Col span={6}>
          {/* <Link
            href={{
              pathname: `/profile/[profilename]/collected`,
              query: {
                profilename: profileName,
              },
            }}
          > */}
          <Button compact fullWidth onClick={() => setProfileView('collected')}>
            Collected
          </Button>
          {/* </Link> */}
        </Grid.Col>
      </Grid>
      <h1>This is {profileName} </h1>
      {profileView === 'created' && <CardGrid cardList={cards} />}
      {profileView === 'collected' && <CardGrid cardList={collectedCards} />}
    </Layout>
  );
}
const COLLECTED_CARDS_QUERY = (userID, loggedUserID) =>
  `SELECT
cards.*,
upvotes.upvoteCount,
userUpvotes.userUpvoteCount,
collects.collectedCount,
userCollected.userCollectedCount
FROM cards
INNER JOIN collected on collected.card_id = cards.id AND collected.user_id = '${userID}'
LEFT JOIN (
  SELECT card_id, COUNT(*) as upvoteCount
  FROM upvotes
  WHERE upvotes.deleted = false
  GROUP BY card_id
) upvotes
ON upvotes.card_id = cards.id
LEFT JOIN (
  SELECT card_id, count(*) as userUpvoteCount
  FROM upvotes
  WHERE upvotes.user_id = '${loggedUserID}'
    AND upvotes.deleted = false
  GROUP BY card_id
) userUpvotes
ON userUpvotes.card_id = cards.id
LEFT JOIN (
  SELECT card_id, count(*) as collectedCount
  FROM collected
  WHERE collected.deleted = false
  GROUP BY card_id
) collects
ON collects.card_id = cards.id
LEFT JOIN (
  SELECT card_id, count(*) as userCollectedCount
  FROM collected
  WHERE collected.user_id= '${loggedUserID}'
    AND collected.deleted = false
  GROUP BY card_id
) userCollected
ON userCollected.card_id = cards.id`;

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

  //find the id of the profile name
  let user = await User.findOne({
    where: {
      username: profileName,
    },
  });

  user = JSON.parse(JSON.stringify(user));

  let followingInfo = Following.findAll({
    where: {
      following_id: user.id,
      unfollowed: false,
    },
  });

  let collectedCards = await dbConnection.query<Card>(
    COLLECTED_CARDS_QUERY(user.id, session.id),
    {
      type: QueryTypes.SELECT,
    }
  );

  cards = JSON.parse(JSON.stringify(cards));
  collectedCards = JSON.parse(JSON.stringify(collectedCards));

  return {
    props: { cards, profileName, collectedCards }, // will be passed to the page component as props
  };
}
