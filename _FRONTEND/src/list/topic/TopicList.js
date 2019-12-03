import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"

import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { MAIN_PAGE } from "../../functions/query"

import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, ListBoardAd } from "../../functions/analytics"


import { GlobalContext } from "../../";
import JoinBanner from "../../components/JoinBanner.js"

import {
     ListCard, PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,
     TopicCoverCard, TextSection,CollectionCard,
     Loading, HeaderText, Text
 } from "../../styled-components"




const TopicList = React.memo((props) => {
    const topics = props.data.topics
    //console.log("topics", topics)
    const topicnames = topics.map(topic => topic.name).join(", ")
    const authStatus = useAuthCheck()
    const firstPart = topics.slice(0,4)
    const secondPart = topics.slice(4, 8)
    const thirdPart = topics.slice(8, 12)

    return (
        <PageContainer>
            <Head
                title={"Pixly Topics"}
                description={`Pixly topics are theme based movie collections. Such as arthouse and cyberpunk films also ` +
                            "movies based on true stories or focus on rich dialogues." 
                        }
                canonical={`https://pixly.app/topics`}
				image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}
            />

            <ContentContainer >
            <HeaderText width={"75%"} fontFamily={"playfair"} color="dark" mt={[4,4,5]}>Pixly Topics: Theme Based Film Lists</HeaderText>  
            <Text mt={[3]} textAlign="justify">
            {`Pixly topics are kind of collections that are more specific than genre based collections. ` + 
                        `Topic movies can focus on some specific issue, or can include the topic as an element of the narrative ` +
                        `such as arthouse, cyberpunk films or movies that focus on rich dialogues or movies passed the Bechdel test. ` +
                        `We added a filter mechanism to some topics which you can filter the films by IMDb rating or release year. ` 
                        }
            </Text>          
            <hr/>

                <Grid columns={[1,1,1,2]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {firstPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id}  
                            link={`/topic/${item.slug}`} 
                            text={item.seoShortDescription} />
                    ))}
                </Grid>

                <ListBoardAd />
                    
                <Grid columns={[1,1,1,2]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {secondPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/topic/${item.slug}`} 
                            text={item.seoShortDescription}  />
                    ))}
                </Grid>

                <Grid columns={[1,1,1,2]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {thirdPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/topic/${item.slug}`} 
                            text={item.seoShortDescription}  />
                    ))}
                </Grid>
            </ContentContainer>


        </PageContainer>
    );
})


const ExploreQuery = props => {
	const { loading, error, data } = useQuery(MAIN_PAGE, {
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <TopicList data={data.mainPage} {...props} />;
};

export default withRouter(ExploreQuery);

