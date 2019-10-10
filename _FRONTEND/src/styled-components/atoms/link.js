import React from 'react';
import { Link } from "react-router-dom"
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import styled from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { UnderlineEffect, Box } from "../index"


const LinkNoFollow = ({ to, className, children }) => <Link rel="nofollow" className={className} to={to} >{children}</Link>


export const DirectorLink = ({director, ...props}) => <NewLink to={`/person/${director.slug}`}  mr={[0]} textShadow={"textDark"} {...props}><UnderlineEffect>{director.name}</UnderlineEffect>{props.extra}</NewLink>

export const DirectorLinks = React.memo(({directors, ...props}) =>(
    <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" {...props}>
        {directors && directors.length > 0 && directors.map((director, index) => (
            <DirectorLink director={director} key={director.slug + index} extra={index!== directors.length - 1 ? "," : ""} ml={index !==0 && "8px"} />
        ))}
    </Box>
))



export const NewLink = styled(LinkNoFollow)`
  transition: ${themeGet("transitions.medium")};
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