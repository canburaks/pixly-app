import React from "react";
import { useMemo } from 'react';

import { Text, Paragraph, 
        Image, ImageShim, //AspectRatioImage, 
        Box, ImageBox, AspectRatioBox,  AspectRatioImageBox,
        NewLink, Input, 
} from "../atoms"

import { TextSection, Card, ImageCard, AspectRatioCard, MosaicCard } from "../elements"



export const MosaicListCard = (props) => (
    <Card width={"100%"} p={"1px"}  height={"100%"} boxShadow="card" hoverShadow borderRadius={"8px"}>
        <MosaicCard images={props.list.image} />
        <TextSection minHeight={40} header={props.list.name}  />
        <NewLink to={`/list/${props.list.slug}/1`} position="absolute" width={"100%"} height="100%" top="0" left="0" zIndex={6} />
    </Card>
)

export const TopicCoverCard = (props) => (
    <ImageCard
        src={props.item.coverPoster || props.item.poster} 
        text={!props.notext ? props.item.name : null}
        link={`/topic/${props.item.slug}`}
        linktext={props.item.name}
        ratio={props.ratio || 0.5625} 
        borderRadius={"8px"}
        boxShadow="card"
        hoverShadow
        {...props}
    />
)

export const DirectorCard = (props) => (
    <ImageCard 
        src={props.item.poster}
        text={props.item.name}
        link={`/person/${props.item.slug}`}
        linktext={props.item.name}
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
            linktext={props.crew.person.name}

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
            linktext={props.item.name}
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
        linktext={props.item.name}
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
        linktext={props.item.name}
        ratio={props.ratio || 1.6} 
        borderRadius={"8px"}
        boxShadow="card"
        hoverShadow
        {...props}
    />
)
export const MovieSimilarCard = (props) => (
    <Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card" hoverShadow>
        <ImageCard
            src={props.item.coverPoster || props.item.poster} 
            link={`/movie/${props.item.slug}`}
            linktext={props.item.name}
            ratio={props.ratio || 0.5625} 
            borderRadius={"8px"}
        />
        <TextSection minHeight={20} 
            header={props.item.name}
            headerSize="s"
            />
        {props.children}
    </Card>
)

// Original
/*
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