import React from "react"
import {  color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import {  styled, linearGradientAnimationKeyframe } from "../"
import "./Spinner.css"
import { Text, Paragraph, 
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    Box, AbsoluteBox, 

} from "../"

export const Spinner = (props) => <Box className="loader" id="spinner" />

export const SpinnerFade = ({size=30, color="white"}) => (
    <Box className="sk-circle-fade" width={size} height={size} >
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
        <CircleFadeDot className="sk-circle-fade-dot" bgBefore={color}></CircleFadeDot>
    </Box>
)

const CircleFadeDot = styled("div")`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; 
    :before {
        content: '';
        background-color: ${props => props.bgBefore && props.bgBefore};
    }
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
`