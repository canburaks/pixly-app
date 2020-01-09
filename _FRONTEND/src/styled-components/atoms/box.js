import React from "react"
import { compose, typography, color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import {  styled, linearGradientAnimationKeyframe } from "../"
import { themeGet } from '@styled-system/theme-get'
import { Image } from "./image"
import { Spinner } from "../others"
//import { motion } from "framer-motion"
import { linearGradient, backgrounds, backgroundImages, setLightness } from 'polished'
import { generateGradient } from "../../functions/"
const hoverShadow = `:hover { box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')}}`

export const Hr = styled("hr")`
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

export const Section = styled.section`
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


export const Box = styled.div`
    box-sizing: border-box;
    position: relative;
    float:${props => props.float && props.float};
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        background:${props => props.hoverLight && setLightness('0.15', `${props.hoverLight}`)};
        }
    transition: ${themeGet("transitions.fast")};
    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
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
// ImageBox, AspectRatioBox and GradientBox
// NOTE: When using ratio use width=100%
export const SuperBox = styled.div`
    box-sizing: border-box !important;
    display:flex;
    position:relative;
    height:auto;
    padding-bottom:${props => `${props.ratio * 100}%`};

    ${props => props.src && backgroundImages(`url(${props.src})`)};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    ${props => props.gradient && themeGet(`gradients.${props.gradient}.colors`)(props) 
        && linearGradient({
        colorStops: themeGet(`gradients.${props.gradient}.colors`)(props),
        toDirection: themeGet(`gradients.${props.gradient}.direction`)(props),
        fallback: themeGet(`gradients.${props.gradient}.fallback`)(props),
    })}

    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
    overflow: hidden;
    z-index:1;
    transition: background-image 5s ease-in-out !important;
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        background:${props => props.hoverLight && setLightness('0.45', 'rgba(204,205,100,0.7)')};
    }
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
export const FlexListItem = styled.li`
    box-sizing: border-box;
    position: relative;
    display:flex;
    float:${props => props.float && props.float};
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        background:${props => props.hoverLight && setLightness('0.15', `${props.hoverLight}`)};
        }
    transition: ${themeGet("transitions.fast")};
    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
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

export const ImageBox = ({ratio,src, ...props}) => (
    <SuperBox width={"100%"} position="relative" {...props} ratio={ratio} >
        <Image 
            src={src} 
            position="absolute" 
            top={0}
            left={0}
            right={0}
            bottom={0}

        />
    </SuperBox>
    )

export const GridBox = styled(Box)`
    display: grid;
    width: 100%;
`


export const FlexBox = props => <Box position="relative" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" {...props} />
export const AbsoluteBox = props => <Box position="absolute" {...props} />
export const CoverBox = props => <Box position="absolute" top={0} left={0} right={0} bottom={0} {...props} />


export const ModalBox = styled.div`
    position: fixed;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:rgba(0,0,0, 0.75);
    padding:5vh 5vw;
    z-index:20;
    box-sizing: border-box;
    transition: all 1.8s cubic-bezier(.51,.17,.46, .88);

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
export const NavBarBox = styled.nav`
    position: absolute;
    top:0;
    left:0;
    width: 100vw;
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 4px 8px ;
    border-top: 2px solid rgba(0, 0, 0, 0.2);

    transition: all 0.3s ease-in-out;
    transition: background-color 1.5s cubic-bezier(.66,.04,.9,.88);
    overflow-y: visible;
    z-index: 10 !important;

    ${props => props.src && backgroundImages(`url(${props.src})`)};
    background-size: cover;
    background-position: center;
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
export const HtmlBox = styled.div`
    box-sizing: border-box;
    position: relative;
    overflow-x:hidden;
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.hover')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        background:${props => props.hoverLight && setLightness('0.15', `${props.hoverLight}`)};
        }
    transition: ${themeGet("transitions.fast")};
    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
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

export const BlurBox = styled(SuperBox)`
    -webkit-filter: ${props => props.blur && `blur(${props.blur}px)`};
    -moz-filter: ${props => props.blur && `blur(${props.blur}px)`};
    -o-filter: ${props => props.blur && `blur(${props.blur}px)`};
    -ms-filter: ${props => props.blur && `blur(${props.blur}px)`};
    filter: ${props => props.blur && `blur(${props.blur}px)`};
    z-index:2;
    overflow: hidden;
`
export const ListBox = styled(Box)`    
    :hover { 
        . p{
            font-weight:bold;
        }
    }
    :first-child {
        border-top-left-radius:8px;
        border-top-right-radius:8px
    }
    :last-child {
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px
    }
    div:not(:last-child) {
        border-bottom:1px solid rgba(180,180,180, 0.25)
    }
    
`



// Allow overflow
/*
export const MotionGridBox = styled(MotionBox)`
    display: grid;
    width: 100%;
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
export const ImageBox = styled.div`
    box-sizing: border-box !important;
    display:flex;
    position:relative;
    height:auto;
    padding-bottom:${props => `${props.ratio * 100}%`};

    ${props => props.src && backgroundImages(`url(${props.src})`)};
    background-size: cover;
    background-position: center;

    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
    overflow: hidden;
    z-index:1;
    transition: background-image 5s ease-in-out !important;
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.diffuse3')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
    }
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


export const GradientBox = styled.div`
    box-sizing: border-box !important;
    display:flex;
    position:relative;
    height:auto;
    :hover { 
        box-shadow: ${props => props.hoverShadow && themeGet('shadows.diffuse3')};
        border: ${props => props.hoverBorder && '3px solid #3633CC' };
        text-decoration: ${props => props.hoverUnderline && "underline"};
        }
    transition: ${themeGet("transitions.fast")};
    border: ${props => props.hoverBorder && "3px solid transparent"};
    cursor: ${props => props.clickable ? "pointer" : "inherit"};
    overflow: hidden;
    background:${props => props.gradient && linearGradient({
        colorStops: themeGet(`gradients.${props.gradient}.colors`)(props),
        toDirection: themeGet(`gradients.${props.gradient}.direction`)(props),
        fallback: themeGet(`gradients.${props.gradient}.fallback`)(props),
    })}
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


export const ImageBox2 = styled(Box)`
    box-sizing: border-box !important;
    background-image: url(${props => props.src});
    background-size: cover;
    background-position: center;
    height:${props => props.auto && "auto"};
    transition: background-image 5s ease-in-out !important;
`



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