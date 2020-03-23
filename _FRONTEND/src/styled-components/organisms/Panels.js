import React from "react";
import { useMemo, useState } from 'react';
import {  useWindowSize, useValues } from "../../functions" 
import { Redirect } from "react-router-dom";


import { 
    Box, Text, HeaderMini, NewLink, TopPanelBackElement, TopPanelCoverElement,
    DirectorLink, DirectorLinks,FlexBox, TagBox,Image,
    LikeMutation,BookmarkMutation, RatingMutation, FollowMutation,
    UsersIcon, EyeIcon,UserIcon,PageContainer, production,
    GradientAnimationModal
} from "../index"

//import { ColorExtractor } from 'react-color-extractor'

const slugComparison = (prevProps, nextProps) => prevProps.item.slug === nextProps.item.slug

// in case of list is an director favorites, than director name will be link, otherwise normal name
const ListName = ({ item }) => <HeaderMini color="lightDark1" textShadow="dark" fontSize={[15, 15, 20, 22, 24]} fontWeight="800">{item.relatedPersons.length > 0 ? <><DirectorLink mr={[0]} director={item.relatedPersons[0]} />{item.name.split(item.relatedPersons[0].name)[1]}</> : item.name}</HeaderMini>


const MovieActions = (props) => (
<FlexBox position="absolute" top="20px" left={[1,1,2,2]} height="auto" minWidth="28px" flexDirection="column">
    <LikeMutation id={props.item.id} active={props.item.isFaved} mb={[2]}/>
    <BookmarkMutation id={props.item.id} active={props.item.isBookmarked} mb={[2]}/>
</FlexBox>
)

export const MovieCoverPanel = (props) => (
        <TopPanelCoverElement 
            item={props.item} 
            header={`${props.item.name.trim()} (${props.item.year})`} 
            Actions={MovieActions}
            darken={true}
            {...props}
        >
            <DirectorLinks directors={props.item.director}  color="lightDark1" fontSize="m" mb={[1,1,1,2]}/>
            
            {props.children}
        </TopPanelCoverElement>
)



const ListActions = (props) => (
<FlexBox position="absolute" top="20px" left={[1,1,2,2]} height="auto" minWidth="28px" flexDirection="column">
    <FollowMutation id={props.item.id} active={props.item.isFollowed}  />
    <UsersIcon hoverScale className="click"
        style={{width:30, height:30}} 
        onClick={() => (props.item.numFollowers > 0 ? window.scrollBy(0, 8000) : null)} 
        title="People who follows the Collection" 
    />
</FlexBox>
)
    
export const ListCoverPanel = React.memo(( props ) =>(
    <TopPanelBackElement src={props.item.coverPoster || props.item.poster} maxHeight={"80px"}>
    

    </TopPanelBackElement>
), (prevProps, nextProps) => (prevProps.item.slug === nextProps.item.slug  && prevProps.isLargeScreen === nextProps.isLargeScreen ))


export const Loading2 = () => (
    <PageContainer bg="transparent">
        {window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </PageContainer>
)
//export const Loading = ({text}) => <GradientAnimationModal text={text || "loading..."} zIndex={16}/>

export const Error = () => <Redirect to="/404" /> // production ? window.location.replace("https://pixly.app/404") : <Redirect to="/404" />

/*

export const MovieCoverPanel = React.memo(( props ) =>(
    <TopPanelBackElement src={props.movie.coverPoster || props.movie.poster} >
        <ImageBox src={props.movie.coverPoster || props.movie.poster} 
            position={"relative"} 
            width={"100%"} minHeight={["45vw","45vw", "40vw"]} maxHeight={"60vh"}
            boxShadow="large" 
            zIndex={3}
            borderRadius={8}
            overflow="hidden"
        >
            <Box position={"absolute"} pl={[2,2,3]} pb={[1,1,2]} left={0} bottom={0} width={"100%"} height={"auto"} bg={"rgba(0,0,0, 0.4)"}>
                <HeaderText color="lightDark1" textShadow={"textDark"} 
                    fontSize={[16, 16, 18, 22, 26]} 
                    fontWeight="bold">
                    {`${props.movie.name} - ${props.movie.year}`}
                </HeaderText>
                <DirectorLinks directors={props.movie.director} year={props.movie.year} color="lightDark1" fontSize="m" mb={[1,1,2,3]}/>
                <SocialBox size={24} item={props.movie} />
            </Box>

        </ImageBox>
    </TopPanelBackElement>
))
*/