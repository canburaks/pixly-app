import React from "react";
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import css from '@styled-system/css'

//import { FacebookSquare as Facebook,  Instagram} from 'styled-icons/boxicons-logos'
//import { Bookmark as BookmarkSolid } from "styled-icons/boxicons-solid"
//import { TwitterSquare as Twitter, Imdb } from "styled-icons/fa-brands"

const movieResponsives = css({
    height: [6,7,8,9,10],
    width: [6,7,8,9,10],
})
const itemSocialResponsives = css({
    height: [5,6],
    width: [5,6],
})

export const Svg = styled("svg")`
    fill: ${props => props.fill || "none"};
    stroke: ${props => props.stroke || "#f1f1f1"};
    stroke-width:${props => props.strokeWidth || 0};
    width:  ${props => props.size || "24px"};
    height: ${props => props.size || "24px"};
    cursor: ${props => props.clickable && "pointer"};
    margin:4px;
    transition: all 0.2s cubic-bezier(.51,.17,.46,.88);
    transform-origin: center;
    :hover {
        transform:${props => props.hoverScale && "scale(1.1, 1.1)"};
    }
    title:${props => props.title && props.title}
	${layout};
	${position};

`



export const MovieSvg = styled(Svg)`
    stroke:${props => props.active ? "white" : "white"};
    stroke-width:${props => props.active ? 0.5 : 2};
    fill:${props => props.active ? "red" : "none"};
    cursor:pointer;
    :hover {
        transform: scale(1.1, 1.1);
        fill: ${props => props.active ? "rgba(255, 255, 255, 0.4)" : "rgba(255,0, 0, 0.4)" };
        stroke-width:${props => props.active ? 1 : 0.5};
    }
`
export const SocialMediaSvg = styled(Svg)`
    stroke: ${themeGet("colors.light")};
    fill: light;
    width:  ${props => props.size || ["20px", "26px", "32px", "36px"]} !important;
    height: ${props => props.size || ["20px", "26px", "32px", "36px"]} !important;
    cursor: pointer;
    :hover {
        transform: ${ props => props.hoverScale ? scale(1.1, 1.1) : null};
        fill:${props => 
             props.imdb ? "#fac539" : 
            (props.facebook ? "#3a67af" : 
            (props.twitter ? "#009de7" : 
            (props.instagram ? "#C13584" : "#f1f1f1")))};
    }
    ${itemSocialResponsives};
`
export const UnFollowAnimatedSvg = styled(Svg)`
    cursor:pointer;
    .circle { transition: opacity 0.4s cubic-bezier(.51,.17,.46,.88); }
    .unf { opacity: 0; transition: opacity 0.4s cubic-bezier(.51,.17,.46,.88); }
    .tick { stroke:${themeGet("colors.green")}; stroke-width:4; transition: opacity 0.4s cubic-bezier(.51,.17,.46,.88); }
    :hover{
        .tick { opacity: 0 }
        .unf { opacity: 1 }
    }
`


/*

    stroke: ${props => props.stroke || "#f1f1f1"};
    stroke-width:${props => props.strokeWidth || 2};
    width:  ${props => props.size || "36px"};
    height: ${props => props.size || "36px"};
    margin:4px;
    cursor: ${props => props.onClick ? "pointer" : "default"};
    transition: all 0.2s cubic-bezier(.51,.17,.46,.88);
    transform-origin: center;
    title:${props => props.title && props.title}

height={["26px", "30px", "34px", "38px"]}

const moviesvgstyle = css`
    stroke:${props => props.active ? "none" : "white"};
    stroke-width:${props => props.active ? 0 : 2};
    fill:${props => props.active ? "red" : "none"};
	${layout};
`

export const LikeIcon = styled(Heart)`
	${props => moviesvgstyle}
`
*/



