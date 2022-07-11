import Link from 'next/link'
import Layout from '../components/Layout'

const ProfilePage = () => (
  <Layout title="Profile page">
    <h1>PROFILE PAGE WILL GO HERE</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
  </Layout>
)

export default ProfilePage
