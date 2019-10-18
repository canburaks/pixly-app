import React from "react"
import { compose, typography, color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import { Image } from "./image"
import { Spinner } from "../others"
import { motion } from "framer-motion"

const hoverShadow = `:hover { box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')}}`


export const Box = styled.div`
    box-sizing: border-box;
    position: relative;
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        }
    transition: ${themeGet("transitions.fast")};
    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
    background: ${props => props.darken && "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.40379901960784315) 50%, rgba(0,0,0,0) 100%)"};
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

export const MotionBox = styled(motion.div)`
    box-sizing: border-box;
    position: relative;
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.diffuse3')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        }
    transition: ${themeGet("transitions.fast")};
    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
    overflow: hidden;
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

export const ImageBox = styled(Box)`
    box-sizing: border-box !important;
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    height:${props => props.auto && "auto"};
    transition: background-image 5s ease-in-out !important;
`
export const BlurBox = styled(ImageBox)`
    -webkit-filter: ${props => props.blur && `blur(${props.blur}px)`};
    -moz-filter: ${props => props.blur && `blur(${props.blur}px)`};
    -o-filter: ${props => props.blur && `blur(${props.blur}px)`};
    -ms-filter: ${props => props.blur && `blur(${props.blur}px)`};
    filter: ${props => props.blur && `blur(${props.blur}px)`};
    z-index:2;
    overflow: hidden;
`

export const GridBox = styled(Box)`
    display: grid;
    width: 100%;
`
export const MotionGridBox = styled(MotionBox)`
    display: grid;
    width: 100%;
`

export const FlexBox = props => <Box position="relative" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" {...props} />
export const AbsoluteBox = props => <Box position="absolute" {...props} />


export const GradientBox = styled(Box)`
    box-sizing: border-box !important;
    background:${background => background};
    height:auto;
`



// Allow overflow
/*
export const AspectRatioFlexibleBox = styled(Box)`
    ::before {
        content: "";
        float: left;
        padding-top: ${props => props.ratio * 100}% !important;
    }
    ::after {
        clear: left;
        content: " ";
        display: table;
    }
`
*/