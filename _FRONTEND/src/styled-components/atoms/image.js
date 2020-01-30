import React from 'react';
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'

import {  styled } from "../"
import { Box, CoverLink } from "../"
//import { Spinner } from "../others"

import { themeGet } from '@styled-system/theme-get'
import { NewLink } from './link';
import { linearGradient, backgrounds, backgroundImages, setLightness } from 'polished'

//import ImgShim from 'react-shimmer'


export const CoverImage = ({src, ratio, alt, title, link, follow=undefined,filter=undefined, ...props }) => (
    <Box position="relative" width="100%" pt={`${ratio*100}%`}  {...props} overflow="hidden" className="absolute-cover-image">
        {link 
            ? <NewLink link={link} title={title} follow={follow}>
                    <AbsoluteImage src={src} alt={alt} title={title} filter={filter} />
                </NewLink>
            : <AbsoluteImage src={src} alt={alt} title={title} filter={filter}/>
        }
    </Box>
)

export const AbsoluteImage = styled("img")`
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    min-width:100%;
    height:100%;
    filter:${props => props.filter};
    /*
    */
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
`


export const Image = styled('img').attrs(
    (props) =>( props.info 
        ? {
            alt:props.info ,
            title:props.info + " image",
            loading:"auto"
        } 
        : {loading:"auto"}
        )
    )`
    transition: all ${themeGet("transitions.medium")};
    filter:${props => props.blur && `blur(${props.blur}px)`};
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