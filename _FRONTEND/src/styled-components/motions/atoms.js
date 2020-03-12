import React from "react";
import { compose, typography, color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

//import { motion } from "framer-motion"
import { linearGradient, backgrounds, backgroundImages, setLightness } from 'polished'
import { Box } from "../"
//import { motion, AnimatePresence } from "framer-motion"

export const ModalMotionBox = ({isOpen, ...props}) => (
    <Box {...props}>
    {props.isOpen && (
      <ModalMotion
        exit={{ opacity: 0 }}
        width={"100%"}
        height="auto"
        overflowY="scroll"
        
      />
    )}
  </Box>
)

export const ModalMotion = styled("div")`
    position: fixed;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow-y:auto;
    top:0 !important;
    left:0 !important;
    right:0 !important;
    bottom:0 !important;
    background-color:rgba(0,0,0, 0.25);
    z-index:10;
    box-sizing: border-box;

    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
    ${grid}
    ${typography}
`