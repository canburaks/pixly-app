import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

export const HiddenText = styled("span")`
    display:none;
`
export const HiddenHeader = styled("h1")`
    display:none;
`

export const Text = styled('p')({

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
  textTransform:"capitalize"
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
  textTransform:"capitalize"
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
    padding: "0px 4px",
    margin: "2px 4px 2px 0px !important",
    fontSize: "12px",
    borderColor: "rgba(255, 255, 255, 1)",
    color: "rgba(255, 255, 255, 0.95) ",
    fontWeight: "bold",
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