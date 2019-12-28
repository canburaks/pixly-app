import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import { themeGet } from '@styled-system/theme-get'
import {  styled } from "../"
import { linearGradient, backgrounds, backgroundImages, setLightness } from 'polished'

export const RegularInput = styled("input")`
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
export const Input = styled("input")`
    width: 100%;
    padding: 4px 0;
    margin: 4px 0;
    box-sizing: border-box;
    border:0px solid transparent !important;
    border-bottom:${props => props.status === "success" 
        ? `5px solid #30c5b1 !important` 
        : `5px solid gray !important`};
    background: transparent;
    font-size:14px;
    font-weight: 400;
    color:rgb(39, 39, 39);
    line-height:16.1px;
    transition:  ${themeGet("transitions.fast")};
    outline-color: initial;
    outline-style: initial;
    outline-width: 0px;
    outline-offset: -2px;
    :focus {
        border-bottom: 5px solid rgba(76, 86, 226, 1) !important;
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
    flex-direction:column;
    transition:  ${themeGet("transitions.fast")};

    ${props => props.gradient && themeGet(`gradients.${props.gradient}.colors`)(props) 
        && linearGradient({
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
    ${typography}
`

export const SearchInput = styled("input")`
    background-color: rgba(40,40,40, 0.6);
    height:70%;
    min-height:60px;
    padding:8px 16px;
    margin:2px 16px;
    font-size:26px;
    font-weight: bold;
    font-style: italic;
    color:rgba(180,180,180, 0.4);
    caret-color: ${themeGet("colors.light")};
    letter-spacing: 1.5px;
    -webkit-appearance: none;
    outline: none;
    transition:0.25s ease-in-out;
    border-radius:8px;
    border:0px solid;
    box-sizing:border-box;
    box-shadow: 0px 2px 6px rgba(6, 28, 63, 0.1);
    :focus {
        background-color: rgba(180, 180, 180, 0.4);
        color:white;
    }
    :focus  ::placeholder {
        color: ${themeGet("colors.active")} ;
        border-color:white;
    }
    ::placeholder {
        color: rgba(180,180,180, 0,9);
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
export const Label = styled("label")`
    font-weight:bold;
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