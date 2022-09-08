import { atom, selector } from 'recoil';

interface updatedCard {
  id: string;
}

type Props = {
  id: string;
};

export const cardDataState = atom({
  key: 'cardDataState',
  default: [],
});

export const homeCardState = selector({
  key: 'homeCardState',
  get: ({ get }) => {
    return get(cardDataState);
  },
  set: ({ set }, updatedCard) => {
    set(cardDataState, (prevCards) => {
      const cardCopy = [...prevCards],
        // @ts-ignore
        cardIdx = cardCopy.findIndex((card) => card.id === updatedCard.id);
      cardCopy.splice(cardIdx, 1, updatedCard);
      return [...cardCopy];
    });
  },
});
