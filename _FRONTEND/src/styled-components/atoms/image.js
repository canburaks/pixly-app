import React from 'react';
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'

import {  styled } from "../"
import { Box } from "./box"
//import { Spinner } from "../others"

import { themeGet } from '@styled-system/theme-get'

//import ImgShim from 'react-shimmer'

export const Image = styled('img').attrs((props) =>( props.info ? {alt:props.info , title:props.info + " image"} : null))`
    ${space}
    ${shadow}
    ${layout}
    ${border}
    ${position}
`

export const styledPicture = styled.picture`
    ${space}
    ${shadow}
    ${layout}
    ${border}
    ${position}
`

/*
export const Picture = (props) => (
    <styledPicture {...props}>
        {props.links.map(link => {
            splitted = link.split(".")
            extension = splitted[splitted.length - 1]
            return <source srcset={link} type={`image/${extension}`} />
        })}
        <Image src={props.links[0]} alt={props.info} />
    </styledPicture>
)

export const ImagePlaceholder = (props) => (
    <ImgShim fallback={<Spinner />} {...props} style={{...placeholderstyle, ...props.style}}  />
)

export const ImageShim = React.memo((props) => (
    <ImgShim fallback={<Spinner />} {...props} style={{...shimstyle, ...props.style}}  />
))
const shimstyle = {width:"100%", height:"100%", minHeight:150, minWidth:150, transition:"0.35s linear"}

*/