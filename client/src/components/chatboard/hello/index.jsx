import React, { useState, useEffect, useReducer, useRef } from "react";

import {
  SliderItem,
  SliderContainer,
  SliderWrapper,
  NavigationItem,
} from "./styles.js";
import { Box, Button, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { textcolor } from "../../../colors/index.js";
import connectUrl from '../../../img/connect/connect.png';
import logo from '../../../logo/logo.png';
import increase from './../../../img/increase/improve.png';
const Slider = () => {

  const [width, setWidth] = useState(0);
  const referent = useRef(null);
  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    items: [
      {
        id: 1,
        component: (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <img
              style={{
                height: "200px",
              }}
              src={logo}
              alt="connect"
            />
            <Typography color={textcolor.primaryGray} fontSize={24}>
              Welcome to BKChat
            </Typography>

          </Box>
        ),
      },
      {
        id: 2,
        component: (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <img
              style={{
                height: "400px",
              }}
              src={connectUrl}
              alt="connect"
            />
            <Typography color={textcolor.primaryGray} fontSize={24}>With more connection</Typography>
          </Box>
        ),
      },
      {
        id: 3,
        component: (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <img
              style={{
                height: "400px",
              }}
              src={increase}
              alt="connect"
            />
            <Typography color={textcolor.primaryGray} fontSize={24}>
            Help users increase the quality of messages
            </Typography>

          </Box>
        ),
      }
    ],
  });
  useEffect(() => {
    let currentWidth = referent.current.offsetWidth;
    setWidth(currentWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useWindowWidth()]);

  return (
    <div
      style={{
        height: "100%",
      }}
      ref={referent}
    >
      <SliderContainer className={"slider-instance"} height={"100%"}>
        {/* <Box> */}
        <SliderWrapper
          width={width * state.items.length}
          style={{
            transform: `translateX(${-(state.currentIndex * width)}px)`,
            transition: "transform ease-out 0.30s",
            width: width * state.items.length + "px",
          }}
        >
          {state.items.map((i) => {
            return <Slide key={"" + i.id + "sldit"} item={i} width={width} />;
          })}
        </SliderWrapper>
        {/* </Box> */}

        <Box
          display={"flex"}
          marginTop={"540px"}
          width={"100%"}
          justifyContent={"center"}
        >
          <Box display={"flex"}>
            {state.items.map((i, index) => {
              return (
                <NavigationItem
                  active={index === state.currentIndex}
                  onClick={() => dispatch({ type: "GOTO", index })}
                  key={"nav" + i.id}
                >
                  &nbsp;
                </NavigationItem>
              );
            })}
          </Box>
        </Box>
        {/* <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    height={"100%"}
                    width={"100%"}
                > */}
        <Box position={"absolute"} left={0} top={"50%"}>
          <Button onClick={() => dispatch({ type: "PREV" })}>
            <KeyboardArrowLeftIcon />
          </Button>
        </Box>
        <Box position={"absolute"} right={0} top={"50%"}>
          <Button onClick={() => dispatch({ type: "NEXT" })}>
            <KeyboardArrowRightIcon />
          </Button>
        </Box>
        {/* </Box> */}
      </SliderContainer>
    </div>
  );
};

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  return width;
}

function reducer(state, action) {
  switch (action.type) {
    case "NEXT":
      if (state.currentIndex === state.items.length - 1) {
        return {
          ...state,
          currentIndex: 0,
        };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + (1 % state.items.length),
      };
    case "PREV":
      if (state.currentIndex === 0) {
        return {
          ...state,
          currentIndex: state.items.length - 1,
        };
      }
      return {
        ...state,
        currentIndex: state.currentIndex - (1 % state.items.length),
      };
    case "GOTO":
      return {
        ...state,
        currentIndex: action.index,
      };
    case "RESET":
      return { currentIndex: 0, currentPosition: 0 };

    default:
      return state;
  }
}

const Slide = ({ item, width }) => {
  return <SliderItem width={width}>{item.component}</SliderItem>;
};

export default Slider;
