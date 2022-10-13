import Link from 'next/link';
import Layout from '../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Card, { CardAttributes } from '../../server/models/card';
import Following, { FollowingAttributes } from '../../server/models/following';
import User from '../../server/models/user';
import CompletedCard from '../../components/CompletedCard';
import { useSession, signOut, getSession } from 'next-auth/react';
import { QueryTypes, Sequelize } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import CardGrid from '../../components/CardGrid';

import { useState, useCallback, useEffect } from 'react';
import { dbConnection } from '../../server/database';
import axios from 'axios';

import getProfileCards from '../../data/profilePageData/cards';
import getProfileId from '../../data/profilePageData/profileID';
import getFollowingInfo from '../../data/profilePageData/followingInformation';

interface UpvoteProps {
  upvoteCount: number;
  userUpvoteCount?: number;
}

interface ProfilePageProps {
  cards: (CardAttributes & UpvoteProps)[];
  collectedCards: (CardAttributes & UpvoteProps)[];
  followingInfo: FollowingAttributes[];
  followedInfo: FollowingAttributes[];
  session: any;
  profileId: any;
  profileFollowed: any;
}

export default function ProfilePage({
  cards,
  collectedCards,
  followingInfo,
  followedInfo,
  session,
  profileId,
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

    if (session.id !== profileId && profileFollowed === null) {
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
                toggleFollow(session.id, profileId);
                if (followingStatus === 'Following') {
                  setNumFollowers(numFollowers - 1);
                  setFollowingStatus('Not Following');
                } else {
                  setNumFollowers(numFollowers + 1);
                  setFollowingStatus('Following');
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
          <Button compact fullWidth onClick={() => setProfileView('collected')}>
            Collected
          </Button>
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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const profileName = context.params.profileName;

  //find the id of the profile name
  let profileId = await getProfileId(profileName);
  profileId = JSON.parse(JSON.stringify(profileId));

  //find the cards and collected cards for the profile
  let { cards, collectedCards } = await getProfileCards(session, profileId);

  //get the following information
  let { followedInfo, followingInfo, profileFollowed } = await getFollowingInfo(
    profileId,
    session
  );

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
      profileId,
      profileFollowed,
    }, // will be passed to the page component as props
  };
}
