import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

//import { Query } from "react-apollo";
import { COMPLEX_SEARCH,TAG_LIST } from "../../functions/query"

import { Head, MidPageAd, HomePageFeedAd, rgaSetEvent } from "../../functions/analytics"
import TagSelectStatic from "./TagSelectStatic"
import {  isEqualObj} from "../../functions"

//import "react-input-range/lib/css/index.css"

import { 
    Box, FlexBox,SuperBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox,
    RatingSlider, YearSlider, HeaderText,
} from "../../styled-components"
import "./Search.css"
import "react-input-range/lib/css/index.css"

const Header = () => (
    <Head
        title={"Pixly - Advance Film Search by Genre, IMDb Rating and Release Year"}
        description={"Pixly Search is a free service that you can make advance movie search and also filter them " + 
                "with respect to their genres, tags, IMDb Ratings and release date"}
        keywords={["Movie Search", "Advance Movie Search", "Search by IMDb Rating", "Movie with Release Year"]}
        canonical={`https://pixly.app/advance-search`}
    />
)

const SearchPage = (props) =>{
    const linkstate = props.location.state
    const initialKeywords = (linkstate && linkstate.keywords) ? linkstate.keywords : ""
    const initialSkip = !initialKeywords.length > 2
    //console.log("search",props)
    
    //Variables
    const [ keywords, setKeywords ] = useState(initialKeywords)
    const [ skip, setSkip ] = useState(initialSkip)
    const [ tags, setTags ] = useState([])
    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})
    const [lazyvariables, setLazyVariables ] = useState({keywords})
    const [ message, setMessage ] = useState(null)



    //const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    //const areEqualSize = (newmovies) => (new Set(movies.map(movie => movie.id)).size === new Set([...movies, ...newmovies].map(movie => movie.id)).size )
    //const mergeVariables = () => ({tags:tags.map(tag=>tag.value), keywords, ...yearData, ...ratingData})
    //const lazy = mergeVariables()
    //const lazyvariables = useDebounce(lazy, 2000);
    
    
    
    //handlers
    const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])
    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])



    const submitHandler = (e) => {
        e.preventDefault()
        if (keywords.length < 3 && tags.length === 0) setMessage("Your should provide search keywords or choose a genre please")
        else {
            const vars = {tags:tags.map(tag=>tag.value), keywords, ...yearData, ...ratingData}
            if (skip === true ) setSkip(false)
            setLazyVariables(vars)

            //GA Search Keyword
            if (vars.keywords.length > 3){
                rgaSetEvent("Search", vars.keywords.trim().toLowerCase())
            }
            if (message && message.length > 0) setMessage("")
        } 
    }

    //console.log("qv",variables)
    return(
        <PageContainer>
            <Header />

            <Form flexWrap="wrap" onSubmit={submitHandler} gradient={"blueish"} py={[4]}>
                <HeaderText textAlign="center" color="rgba(255,255,255, 0.9)" my={[5]}>Search Movies by Genre, Rating and Year</HeaderText>
                <FlexBox justifyContent="center" id="s-text-input" minWidth="100%" position="relative">
                    <SearchInput type="text"   
                        px={[2,3,4,4,4]}
                        placeholder="Search.."
                        autoFocus
                        value={keywords} 
                        onChange={keywordsHandler} 
                        minHeight="70px"
                        width={"100%"}
                    />
                    <Button type="submit" 
                        position="absolute" 
                        display="flex" justifyContent="center" alignItems="center"
                        right={40} top={12} p={0} 
                        width={50} height={50} 
                        hoverBg={"blue"}
                        borderRadius="50%" 
                        bg="dark"
                    >
                        <SearchIcon  stroke="white" strokeWidth="3" size={30} />
                    </Button>
                </FlexBox>


                <FlexBox id="search-settings-box" 
                    flexDirection={["row", "row"]} 
                    width={["100%", "100%", "100%"]}  
                    minHeight={["80px", "80px", "80px", "100%"]}
                    justifyContent="space-around"
                    flexWrap="wrap"
                    px={[3]} mt={[3,3,3]}
                >
                    <FlexBox 
                        flexDirection={["row"]} 
                        alignItems={"flex-start"} 
                        my={[3]} px={[3,3,3, 3]} 
                        width={"100%"}
                        flexGrow={1,1,1, 0}
                    >
                        <TagSelectStatic tags={tags} tagSetter={setTags} />
                    </FlexBox>
                    <YearSlider dispatcher={yearDispatcher} classname="cbssss" />
                    <RatingSlider dispatcher={ratingDispatcher} />
                </FlexBox>
            </Form>

            <Box id="search-rresult-box"  
                    borderLeft="2px solid" 
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%"]} minHeight={["60vw"]}
                    p={[1,2,3]}
                >
                    <Text fontSize={[14,14,16]} minHeight={16} fontWeight={"bold"}>{message}</Text>
                    
                    <SearchQueryBox lazyvariables={lazyvariables} skip={skip} />
                </Box>
        </PageContainer>
    );
}

const SearchQueryBox = React.memo(({lazyvariables, skip}) => {
    const [page, setPage] = useState(1)
    const { loading, data, error } = useQuery(COMPLEX_SEARCH, {variables:{page:page, ...lazyvariables}, skip:skip});

    const prevPage = useCallback(() => setPage(page - 1), [page])
    const nextPage = useCallback(() => setPage(page + 1), [page])
    //console.log(loading, error, data)
    if (loading) return <Loading text="Searching"/>
    if (data) {
        const pageQuantity = data.complexSearch.result.length
        const firstPart = data.complexSearch.result.slice(0, Math.floor(pageQuantity/ 2) + 1)
        const secondPArt = data.complexSearch.result.slice(Math.floor(pageQuantity/ 2) + 1, 30)
        return (
            <>
            <Grid columns={[1,2,2,3,3,3,4]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {firstPart.map( item => (
                    <MovieCoverCard item={item} key={"rec" + item.id}/>
                ))}
            </Grid>
            <MidPageAd/>
            <Grid columns={[1,2,2,3,3,3,4]} py={[4]} gridColumnGap={[3,3,3,4]}>
                {secondPArt.map( item => (
                    <MovieCoverCard item={item} key={"rec" + item.id}/>
                ))}
            </Grid>
            <HomePageFeedAd />

            {data.complexSearch.quantity >= 18 &&
                    <PaginationBox mb={[2]}
                        currentPage={data.complexSearch.quantity!==null && page} 
                        totalPage={Math.ceil(data.complexSearch.quantity/18)} 
                        nextPage={nextPage} prevPage={prevPage} 
                    />}
            </>
    )}
    else return <div></div>
}, (p,n) => (isEqualObj(p.lazyvariables,n.lazyvariables) && p.skip === n.skip))  


export default withRouter(SearchPage);

