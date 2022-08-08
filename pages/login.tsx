import React from 'react';
import { useForm, useToggle, upperFirst } from '@mantine/hooks';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
} from '@mantine/core';
// import { GoogleButton, TwitterButton } from '../SocialButtons/SocialButtons';
import { FcGoogle } from 'react-icons/fc';
import Layout from '../components/Layout';
import { signIn } from 'next-auth/react';

export default function AuthenticationForm(props: PaperProps<'div'>) {
  const [type, toggle] = useToggle('login', ['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  return (
    <Layout>
      <Paper radius='md' p='xl' withBorder {...props}>
        <Text size='lg' weight={500}>
          Welcome to Doodle Monsters, {type} with
        </Text>

        <Group grow mb='md' mt='md'>
          {/* <GoogleButton radius='xl'>Google</GoogleButton> */}
          {/* <TwitterButton radius='xl'>Twitter</TwitterButton> */}
          <FcGoogle></FcGoogle>
        </Group>

        <Divider
          label='Or continue with email'
          labelPosition='center'
          my='lg'
        />

        <form
          onSubmit={form.onSubmit(() => {
            if (type === 'login') {
              console.log('email:', form.values.email);
              console.log('password:', form.values.password);
              signIn('credentials', {
                email: form.values.email,
                password: form.values.password,
                callbackUrl: `${window.location.origin}`,
              });
            }
          })}
        >
          <Group direction='column' grow>
            {type === 'register' && (
              <TextInput
                label='Name'
                placeholder='Your name'
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue('name', event.currentTarget.value)
                }
              />
            )}

            <TextInput
              required
              label='Email'
              placeholder='hello@mantine.dev'
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue('email', event.currentTarget.value)
              }
              error={form.errors.email && 'Invalid email'}
            />

            <PasswordInput
              required
              label='Password'
              placeholder='Your password'
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue('password', event.currentTarget.value)
              }
              error={
                form.errors.password &&
                'Password should include at least 6 characters'
              }
            />

            {type === 'register' && (
              <Checkbox
                label='I accept terms and conditions'
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue('terms', event.currentTarget.checked)
                }
              />
            )}
          </Group>

          <Group position='apart' mt='xl'>
            <Anchor
              component='button'
              type='button'
              color='gray'
              onClick={() => toggle()}
              size='xs'
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type='submit'>{upperFirst(type)}</Button>
          </Group>
        </form>
      </Paper>
    </Layout>
  );
}
