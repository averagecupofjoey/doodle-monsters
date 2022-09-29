import Link from 'next/link';
import Layout from '../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Card, { CardAttributes } from '../../server/models/card';
import Following, { FollowingAttributes } from '../../server/models/following';
import User from '../../server/models/user';
import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../../components/CompletedCard';
import { useSession, signOut, getSession } from 'next-auth/react';
import { QueryTypes, Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import CardGrid from '../../components/CardGrid';

import { useState, useCallback, useEffect } from 'react';
import { dbConnection } from '../../server/database';
import axios from 'axios';

interface UpvoteProps {
  upvoteCount: number;
  userUpvoteCount?: number;
  // upvoteDeleted: boolean | null;
  // Upvotes: Upvote[];
}

interface ProfilePageProps {
  cards: (CardAttributes & UpvoteProps)[];
  collectedCards: (CardAttributes & UpvoteProps)[];
  followingInfo: FollowingAttributes[];
  followedInfo: FollowingAttributes[];
  session: any;
  profileUser: any;
  profileFollowed: any;
}

export default function ProfilePage({
  cards,
  collectedCards,
  followingInfo,
  followedInfo,
  session,
  profileUser,
  profileFollowed,
}: ProfilePageProps) {
  const [profileView, setProfileView] = useState('created');
  const [followingStatus, setFollowingStatus] = useState('');
  const [numFollowers, setNumFollowers] = useState(null);
  const [numFollowing, setNumFollowing] = useState(null);
  const router = useRouter();
  const { profileName } = router.query;

  let followersNum = followedInfo.length;
  let followingNum = followingInfo.length;

  const toggleFollow = function (user_id, profile_id) {
    console.log('toggling follow');
    axios
      .put('/api/togglefollow', { user_id, profile_id })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (profileFollowed) {
      setFollowingStatus('Following');
    }

    if (session.id !== profileUser.id && profileFollowed === null) {
      setFollowingStatus('Not Following');
    }

    setNumFollowers(followersNum);
    setNumFollowing(followingNum);
  }, [profileFollowed, followersNum, followingNum]);

  return (
    <Layout title='Profile page'>
      <Grid justify='space-between' align='center'>
        <Grid.Col span={4}>
          Profile Image
          {followingStatus !== '' && (
            <Button
              compact
              onClick={() => {
                toggleFollow(session.id, profileUser.id);
                if (followingStatus === 'Following') {
                  // let updatedFollowers = followedInfo.length--;
                  // console.log(updatedFollowers);
                  // console.log('###### before unfollow', followersNum);
                  // followersNum = followersNum -= 1;
                  setNumFollowers(numFollowers - 1);
                  setFollowingStatus('Not Following');
                  // console.log('##### after unfollow', followersNum);
                } else {
                  // let updatedFollowers = followedInfo.length++;
                  // console.log(updatedFollowers);
                  // console.log('###### before follow', followersNum);
                  // followersNum = followersNum += 1;
                  setNumFollowers(numFollowers + 1);
                  setFollowingStatus('Following');
                  // console.log('##### after follow', followersNum);
                }
              }}
            >
              {followingStatus}
            </Button>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <Button compact onClick={() => setProfileView('followers')}>
            {numFollowers} Followers
          </Button>
        </Grid.Col>
        <Grid.Col span={4}>
          <Button compact onClick={() => setProfileView('following')}>
            {numFollowing} Following
          </Button>
        </Grid.Col>
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
      {profileView === 'following' && <h1>Following Grid will go here</h1>}
      {profileView === 'followers' && <h1>Followed Grid will go here</h1>}
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
  let profileUser = await User.findOne({
    where: {
      username: profileName,
    },
  });

  profileUser = JSON.parse(JSON.stringify(profileUser));

  let followedInfo = await Following.findAll({
    where: {
      followed_id: profileUser.id,
      unfollowed: false,
    },
    // attributes: {
    //   include: [
    //     [
    //       Sequelize.literal(`(
    //         SELECT count(*)::int
    //         FROM following
    //         WHERE following."followed_id" = '${user.id}'
    //         AND following."unfollowed" = false
    //       )`),
    //       'profileFollowerCount',
    //     ],
    //   ],
    // },
  });

  let followingInfo = await Following.findAll({
    where: {
      follower_id: profileUser.id,
      unfollowed: false,
    },
    // attributes: {
    //   include: [
    //     [
    //       Sequelize.literal(`(
    //         SELECT count(*)::int
    //         FROM following
    //         WHERE following."follower_id" = '${user.id}'
    //         AND following."unfollowed" = false
    //       )`),
    //       'profileFollowingCount',
    //     ],
    //   ],
    // },
  });

  let collectedCards = await dbConnection.query<Card>(
    COLLECTED_CARDS_QUERY(profileUser.id, session.id),
    {
      type: QueryTypes.SELECT,
    }
  );

  let profileFollowed = await Following.findOne({
    where: {
      follower_id: session.id,
      followed_id: profileUser.id,
      unfollowed: false,
    },
  });

  cards = JSON.parse(JSON.stringify(cards));
  collectedCards = JSON.parse(JSON.stringify(collectedCards));
  followingInfo = JSON.parse(JSON.stringify(followingInfo));
  followedInfo = JSON.parse(JSON.stringify(followedInfo));
  profileFollowed = JSON.parse(JSON.stringify(profileFollowed));

  return {
    props: {
      cards,
      profileName,
      collectedCards,
      followingInfo,
      followedInfo,
      session,
      profileUser,
      profileFollowed,
    }, // will be passed to the page component as props
  };
}
