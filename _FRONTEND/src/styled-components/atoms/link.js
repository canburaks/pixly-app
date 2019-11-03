import React from 'react';
import { Link } from "react-router-dom"
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import { UnderlineEffect, Box, HiddenSpan } from "../index"
import { hideText } from 'polished'


const LinkNoFollow = ({ to,link, className, children, follow }) => <Link rel={!follow ? "nofollow" : ""}  className={className} to={link || to} >{children}</Link>


export const DirectorLink = ({director, ...props}) => <NewLink to={`/person/${director.slug}`}  mr={[0]} textShadow={"textDark"} {...props}><UnderlineEffect>{director.name}</UnderlineEffect>{props.extra}</NewLink>

const StateLink = (props) => <Link  {...props} to={{pathname:props.link, state:{...props.state}}}  />
export const StatefullLink = styled(StateLink)`
  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${border}
  ${position}
  ${typography}
`


export const DirectorLinks = React.memo(({directors, ...props}) =>(
    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" {...props}>
        {directors && directors.length > 0 && directors.map((director, index) => (
            <DirectorLink director={director} key={director.slug + index} extra={index!== directors.length - 1 ? "," : ""} ml={index !==0 && "8px"} />
        ))}
    </Box>
))

export const CoverLink = (props) => (
    <NewLink 
        to={props.link || props.to}  
        position={"absolute"}
        top={0} left={0} right={0} bottom={0}
        zIndex={3}
        {...props} 
    >
      {props.text && <HiddenSpan>{props.text}</HiddenSpan>}
    </NewLink>
)

export const NewLink = styled(LinkNoFollow)`
  color: unset !important;
  color:${props => props.color ? props.color : themeGet("colors.light")};
  :hover {
      background-color:${props => props.hoverBg && props.hoverBg};
      color:${props => props.hoverColor && props.hoverColor};
      box-shadow:${props => props.hoverShadow && props.hoverShadow}
  };
  text-decoration:initial;
  transition: ${themeGet("transitions.medium")};
  ${props => props.hidden && hideText()}

  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${border}
  ${position}
  ${typography}
`
export const OuterLink = styled.a.attrs(() => ({rel:"nofollow noopener", target:"_blank"}))`
  :hover { 
    text-decoration: ${props => props.hoverUnderline && "underline"}
  };
  text-decoration:initial;
  text-align:center;
  display:flex;
  flex-direction:row;
  align-items:center;
  transition: ${themeGet("transitions.medium")};
  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${border}
  ${position}
  ${typography}
`