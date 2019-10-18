import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import { hideText } from 'polished'

export const HiddenText = styled("span")`
    max-width:1px !important;
    max-height:1px!important;
    visibility:hidden;
`
export const HiddenHeader = styled("h1")`
    max-width:1px !important;
    max-height:1px!important;
    visibility:hidden;
`


export const Text = styled('p')({
  wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal"
  },
    compose(
      typography,
      color,
      space,
      shadow,
      layout,
      position,
      border
    )
)

export const HeaderText = styled('h1')({
  minWidth:"100% !important",
  textTransform:"capitalize",
  wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal"

},
  compose(
    typography,
    color,
    space,
    shadow,
    layout,
    position,
      border
  )
)
export const HeaderMini = styled('h4')({
  minWidth:"100% !important",
  textTransform:"capitalize",
  fontWeight:"bold",
  wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal"

},
  compose(
    typography,
    color,
    space,
    shadow,
    layout,
    position,
      border
  )
)
export const Paragraph = styled('p')({
    overflowY: props => props.textHidden && "hidden",
    textOverflow: props => props.textHidden && "ellipsis",
    wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal"

  },
    compose(
      typography,
      color,
      space,
      shadow,
      layout,
        border
    )
)

export const TagText = styled('p')({
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "4px",
    padding: "2px 8px",
    margin: "2px 4px 2px 0px !important",
    fontSize: "10px",
    borderColor: "rgb(210, 210, 210)",
    color: "rgb(210, 210, 210) ",
    },
    compose(
      typography,
      color,
      space,
      shadow,
      layout,
      position,
      border
    )
  )

  export const Blockquote = styled('blockquote')({
    fontFamily:themeGet("fonts.quote")
  },
    compose(
      typography,
      color,
      space,
      shadow,
      layout,
      position,
      border
    )
)
    

    
export const Cite = styled("cite")`
  display: block;
  font-style: italic;
  text-align: right;
  :before {
    content: "- ";
  }
  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${background}
  ${position}
  ${typography}
`