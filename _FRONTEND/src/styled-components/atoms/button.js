import React from "react"
import { compose, typography, color, space, shadow, layout, border, background, flexbox, position } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import { linearGradient } from 'polished'

export const Button = styled.button`
    padding: 8px 8px;
    margin: 4px;
    box-sizing: border-box;
    border:0;
    transition:  ${themeGet("transitions.medium")};
    cursor:pointer;
    background:transparent;
    :hover {
        background-color:${props => props.hoverBg && props.hoverBg};
        color:${props => props.hoverColor && props.hoverColor};
        box-shadow:${props => props.hoverShadow && props.hoverShadow};
        border-color:${props => props.hoverBorderColor && props.hoverBorderColor}
    }
    ${props => props.gradient && themeGet(`gradients.${props.gradient}.colors`)(props) 
        && linearGradient({
        colorStops: themeGet(`gradients.${props.gradient}.colors`)(props),
        toDirection: themeGet(`gradients.${props.gradient}.direction`)(props),
        fallback: themeGet(`gradients.${props.gradient}.fallback`)(props),
    })};

    :focus {
        outline: none;
    };
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
    ${typography}
`
export const ImageButton = styled.button`
    margin: 0;
    border:0;
    padding:0;
    cursor:pointer;
    background: ${props => `url(${props.src})`};
    background-size: cover;
    background-position: center;
    :hover {
        color:${props => props.hoverColor && props.hoverColor};
        box-shadow:${props => props.hoverShadow && props.hoverShadow};
        border-color:${props => props.hoverBorderColor && props.hoverBorderColor}
    }
    :focus {
        outline: none;
    };
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
    ${typography}
`

export const BubbleButton = styled.button`
    z-index: 1;
    position: relative;
    font-size: inherit;
    font-family: inherit;
    color: white;
    padding: 12px 12px;
    outline: none;
    border: none;
    background-color: rgba(45, 47, 87, 0.8);
    overflow: hidden;
    transition: all 0.45s ease-in-out;
    box-shadow:${themeGet("shadows.xs")};
    ${props => props.gradient && themeGet(`gradients.${props.gradient}.colors`)(props) 
        && linearGradient({
        colorStops: themeGet(`gradients.${props.gradient}.colors`)(props),
        toDirection: themeGet(`gradients.${props.gradient}.direction`)(props),
        fallback: themeGet(`gradients.${props.gradient}.fallback`)(props),
    })}
    ::before {
        content: '';
        z-index: -1;
        position: absolute;
        bottom: 100%;
        right: 100%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: ${themeGet("colors.accent1")};
        transform-origin: center;
        transform: translate3d(50%, 50%, 0) scale3d(0, 0, 0);
        transition: all 0.45s ease-in-out;
      }
    :hover {
        cursor: pointer;
        color:${props => props.hoverColor ? props.hoverColor : themeGet("colors.light")};
        border-color:${props => props.hoverBg ? props.hoverBg : themeGet("colors.accent1")};
        box-shadow:${props => props.hoverShadow && props.hoverShadow};
      }

      :hover::before {
        transform: translate3d(50%, 50%, 0) scale3d(15, 15, 15);
      }
      ${color}
      ${space}
      ${shadow}
      ${layout}
      ${background}
      ${border}
      ${flexbox}
      ${position}
      ${typography}
`
