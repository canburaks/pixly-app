import React from "react";
import { useContext, useState, useReducer, useEffect, lazy, Suspense, useRef } from 'react';
import { Route, Switch, Link, withRouter } from "react-router-dom"
import { MAIN_PAGE } from "../functions/query";
import { Query } from "react-apollo";
import { rgaPageView,  Head, MidPageAd } from "../functions/analytics"
import { useWindowSize, useAuthCheck, useClientWidth } from "../functions/hooks"
import {GridBox, GridItem, SpeedyGridBox } from "../components/GridBox" 

import JoinBanner from "../components/JoinBanner.js"


import { GlideBox } from "../components2/Glide.js"
//import { motion, useViewportScroll } from "framer-motion"
import { MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid, PageContainer, ContentContainer } from "../styled-components"

import "./MainPage.css"

const MainPage = (props) => {
    //console.log("main-page: ",props)
    const authStatus = useAuthCheck();

    const CarouselList = React.memo(({ item }) => (
        <Link to={`/list/${item.slug}/1`} rel="nofollow" key={item.slug} >
            <img 
                alt= {item.name + " poster"}
                title={item.name + " poster"}
                src={item.coverPoster} 
                className="bor-rad-2x w100 fg-1 box-shadow-short"
                />
        </Link>
    ))

//    const CarouselList2 = React.memo(({ item }) => (
//        <Link to={`/list/${item.slug}/1`} rel="nofollow" key={item.slug} >
//            <ImageShim 
//                alt= {item.name + " poster"}
//                title={item.name + " poster"}
//                src={item.coverPoster} 
//                style={{borderRadius:8}}
//                />
//        </Link>
//    ))
    const sortedMovies = props.data.movies.sort((a,b) => b.id - a.id)
    return(
        <PageContainer>
            <Head
                description={"Pixly Movie Home Page. Pixly is personalized movie recommendation and social movie discovery platform"}
                title={"Pixly Movie Platform"}
                keywords={"pixly movies, pixly cinema, pixly recommendation, movietowatch, movie suggestions, similar movies"}
                canonical={`https://pixly.app/`}
            >
                <meta name="twitter:card" content="app" />
                <meta name="twitter:site" content="@pixlymovie" />
                <meta name="twitter:description" content="Personal Movie Recommendation and Social Movie Discovering Platform" />
                <meta name="twitter:app:name:iphone" content="Pixly" />
                <meta name="twitter:app:name:ipad" content="Pixly" />
                <meta name="twitter:app:name:googleplay" content="Pixly" />
            </Head>
            {!authStatus && <JoinBanner />}

            <ContentContainer>
                
                <GlideBox s={1.5} m={2} l={2} xl={2.2}  xxl={3} xxxl={3} >
                    {props.data.lists.map(item => <CarouselList  item={item} key={item.slug} /> )}
                </GlideBox>


                <h4 className="t-xl t-bold mar-t-4x asfs hover-t-underline t-color-dark">
                    <Link rel="nofollow" to={`/directors/1`} title="Visit Directors Page">Directors</Link>
                </h4>

                <GlideBox s={3} m={3} l={[4]} xl={[5]}  xxl={[6]} xxxl={[7]} >
                    {props.data.persons.map(person => (
                        <DirectorCard item={person} key={person.slug}/>
                    ) )}
                </GlideBox >


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

const MainPageQuery = (props) =>(
    <Query query={MAIN_PAGE}>
    {({ loading, error, data, refetch }) => {
        if (loading) return <Loading />;
            if (error) return <div className="gql-error">{JSON.stringify(error.message)}</div>;
            return <MainPage data={data.mainPage} {...props} />
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

/*
        <LazyImageProvider> 
            <Carousel >
                {props.data.lists.map(item => (
                    
                    <Link to={`/list/${item.slug}/1`} rel="nofollow" key={item.slug}>
                        <LazyImage aspectRatio={[100, 45]} src={item.coverPoster}  />
                    </Link>
                ))}
            </Carousel>
        </LazyImageProvider>

        <Swiper {...swiperSettings}>
            {props.data.lists.map( item=> (
                <div className="carousel-list"  key={item.slug}>
                    <Link to={`/list/${item.slug}/1`} rel="nofollow">
                        <img src={item.coverPoster} className="carousel-list-image"  />
                    </Link>
                </div>
            ))}
            </Swiper>
const SlickCarousel = (props) =>{
    const settings = {
      className: "slider variable-width",
      arrows:true,
      dots: true,
      infinite: true,
      centerMode: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      autoplay: true,
      autoplaySpeed: 4000,
      swipeToSlide: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };
    return(
      <Slider {...settings}>
          {props.items.map( i=> (
              <div className="carousel-list" key={i.slug}>
                    <img className="carousel-list-image" src={i.coverPoster} />
                    <Link to={`/list/${i.slug}/1`}>
                        <button className="see-button">See</button>
                    </Link>
              </div>
          ))}
      </Slider>
    )
}
*/