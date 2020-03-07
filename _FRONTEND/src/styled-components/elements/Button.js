import React from "react";
import { useMemo, useCallback } from 'react';

import { Text, Paragraph, 
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, AbsoluteBox, Spinner, FlexBox,
        NewLink, Input, Button, BubbleButton
} from "../"

import { TextSection } from "./TextSection"
import { useScrollPosition } from "../../functions/hooks"
import { CoverLink } from "../atoms";




export const ActionButton = ({onClick,isLoading, borderRadius="6px", ...props}) => (
    <Button 
        borderRadius={borderRadius}
        minWidth={"120px"}
        maxwidth={"160px"}
        height={["50px"]}
        fontSize={[12,14,14,16]}
        bg="shark"
        color="light"
        display="flex"
        justifyContent="center"
        alignItems="center"
        {...props}
    >
        {console.log("action button isLoading", isLoading)}
        {isLoading ? <Spinner /> : props.children}
    </Button>
)

export const LinkButton = (props) => (
    <FlexBox type="button" alignItems="center" justifyContent="center"
        fontSize={[12,14]} fontWeight="bold"
        bg="transparent" color={"light"} 
        alignSelf="center"
        px={[4,4,5]} py={[2]} 
        my={[2]} mt={"auto"}
        //hoverBorderColor="transparent"
        border={"1px solid"} borderColor="light" 
        borderRadius={"4px"}
        {...props}
    >
        <CoverLink link={props.link} follow={props.follow} to={props.to} />
            {props.text}
            {props.children}
    </FlexBox>
)


export const SearchButton = ({onClick, borderRadius="6px", ...props}) => (
        <Button 
            borderRadius={borderRadius}
            minWidth={"40px"}
            maxwidth={"80px"}
            fontSize={[12,14,14,16]}
            bg="shark"
            color="light"
            {...props}
        >
            {props.children}
        </Button>
)

export const ScrollButton = ({onClick, borderRadius="50%", ...props}) => (
    <Box 
        position="fixed" left={["32px"]} bottom="32px" 
        width={[56]}
        height={[56]}
        onClick={onClick}
        borderRadius={borderRadius}
        zIndex={2}
        {...props}
    >
        <BubbleButton borderRadius={borderRadius} bg="#f1f1f1" p={[1]}>{props.children}</BubbleButton>
    </Box>
)

export const ScrollTopButton = React.memo(() => {
    const scrollPosition = useScrollPosition()
    const show = scrollPosition < 300 ? false : true
    const handleScroll = useCallback(() => window.scrollTo({top:0, left:0, behavior:"smooth"}, []))
    const visibility = {visibility: show ? "visible" : "hidden"}
    
    return <ScrollButton onClick={handleScroll} style={visibility}><ChevronsUp /></ScrollButton>
})


const ChevronsUp = ({size=40, color="#000000"}) => (
<svg xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
>
    <path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/>
</svg>
)