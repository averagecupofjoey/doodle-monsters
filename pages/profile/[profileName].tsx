import Layout from '../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import { CardAttributes } from '../../server/models/card';
import { FollowingAttributes } from '../../server/models/following';
import { getSession } from 'next-auth/react';
import CardGrid from '../../components/CardGrid';

import { useState, useEffect } from 'react';
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
      <div className='profileTop'>
        <Grid justify='space-between' align='center'>
          <Grid.Col span={4}>
            Profile Image {profileName}
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
            <Button
              compact
              fullWidth
              onClick={() => setProfileView('collected')}
            >
              Collected
            </Button>
          </Grid.Col>
        </Grid>
      </div>
      {/* <h1>This is {profileName} </h1> */}
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

  //find the cards and collected cards for the profile
  let { cards, collectedCards } = await getProfileCards(session, profileId);

  //get the following information
  let { followedInfo, followingInfo, profileFollowed } = await getFollowingInfo(
    profileId,
    session
  );

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
