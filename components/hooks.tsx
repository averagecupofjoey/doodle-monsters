import * as React from 'react';
import { useRecoilState } from 'recoil';
import { cardDataState } from './states';

export const useCardsList = () => {
  const [cards, setCards] = useRecoilState(cardDataState);

  return {
    cards,
    setCards,
  };
};
