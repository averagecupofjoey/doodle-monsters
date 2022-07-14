import {
  Grid,
  ColorPicker,
  Slider,
  Container,
  TextInput,
  Button,
} from '@mantine/core';
import CanvasDraw from 'react-canvas-draw';
import React, { FC, useState, useRef } from 'react';
import { RiDeleteBin6Fill, RiEraserLine } from 'react-icons/ri';
import { GrFormNextLink } from 'react-icons/gr';
import { useElementSize } from '@mantine/hooks';
import { FaPencilRuler, FaPencilAlt } from 'react-icons/fa';

const WHITE = '#ffffff';

// const MARKS = [
//   { value: 1, label: 'xs' },
//   { value: 2, label: 'sm' },
//   { value: 3, label: 'md' },
//   { value: 4, label: 'lg' },
//   { value: 5, label: 'xl' },
// ];

const MARKS = [
  { value: 0, label: 'xs' },
  { value: 25, label: 'sm' },
  { value: 50, label: 'md' },
  { value: 75, label: 'lg' },
  { value: 100, label: 'xl' },
];

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
  const [nextSelected, setNextSelected] = useState(false);

  const [value, setValue] = useState(1);
  const [endValue, setEndValue] = useState(50);

  const [radiusValue, setRadiusValue] = useState(1);

  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();

  // const canvasRef = useRef<CanvasDraw>(null);

  // const onDelete = () => {
  //   canvasRef.current?.eraseAll();
  // };

  const canvasRef = React.createRef();

  const onDelete = () => {
    console.log(canvasRef);
    canvasRef.current?.eraseAll();
  };

  const onNext = () => {
    localStorage.setItem('savedDrawing', canvasRef.current?.getSaveData());
    console.log(canvasRef.current?.getDataURL());
    setNextSelected(true);
  };

  const onSave = () => {
    console.log(inputRef.current.value);
  };

  const inputRef = useRef<HTMLInputElement>();

  return (
    <>
      <div className='cardContainer'>
        <div className='card'>
          <div className='cardHeader'>{userName}</div>
          <div className='cardImage' ref={imageRef}>
            {imageWidth && imageHeight && !nextSelected && (
              <CanvasDraw
                ref={canvasRef}
                // ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
                canvasWidth={imageWidth}
                canvasHeight={imageHeight}
                brushRadius={radiusValue}
                brushColor={erase ? WHITE : color}
              />
            )}

            {imageWidth && imageHeight && nextSelected && (
              <CanvasDraw
                disabled
                hideGrid
                canvasWidth={imageWidth}
                canvasHeight={imageHeight}
                saveData={localStorage.getItem('savedDrawing')}
              />
            )}
          </div>
          <div className='cardOptions'>
            <Grid sx={{ flex: '1' }} justify='center' gutter={0}>
              <ColWrapper>
                <RiDeleteBin6Fill onClick={onDelete} />
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
                  <FaPencilAlt
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
                  <GrFormNextLink onClick={onNext} />
                  Next
                </ColWrapper>
              ) : (
                <ColWrapper>
                  <Button onClick={onSave}>
                    <GrFormNextLink />
                    Save
                  </Button>
                </ColWrapper>
              )}
            </Grid>
          </div>
          {!nextSelected && (
            <div className='cardBottom'>
              <div className='colorContainer'>
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
              {/* <Slider
              label={(val) => MARKS.find((mark) => mark.value === val).label}
              defaultValue={1}
              min={1}
              max={5}
              step={1}
              marks={MARKS}
              styles={{ markLabel: { display: 'none' } }}
            /> */}
              {/* <Slider
              label={(val) => MARKS.find((mark) => mark.value === val).label}
              defaultValue={50}
              step={25}
              marks={MARKS}
              styles={{ markLabel: { display: 'none' } }}
            /> */}
              <Container className='sliderContainer'>
                <FaPencilRuler />
                <Slider
                  value={value}
                  min={1}
                  max={10}
                  onChange={setValue}
                  // onChangeEnd={setEndValue}
                  onChangeEnd={setRadiusValue}
                />
              </Container>
            </div>
          )}
          {nextSelected && (
            // <div className='cardBottom'>
            <TextInput ref={inputRef} />
            // </div>
          )}
        </div>
      </div>
      {/* <CanvasDraw canvasWidth="100" canvasHeight="100"/> */}
    </>
  );
}
