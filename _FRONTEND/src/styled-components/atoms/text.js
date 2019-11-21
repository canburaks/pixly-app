import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import { hideText } from 'polished'
import { Head } from '../../functions'

export const HiddenSpan = styled("span")`
    position:"absolute";
    z-index:-1;
    display:none;
    text-indent: 101%;
    overflow: hidden;
    whitespace: nowrap;
    /*
    max-width:10px !important;
    max-height:1px!important;
    */
`
export const HiddenText = styled("p")`
    position:"absolute";
    z-index:-1;
    display:none;
    text-indent: 101%;
    overflow: hidden;
    whitespace: nowrap;
    /*
    max-width:100% !important;
    max-height:1px!important;
    */
`
export const HiddenHeader = styled("h2")`
    position:"absolute";
    z-index:-1;
    display:none;
    text-indent: 101%;
    overflow: hidden;
    whitespace: nowrap;
    /*
    max-width:1px !important;
    max-height:1px!important;
    */
`
export const HiddenSubHeader = styled("h4")`
    position:"absolute";
    z-index:-1;
    display:none;
    text-indent: 101%;
    overflow: hidden;
    whitespace: nowrap;
    /*
    max-width:1px !important;
    max-height:1px!important;
    */
`
export const Span = styled("span")`
    color: ${themeGet("colors.dark")};
    opacity:0.75;
    visibility: ${props => props.invisible ? "hidden" : "visible"}
    ${typography}
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${position}
    ${border}
`

export const Text = styled('p')({
  wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal",
  color:themeGet("dark"),
  fontWeight:400,
  margin:0,
  whiteSpace: "pre-line",
  cursor:props => props.clickable ? "pointer" : "inherit",
  whiteSpace:props => props.truncate && "nowrap",
  overflow:props => props.truncate && "hidden",
  textOverflow:props => props.truncate && "ellipsis",
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
  textTransform:props => props.uncapitalize ? "none" : "capitalize",
  fontWeight:"bold",
  color:"dark",
  marginTop:"8px",
  cursor:props => props.clickable ? "pointer" : "inherit",
  textShadow:props => props.textShadow || themeGet("shadows.lightGray"),
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
export const SubHeaderText = styled('h2')({
  width:"100% ",
  textTransform:"capitalize",
  fontWeight:"bold",
  color:"dark",
  cursor:props => props.clickable ? "pointer" : "inherit",
  textShadow:props => props.textShadow || themeGet("shadows.lightGray"),
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
export const HM = styled("h4")`
    :hover {
      text-decoration:${props => props.hoverUnderline && "underline"};
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

export const HeaderMini = styled(HM)({
    width:"100% ",
    textTransform:"capitalize",
    fontWeight:"bold",
    color:"dark",
    cursor:props => props.clickable ? "pointer" : "inherit",
    textShadow:props => props.textShadow || themeGet("shadows.lightGray"),
    wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal"

    }
)

HeaderMini.defaultProps = {
  fontSize: ["18px", "18px", "20px", "22px", "24px", "26px"]
}
SubHeaderText.defaultProps = {
  fontSize: ["20px", "20px", "22px", "26px", "28px", "30px"]
}
HeaderText.defaultProps = {
  fontSize: ["24px", "24px", "28px", "32px", "34px", "36px"]
}
export const Paragraph = styled('p')({
    overflowY: props => props.textHidden && "hidden",
    textOverflow: props => props.textHidden && "ellipsis",
    wordSpacing: props => props.wordSpacing ? props.wordSpacing : "normal",
    textAlign:"justify"
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