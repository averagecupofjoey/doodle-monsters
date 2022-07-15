import Link from 'next/link';
import Layout from '../components/Layout';
import { Grid, Button } from '@mantine/core';

const ProfilePage = () => (
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
  </Layout>
);

export default ProfilePage;
