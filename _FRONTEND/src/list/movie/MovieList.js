import React from "react";
import { useState, useContext, useCallback, useMemo } from "react"
import { withRouter } from "react-router-dom";



import { useAuthCheck } from "../../functions/hooks";
import {   Head, MidPageAd, HomePageFeedAd, MoviePageAd } from "../../functions/analytics"

import { GlobalContext } from "../../";

import {  
    MovieCoverBox, ProfileCircleBox, PageContainer,
    ContentContainer, PaginationBox, ListCoverPanel,
    TextSection,HiddenHeader, MovieRichCardBox,WhiteMovieCard,
    MovieRichCard, Grid, HeaderText, Text, Span
} from "../../styled-components"




const MovieList = (props) => {
    //console.log("props",props.liste.isFollowed)
    const liste = props.liste
    const isFollowed = liste ? liste.isFollowed : null

    //const [liste, setListe ] = useState({id:"null",name:null, summary:"", isFollowed:false, followers:[] })
    const [follow, setFollow] = useState(isFollowed);
    const authStatus = useAuthCheck()
    const state = useContext(GlobalContext);

    const nextPage = useCallback(() => props.history.push(`/list/${listSlug}/${currentPage + 1}`),[currentPage, listSlug] )
    const prevPage = useCallback(() => props.history.push(`/list/${listSlug}/${currentPage - 1}`),[currentPage, listSlug] )

    //const screenSize = useWindowSize();
    const screenSize = state.screenSize;
    const listSlug = props.match.params.slug
    //console.log("movie query params", props.match.params)
    const ppi = 20
    const currentPage = parseInt(props.match.params.page)
    const isLargeScreen = screenSize.includes("L")
    const LıstHeader = liste.slug==="our-selection" 
        ? () => <HeaderText>A Curated Movie List: <em>{liste.name}</em></HeaderText> 
        : () => <HeaderText>{liste.name}</HeaderText> 
    //console.log(liste.summary)

    const pageQuantity = liste.movies.length 

    const orderedMovies = useMemo(() => liste.movies.sort((a,b) => b.imdbRating - a.imdbRating ), [liste.slug])
    const firstPart = orderedMovies.slice(0, 4)
    const secondPArt = orderedMovies.slice(4, 8)
    const thirdPart = orderedMovies.slice(8, 18)
    const haveThirdPart = orderedMovies.length > 8;
    //console.log("liste", orderedMovies)
    return(
        <PageContainer>
            <Head
                description={liste.seoDescription}
                title={liste.seoTitle}
                richdata={liste.richdata}
                keywords={liste.seoKeywords}
                image={liste.coverPoster 
                        ? liste.coverPoster 
                        : liste.listType === "df" && liste.relatedPersons.length > 0 
                            ? liste.relatedPersons.poster
                            : null}
                canonical={`https://pixly.app${window.location.pathname}`}
            />
            <ListCoverPanel 
                blur={20} mb={[3]} 
                width={"100vw"} height={"56vw"} 
                item={liste}  
                authStatus={authStatus}
                screenSize={screenSize}
                isLargeScreen={isLargeScreen}
            />
            
            <ContentContainer>
                <LıstHeader />
                <Text mt={[3]}>{liste.summary}</Text>
                <hr />

                <Grid columns={[1,1,1,2]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {firstPart.map( item => (
                        <WhiteMovieCard item={item} key={"rec" + item.id} />
                    ))}
                </Grid>
                
                <HomePageFeedAd/>
                <Grid columns={[1,1,1,2]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {secondPArt.map( item => (
                        <WhiteMovieCard item={item} key={"rec" + item.id} />
                    ))}
                </Grid>
                <MidPageAd />

                <Grid columns={[1,1,1,2]} py={[4]} gridColumnGap={[3,3,3,4]}>
                    {thirdPart.map( item => (
                        <WhiteMovieCard item={item} key={"rec" + item.id} />
                    ))}
                </Grid>
                {haveThirdPart && <MoviePageAd />}
                
                
                {liste.numMovies > ppi && 
                <PaginationBox 
                    currentPage={currentPage} 
                    nextPage={nextPage} 
                    prevPage={prevPage} 
                    totalPage={liste.numMovies} 
                    />}
                

                {/* FOLLOWERS PANEL*/}
                {liste.followers.length > 0 &&
                    <div className="fbox-c jcfs pad-lr-5x w100">
                        <h6>Followers</h6>
                        <hr />
                        <div className="w100 fbox-r jcfs aic mar-bt-3x" >

                        <ProfileCircleBox  items={liste.followers} columns={[4,6,8,10,12]} />

                        </div>
                    </div>}


                {/* REFERENCE */}
                {liste.referenceLink &&
                    <p className="t-italic t-xs op80 mar-t-x w100 mar-t-4x">
                        source:
                        <a className="hover-bor-b t-color-dark op80" 
                            target="_blank" rel="noopener"  href={liste.referenceLink}>{liste.referenceLink}</a>
                    </p>}
            </ContentContainer>

        </PageContainer>
    )
}


export default withRouter(MovieList)

