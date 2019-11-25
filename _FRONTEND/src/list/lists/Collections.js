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
    Loading
} from "../../styled-components"



const ListBoard = (props) => {
    const lists = props.data
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

    const allLists = [...otherLists, ...festivalWinners, ...directorsFavourite]
    const firstPart = allLists.slice(0,4)
    const secondPart = allLists.slice(4, 8)
    const thirdPart = allLists.slice(8, 18)



    //console.log(otherLists)

    return (
        <PageContainer>
            <Head
                title={"Pixly Film Lists"}
                description={"Collections of festival awarded films, famous director's favorite " +
                            "movie lists, curated and recommended films and lists to watch. "}
                canonical={`https://pixly.app/film-lists`}
            />

            <ContentContainer mb={[3,3,3,3,4]}>
                <div className="list-type-header fbox-c pad-bt-4x ">
                    <h2 className="primary-text">
                        Pixly Collections
                    </h2>
                    <p className="t-m t-color-dark">
                        Pixly collections is a collected and curated lists of movies. 
                        Pixly Selections is edited and curated by us. If you are wondering what are the favorite films of famous directors, you will find it in there. 
                        You can also find movies that are awarded by very prestigious film festivals like Cannes, Berlin and Venice. 
                        We are still collecting and improving our database for you. 
                        If you have any suggestions to add or in any case, please feel free to write it from the bottom part of the page.
                    </p>
                    <hr />
                </div>
                
                <Grid columns={[1,1,2,2,2,2,4]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {firstPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/list/${item.slug}/1`} 
                            text={item.seoShortDescription}
                        />
                    ))}
                </Grid>
                
                <HomePageFeedAd />

                <Grid columns={[1,1,2,2,2,2,4]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {secondPart.map( item => (
                        <CollectionCard 
                            item={item} key={"rec" + item.id} 
                            link={`/list/${item.slug}/1`} 
                            text={item.seoShortDescription}
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
                        />
                    ))}
                </Grid>

                <ListBoardAd />


            </ContentContainer>
            {!authStatus && <JoinBanner />}
            
        </PageContainer>

    );
};

const ExploreQuery = props => {
	const { loading, error, data } = useQuery(LIST_BOARD, {
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <ListBoard data={data.listOfCategoricalLists} {...props} />;
};

export default withRouter(ListBoard);
