import React from 'react';
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'

import styled from 'styled-components'
import { Box } from "./box"
import { Spinner } from "../others"

import { themeGet } from '@styled-system/theme-get'

import ImgShim from 'react-shimmer'

export const Image = styled('img')`
    ${space}
    ${shadow}
    ${layout}
    ${border}
    ${position}
`

const placeholderstyle = {
    width:"100%", height:"100%", position:"absolute",
    left:0, top:0, right:0, bottom:0, width:"100%", height:"100%",
    transition:"0.35s linear"
}

export const ImagePlaceholder = (props) => (
    <ImgShim fallback={<Spinner />} {...props} style={{...placeholderstyle, ...props.style}}  />
)


export const ImageShim = React.memo((props) => (
    <ImgShim fallback={<Spinner />} {...props} style={{...shimstyle, ...props.style}}  />
))
const shimstyle = {width:"100%", height:"100%", minHeight:150, minWidth:150, transition:"0.35s linear"}

