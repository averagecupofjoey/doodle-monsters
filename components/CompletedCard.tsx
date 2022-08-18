import * as React from 'react';
// import ListItem from './ListItem';
// import { User } from '../interfaces';
import { Grid } from '@mantine/core';

type Props = {
  monsterName: string;
  username: string;
  img: string;
  desc: string;
};

const CompletedCard = ({ monsterName, username, img, desc }: Props) => (
  <div className='cardContainer'>
    <div className='card'>
      <div className='cardHeader'>
        <Grid justify='space-between' align='center'>
          <Grid.Col span={6}>{monsterName}</Grid.Col>
          <Grid.Col span={6}>by: {username}</Grid.Col>
        </Grid>
      </div>
      <div className='cardImage'>
        <img src={img}></img>
      </div>
      <div className='cardOptions'>Bar for stuff here</div>
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
