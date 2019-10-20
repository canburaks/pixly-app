import React from "react";
import { useMemo } from 'react';
import { motion } from "framer-motion"
import { Text, Paragraph, HeaderMini,
        Image, ImageShim, //AspectRatioImage, 
        Box, FlexBox,
        TextSection, Card, ImageCard, AspectRatioCard, MosaicCard,DarkCard,
        NewLink, Input, LinkButton, ImdbRatingIcon, YearClockIcon, 
        BookmarkMutation, RatingMutation,TagBox
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