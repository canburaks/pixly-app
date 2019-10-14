import React from "react"
import { compose, typography, color, space, shadow, layout, border, background, flexbox, position } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

export const Button = styled.button`
    width: 100%;
    padding: 8px 8px;
    margin: 4px;
    box-sizing: border-box;
    transition:  ${themeGet("transitions.fast")};
    :hover {
        background-color:${props => props.hoverBg && props.hoverBg};
        color:${props => props.hoverColor && props.hoverColor};
        box-shadow:${props => props.hoverShadow && props.hoverShadow}
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
    padding: 20px 20px;
    outline: none;
    border: none;
    background-color: rgba(45, 47, 87, 0.8);
    overflow: hidden;
    transition: color 0.4s ease-in-out;
    box-shadow:${themeGet("shadows.xs")};

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
        transition: transform 0.45s ease-in-out;
      }
    :hover {
        cursor: pointer;
        color: ${themeGet("colors.white")};
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