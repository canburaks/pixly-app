/* eslint-disable */
import React, { useState } from 'react'

import { useQuery } from "@apollo/react-hooks";
import { ACTIVE_DIRECTORS } from "../../functions/query";

import { rgaPageView, Head, MidPageAd, HomePageFeedAd } from "../../functions/analytics"
import { GridBox, GridItem } from "../../components/GridBox" 
import { useAuthCheck } from "../../functions/hooks";
import JoinBanner from "../../components/JoinBanner.js"
//import { MaterialCard } from "../../comp-material/Card"
import {
    DirectorCard,HiddenHeader, Loading, Hr,
    PageContainer, ContentContainer,Text,
    HeaderText, Error, Grid, ActiveDirectorCard
} from "../../styled-components"


const DirectorList = (props) =>{
    //console.log(props)
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
                <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[2,2,3]}>
                    {props.directors.map(director => (
                        <ActiveDirectorCard item={director} key={director.id}  />
                    ))}
                </Grid>                

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