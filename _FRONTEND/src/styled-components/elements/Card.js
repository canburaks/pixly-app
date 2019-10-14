import React from "react";
import { useMemo } from 'react';

import { Text, Paragraph, 
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, ImageBox, AbsoluteBox, 
        NewLink, Input, HiddenText,
        TextSection, HeaderMini, 
} from "../index"





export const Card = (props) =>(
    <Box  display="flex" position="relative"
        flexDirection="column" justifyContent="flex-start" alignItems="stretch" 
        boxShadow="small" m={[0]}  borderRadius={props.borderRadius} {...props} 
    />
)
// Does not allow overflow
export const AspectRatioCard = (props) => (
    <ImageBox {...props} src={props.src} zIndex={1} pb={`${props.ratio * 100}%`} overflow="hidden" 
        borderRadius={props.borderRadius} 
        
    >
        {props.children}
    </ImageBox>
)


export const ImageCard = ({src, text, link, ratio, width,borderRadius, color, boxShadow, hoverShadow, fontSize, title, ...props}) => (
    <AspectRatioCard ratio={ratio} width={width || "100%"} src={src} 
        title={title}
        hoverShadow={hoverShadow} boxShadow={boxShadow} 
        borderRadius={borderRadius}
    > 
        <HeaderMini fontSize={fontSize}
            color={color} fontWeight="bold" 
            position="absolute" left="8px" 
            bottom="8px" textShadow={"dark"}
        >
            {text}
        </HeaderMini>
        <NewLink to={link} position="absolute" width={"100%"} height="100%" top="0" left="0">
        {props.linktext && <HiddenText>{props.linktext}</HiddenText>}
        </NewLink>
    </AspectRatioCard>
)

ImageCard.defaultProps = {
    color: "light",
    width: "100%",
    borderRadius: "8px",
    fontSize: "m",
}

export const MosaicCard = ({ images }) => (
    <AspectRatioCard
        width={"100%"} p={"1px"}  height={"100%"}
        ratio={1/1.5}
        borderRadius={"8px"}
        borderBottom="2px solid rgba(0,0,0, 0.7)"
    >
        {images.map((url, index) => (
            <Image src={url} key={index}
                position="absolute" 
                top={0} bottom={0}
                left={`${index * 20}%`}
                zIndex={5-index} 
                width={`40%`} height={"100%"} 
                borderRadius={"4px"} boxShadow="mosaic"
            />
    ))}
    </AspectRatioCard>
)

//export const DirectorCard3 = React.memo((props) => (
//    <AspectRatioImage ratio={1/2} width={350} src={props.person.poster} {...props}>
//    </AspectRatioImage>
//))

/*


export const AspectRatioImageBoxCard = React.memo((props) => props.nowrap 
?(
    <ImageBox {...props} src={props.src} pb={`${props.ratio * 100}%`} overflow="hidden" borderRadius={props.borderRadius} >
        {props.children}
    </ImageBox>
)
:(
    <Box width={props.width} height={"auto"} m={props.m} {...props}>
        <ImageBox src={props.src} pb={`${props.ratio * 100}%`} overflow="hidden" borderRadius={props.borderRadius} >
            {props.children}
        </ImageBox>
    </Box>
))

*/