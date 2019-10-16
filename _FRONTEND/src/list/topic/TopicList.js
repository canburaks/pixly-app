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
     TopicCoverCard,
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

                <div className="list-type-header fbox-c pad-bt-4x ">
                    <h2 className="primary-text">
                        Pixly Topics
                    </h2>
                    <p className="t-m t-color-dark">
                    </p>
                    <hr />
                </div>
                <Grid columns={[1,2,2,3,3,3,4]}  >
                    {topics.map(topic => <TopicCoverCard item={topic} key={topic.slug} />)}
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

