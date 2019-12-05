/* eslint-disable */
import React, { useState } from 'react'

import { useQuery } from "@apollo/react-hooks";
import { ACTIVE_DIRECTORS } from "../../functions/query";

import { rgaPageView, Head, DirectorPageAd } from "../../functions/analytics"
import { GridBox, GridItem } from "../../components/GridBox" 
import { useAuthCheck } from "../../functions/hooks";
import JoinBanner from "../../components/JoinBanner.js"
//import { MaterialCard } from "../../comp-material/Card"
import {
    DirectorCard,HiddenHeader, Loading, 
    PageContainer, ContentContainer,
    HeaderText, Error, Grid, ActiveDirectorCard
} from "../../styled-components"


const DirectorList = (props) =>{
    console.log(props)
    return(
        <PageContainer>
            <Head
                description={"Filmographies, Favourite Films of some directors like: "}
                title={"Pixly - Directors Collection"}
                keywords={`Famous Directors List` }
                canonical={`https://pixly.app/directors/1`}
            />
            
            <ContentContainer>
                <HeaderText>Directors Collection</HeaderText>
                <Grid columns={[1,1,1,1,2]} py={[4]} gridColumnGap={[2,2,3]}>
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