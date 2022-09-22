import Link from 'next/link';
import Layout from '../../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Card, { CardAttributes } from '../../../server/models/card';
import User from '../../../server/models/user';
import Collect from '../../../server/models/collect';
import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../../../components/CompletedCard';
import { useSession, signOut, getSession } from 'next-auth/react';
import { Sequelize, QueryTypes } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import CardGrid from '../../../components/CardGrid';

import { useState, useCallback, useEffect } from 'react';
import { dbConnection } from '../../../server/database';

interface UpvoteProps {
  upvoteCount: number;
  userUpvoteCount?: number;
  // upvoteDeleted: boolean | null;
  // Upvotes: Upvote[];
}
interface ProfilePageProps {
  cards: (CardAttributes & UpvoteProps)[];
}

export default function CollectedPage({ cards }: ProfilePageProps) {
  const router = useRouter();
  const { profileName } = router.query;

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
      <CardGrid cardList={cards} />
      <h1>WE ARE ON THE COLLECTED PAGE</h1>
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

/// https://www.programiz.com/sql/left-join

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const profileName = context.params.profileName;

  //find the id of the profile name
  let user = await User.findOne({
    where: {
      username: profileName,
    },
  });

  user = JSON.parse(JSON.stringify(user));

  let cards = await dbConnection.query<Card>(
    COLLECTED_CARDS_QUERY(user.id, session.id),
    {
      type: QueryTypes.SELECT,
    }
  );

  //find all records in collected with that found id

  //find all cards for those cardId's

  cards = JSON.parse(JSON.stringify(cards));

  return {
    props: { cards }, // will be passed to the page component as props
  };
}
