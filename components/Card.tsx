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
  Select,
} from '@mantine/core';
import CanvasDraw from 'react-canvas-draw';
import React, { FC, useState, useRef, useCallback } from 'react';
import { RiDeleteBin6Fill, RiEraserLine } from 'react-icons/ri';
import { GrFormNextLink, GrFormPreviousLink } from 'react-icons/gr';
import { useElementSize } from '@mantine/hooks';
import { FaPencilRuler, FaPencilAlt } from 'react-icons/fa';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import _ from 'lodash';

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
  const [monsterName, setMonsterName] = useState('');

  const [value, setValue] = useState(1);
  const [endValue, setEndValue] = useState(50);

  const [radiusValue, setRadiusValue] = useState(1);

  const [opened, setOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [typeOpened, setTypeOpened] = useState(false);

  const [drawing, setDrawing] = useState(null);
  const [monsterPNG, setMonsterPNG] = useState(null);
  const [monsterDesc, setMonsterDesc] = useState(null);
  const [monsterType, setMonsterType] = useState(null);

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
    // localStorage.setItem('savedDrawing', canvasRef.current?.getSaveData());
    setDrawing(canvasRef.current?.getSaveData());

    //This will store the base64 image to submit to database
    setMonsterPNG(canvasRef.current?.getDataURL());

    //Trim input name to prevent spaces for monster name
    setMonsterName(monsterName.trim());
    if (monsterName.trim().length === 0) {
      setOpened(true);
    }
    if (monsterType === null) {
      setTypeOpened(true);
    } else {
      setNextSelected(true);
    }
  };

  const onSave = () => {
    // This will be where we save the information to the database
    console.log(descriptionRef.current.value);
  };

  const handleChange = (e) => {
    if (e.target.value.length === 0 && e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setMonsterName(e.target.value);
    }
  };

  const handleDescChange = (e) => {
    setMonsterDesc(e.target.value);
  };

  const descriptionRef = useRef<HTMLTextAreaElement>();
  const nameRef = useRef<HTMLInputElement>();

  const submitData = (value) => {
    console.log(value);
    let data = { content: value };
    axios
      .post('/api/sendpost', data)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveMonster = (
    monsterName,
    userName,
    img,
    desc,
    userId,
    monsterType
  ) => {
    // console.log('in saveMonster function');
    // console.log('monsterName', monsterName);
    // console.log('username', userName);
    // console.log('img', img);
    // console.log('desc', desc);
    // console.log('userId', userId);
    axios
      .post('/api/createcard', {
        monsterName,
        userName,
        img,
        desc,
        userId,
        monsterType,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const throttleSave = useCallback(_.throttle(saveMonster))

  const { data: session, status } = useSession();
  const userId = session.id;

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
          opened={typeOpened}
          onClose={() => setTypeOpened(false)}
          transition='fade'
          transitionDuration={600}
          transitionTimingFunction='ease'
        >
          {'Please select a monster type'}
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
        <div className='card' style={{ backgroundColor: monsterType }}>
          <div className='cardHeader'>
            <Grid justify='space-between' align='center'>
              <Grid.Col span={6}>
                {!nextSelected && (
                  <TextInput
                    className='monsterName'
                    ref={nameRef}
                    size='xs'
                    onChange={handleChange}
                    placeholder={monsterName ? monsterName : 'Monster Name'}
                    styles={() => ({
                      input: {
                        backgroundColor: 'transparent',
                        color: 'black',
                        borderColor: 'black',
                        paddingLeft: '5px',
                      },
                    })}
                  ></TextInput>
                )}
                {nextSelected && <>{monsterName}</>}
              </Grid.Col>
              {/* <Grid.Col span={6}>by: {session.username}</Grid.Col> */}
              <Grid.Col span={6}>
                <Select
                  placeholder='Type'
                  value={monsterType}
                  onChange={setMonsterType}
                  data={[
                    { value: 'SkyBlue', label: 'Blue' },
                    { value: 'Crimson', label: 'Red' },
                    { value: 'Pink', label: 'Pink' },
                    { value: 'Gainsboro', label: 'Gray' },
                  ]}
                  styles={() => ({
                    input: {
                      backgroundColor: 'transparent',
                      color: 'black',
                      borderColor: 'black',
                      paddingLeft: '5px',
                      textAlign: 'right',
                    },
                  })}
                ></Select>
              </Grid.Col>
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
                saveData={drawing ? drawing : null}
              />
            )}

            {imageWidth && imageHeight && nextSelected && (
              <CanvasDraw
                disabled
                hideGrid
                canvasWidth={imageWidth}
                canvasHeight={imageHeight}
                // saveData={localStorage.getItem('savedDrawing')}
                saveData={drawing}
              />
            )}
          </div>
          <div className='cardOptions'>
            <Grid sx={{ flex: '1' }} justify='center' gutter={0}>
              {!nextSelected && (
                <ColWrapper>
                  <RiDeleteBin6Fill onClick={onDelete} />
                  Delete
                </ColWrapper>
              )}
              {nextSelected && (
                <ColWrapper>
                  <GrFormPreviousLink
                    onClick={() => {
                      setNextSelected(false);
                    }}
                  />
                  Previous
                </ColWrapper>
              )}
              {/* <div onClick={() => toggleErase(!erase)}> */}

              {!nextSelected && !erase && (
                <ColWrapper>
                  <RiEraserLine
                    onClick={() => {
                      toggleErase(true);
                    }}
                  />
                  Erase
                </ColWrapper>
              )}

              {!nextSelected && erase && (
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

              {nextSelected && <ColWrapper></ColWrapper>}

              {!nextSelected ? (
                <ColWrapper>
                  <GrFormNextLink onClick={onNext} />
                  Next
                </ColWrapper>
              ) : (
                <ColWrapper>
                  <Button
                    onClick={() =>
                      // _.throttle(() => {
                      //   saveMonster(
                      //     monsterName,
                      //     session.username,
                      //     monsterPNG,
                      //     descriptionRef.current?.value,
                      //     session.id
                      //   );
                      // }, 1000)
                      saveMonster(
                        monsterName,
                        session.username,
                        monsterPNG,
                        monsterDesc,
                        session.id,
                        monsterType
                      )
                    }
                  >
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
            <div
              className='cardBottomDesc'
              style={{ height: '30%', display: 'flex' }}
            >
              {/* <Textarea
                ref={descriptionRef}
                autosize={true}
                minRows={6}
                sx={{ height: '100%' }}
              /> */}
              <textarea
                onChange={handleDescChange}
                style={{
                  flex: 1,
                  background: 'transparent',
                  // borderColor: 'black',
                  padding: '5px',
                  border: 'solid 2px black',
                }}
                placeholder='Enter monster description/lore here! '
              />
            </div>
          )}
        </div>
      </div>
      {/* <CanvasDraw canvasWidth="100" canvasHeight="100"/> */}
    </>
  );
}
