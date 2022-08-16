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
import axios from 'axios';
import _ from 'lodash';

const registerUser = (username, email, password) => {
  console.log('in registerUser function');
  axios
    .post('/api/createuser', { username, email, password })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

export default function AuthenticationForm(props: PaperProps<'div'>) {
  const [type, toggle] = useToggle('login', ['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
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
              // console.log('email:', form.values.email);
              // console.log('password:', form.values.password);
              signIn('credentials', {
                email: form.values.email,
                password: form.values.password,
                callbackUrl: `${window.location.origin}`,
              });
            }
            if (type === 'register') {
              console.log('in the register if');
              // _.throttle(() => {
              //   console.log('inside the throttle');
              //   registerUser(
              //     form.values.username,
              //     form.values.email,
              //     form.values.password
              //   );
              // }, 1000);
              registerUser(
                form.values.username,
                form.values.email,
                form.values.password
              );
              // _.throttle()
            }
          })}
        >
          <Group direction='column' grow>
            {type === 'register' && (
              <TextInput
                label='Username'
                placeholder='Desired Username'
                value={form.values.username}
                onChange={(event) =>
                  form.setFieldValue('username', event.currentTarget.value)
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
