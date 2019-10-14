import React from "react";
import { useMemo, useCallback } from 'react';

import { Text, Paragraph, 
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, ImageBox, AbsoluteBox, 
        NewLink, Input, Button, BubbleButton
} from "../atoms"

import { TextSection } from "./TextSection"
import { useScrollPosition } from "../../functions/hooks"


export const SearchButton = ({onClick, borderRadius="6px", ...props}) => (
        <Button 
            borderRadius={borderRadius}
            minWidth={"40px"}
            maxwidth={"80px"}
            fontSize={[12,14,14,16]}
            bg="shark"
            color="light"
        >
            {props.children}
        </Button>
)

export const ScrollButton = ({onClick, borderRadius="50%", ...props}) => (
    <Box 
        position="fixed" right={["30px", "40px", "50px"]} bottom="40px" 
        width={[60,60,70, 80]}
        height={[60,60,70, 80]}
        onClick={onClick}
        borderRadius={borderRadius}
        zIndex={2}
        {...props}
    >
        <BubbleButton borderRadius={borderRadius}>{props.children}</BubbleButton>
    </Box>
)

export const ScrollTopButton = React.memo(() => {
    const scrollPosition = useScrollPosition()
    const show = scrollPosition < 200 ? false : true
    const handleScroll = useCallback(() => window.scrollTo({top:0, left:0, behavior:"smooth"}, []))
    const visibility = {visibility: show ? "visible" : "hidden"}

    return <ScrollButton onClick={handleScroll} style={visibility}>Top</ScrollButton>
})