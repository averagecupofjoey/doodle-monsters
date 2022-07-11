import { Button, Flex, Heading, Input } from '@chakra-ui/react'
import Link from 'next/link'
import Layout from '../components/Layout'

const LoginPage = () =>{
  return (
    <Layout title="About | Next.js + TypeScript Example">
    <Flex height='100vh' alignItems='center' justifyContent='center'>
      <Flex direction='column' background='gray.100' p={12} rounded={6}>
        <Heading mb={6}> Login</Heading>
        <Input placeholder='Enter Your Username' variant='filled' mb={3} type='email'></Input>
        <Input placeholder='Enter Your Password' variant='filled' mb={6} type='password'></Input>
        <Button colorScheme='teal' mb={3}>Log In</Button>
          <Link href="/register">
          <a>Register</a>
        </Link>
      </Flex>
    </Flex>
  </Layout>
  )

}

export default LoginPage
