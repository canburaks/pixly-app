/* eslint-disable */
import React, { useState } from 'react'

import { useQuery } from "@apollo/react-hooks";
import { ACTIVE_DIRECTORS } from "../../functions/query";

import { rgaPageView, Head, MidPageAd, HomePageFeedAd, FeedMobileTopicPageAd, MoviePageAd } from "../../functions/analytics"
import { GridBox, GridItem } from "../../components/GridBox" 
import { useAuthCheck, useValues } from "../../functions/hooks";
import JoinBanner from "../../components/JoinBanner.js"
//import { MaterialCard } from "../../comp-material/Card"
import {
    DirectorCard,HiddenHeader, Loading, Hr,
    PageContainer, ContentContainer,Text,
    HeaderText, Error, Grid, ActiveDirectorCard
} from "../../styled-components"


const DirectorList = (props) =>{
    const firstPart = props.directors.slice(0, 6)
    const secondPart = props.directors.slice(6, 12)
    const thirdPart = props.directors.slice(12, 18)
    const fourthPart = props.directors.slice(18, 50)
    const isMobile = window.innerWidth < 480;
    const ResponsiveAd1 = isMobile ? FeedMobileTopicPageAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileTopicPageAd : MidPageAd
    const ResponsiveAd3 = isMobile ? FeedMobileTopicPageAd : MoviePageAd
    return(
        <PageContainer>
            <Head
                title={"Director Filmographies, Favourite Films, Interviews and Reviews"}
                description={"Famous directors' filmographies, favourite films, Interviews with directors, " +
                    "video-essays, conversations with directors and many video content."}
                keywords={`Famous Directors List` }
                canonical={`https://pixly.app/directors/1`}
            />
            
            <ContentContainer>
                <HeaderText mt={[4,4,5]}>Director Filmographies, Favourite Films, Interviews and Reviews</HeaderText>
                <Text>
                    We are continously collecting cinema content about famous directors.
                    Besides the filmographies of them, we are trying to gather their 
                    favourite film lists from trusted sources and video content about them.
                    You will find many video content that are collected from internet by us. 
                    You'll see their cinematic techniques, hidden details and many video essays 
                    about them.
                 </Text>
                 <Hr/>
                <ul>
                <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                    {firstPart.map(director => (
                        <ActiveDirectorCard item={director} key={director.id}  />
                    ))}
                </Grid>      

                <ResponsiveAd1 />
                
                <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                    {secondPart.map(director => (
                        <ActiveDirectorCard item={director} key={director.id}  />
                    ))}
                </Grid>  
                
                <ResponsiveAd2 />

                <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                    {thirdPart.map(director => (
                        <ActiveDirectorCard item={director} key={director.id}  />
                    ))}
                </Grid>  
                <ResponsiveAd3 />
                <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                    {fourthPart.map(director => (
                        <ActiveDirectorCard item={director} key={director.id}  />
                    ))}
                </Grid>           
            </ul>
            </ContentContainer>
        </PageContainer>
    );
};

const ActiveDirectorQuery = (props) =>{
    const {loading, error, data} = useQuery(ACTIVE_DIRECTORS, { partialRefetch:true})
    if (loading) return <Loading />
    if (error) return <Error />
    if (data){
        return <DirectorList directors={data.activeDirectors} {...props} />
    }

}

export default ActiveDirectorQuery;