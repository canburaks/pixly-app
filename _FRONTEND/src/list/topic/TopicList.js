import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"

import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_LIST_QUERY } from "../../functions/query"

import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, ListBoardAd, ListBoardAd2  } from "../../functions/analytics"


import { GlobalContext } from "../../App";
import JoinBanner from "../../components/JoinBanner.js"

import {
     ListCard, PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,
     TopicCoverCard, TextSection,
     Loading
 } from "../../styled-components"




const TopicList = React.memo((props) => {
    const topics = props.topics
    const authStatus = useAuthCheck()
    rgaPageView()
    return (
        <PageContainer>
            <Head
                title={"Pixly Topics"}
                description={"Collections of movie lists; Cannes, Berlin, Venice Film festival winner films. " + 
                            "Favorite film lists of Quentin Tarantino, David Fincher, Stanley Kubrick and Nuri Bilge Ceylan. " + 
                            "Curated film lists, Imdb 250 list, Pixly selected Movies "
                        }
                canonical={`https://pixly.app/topics`}
            />
            {!authStatus && <JoinBanner />}

            <ContentContainer>
            <HiddenHeader>Pixly Topics</HiddenHeader>
            
                <TextSection
                headerSize={["18px", "18px", "22px", "26px"]}
                textSize={["14px", "14px", "16px"]}
                header={"Pixly Topics"}
                text={`Pixly topics are kind of collections that are more specific than genre based collections.` + 
                        `Topic pages treat specific subjects like 'Art House', 'Terrorism'. You can also filter your search based` + 
                        `on IMDb ratings or release year of the movies`}
                mb={[2,2,3]}
                />

                <Grid 
                    columns={[1,2]}  
                    borderTop="1px solid" borderColor="rgba(40,40,40, 0.6)"
                    pt={[2,2,3]}
                >
                    {topics.map(topic => <TopicCoverCard item={topic} key={topic.slug} fontSize={"22px"}/>)}
                </Grid>

                <ListBoardAd />
                    
            </ContentContainer>
        </PageContainer>
    );
})

const Query = (props) =>{
    const { loading, error, data } = useQuery(TOPIC_LIST_QUERY)
    console.log(loading, error)
    if (loading) return <Loading />
    if (data) return <TopicList topics={data.listOfTopics} />
    else return <div></div>
}

export default withRouter(Query);

