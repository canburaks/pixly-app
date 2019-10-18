import React from "react";
import { useMemo } from 'react';

import { Text, Paragraph, HeaderMini,
        Image, ImageShim, //AspectRatioImage, 
        Box, FlexBox,
        TextSection, Card, ImageCard, AspectRatioCard, MosaicCard,DarkCard,
        NewLink, Input, LinkButton, ImdbRatingIcon, YearClockIcon
} from "../index"

export const MovieInformationCard = (props) => (
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


export const RecommendationCard = (props) => (
    <DarkCard 
        src={props.item.coverPoster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
        headerSize={[]}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show More"}
    >
        <FlexBox justifyContent="space-between" alignItems={"center"} mb={[1]} mt={[2]} width="100%">
            <ImdbRatingIcon rating={props.item.imdbRating} size={["18px", "18px", "24px"]} fill="#fac539"/>
            <YearClockIcon year={props.item.year} size={["18px", "18px", "24px"]} ml={[2,2,2,2,3]}/>
        </FlexBox>
        <Text
            fontSize={["13px", "13px", "13px","14px", "14px", "16px"]}
            color="light"
            my={[2]} mb={[3]}
            >
            {props.item.summary.length > 100 ? props.item.summary.slice(0,100) + "..." : props.item.summary}
        </Text>

    </DarkCard>

)
export const MovieSimilarCard = (props) => (
    <DarkCard
        src={props.item.coverPoster || props.item.poster}
        link={`/movie/${props.item.slug}`}
        header={props.item.name}
    >
        {props.children}
    </DarkCard>
)

export const TopicCoverCard = (props) => (
    <DarkCard 
        src={props.item.coverPoster}
        link={`/topic/${props.item.slug}`}
        text={props.item.summary}
        textSize={["13px", "13px", "13px","14px", "14px", "16px"]}
        buttonText={"Show Me"}
    />
)



export const DirectorCard = (props) => (
    <ImageCard 
        src={props.item.poster}
        text={props.item.name}
        text={!props.notext ? props.item.name : null}
        link={`/person/${props.item.slug}`}
        hiddentext={props.item.name}
        ratio={1.67} 
        borderRadius={"8px"}
        boxShadow="card"
        hoverShadow 
        {...props}
    />
)

export const CrewCard = (props) => (
    <Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card" hoverShadow maxWidth={"200px"}>
        <ImageCard
            src={props.crew.person.poster} 
            link={`/person/${props.crew.person.slug}`}
            hiddentext={props.crew.person.name}

            ratio={1.5}
            borderRadius={"8px"}
        />
        <TextSection minHeight={20} 
            header={props.crew.person.name}
            headerSize="s"
            text={props.crew.character}
            textSize="xs" 
            />
    </Card>
)


export const ListCard = (props) => (
    <Card width={props.width || "100%"} p={"0px"}  height={props.height || "100%"} boxShadow="card" bg="white" hoverShadow borderRadius={"8px"} 
        justifyContent="space-between"

    >
        <ImageCard
            src={props.item.coverPoster} 
            link={`/list/${props.item.slug}/1`}
            hiddentext={props.item.name}
            ratio={0.41}
            borderRadius={"6px"}
        />
    </Card>
)

export const MovieCoverCard = (props) => (
    <ImageCard
        src={props.item.coverPoster || props.item.poster} 
        text={!props.notext ? props.item.name : null}
        link={`/movie/${props.item.slug}`}
        hiddentext={props.item.name}
        ratio={props.ratio || 0.5625} 
        borderRadius={"8px"}
        boxShadow="card"
        hoverShadow
        {...props}
    />
)


export const MoviePosterCard = (props) => (
    <ImageCard
        src={props.item.poster} 
        text={!props.notext ? props.item.name : null}
        link={`/movie/${props.item.slug}`}
        hiddentext={props.item.name}
        ratio={props.ratio || 1.6} 
        borderRadius={"8px"}
        boxShadow="card"
        hoverShadow
        {...props}
    />
)


export const MosaicListCard = (props) => (
    <Card width={"100%"} p={"1px"}  height={"100%"} boxShadow="card" hoverShadow borderRadius={"8px"}>
        <MosaicCard images={props.list.image} />
        <TextSection minHeight={40} header={props.list.name}  />
        <NewLink to={`/list/${props.list.slug}/1`} position="absolute" width={"100%"} height="100%" top="0" left="0" zIndex={6} />
    </Card>
)
// Original
/*


export const MovieSimilarCard2 = (props) => (
    <FlexBox 
        flexDirection="column" justifyContent="flex-start" 
        width={"100%"} height={"auto"} 
        bg="dark" borderRadius={"8px"}
        boxShadow="card"
        hoverShadow={"hover"}
    >
        <ImageCard
            src={props.item.coverPoster || props.item.poster} 
            link={`/movie/${props.item.slug}`}
            hiddentext={props.item.name}
            ratio={props.ratio || 0.5625} 
            borderRadius={0}
            borderTopLeftRadius={"8px"}
            borderTopRightRadius={"8px"}
            boxShadow="card"
            textShadow="textLight"
            {...props}
        />
        <FlexBox p={[2,2,3]} pb={[1]} flexDirection="column" justifyContent="flex-start" width={"100%"}>
            <Text color="light" fontWeight="bold">{props.item.name}</Text>
            {props.children}
        </FlexBox>

    </FlexBox>
)

    <Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card" hoverShadow>
        <ImageCard
            src={props.item.coverPoster || props.item.poster} 
            link={`/movie/${props.item.slug}`}
            hiddentext={props.item.name}
            ratio={props.ratio || 0.5625} 
            borderRadius={"8px"}
        />
        <TextSection minHeight={20} 
            header={props.item.name}
            headerSize="s"
            />
        {props.children}
    </Card>


export const DirectorCard2 = React.memo((props) => (
    <NewLink rel="nofollow" to={`/person/${props.person.slug}`}>
        <ImageBox src={props.person.poster} borderRadius={8} 
            width={1} height={1} minWidth={150} maxWidth={163} maxHeight={270} minHeight={250}
            boxShadow="small" {...props}
            >
            <Text fontSize="m" color="light" fontWeight="bold" position="absolute" left="8px" bottom="8px" >{props.person.name}</Text>
        </ImageBox>
    </NewLink>
))



//export const DirectorCard3 = React.memo((props) => (
//    <AspectRatioImage ratio={1/2} width={350} src={props.person.poster} {...props}>
//    </AspectRatioImage>
//))

*/