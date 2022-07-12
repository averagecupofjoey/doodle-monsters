import { Grid, ColorPicker } from '@mantine/core';
import CanvasDraw from 'react-canvas-draw';
import { FC, useState } from 'react';
import { RiDeleteBin6Fill, RiEraserLine } from 'react-icons/ri';
import { GrFormNextLink } from 'react-icons/gr';
import { useElementSize } from '@mantine/hooks';

const WHITE = '#ffffff';

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
  const [erase, toggleErase] = useState(false);
  const [nextSelected, updateNextSelected] = useState(false);

  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();
  console.log(erase);

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
                brushColor={erase ? WHITE : color}
              />
            )}
          </div>
          <div className='cardOptions'>
            <Grid sx={{ flex: '1' }} justify='center' gutter={0}>
              <ColWrapper>
                <RiDeleteBin6Fill />
                Delete
              </ColWrapper>
              {/* <div onClick={() => toggleErase(!erase)}> */}
              {!erase ? (
                <ColWrapper>
                  <RiEraserLine
                    onClick={() => {
                      toggleErase(true);
                    }}
                  />
                  Erase
                </ColWrapper>
              ) : (
                <ColWrapper>
                  <RiEraserLine
                    onClick={() => {
                      toggleErase(false);
                      // updateColor(WHITE);
                    }}
                  />{' '}
                  Draw
                </ColWrapper>
              )}
              {!nextSelected ? (
                <ColWrapper>
                  <GrFormNextLink onClick={() => updateNextSelected(true)} />
                  Next
                </ColWrapper>
              ) : (
                <ColWrapper>
                  <GrFormNextLink />
                  Save
                </ColWrapper>
              )}
            </Grid>
          </div>
          <div className='cardBottom'>
            <ColorPicker
              value={erase ? WHITE : color}
              onChange={(color) => {
                if (erase) {
                  return;
                }
                updateColor(color);
              }}
              size='xs'
            />
          </div>
        </div>
      </div>
      {/* <CanvasDraw canvasWidth="100" canvasHeight="100"/> */}
    </>
  );
}
