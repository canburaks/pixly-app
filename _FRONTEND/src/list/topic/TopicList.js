import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"

import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_LIST_QUERY } from "../../functions/query"

import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, ListBoardAd } from "../../functions/analytics"


import { GlobalContext } from "../../";
import JoinBanner from "../../components/JoinBanner.js"

import {
     ListCard, PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,
     TopicCoverCard, TextSection,
     Loading
 } from "../../styled-components"




const TopicList = React.memo((props) => {
    const topics = props.topics
    console.log("topics", topics)
    const topicnames = topics.map(topic => topic.name).join(", ")
    const authStatus = useAuthCheck()
    return (
        <PageContainer>
            <Head
                title={"Pixly Topics"}
                description={`Pixly topics are a collection of movies that have common subgenre or topic like ${topicnames}.` + 
                            ` You can find the best ${topicnames} films, by filtering your criteria like IMDb rating or release year.`
                        }
                canonical={`https://pixly.app/topics`}
            />

            <ContentContainer pb={"100px"}>
                <HiddenHeader>Pixly Topics</HiddenHeader>
            
                <TextSection
                headerSize={["20px", "20px", "24px", "28px", "32px", "36px"]}
                textSize={["14px", "14px", "16px"]}
                header={"Pixly Topics"}
                text={`Pixly topics are kind of collections that are more specific than genre based collections.` + 
                        `Topic movies can focus on some specific issue, or can include the topic as an element of the narrative.` +
                        `We added a filter mechanism which you can filter the topic movies by IMDb rating or release year ` + 
                        `in order to find the most suitable films for yourself.`
                        }
                mb={[2,2,3]}
                />

                <Grid 
                    columns={[1,1,2, 2,2,2,3]}  
                    borderTop="1px solid" borderColor="rgba(40,40,40, 0.6)"
                    pt={[2,2,3]}
                >
                    {topics.map(topic => <TopicCoverCard item={topic} key={topic.slug} fontSize={["12px", "12px", "14px"]}/>)}
                </Grid>

                <ListBoardAd />
                    
            </ContentContainer>

            {!authStatus && <JoinBanner />}

        </PageContainer>
    );
})

const Query = (props) =>{
    const { loading, error, data } = useQuery(TOPIC_LIST_QUERY)
    console.log(data, loading, error)
    if (loading) return <Loading />
    if (data) return <TopicList topics={data.listOfTopics} />
    else return <div></div>
}

export default withRouter(Query);

