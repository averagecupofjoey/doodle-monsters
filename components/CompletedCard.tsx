import * as React from 'react';
import { FC, useCallback } from 'react';
// import ListItem from './ListItem';
// import { User } from '../interfaces';
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

import { useRecoilState } from 'recoil';
// import { homeCardState } from './states';
import { cardDataState } from './states';
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

const createUpvote = function (card_id, user_id) {
  console.log('creating upvote');
  axios
    .post('/api/createupvote', { card_id, user_id })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
};

const toggleUpvote = function (card_id, user_id, userDeleted) {
  console.log('toggling upvote');
  axios
    .put('/api/toggleupvote', { card_id, user_id, userDeleted })
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
  const { cards: homeCards, setCards: setHomeCards } = useCardsList();

  const upvote = useCallback(() => {
    console.log('THE CURRENT USER ID IS', currentUserId);
    toggleUpvote(cardId, currentUserId, homeCards[cardIdx].upvoteDeleted);
    // setUpvoteDeletedStatus(!upvoteDeletedStatus);
    // setTotalUpvotes(totalUpvotes + 1);
    setHomeCards((x) => {
      const homeCardsCopy = [...x];
      homeCardsCopy[cardIdx] = {
        ...homeCardsCopy[cardIdx],
      };
      homeCardsCopy[cardIdx].upvoteDeleted = false;
      homeCardsCopy[cardIdx].upvoteCount++;
      homeCardsCopy[cardIdx].userUpvoteCount++;
      return homeCardsCopy;
    });
  }, [cardId, cardIdx, currentUserId, homeCards]);

  const undoUpvote = useCallback(() => {
    console.log('THE CURRENT USER ID IS', currentUserId);
    toggleUpvote(cardId, currentUserId, homeCards[cardIdx].upvoteDeleted);
    // setUpvoteDeletedStatus(!upvoteDeletedStatus);
    // setTotalUpvotes(totalUpvotes - 1);
    setHomeCards((x) => {
      // const upvoteStatus = [...x[cardIdx].upvoteDeleted];
      // upvoteStatus[cardIdx] = true;
      const homeCardsCopy = [...x];
      homeCardsCopy[cardIdx] = {
        ...homeCardsCopy[cardIdx],
      };
      homeCardsCopy[cardIdx].upvoteDeleted = true;
      homeCardsCopy[cardIdx].upvoteCount--;
      homeCardsCopy[cardIdx].userUpvoteCount--;
      return homeCardsCopy;
    });
  }, [cardId, cardIdx, currentUserId, homeCards]);

  return {
    upvote,
    undoUpvote,
  };
};

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
  console.log(
    'CARD ID IS:',
    cardId,
    'Current user Id is',
    currentUserId,
    'upvotes are:'
  );

  // const index = homeCards.findIndex((cardItem) => cardItem === cardId);
  // console.log('INDEX IS', index);

  // console.log('IN HOME CARDS ON COMPLETED CARD', homeCards);

  const [totalUpvotes, setTotalUpvotes] = useState(upvoteCount);
  const { upvote, undoUpvote } = useToggleUpvote(
    cardId,
    cardIdx,
    currentUserId
  );

  console.log(cardIdx, userUpvoteCount);
  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();

  // let homeCardsCopy = [...homeCards];

  // console.log('**** HOME CARDS COPY', homeCardsCopy);

  // React.useEffect(() => {
  //   loadUpvotes(cardId).then((x) => {
  //     console.log('*****', x);
  //   });
  // }, []);

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
