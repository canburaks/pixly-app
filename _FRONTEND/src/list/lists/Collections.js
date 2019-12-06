import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"
import { withRouter, Link } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd, ListBoardAd,
    MAIN_PAGE, LIST_BOARD
} from "../../functions"

import { GlobalContext } from "../../";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text
} from "../../styled-components"



const ListBoard = (props) => {
    const lists = props.data.lists
    const authStatus = useAuthCheck();
    const state = useContext(GlobalContext);
    
    if (props.viewer){
        state.methods.updatePoints(props.viewer.points)
    }
    const pixlyselection = useMemo(() => lists.filter(l => l.slug === "our-selection")[0])
    const nonpixlyselection = useMemo(() => lists.filter(l => l.slug !== "our-selection"))


    const directorsFavourite = useMemo(() => lists.filter( l => l.listType==="df"))
    const festivalWinners = useMemo(() => lists.filter(l => l.listType === "fw"))
    const otherLists = useMemo(() => lists.filter(l => l.listType === "ms"))
    const listOfMonth = useMemo(() => lists.filter(l => l.listType === "mm"))
    //console.log(listOfMonth)
    const allLists = [...listOfMonth, ...otherLists, ...festivalWinners, ...directorsFavourite]
    const firstPart = allLists.slice(0,4)
    const secondPart = allLists.slice(4, 8)
    const thirdPart = allLists.slice(8, 18)



    //console.log(otherLists)
    const buttonText = (name) => name.length > 20 ? name.slice(0,20) + "..." : name
    return (
        <PageContainer>
            <Head
                title={"Pixly Film Lists"}
                description={"Collections of festival awarded films, famous director's favorite " +
                            "movie lists, curated and recommended films and lists to watch. "}
                image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}

                canonical={`https://pixly.app/film-lists`}
            />

            <ContentContainer mb={[3,3,3,3,4]}>
                <HeaderText width={"75%"} fontFamily={"playfair"} color="dark" mt={[4,4,5]}>Pixly Film Lists: Curated and Collected Movie Lists</HeaderText>  
                <Text mt={[3]} textAlign="justify"> 
                    Pixly Selections is edited and curated by us. If you are wondering what are the favorite films of famous directors, you will find it in there. 
                    You can also find movies that are awarded by very prestigious film festivals like Cannes, Berlin and Venice. 
                    We are still collecting and improving our database for you. 
                    If you have any suggestions to add or in any case, please feel free to write it from the bottom part of the page.
                </Text>    
                <hr/>
                <Grid columns={[1,1,1,2,2,3]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {allLists.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/list/${item.slug}/1`} 
                            text={item.seoShortDescription}
                            ratio={0.4}
                            buttonText={`See ${buttonText(item.name)}`}
                        />
                    ))}
                </Grid>
                
                {/*
                <HomePageFeedAd />

                <Grid columns={[1,1,2,2,2,2,4]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {secondPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/list/${item.slug}/1`} 
                            text={item.seoShortDescription}
                            ratio={0.4}
                        />
                    ))}
                </Grid>


                <MidPageAd />

                <Grid columns={[1,1,2,2,2,2,4]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {thirdPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/list/${item.slug}/1`} 
                            text={item.seoShortDescription}
                            ratio={0.4}
                        />
                    ))}
                </Grid>

                <ListBoardAd />*/}


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
