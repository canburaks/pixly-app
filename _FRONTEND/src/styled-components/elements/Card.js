import React from "react";
import { useMemo } from 'react';

import { Text, Paragraph, 
        Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
        Box, SuperBox, AbsoluteBox, 
        NewLink, Input, HiddenText,
        TextSection, HeaderMini, FlexBox,LinkButton,
        BookmarkMutation, RatingMutation,TagBox,
        ImdbRatingIcon, YearClockIcon, 
} from "../index"

export const MovieRichCard = (props) => {
    return (
    <DarkCard 
        src={props.item.coverPoster || props.item.poster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show More"}
    >
        <FlexBox justifyContent="space-between" alignItems={"center"} mb={[1]} mt={[2]} width="100%">
            {props.item.imdbRating && 
                <ImdbRatingIcon 
                    rating={props.item.imdbRating} 
                    size={"22px"} 
                    fill="#fac539"
                />}
            {props.item.year && 
                <YearClockIcon fill="white"
                    year={props.item.year} 
                    size={"22px"} 
                    ml={[2,2,2,2,3]}
                />}
        </FlexBox>

        {/* MUTATIONS */}
        <FlexBox justifyContent="space-between" alignItems={"center"} mb={[1]} mt={[2]} width="100%">
            <RatingMutation  item={props.item} />
            <BookmarkMutation id={props.item.id} active={props.item.isBookmarked} size={"28px"}/>
        </FlexBox>
        <TagBox tags={props.item.tags} num={8} />
        <Text mt="auto"
            fontSize={["13px", "13px", "13px","14px", "14px", "16px"]}
            color="light"
            my={[2]}
            >
            {props.item.summary.length > 250 ? props.item.summary.slice(0,250) + "..." : props.item.summary}
        </Text>

    </DarkCard>
    )
}

export const DarkCard = props => (
    <FlexBox 
        flexDirection="column" justifyContent="flex-start" 
        width={"100%"} height={"100%"} 
        bg="dark" borderRadius={"8px"}
        boxShadow="card"
        hoverShadow={"hover"}
    >
        <ImageCard
            src={props.src} 
            link={props.link}
            ratio={props.ratio || 0.5625} 
            borderRadius={0}
            borderTopLeftRadius={"8px"}
            borderTopRightRadius={"8px"}
            boxShadow="card"
            textShadow="textLight"
        />
        <FlexBox 
            flexDirection="column" justifyContent="flex-start" 
            width={"100%"} height="auto" 
            flexGrow={1}
            px={[2,2,2,2,3]} pt={[3]} pb={[1]}  
        >
            {props.header && <HeaderMini fontWeight="bold" m={0} my={[2]} color="light" fontSize={["18px", "18px", "22px"]}>{props.header}</HeaderMini> }
            {props.text && <Text color="light" my={[2,2,3]} fontSize={props.textSize}>{props.text}</Text>}
            {props.children}
            {props.buttonText && <LinkButton link={props.link} text={props.buttonText} mt="auto" ></LinkButton>}
        </FlexBox>
    </FlexBox>
)


export const Card = (props) =>(
    <Box  display="flex" position="relative"
        flexDirection="column" justifyContent="flex-start" alignItems="stretch" 
        boxShadow="small" m={[0]}  borderRadius={props.borderRadius} {...props} 
    />
)


export const ImageCard = ({src, text, link, ratio, width,borderRadius, color, boxShadow, hoverShadow, fontSize, title, ...props}) => (
    <SuperBox ratio={ratio} width={width || "100%"} src={src} 
        title={title}
        hoverShadow={hoverShadow} boxShadow={boxShadow} 
        borderRadius={borderRadius || 0}
        {...props}
    > 
        <HeaderMini fontSize={fontSize}
            color={color} fontWeight="bold" 
            position="absolute" left="8px" 
            bottom="8px" textShadow={props.textShadow}
        >
            {text}
        </HeaderMini>
        <NewLink to={link} hidden position="absolute" width={"100%"} height="100%" top="0" left="0">
        {props.hiddentext ? props.hiddentext : text}
        {/*props.hiddentext && <HiddenText>{props.hiddentext}</HiddenText>*/}
        </NewLink>
    </SuperBox>
)



ImageCard.defaultProps = {
    color: "light",
    width: "100%",
    borderRadius: "8px",
    fontSize: "m",
}

export const MosaicCard = ({ images }) => (
    <SuperBox
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
    </SuperBox>
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