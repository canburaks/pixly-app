import React from "react"
import { compose, typography, color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import {  styled, linearGradientAnimationKeyframe } from "../"
import { themeGet } from '@styled-system/theme-get'
import { Image } from "./image"
import { Spinner } from "../others"
//import { motion } from "framer-motion"
import { linearGradient, backgrounds, backgroundImages, setLightness } from 'polished'
import { generateGradient } from "../../functions/"


export const Ul = styled("ul")`
    padding:0;
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

