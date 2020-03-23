import React from "react";
import { useState, useContext, useMemo, useEffect, useRef } from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, HeaderMini, NewLink, Paragraph,
    TagText,HtmlBox,SubHeaderText, Image,CoverLink, Ul, Li, Span,
    LikeMutation, BookmarkMutation, TagBox
} from "../index"
import { SocialBox } from "../others"

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
        <TagBox tags= {props.item.tags.filter(tag => tag.genreTag === true)} />
        {/*console.log("movie cover")
        <RatingMutation  item={props.item}  />
        */}
    </TopPanelCoverElement>
)


export const TopPanelCoverElement = React.memo((props) => (
    <SuperBox src={props.item.largeCoverPoster || props.item.coverPoster || props.item.poster} 
        position={"relative"} 
        top={0} left={0} maxWidth={["100%"]}
        height={["60vw","60vw", "50vw"]} maxHeight={"90vh"}
        boxShadow="card" 
        zIndex={3}
        overflow="hidden"
    >   
        <SocialBox size={24} item={props.item} position="absolute" top="20px" right="20px" />
        {props.Actions && <props.Actions item={props.item} authStatus={props.authStatus} />}
        {props.Trailer && <props.Trailer />}

        {/*console.log("top panel", props.item.name) */}
        <Box position={"absolute"} 
            pl={[2,2,3]} py={[1,1,2]} pt={[1,1,2]} 
            left={0} bottom={0} 
            width={"100%"} height={"auto"} maxHeight={"50%"}
            darken={props.darken}
            bg={"rgba(0,0,0, 0.5)"}
        >
            <Span 
                color="lightDark1" textShadow={"textDark"} 
                fontSize={["20px", "20px", "24px", "30px","34px"]} 
                fontWeight="bold"
            >
                {props.header}
            </Span>

            {props.Header && <props.Header item={props.item} authStatus={props.authStatus} />}
            {props.subheader && <SubHeaderText color="lightDark1" textShadow="dark" fontSize={[14, 14, 18, 20, 22]} fontWeight="500">{props.subheader}</SubHeaderText>}
            {/*console.log("il", props.isLargeScreen)*/}
            {(props.text && props.isLargeScreen) && <Paragraph color="lightDark1" textShadow={"textDark"} fontSize={[14, 14, 16, 16,18]}  maxWidth={"95%"}>{props.text}</Paragraph>}
            {props.children}
        </Box>

    </SuperBox>
), (prevProps, nextProps) => (prevProps.isLargeScreen === nextProps.isLargeScreen && prevProps.item.coverPoster === nextProps.item.coverPoster))
