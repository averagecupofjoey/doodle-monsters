import {
  Grid,
  ColorPicker,
  Slider,
  Container,
  TextInput,
  Textarea,
  Button,
  Modal,
  Group,
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
  monster = 'test',
  userName = 'John Smith',
  monsterString = 'null',
}) {
  const [color, updateColor] = useState('#4dabf7');
  const [erase, toggleErase] = useState(false);
  const [nextSelected, setNextSelected] = useState(false);
  const [monsterName, setMonsterName] = useState(null);

  const [value, setValue] = useState(1);
  const [endValue, setEndValue] = useState(50);

  const [radiusValue, setRadiusValue] = useState(1);

  const [opened, setOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);

  const {
    ref: imageRef,
    width: imageWidth,
    height: imageHeight,
  } = useElementSize();

  // const canvasRef = useRef<CanvasDraw>(null);

  // const onDelete = () => {
  //   canvasRef.current?.eraseAll();
  // };

  // const canvasRef = React.createRef();
  const canvasRef = React.createRef<CanvasDraw>();

  const onDelete = () => {
    console.log(canvasRef);
    setDeleteOpened(true);
    // canvasRef.current?.eraseAll();
  };

  const onNext = () => {
    //We use this to draw the uneditable image on the next step
    localStorage.setItem('savedDrawing', canvasRef.current?.getSaveData());

    //This will store the base64 image to submit to database
    console.log(canvasRef.current?.getDataURL());
    if (monsterName === null) {
      setOpened(true);
    } else {
      setNextSelected(true);
    }
  };

  const onSave = () => {
    // This will be where we save the information to the database
    console.log(descriptionRef.current.value);
  };

  const handleChange = (e) => {
    setMonsterName(e.target.value);
  };

  const descriptionRef = useRef<HTMLTextAreaElement>();
  const nameRef = useRef<HTMLInputElement>();

  return (
    <>
      <div className='cardContainer'>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          transition='fade'
          transitionDuration={600}
          transitionTimingFunction='ease'
        >
          {'Please enter a monster name'}
        </Modal>
        <Modal
          opened={deleteOpened}
          onClose={() => setDeleteOpened(false)}
          transition='fade'
          transitionDuration={600}
          transitionTimingFunction='ease'
        >
          {
            <>
              'Are you sure you want to delete this drawing?'
              <Group spacing={'xl'}>
                <Button
                  onClick={() => {
                    canvasRef.current?.eraseAll();
                    setDeleteOpened(false);
                  }}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => {
                    setDeleteOpened(false);
                  }}
                >
                  No
                </Button>
              </Group>
            </>
          }
        </Modal>
        <div className='card'>
          <div className='cardHeader'>
            <Grid justify='space-between' align='center'>
              <Grid.Col span={6}>
                <TextInput
                  className='monsterName'
                  ref={nameRef}
                  size='xs'
                  onChange={handleChange}
                  placeholder='Enter monster name'
                  styles={() => ({
                    input: {
                      backgroundColor: 'transparent',
                      color: 'black',
                      borderColor: 'black',
                      paddingLeft: '5px',
                    },

                    //need to target input::placeholder
                    placeholder: {
                      color: 'black',
                    },
                  })}
                ></TextInput>
              </Grid.Col>
              <Grid.Col span={6}>by: {userName}</Grid.Col>
            </Grid>
          </div>
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
              <FaPencilRuler />
              <Container className='sliderContainer'>
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
            <div className='cardBottomDesc' style={{ height: '30%' }}>
              <Textarea ref={descriptionRef} sx={{ height: '100%' }} />
            </div>
          )}
        </div>
      </div>
      {/* <CanvasDraw canvasWidth="100" canvasHeight="100"/> */}
    </>
  );
}
