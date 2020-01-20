import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"
import { withRouter, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,PEOPLE_LIST
} from "../../functions"

import { GlobalContext } from "../../";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text,ActivePeopleCard, FlexBox,PaginationBox
} from "../../styled-components"



const PeoplePage = (props) => {
    const people = props.data
    const firstPart = people.slice(0,5)
    const secondPart = people.slice(5, 10)

    //console.log("props", props)
    const authStatus = useAuthCheck();
    const state = useContext(GlobalContext);
    
    const currentPage = parseInt(props.match.params.page)
    const nextPage = useCallback(() => props.history.push(`/people/${currentPage + 1}`),[currentPage] )
    const prevPage = useCallback(() => props.history.push(`/people/${currentPage - 1}`),[currentPage] )

    //console.log("curr", currentPage)

    const isMobile = window.innerWidth < 480;
    const ResponsiveAd1 = isMobile ? FeedMobileCollectionAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileCollectionAd : MidPageAd


    ////console.log(otherLists)
    return (
        <PageContainer>
            <Head
                title={"Pixly - Discover People Who Have Similar Taste"}
                description={"The People who are the most actives "}
                canonical={`https://pixly.app/people`}
            />

            <ContentContainer mb={[3,3,3,3,4]} pb={[3]}>
                <HeaderText width={"75%"} fontFamily={"playfair"} color="dark" mt={[4,4,5]}>
                    Pixly Neighbours
                </HeaderText>  
                <Text mt={[3]} textAlign="justify"> 
                    The people who are the most active. You can check and compare your cinema taste with people.
                </Text>    
                <hr/>
                <FlexBox flexDirection="column">
                    {firstPart.map(profile => (
                        <ActivePeopleCard key={profile.username}
                            profile={profile} 

                        />
                    ))}

                    <ResponsiveAd1 />

                    {secondPart.map(profile => (
                        <ActivePeopleCard key={profile.username}
                            profile={profile} 

                        />
                    ))}

                    <ResponsiveAd2 />
                </FlexBox>


                <PaginationBox 
                    currentPage={currentPage} 
                    nextPage={nextPage} 
                    prevPage={prevPage} 
                    totalPage={20} 
                    />
            </ContentContainer>
            
        </PageContainer>

    );
};

const PeopleQuery = props => {
    const location = useLocation()
    const page = location.pathname.split("people/")[1]
    //console.log("p", page)
    //console.log("location", location)
	const { loading, error, data } = useQuery(PEOPLE_LIST, {
        variables:{page: parseInt(page)},
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <PeoplePage data={data.listOfPeople} {...props} />;
};

export default withRouter(PeopleQuery);
