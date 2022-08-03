import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <RecoilRoot>
        <ChakraProvider>
          {/* <div className='appWrapper'> */}
          <Component {...pageProps} />
          {/* </div> */}
        </ChakraProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}
