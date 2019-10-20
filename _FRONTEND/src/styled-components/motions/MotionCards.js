import React from "react";
import { useMemo } from 'react';
import { motion } from "framer-motion"
import { Text, Paragraph, HeaderMini,
        Image, ImageShim, //AspectRatioImage, 
        Box, FlexBox,
        TextSection, Card, ImageCard, AspectRatioCard, MosaicCard,DarkCard,
        NewLink, Input, LinkButton, ImdbRatingIcon, YearClockIcon, 
        BookmarkMutation, RatingMutation
} from "../index"




export const MovieMotionCard = (props) => {
    
    return (
    <DarkCard 
        src={props.item.coverPoster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show More"}
    >
        <FlexBox justifyContent="space-between" alignItems={"center"} mb={[1]} mt={[2]} width="100%">
            {props.item.imdbRating && 
                <ImdbRatingIcon 
                    rating={props.item.imdbRating} 
                    size={["18px", "18px", "24px"]} 
                    fill="#fac539"
                />}
            {props.item.year && 
                <YearClockIcon fill="white"
                    year={props.item.year} 
                    size={["18px", "18px", "24px"]} 
                    ml={[2,2,2,2,3]}
                />}
        </FlexBox>

        <Text
            fontSize={["13px", "13px", "13px","14px", "14px", "16px"]}
            color="light"
            my={[2]}
            >
            {props.item.summary.length > 100 ? props.item.summary.slice(0,100) + "..." : props.item.summary}
        </Text>

    </DarkCard>
    )
}