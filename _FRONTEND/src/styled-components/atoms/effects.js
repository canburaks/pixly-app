import React from "react"
import { typography, color, space, shadow, layout, border, background, flexbox, position, system, grid } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import css from '@styled-system/css'



export const UnderlineEffect = styled.span`
    position: relative;

    ::before {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: white;
        transform-origin: center;
        transform: translate(-50%, 0) scaleX(0);
        transition: transform 0.3s ease-in-out;
      }
    :hover::before {
        transform: translate(-50%, 0) scaleX(1);
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