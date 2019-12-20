import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"
import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    MAIN_PAGE, LIST_BOARD, MoviePageAd
} from "../../functions"

import { GlobalContext } from "../../";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, 
} from "../../styled-components"



const ListBoard = (props) => {
    const lists = props.data.lists
    const authStatus = useAuthCheck();
    const state = useContext(GlobalContext);
    
    const partitionQuantity = useValues([4,4,4,4,3])
    const isMobile = window.innerWidth < 480;

    if (props.viewer){
        state.methods.updatePoints(props.viewer.points)
    }
    const pixlyselection = useMemo(() => lists.filter(l => l.slug === "our-selection")[0])
    const nonpixlyselection = useMemo(() => lists.filter(l => l.slug !== "our-selection"))


    const directorsFavourite = useMemo(() => lists.filter( l => l.listType==="df"))
    const festivalWinners = useMemo(() => lists.filter(l => l.listType === "fw"))
    const otherLists = useMemo(() => lists.filter(l => l.listType === "ms"))
    const listOfMonth = useMemo(() => lists.filter(l => l.listType === "mm"))
    const listOfYear = useMemo(() => lists.filter(l => l.listType === "my"))

    //console.log(listOfMonth)
    const allLists = [...listOfYear, ...listOfMonth, ...otherLists, ...festivalWinners, ...directorsFavourite]
    //console.log(allLists)

    const firstPart = allLists.slice(0,partitionQuantity)
    const secondPart = allLists.slice(partitionQuantity, partitionQuantity * 2)
    const thirdPart = allLists.slice(partitionQuantity * 2, partitionQuantity * 3)
    const fourthPart = allLists.slice(partitionQuantity * 3, partitionQuantity * 4)
    const fifthPart = allLists.slice(partitionQuantity * 4, partitionQuantity * 5)

    const ResponsiveAd1 = isMobile ? FeedMobileCollectionAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileCollectionAd : MidPageAd
    const ResponsiveAd3 = isMobile ? FeedMobileCollectionAd : MoviePageAd


    //console.log(otherLists)
    const buttonText = (name) => name.length > 20 ? name.slice(0,20) + "..." : name
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

            <ContentContainer mb={[3,3,3,3,4]}>
                <HeaderText width={"75%"} fontFamily={"playfair"} color="dark" mt={[4,4,5]}>Pixly Film Lists: Curated and Collected List of Films</HeaderText>  
                <Text mt={[3]} textAlign="justify"> 
                    Pixly Selections is edited and curated by us. If you are wondering what are the favorite films of famous directors, you will find it in there. 
                    You can also find movies that are awarded by very prestigious film festivals like Cannes, Berlin and Venice. 
                    We are still collecting and improving our database for you. 
                    If you have any suggestions to add or in any case, please feel free to write it from the bottom part of the page.
                </Text>    
                <hr/>
                <ul>
                    <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {firstPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id} 
                                link={`/list/${item.slug}/1`} 
                                text={item.seoShortDescription}
                                ratio={0.4}
                                buttonText={`See ${buttonText(item.name)}`}
                            />
                        ))}
                    </Grid>

                    <ResponsiveAd1 />
                    <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {secondPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id} 
                                link={`/list/${item.slug}/1`} 
                                text={item.seoShortDescription}
                                ratio={0.4}
                                buttonText={`See ${buttonText(item.name)}`}
                            />
                        ))}
                    </Grid>

                    <ResponsiveAd2 />
                    <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {thirdPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id} 
                                link={`/list/${item.slug}/1`} 
                                text={item.seoShortDescription}
                                ratio={0.4}
                                buttonText={`See ${buttonText(item.name)}`}
                            />
                        ))}
                    </Grid>
                    <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {fourthPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id} 
                                link={`/list/${item.slug}/1`} 
                                text={item.seoShortDescription}
                                ratio={0.4}
                                buttonText={`See ${buttonText(item.name)}`}
                            />
                        ))}
                    </Grid>
                    <Grid columns={[1,1,2,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                        {fifthPart.map( item => (
                            <CollectionCard 
                                item={item} key={"rec" + item.id} 
                                link={`/list/${item.slug}/1`} 
                                text={item.seoShortDescription}
                                ratio={0.4}
                                buttonText={`See ${buttonText(item.name)}`}
                            />
                        ))}
                    </Grid>
                </ul>
            </ContentContainer>
            {!authStatus && <JoinBanner />}
            
        </PageContainer>

    );
};

const ExploreQuery = props => {
	const { loading, error, data } = useQuery(MAIN_PAGE, {
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <ListBoard data={data.mainPage} {...props} />;
};

export default withRouter(ExploreQuery);
