import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"
import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    SIMILAR_FINDER, LIST_BOARD, MoviePageAd
} from "../../functions"

import { GlobalContext } from "../..";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, FlexBox
} from "../../styled-components"



const SimilarFinder = (props) => {
    const lists = props.data.similars
    const state = useContext(GlobalContext);
    
    const partitionQuantity = useValues([4,4,4,4,3])
    const isMobile = window.innerWidth < 480;



    const firstPart = allLists.slice(0,partitionQuantity)
    const secondPart = allLists.slice(partitionQuantity, partitionQuantity * 2)
    const thirdPart = allLists.slice(partitionQuantity * 2, partitionQuantity * 3)
    const fourthPart = allLists.slice(partitionQuantity * 3, partitionQuantity * 4)
    const fifthPart = allLists.slice(partitionQuantity * 4, partitionQuantity * 5)

    const ResponsiveAd1 = isMobile ? FeedMobileCollectionAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileCollectionAd : MidPageAd
    const ResponsiveAd3 = isMobile ? FeedMobileCollectionAd : MoviePageAd


    //console.log(otherLists)
    useEffect(() => window.scrollTo(0,0), [])
    return (
        <PageContainer>
            <Head
                title={"Pixly - List Of Films, Curated and Collected Movie Lists"}
                description={"Great List of Films - Collections of festival awarded films, famous director's favorite " +
                            "curated and recommended films and lists to watch. "}
                image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}

                canonical={`https://pixly.app/film-lists`}
            />
            <Hero />

            
        </PageContainer>

    );
};


const Hero = () => (
    <FlexBox className="unmatched-orange"
        width="100%"
        height="auto"
        display="flex" flexDirection="column"
        px={["5vw", "5vw", "8vw"]} pt={[5,5,5,6]}  pb={[4,4]}
        top={-75}
    >

        <HeaderText  
            fontFamily={"playfair"} fontWeight="bold"
            fontSize={["30px", "30px", "36px", "42px", "48px", "54px"]}
            color="white" my={[3]} pt={[3]}
            textAlign="center" 
        
        >
            Pixly Film Lists: Curated and Collected List of Films
        </HeaderText>  
        <Text mt={[3]} textAlign="justify" color="white">
            Pixly Selections is edited and curated by us. If you are wondering what are the favorite films of famous directors, you will find it in there. 
            You can also find movies that are awarded by very prestigious film festivals like Cannes, Berlin and Venice. 
            We are still collecting and improving our database for you. 
            If you have any suggestions to add or in any case, please feel free to write it from the bottom part of the page.
        </Text> 
</FlexBox>
)
 
const SimilarFinderQuery = props => {
	const { loading, error, data } = useQuery(SIMILAR_FINDER, {
        variables:{slug:props.match.location.params.slug, page:props.match.location.params.page},
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <SimilarFinder data={data} {...props} />;
};

export default withRouter(SimilarFinderQuery);
