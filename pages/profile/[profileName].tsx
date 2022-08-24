import Link from 'next/link';
import Layout from '../../components/Layout';
import { Grid, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import Card, { CardAttributes } from '../../server/models/card';
import User from '../../server/models/user';
import { SimpleGrid } from '@mantine/core';
import CompletedCard from '../../components/CompletedCard';

interface ProfilePageProps {
  cards: CardAttributes[];
}

export default function ProfilePage({ cards }: ProfilePageProps) {
  const router = useRouter();
  const { profileName } = router.query;
  console.log(cards);
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
      <SimpleGrid cols={2}>
        {cards.map((card) => {
          return (
            <CompletedCard
              monsterName={card.monsterName}
              username={null}
              img={card.img}
              desc={card.desc}
              monsterType={card.monsterType}
              creatorId={card.userId}
              cardId={card.id}
            ></CompletedCard>
          );
        })}
      </SimpleGrid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // const router = useRouter();
  // const { profileName } = router.query;
  const profileName = context.params.profileName;
  console.log('######', context.params.profileName);
  const cards = await Card.findAll({
    where: {
      userName: profileName,
    },
    raw: true,
  });

  return {
    props: { cards }, // will be passed to the page component as props
  };
}
