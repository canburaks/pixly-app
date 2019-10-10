import React from "react";
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import styled from 'styled-components'
import { themeGet } from '@styled-system/theme-get'

export const HeartIcon = ({size=40, color="#000000"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} 
        viewBox="0 0 24 24"
        fill="none" stroke={color} 
        strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"
        >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
)

export const BookmarkIcon = ({size=40, color="#000000"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" 
        width={size} height={size} 
        fill="none" stroke={color} 
        strokeWidth="2" strokeLinecap="square" strokeLinejoin="arcs"
        viewBox="0 0 24 24" 
    >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
)