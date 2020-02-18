import React from 'react';
import { Link } from "react-router-dom"
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'
import { UnderlineEffect, Box, HiddenSpan } from "../index"
import { hideText } from 'polished'
import { HashLink as HLink } from 'react-router-hash-link';

export const HashLink = styled(HLink).attrs(props => props.rel ? {rel:props.rel} : {rel:"nofollow"} )`
  color: unset !important;
  color:${props => props.color ? props.color : themeGet("colors.light")};
  font-family: ${props => props.fontFamily ? props.fontFamily : themeGet("fonts.paragraph")};
  :hover {
      background-color:${props => props.hoverBg && props.hoverBg};
      color:${props => props.hoverColor && props.hoverColor};
      box-shadow:${props => props.hoverShadow && props.hoverShadow};
      text-decoration:${props => props.hoverUnderline && "underline"};
  };
  text-decoration:initial;
  transition: ${themeGet("transitions.medium")};
  ${props => props.hidden && hideText()};
  ${flexbox}
  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${border}
  ${position}
  ${typography}
`

const LinkNoFollow = ({ to,link, className, children, follow,target, title, ...props }) => (
	<Link 
    target={target}
		rel={(follow===false) ? "nofollow" : null}  
		className={className} 
		to={link || to} 
    title={title}

  >
		{children}
	</Link>)


export const DirectorLink = ({director, ...props}) => (
	<NewLink 
      to={`/person/${director.slug}`}  
      textShadow={"textDark"} 
      px={0}
      mr={[0]} 
      hoverUnderline
      {...props}
    >
      {director.name}
      {props.extra}
    </NewLink>)

const StateLink = (props) => <Link  {...props} to={{pathname:props.link, state:{...props.state}}}  rel="nofollow"/>
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
        className="cover-link"
        {...props} 
    >
      {props.text && <HiddenSpan>{props.text}</HiddenSpan>}
    </NewLink>
)

export const NewLink = styled(LinkNoFollow)`
  color: unset !important;
  color:${props => props.color ? props.color : themeGet("light")} !important;
  font-family: ${props => props.fontFamily ? props.fontFamily : themeGet("fonts.paragraph")};
  :hover {
      background-color:${props => props.hoverBg && props.hoverBg};
      color:${props => props.hoverColor && props.hoverColor};
      box-shadow:${props => props.hoverShadow && props.hoverShadow};
      text-decoration:${props => props.hoverUnderline && "underline"};
      opacity:1;
  };
  text-decoration:${props => (props.underline || props.textUnderline) ? "underline" : "initial"};
  transition: ${themeGet("transitions.fast")};
  lineHeight:inherit;
  ${props => props.hidden && hideText()}
  ${flexbox}
  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${border}
  ${position}
  ${typography}
`
export const CoverLink2 = () => <NewLink position="absolute" left={0} top={0}  right={0} bottom={0} {...props} />

export const OuterLink = styled.a.attrs(({follow=true, ...props}) => (
  follow ? {rel:"noopener", target:"_blank"} : {rel:"nofollow noopener", target:"_blank"}))`
  color: unset !important;
  color:${props => props.color ? props.color : themeGet("colors.light")};
  font-family: ${props => props.fontFamily ? props.fontFamily : themeGet("fonts.paragraph")};
  :hover {
      background-color:${props => props.hoverBg && props.hoverBg};
      color:${props => props.hoverColor && props.hoverColor};
      box-shadow:${props => props.hoverShadow && props.hoverShadow};
      text-decoration:${props => props.hoverUnderline && "underline"};
      opacity:1;
  };
  text-decoration:${props => (props.underline || props.textUnderline) ? "underline" : "initial"};
  transition: ${themeGet("transitions.fast")};

  ${color}
  ${space}
  ${shadow}
  ${layout}
  ${border}
  ${position}
  ${typography}
`