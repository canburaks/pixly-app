import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"

import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { MAIN_PAGE } from "../../functions/query"

import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, MoviePageAd, MidPageAd,HomePageFeedAd, FeedMobileCollectionAd } from "../../functions/analytics"


import { GlobalContext } from "../../";
import JoinBanner from "../../components/JoinBanner.js"

import {
     ListCard, PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,
     TopicCoverCard, TextSection,CollectionCard,Image, SuperBox,
     Loading, HeaderText, Text, FlexBox
 } from "../../styled-components"


const eclipseurl = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/unmatched-eclipse.jpg"
const unmatchedredurl = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/renowned-red.jpg"

const TopicList = (props) => {
    const topics = useMemo(() => props.data.topics.sort((a,b) => b.id - a.id),[])
    //const partitionQuantity = useValues([4,4,4,4,3])
    const partitionQuantity = 6

    //console.log("topics", partitionQuantity)
    //const topicnames = topics.map(topic => topic.name).join(", ")
    //const authStatus = useAuthCheck()
    const firstPart = topics.slice(0,partitionQuantity)
    const secondPart = topics.slice(partitionQuantity, partitionQuantity * 2)
    const thirdPart = topics.slice(partitionQuantity * 2, partitionQuantity * 3)
    const fourthPart = topics.slice(partitionQuantity * 3, partitionQuantity * 4)

    const isMobile = window.innerWidth < 480;
    const ResponsiveAd1 = isMobile ? FeedMobileCollectionAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileCollectionAd : MidPageAd
    const ResponsiveAd3 = isMobile ? FeedMobileCollectionAd : MoviePageAd
    useEffect(() => window.scrollTo(0,0), [])
    return (
        <PageContainer>
            <Head
                title={"Pixly Topics: Art House, Controversial, Biopic, LGBT Films ..."}
                description={`Pixly topics are theme based movie collections. Such as arthouse and cyberpunk films also ` +
                            "movies based on true stories or focus on rich dialogues." 
                        }
                canonical={`https://pixly.app/topics`}
				image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}
            />

            <Hero />

            <ContentContainer >
         
                <ResponsiveAd1 />
                <dl>
                    <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {firstPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id}  
                                link={`/topic/${item.slug}`} 
                                text={item.seoShortDescription} />
                        ))}
                    </Grid>
                    <ResponsiveAd3 />

                    <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {secondPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id}  
                                link={`/topic/${item.slug}`} 
                                text={item.seoShortDescription} />
                        ))}
                    </Grid>

                </dl>
            </ContentContainer>


        </PageContainer>
    );
}

const Hero = () => (
    <FlexBox className="unmatched-red"
        width="100%"
        height="auto"
        display="flex" flexDirection="column"
        px={"5vw"} py={[5,5,5,6]} top={-75}
    >

        <HeaderText  
            fontFamily={"playfair"} fontWeight="bold"
            fontSize={["30px", "30px", "36px", "42px", "48px", "54px"]}
            color="white" my={[3]} pt={[3]}
            textAlign="center" 
        
        >
            Film Topics: Theme Based Lists of Films
        </HeaderText>  
        <Text mt={[3]} textAlign="justify" color="white">
        {`Pixly topics are kind of collections that are more specific than genre based collections. ` + 
            `Topic movies can focus on some specific issue, or can include the topic as an element of the narrative ` +
            `such as arthouse, cyberpunk films or movies that focus on rich dialogues or movies passed the Bechdel test. ` +
            `We added a filter mechanism to some topics which you can filter the films by IMDb rating or release year. ` 
            }
        </Text> 
</FlexBox>
)


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

