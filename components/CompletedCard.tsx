import * as React from 'react';
import { FC, useCallback } from 'react';
import { Grid } from '@mantine/core';
import Link from 'next/link';
import {
  TiArrowUpOutline,
  TiArrowUpThick,
  TiPlusOutline,
  TiPlus,
} from 'react-icons/ti';
import { FaRegComments, FaComments } from 'react-icons/fa';
import { IoMdShareAlt } from 'react-icons/io';
import axios from 'axios';
import { useElementSize } from '@mantine/hooks';
import { useState } from 'react';

import { useCardsList } from './hooks';

type Props = {
  monsterName: string;
  username: string;
  img: string;
  desc: string;
  monsterType: string;
  onClick?: () => void;
  creatorId: string;
  cardId: string;
  currentUserId?: string;
  upvoteCount: number;
  userUpvoteCount: number;
  cardIdx: number;
};

const ColWrapper: FC = ({ children }) => {
  return (
    <Grid.Col
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      span={3}
    >
      {children}
    </Grid.Col>
  );
};

const toggleUpvote = function (card_id, user_id) {
  console.log('toggling upvote');
  axios
    .put('/api/toggleupvote', { card_id, user_id })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

const useToggleUpvote = (
  cardId: string,
  cardIdx: number,
  currentUserId?: string
) => {
  const { cards, setCards } = useCardsList();

  const upvote = useCallback(() => {
    toggleUpvote(cardId, currentUserId);
    setCards((x) => {
      const cardsCopy = [...x];
      cardsCopy[cardIdx] = {
        ...cardsCopy[cardIdx],
      };
      cardsCopy[cardIdx].upvoteCount++;
      cardsCopy[cardIdx].userUpvoteCount++;
      return cardsCopy;
    });
  }, [cardId, cardIdx, currentUserId, cards]);

  const undoUpvote = useCallback(() => {
    toggleUpvote(cardId, currentUserId);
    setCards((x) => {
      const cardsCopy = [...x];
      cardsCopy[cardIdx] = {
        ...cardsCopy[cardIdx],
      };
      cardsCopy[cardIdx].upvoteCount--;
      cardsCopy[cardIdx].userUpvoteCount--;
      return cardsCopy;
    });
  }, [cardId, cardIdx, currentUserId, cards]);

  return {
    upvote,
    undoUpvote,
  };
};

// const useToggleUpvote = (
//   cardId: string,
//   cardIdx: number,
//   currentUserId?: string
// ) => {
//   const { cards: homeCards, setCards: setHomeCards } = useCardsList();

//   const upvote = useCallback(() => {
//     toggleUpvote(cardId, currentUserId);
//     setHomeCards((x) => {
//       const homeCardsCopy = [...x];
//       homeCardsCopy[cardIdx] = {
//         ...homeCardsCopy[cardIdx],
//       };
//       homeCardsCopy[cardIdx].upvoteCount++;
//       homeCardsCopy[cardIdx].userUpvoteCount++;
//       return homeCardsCopy;
//     });
//   }, [cardId, cardIdx, currentUserId, homeCards]);

//   const undoUpvote = useCallback(() => {
//     toggleUpvote(cardId, currentUserId);
//     setHomeCards((x) => {
//       const homeCardsCopy = [...x];
//       homeCardsCopy[cardIdx] = {
//         ...homeCardsCopy[cardIdx],
//       };
//       homeCardsCopy[cardIdx].upvoteCount--;
//       homeCardsCopy[cardIdx].userUpvoteCount--;
//       return homeCardsCopy;
//     });
//   }, [cardId, cardIdx, currentUserId, homeCards]);

//   return {
//     upvote,
//     undoUpvote,
//   };
// };

const CompletedCard = ({
  monsterName,
  username,
  img,
  desc,
  monsterType,
  onClick,
  creatorId,
  cardId,
  currentUserId,
  upvoteCount,
  userUpvoteCount,
  cardIdx,
}: Props) => {
  // const [totalUpvotes, setTotalUpvotes] = useState(upvoteCount);
  const { upvote, undoUpvote } = useToggleUpvote(
    cardId,
    cardIdx,
    currentUserId
  );

  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();

  return (
    <div className='cardContainer' onClick={onClick}>
      <div className='card' style={{ backgroundColor: monsterType }}>
        <div className='cardHeader'>
          <Grid justify='space-between' align='center'>
            {username === null && <Grid.Col span={12}>{monsterName}</Grid.Col>}
            {username !== null && <Grid.Col span={6}>{monsterName}</Grid.Col>}
            {username !== null && (
              <Grid.Col span={6}>
                by: <Link href={`/profile/${username}`}>{username}</Link>
              </Grid.Col>
            )}
          </Grid>
        </div>
        <div className='cardImage' ref={imageRef}>
          {imageWidth && imageHeight && (
            <img
              src={img}
              style={{ width: imageWidth, height: imageHeight }}
            ></img>
          )}
        </div>
        <div className='cardOptions'>
          {username === null && (
            <Grid justify='space-between' align='left'>
              <Grid.Col span={6}>
                {userUpvoteCount ? <TiArrowUpThick /> : <TiArrowUpOutline />}{' '}
                {upvoteCount}
              </Grid.Col>
              <Grid.Col span={6}></Grid.Col>
            </Grid>
          )}
          {username !== null && (
            <Grid gutter='xl' justify='space-between'>
              <ColWrapper>
                <Grid.Col span={3}>
                  {userUpvoteCount == null && <TiArrowUpOutline />}
                  {userUpvoteCount === 0 && (
                    <TiArrowUpOutline onClick={upvote} />
                  )}
                  {userUpvoteCount === 1 && (
                    <TiArrowUpThick onClick={undoUpvote} />
                  )}{' '}
                  {upvoteCount}
                </Grid.Col>
              </ColWrapper>
              <ColWrapper>
                <Grid.Col span={3}>
                  <TiPlusOutline />
                </Grid.Col>
              </ColWrapper>
              <ColWrapper>
                <Grid.Col span={3}>
                  <FaRegComments />
                </Grid.Col>
              </ColWrapper>
              <ColWrapper>
                <Grid.Col span={3}>
                  <IoMdShareAlt />
                </Grid.Col>
              </ColWrapper>
            </Grid>
          )}
        </div>
        <div
          className='cardBottomDesc'
          style={{ height: '30%', display: 'flex' }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
};

export default CompletedCard;
