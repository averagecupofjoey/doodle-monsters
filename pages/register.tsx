import { Button, Flex, Heading, Input } from '@chakra-ui/react'
import Link from 'next/link'
import Layout from '../components/Layout'

const RegisterPage = () =>{
  return (

  <Flex height='100vh' alignItems='center' justifyContent='center'>
    <Flex direction='column' background='gray.100' p={12} rounded={6}>
      <Heading mb={6}> Register </Heading>
      <Input placeholder='Username' variant='filled' mb={3} type="text"></Input>
      <Input placeholder='Email' variant='filled' mb={3} type="email"></Input>
      <Input placeholder='Password' variant='filled' mb={3} type='password'></Input>
      <Input placeholder='Confirm Password' variant='filled' mb={6} type='password'></Input>
      <Button colorScheme='teal' mb={2}>Register</Button>
      <Link href="/login">
        <a>Login</a>
      </Link>
    </Flex>
  </Flex>
  )

}

export default RegisterPage
