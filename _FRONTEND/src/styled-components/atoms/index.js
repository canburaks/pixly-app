import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import styled from 'styled-components'
import { themeGet } from '@styled-system/theme-get'

export * from "./box"
export * from "./image"
export * from "./button"
export * from "./effects"
export * from "./link"
export * from "./text"
export * from "./svg"

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






/*
const LinkNoFollow = (props) => <Link rel="nofollow" {...props} />

export const NewLink = styled(LinkNoFollow)(
  compose(
    typography,
    color,
    space,
    layout,
    position
  )
)
*/
/*
export const NewLink = styled(Link)(
  compose(
    typography,
    color,
    space,
    layout,
    position
  )
)

*/