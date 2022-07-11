import { ChakraProvider } from "@chakra-ui/react"
import { RecoilRoot } from "recoil"
import type { AppProps } from 'next/app'
import '../styles.css'

export default function App({ Component, pageProps}: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </RecoilRoot>
  )
}
