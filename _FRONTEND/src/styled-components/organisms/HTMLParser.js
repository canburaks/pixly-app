import React from "react";
import { useState, useContext, useMemo, useEffect, useRef } from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, HeaderMini, NewLink, Paragraph,
    TagText,HtmlBox,SubHeaderText, Image,CoverLink
} from "../index"
import { SocialBox } from "../others"
import parse, { domToReact } from 'html-react-parser';

import Highlight from 'react-highlight'

import ReactDOMServer from 'react-dom/server';


const logger = (html) => {
        //console.log("html nodes", html.childNodes)
        var box = document.createElement('div');
        box.innerHTML = html;
        //console.log("box-proto", box.__proto__)

        var x = box.childNodes;
        //console.log( x)
        return box;
        //  ↵↵
}

const parser = (el) => {

    //Elements and length
    const children = el.childNodes
    const len = children.length
    const tag = children.nodeName
    console.log("opening - child nodes: ", children,len)
    //children.forEach(c => console.log("foreach",c, c.length, c.nodeName))
    //console.log(len, "len")
    for(let i=0; i<len; i++){
        const child = children[i]
        console.log("for child: ", child, child.nodeName, child.childElementCount)
        if (child.nodeName==="P"){
            console.log("p found:", parser(child))
        }
        //console.log("loop ", children[i].childNodes)
        //console.log("i", children[i])
    }
    //children.map(c => console.log(c.nodeName, c.childElementCount))
} 

export const HtmlParser = ({ html, ...props }) => {
    // first parse string and get dom node
    const str2node = parseFromString(html)


    parser(str2node)

    return (
        <Box display="flex" flexDirection="column" dangerouslySetInnerHTML={{__html:logger(html) }}  {...props}>

        </Box>    
    )
}

const parseFromString = (html) => {
    const el = document.createElement('div');
    el.innerHTML = html
    return el
}
