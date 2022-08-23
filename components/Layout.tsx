import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { HeaderMenu } from './Header';
import FooterMenu from './Footer';

type Props = {
  children: ReactNode | undefined;
  title?: string;
};

{
  /* <Layout title="shshfdlskajfsaljk">
  <div>
    <li></li>
  </div>
</Layout> */
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className='appContainer'>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <HeaderMenu />
    {/* <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link> |{' '}
        <Link href="/login">
          <a>Login</a>
        </Link>{' '}
        | <a href="/api/users">Users API</a>
      </nav>
    </header> */}
    {children}
    {/* <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer> */}
    <FooterMenu />
  </div>
);

export default Layout;
