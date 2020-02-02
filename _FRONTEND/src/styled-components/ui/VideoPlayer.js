import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect, useRef } from "react"
import { withRouter, Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


import { useWindowSize, useAuthCheck, useClientWidth, useClientHeight, useValues,
    
} from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    SIMILAR_FINDER, LIST_BOARD, MoviePageAd,FeedMobileTopicPageAd
} from "../../functions"

import { GlobalContext } from "../..";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, FlexBox, RegularInput, MovieAutoComplete, SuperBox, CoverLink, TagBox,
    NewLink, Image, SubHeaderText, LinkButton, HeaderMini, Span, Box,Iframe, Hr, Section,MessageBox,
    PaginationBox, Dl,Dt,Dd, Em
} from "../"
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { Plus } from 'css-spinners-react'
import { LazyLoadComponent } from 'react-lazy-load-image-component';

export const VideoPlayer = ({link, ...props}) =>{
    
    const src = getYoutubeUrl(link)
    console.log("src",link, src)
    return (
        <Box width="80vw" maxWidth="100%" height="45vw" minHeight={["300px"]}  
            position="relative" 
            bg="transparent"
            overflow="hidden"
        >
            <Iframe id="player"
                src={src}
                title="youtube player"
                theme="light" color="red"
                width="100%" height="auto" minHeight="250px"
                controls="0"
                rel="0" m={0}
                frameBorder="0" allowFullScreen={true}
                {...props}
            />
        </Box>
    )
}
function getYoutubeUrl(link) {
    const origin = window.location.href
    if (link && link.length > 0){
        const ytid = link.split("?v=")[1]
        return `https://www.youtube.com/embed/${ytid}?rel=0&modestbranding=1&autohide=1&enablejsapi=1&origin=${origin}`
    }
    return null
}
