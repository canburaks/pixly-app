import React from "react";
import { useContext, useState, useReducer, useEffect, lazy, Suspense, useRef } from 'react';
import { Route, Switch, Link, withRouter } from "react-router-dom"
import { MAIN_PAGE } from "../functions/query";
import { Query } from "react-apollo";
import { useQuery, useApolloClient, useLazyQuery } from '@apollo/react-hooks';
import { getDataFromTree } from "@apollo/react-ssr";

import { rgaPageView,  Head, MidPageAd } from "../functions/analytics"
import { useWindowSize, useAuthCheck, useClientWidth } from "../functions/hooks"
import {GridBox, GridItem, SpeedyGridBox } from "../components/GridBox" 

import JoinBanner from "../components/JoinBanner.js"


import { GlideBox } from "../components2/Glide.js"
//import { motion, useViewportScroll } from "framer-motion"
import { MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid, PageContainer, ContentContainer } from "../styled-components"

import "./MainPage.css"


const MainPage = (props) => {
    console.log("main-page props: ",props)
    const authStatus = useAuthCheck();

    const CarouselList =({ item }) => (
        <Link to={`/list/${item.slug}/1`} rel="nofollow" key={item.slug} >
            <img 
                alt= {item.name + " poster"}
                title={item.name + " poster"}
                src={item.coverPoster} 
                className="bor-rad-2x w100 fg-1 box-shadow-short"
                />
        </Link>
    )

    const sortedMovies = props.data.movies.sort((a,b) => b.id - a.id)
    
    return(
        <PageContainer>
            <Head
                description={" Get Personalized Recommendation. Find similar movies. Discover Movie Lists, New Films and People with Similar Cinema Taste."}
                title={"Pixly Movie - Find similar movies, get personalized recommendation"}
                keywords={"discover movie, pixly movies, pixly home page, pixly cinema, pixly recommendation, movietowatch, movie suggestions, similar movies, similar movie, ai recommendation"}
                canonical={`https://pixly.app`}
            >
                <meta name="twitter:card" content="app" />
                <meta name="twitter:site" content="@pixlymovie" />
                <meta name="twitter:description" content="Personal Movie Recommendation and Social Movie Discovering Platform" />
                <meta name="twitter:app:name:iphone" content="Pixly" />
                <meta name="twitter:app:name:ipad" content="Pixly" />
                <meta name="twitter:app:name:googleplay" content="Pixly" />
                <meta property="og:type" content="business.business"/>
                <meta property="og:title" content="Pixly"/>
                <meta property="og:url" content="https://pixly.app"/>
                <meta property="og:image" content="https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/brand/pixly-hare-circle.png"/>
                <meta property="business:contact_data:street_address" content="."/>
                <meta property="business:contact_data:locality" content="Istanbul"/>
                <meta property="business:contact_data:region" content="Europe"/>
                <meta property="business:contact_data:postal_code" content="34430"/>
                <meta property="business:contact_data:country_name" content="Turkey"/>
            </Head>
            
            {!authStatus && <JoinBanner />}

            <ContentContainer>
                
                <GlideBox xs ={1} s={2} m={2} l={2} xl={2.2}  xxl={3} xxxl={3} >
                    {props.data.lists.map(item => <CarouselList  item={item} key={item.slug} /> )}
                </GlideBox>


                <h4 className="t-xl t-bold mar-t-4x asfs hover-t-underline t-color-dark">
                    <Link rel="nofollow" to={`/directors/1`} title="Visit Directors Page">Directors</Link>
                </h4>

                <GlideBox s={2} m={3} l={[4]} xl={[5]}  xxl={[6]} xxxl={[7]} >
                    {props.data.persons.map(person => (
                        <DirectorCard item={person} key={person.slug}/>
                    ) )}
                </GlideBox>


                <h4 className="t-xl t-bold mar-t-4x asfs hover-t-underline">
                    <Link rel="nofollow" to={`/advance-search`} title="Search Movies">
                        Up-To-Date
                    </Link>
                </h4>
                
                <MovieCoverBox items={sortedMovies} columns={[1,2, 2, 3,3, 4]} />
                
                <MidPageAd />


            </ContentContainer>
            

        </PageContainer>
    )
}

const MainPageQuery2 = (props) =>{
    const client = useApolloClient();

    const cachedata = client.readQuery({query:MAIN_PAGE})
    const [mainPage, { loading, error, data, refetch }] = useLazyQuery(MAIN_PAGE)

    const [ pageData, setPageData ] = useState(null)

    if (pageData){
        return  <MainPage data={pageData.mainPage} />
    }
    if (pageData === null){
        if (cachedata && cachedata.mainPage){
            console.log("cache data is setting")
            setPageData(cachedata)
        }
        else if (data && data.mainPage){
            console.log("lazy query data is setting")
            setPageData(data)
        }
        
        else if (!cachedata){
            console.log("no data: querying lazily")
            mainPage()
        }
    }
    
    //console.log("cachedata", cachedata)
    //return <MainPage data={pageData.mainPage} />
    //return <div></div>
}

const MainPageQuery = (props) => (
    <Query query={MAIN_PAGE} partialRefetch={true}>
    {({ loading, error, data, refetch }) => {
        if (loading) return <Loading />;
        if (error) return <div className="gql-error">{JSON.stringify(error.message)}</div>;
        return <MainPage data={data.mainPage} />
    }}
    </Query>
)


const Loading = () => (
    <div className="page-container">
        {window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)


export default MainPageQuery

