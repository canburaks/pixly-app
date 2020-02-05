import React from "react";
import { useState, useContext, useMemo, useEffect, useRef } from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, HeaderMini, NewLink, Paragraph,
    TagText,HtmlBox,SubHeaderText, Image,CoverLink, Ul, Li
} from "../index"
import { SocialBox } from "../others"
import parse, { domToReact } from 'html-react-parser';

import Highlight from 'react-highlight'




export const HtmlParagraph = ({ html, ...props }) => {
    //console.log(props)
    const options = {
        replace: domNode => {
        console.log(domNode)
        if (domNode.attribs && domNode.name ==="p"){
            return <Text width={"100%"} maxWidth={"100%"} opacity={0.8}
                        fontSize={["14px","14px", "16px"]} 
                        {...props}
                    >
                        {domToReact(domNode.children)}
                    </Text>}
        }}

    function parseTest(){
        if(html){
            //console.log("parser" , html)
            //console.log("topic: ", parseResult)
            return parse(html, options)
        }
    }
    return (
        <HtmlBox maxWidth={"100%"} width={"100%"}  overflowX="hidden" className="html-box">
            {parseTest()}
        </HtmlBox>
    )
}




export const HtmlContainer = ({ html, ...props }) => {
    const style = props.style || {
        p:{},
        h1:{},
        h2:{},
        h3:{},
        h4:{},
        ul:{},
        li:{}
    }
    //console.log(props)
    const options = {
        replace: domNode => {
            if (domNode.attribs && domNode.name ==="h1"){
                return (
                    <HeaderText  opacity={0.95}
                        mt={"32px !important"}
                        fontSize={["24px", "24px", "28px", "32px", "36px"]}
                        {...style.h1}
                    >
                        {domToReact(domNode.children)}
                    </HeaderText>)
            }
            else if (domNode.attribs && domNode.name ==="h2"){
                return <SubHeaderText opacity={0.9}
                            fontSize={["22px", "22px", "26px"]}  
                            mt={"32px !important"}
                            opacity={0.95}
                            {...style.h2}
                        >
                        {domToReact(domNode.children)}
                        </SubHeaderText>
            }

            else if (domNode.attribs && (domNode.name === 'h3' || domNode.name === 'h4')) {
                return <HeaderMini   opacity={0.85}
                            fontSize={["20px", "20px", "22px"]}
                            mt={"8px !important"} width="100%"
                            opacity={0.95}
                            {...style.h3}
                            {...style.h4}
                        >
                            {domToReact(domNode.children)}
                        </HeaderMini>
            }
            else if (domNode.attribs && domNode.name === 'p' ) {
                //const anchorchildren = domNode.children.filter(c => c.name==="a")
                //for (let i=0; i<domNode.children.length)

                //console.log("aaaa",anchorchildren)
                return <Text width={"100%"} opacity={0.8}
                            fontSize={["14px","14px", "16px"]} 
                            {...style.p}
                        >
                            {domToReact(domNode.children)}
                        </Text>
            }
            else if (domNode.attribs && domNode.name === 'ul' ) {
                return <Ul width={"100%"} opacity={0.8}
                            fontSize={["14px","14px", "16px"]} 
                            {...style.p}
                            {...style.ul}
                        >
                            {domToReact(domNode.children)}
                        </Ul>
            }
            else if (domNode.attribs && domNode.name === 'li' ) {
                return <Li width={"100%"} opacity={0.8}
                            fontSize={["14px","14px", "16px"]} 
                            {...style.p}
                            {...style.li}
                        >
                            {domToReact(domNode.children)}
                        </Li>
            }
            else if (domNode.attribs && domNode.name ==="code"){
                return <Highlight>{domToReact(domNode.children)}</Highlight>
            }
          }
    }

    function parseTest(){
        if(html){
            //console.log("parser" , html)
            //console.log("topic: ", parseResult)
            return parse(html, options)
        }
    }
    return (
        <HtmlBox maxWidth={"100%"} width={"100%"}  overflowX="hidden" {...props} className="html-box">
            {parseTest()}
        </HtmlBox>
    )
}
















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
