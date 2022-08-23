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

type Props = {
  monsterName: string;
  username: string;
  img: string;
  desc: string;
  monsterType: string;
  onClick?: () => void;
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

const CompletedCard = ({
  monsterName,
  username,
  img,
  desc,
  monsterType,
  onClick,
}: Props) => (
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
      <div className='cardImage'>
        <img src={img} style={{ objectFit: 'fill' }}></img>
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
                <TiArrowUpOutline>Upvotes</TiArrowUpOutline>
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

export default CompletedCard;
