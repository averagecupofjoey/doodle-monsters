import { Grid, ColorPicker } from '@mantine/core';
import CanvasDraw from 'react-canvas-draw';
import { FC, useState } from 'react';
import { RiDeleteBin6Fill, RiEraserLine } from 'react-icons/ri';
import { GrFormNextLink } from 'react-icons/gr';
import { useElementSize } from '@mantine/hooks';

const ColWrapper: FC = ({ children }) => {
  return (
    <Grid.Col
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      span={4}
    >
      {children}
    </Grid.Col>
  );
};

export default function Card({
  monsterName = 'test',
  userName = 'John Smith',
  monsterString = 'null',
}) {
  const [color, updateColor] = useState('#4dabf7');
  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();
  console.log(imageWidth, imageHeight);
  return (
    <>
      <div className='cardContainer'>
        <div className='card'>
          <div className='cardHeader'>{userName}</div>
          <div className='cardImage' ref={imageRef}>
            {imageWidth && imageHeight && (
              <CanvasDraw
                canvasWidth={imageWidth}
                canvasHeight={imageHeight}
                brushRadius={1}
                brushColor={color}
              />
            )}
          </div>
          <div className='cardOptions'>
            <Grid sx={{ flex: '1' }} justify='center' gutter={0}>
              <ColWrapper>
                <RiDeleteBin6Fill />
                Delete
              </ColWrapper>
              <ColWrapper>
                <RiEraserLine />
                Erase
              </ColWrapper>
              <ColWrapper>
                <GrFormNextLink />
                Next
              </ColWrapper>
            </Grid>
          </div>
          <div className='cardBottom'>
            <ColorPicker value={color} onChange={updateColor} size='xs' />
          </div>
        </div>
      </div>
      {/* <CanvasDraw canvasWidth="100" canvasHeight="100"/> */}
    </>
  );
}
