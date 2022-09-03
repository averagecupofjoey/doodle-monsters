import * as React from 'react';
import { FC } from 'react';
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
    .post('/api/createupvote', { card_id, user_id })
    .then((response) => {
      console.log(response);
    })
    .catch((e) => {
      console.log(e);
    });
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
}: Props) => {
  console.log(
    'CARD ID IS:',
    cardId,
    'Current user Id is',
    currentUserId,
    'upvotes are:'
  );
  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();

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
                <TiArrowUpOutline></TiArrowUpOutline>
              </Grid.Col>
              <Grid.Col span={6}></Grid.Col>
            </Grid>
          )}
          {username !== null && (
            <Grid gutter='xl' justify='space-between'>
              <ColWrapper>
                <Grid.Col span={3}>
                  <TiArrowUpOutline
                    onClick={() => {
                      console.log('THE CURRENT USER ID IS', currentUserId);
                      toggleUpvote(cardId, currentUserId);
                    }}
                  />{' '}
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
