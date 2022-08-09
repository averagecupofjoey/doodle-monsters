import { atom } from 'recoil';

export const loggedInState = atom({
  key: 'loggedIn',
  default: false,
});
