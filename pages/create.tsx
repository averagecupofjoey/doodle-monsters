import Link from 'next/link';
import Layout from '../components/Layout';
import Card from '../components/Card';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CreatePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  // if (!session) {
  //   return <h2>Redirect</h2>;
  // }
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, []);
  if (!session) {
    return <Layout>Redirecting to login</Layout>;
  }
  return (
    <Layout title='Profile page'>
      <Card></Card>
    </Layout>
  );
};

export default CreatePage;
