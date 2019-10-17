import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import { themeGet } from '@styled-system/theme-get'
import {  styled } from "../"


export const Input = styled("input")`
    width: 100%;
    padding: 4px 0;
    margin: 4px 0;
    box-sizing: border-box;
    border:0px solid transparent !important;
    border-bottom: 3px solid gray !important;
    background: transparent;
    font-size:14px;
    font-weight: 400;
    color:rgb(69, 69, 69);
    line-height:16.1px;
    transition:  ${themeGet("transitions.fast")};
    outline-color: initial;
    outline-style: initial;
    outline-width: 0px;
    outline-offset: -2px;
    :focus {
        border-bottom: 3px solid rgba(76, 86, 226, 1) !important;
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
export const Form = styled("form")`
    width: 100%;
    box-sizing: border-box;
    display:flex;
    flex-direction:row;
    transition:  ${themeGet("transitions.fast")};
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

export const SearchInput = styled("input")`
    background-color: rgba(180, 180, 180, 0.8);
    height:70%;
    min-height:60px;
    padding:8px 16px;
    font-size:26px;
    font-weight: bold;
    font-style: italic;
    color:${themeGet("colors.light")};
    letter-spacing: 1.5px;
    border-radius: 0px;
    -webkit-appearance: none;
    outline: none;
    transition:0.25s ease-in-out;
    border-radius:32px;
    margin:8px 16px;
    caret-color: ${themeGet("colors.light")};
    border:2px solid;
    box-sizing:border-box;
    box-shadow: 0px 2px 6px rgba(6, 28, 63, 0.3);
    :focus {
        background-color: rgba(40,40,40, 0.6);
    }
    :focus  ::placeholder {
        color: ${themeGet("colors.active")};
        border-color:white;
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
