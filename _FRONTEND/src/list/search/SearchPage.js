import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

//import { Query } from "react-apollo";
import { COMPLEX_SEARCH,TAG_LIST } from "../../functions/query"

import { Head, MidPageAd, HomePageFeedAd, rgaSetEvent } from "../../functions/analytics"
//import TagSelectStatic from "./TagSelectStatic"
import {  isEqualObj, useWindowSize, BannerAd } from "../../functions"

//import "react-input-range/lib/css/index.css"

import { 
    Box, FlexBox,SuperBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,Image,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox,
    //RatingSlider, 
    //YearSlider,
    TagSlider,
    HeaderText,
    NewLink,
} from "../../styled-components"
import { LazyLoadComponent } from 'react-lazy-load-image-component';

import { YearSlider, RatingSlider, TagSelect, SearchInputMaterial } from "../../styled-material"

import "./Search.css"


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
    const [ tag, setTag ] = useState("")
    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2020})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})
    const [lazyvariables, setLazyVariables ] = useState({keywords})
    const [ message, setMessage ] = useState(null)
    const screenSize = useWindowSize()



    //const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    //const areEqualSize = (newmovies) => (new Set(movies.map(movie => movie.id)).size === new Set([...movies, ...newmovies].map(movie => movie.id)).size )
    //const mergeVariables = () => ({tags:tags.map(tag=>tag.value), keywords, ...yearData, ...ratingData})
    //const lazy = mergeVariables()
    //const lazyvariables = useDebounce(lazy, 2000);
    
    
    
    //handlers
    const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])
    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const tagDispatcher = useCallback((t) => setTag(t), [tag])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])


    const submitHandler = (e) => {
        e.preventDefault()
        if (keywords.length < 3 && (tag===null || tag.length === 0)) setMessage("Your should provide search keywords or choose a genre please")
        else {
            const vars = {keywords, ...yearData, ...ratingData}
            if (tag && tag.length > 0){
                vars.tags = [tag]
            }
            if (skip === true ) setSkip(false)
            setLazyVariables(vars)

            //GA Search Keyword
            if (vars.keywords.length > 3){
                rgaSetEvent("Search", vars.keywords.trim().toLowerCase())
            }
            if (message && message.length > 0) setMessage("")
        } 
    }
    //console.log("main", tag, lazyvariables)
    const isSmallScreen = useMemo(() => !screenSize.includes("L"), [screenSize])
    const responsivePosterUrl = isSmallScreen 
        ? "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-v.jpg"
        : "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-dark.jpg"
    
    return(
        <PageContainer  p={[0]}>

            <FlexBox overflow="hidden" flexDirection="column" position="relative" top={0} boxShadow="card">
                <Image src={responsivePosterUrl} position="absolute" 
                    top={-20} left={-10} right={10} blur={8}
                    minWidth={"100%"} 
                    alt={"Pixly AI Movie Recommendation and Movie Rating Website"} zIndex={0}
                />
                <Form flexWrap="wrap" onSubmit={submitHandler} py={[5]} maxWidth="100%" mt={[4]} zIndex={1} px={[4]}>
                    <HeaderText 
                        textAlign="center" color="rgba(255,255,255, 0.9)" 
                        my={[3]} 
                        fontSize={["30px", "30px", "36px", "42px", "48px", "54px"]}
                    >
                        Search Movies by Genre, Rating and Year
                    </HeaderText>

                    
                    <FlexBox flexDirection={["column", "column", "row"]} width={"100%"}>
                        <YearSlider dispatcher={yearDispatcher}     showLabel />
                        <RatingSlider dispatcher={ratingDispatcher} showLabel />
                    </FlexBox>

                    <FlexBox flexDirection={["column","column","column","row"]} alignItems="center">

                        <TagSlider 
                            dispatcher={tagDispatcher}  
                            height={["30px","30px","30px","50px"]} 
                            width={["100%","100%","100%","20%"]}
                            minWidth="100px"
                            px={[0,0,0,2]}     mb={[2,2,2,0]}                       
                        />
                        <FlexBox justifyContent="center" id="s-text-input" 
                            minWidth={["100%","100%","100%","80%"]} alignItems="center" position="relative" 
                            >
                            <SearchInput type="text"   
                                px={[2,3,4,4,4]}
                                placeholder="Search.."
                                autoFocus={false}
                                value={keywords} 
                                onChange={keywordsHandler} 
                                minHeight="50px"
                                width={"100%"}
                                border="1px solid"
                                borderColor="rgba(0,0,0, 0.15)"
                                color="#181818"
                                bg="rgba(255,255,255,0.45)"
                            />
                            <Button type="submit" 
                                onClick={submitHandler} 
                                position="absolute" 
                                display="flex" justifyContent="center" alignItems="center"
                                right={["4vw", "4vw", "2vw", "2vw"]} top={"2px"} p={0} 
                                width={40} height={40} 
                                hoverBg={"rgba(40,40,40,0.4)"}
                                borderRadius="50%" 
                                title="Click for Search"
                                bg="dark"
                            >
                                <SearchIcon  stroke="white" strokeWidth="3" size={24} />
                            </Button>
                        </FlexBox>
                    </FlexBox>

                    <Text fontSize={[14,14,16]} fontWeight={"bold"} textAlign="center" color="red">{message}</Text>

                </Form>
            </FlexBox>
            <BannerAd />
            <Box id="search-rresult-box"  
                borderLeft="2px solid" 
                borderColor="rgba(40,40,40, 0.3)"
                width="101vw"
                minWidth={["100%"]} minHeight={["60vw"]}
                left={"-1vw"} top={0}
                p={[2]}
            >
                
                <SearchQueryBox lazyvariables={lazyvariables} skip={skip} />
            </Box>
        </PageContainer>
    );
}

const SearchQueryBox = React.memo(({lazyvariables, skip}) => {
    const [page, setPage] = useState(1)
    const { loading, data, error } = useQuery(COMPLEX_SEARCH, {variables:{page:page, ...lazyvariables}, skip:skip});
    //console.log(lazyvariables)
    const prevPage = useCallback(() => setPage(page - 1), [page])
    const nextPage = useCallback(() => setPage(page + 1), [page])
    console.log(loading, error, data)
    if (loading) return <Loading text="Searching"/>
    if (data) {
        const pageQuantity = data.complexSearch.result.length
        const firstPart = data.complexSearch.result.slice(0, 12)
        const secondPArt = data.complexSearch.result.slice(12)
        return (
            <>
            <Grid columns={[2,2,3,3,4,6]} pb={[4]} gridColumnGap={[2]} gridRowGap={[2]} px={[2]}>
                {firstPart.map( item => (
                    <LazyLoadComponent key={"rec" + item.id} >
                        <MovieCard item={item} borderRadius={[0]}/>
                    </LazyLoadComponent>
                ))}
            </Grid>
            <HomePageFeedAd />
            <Grid columns={[2,2,3,3,4,6]} py={[4]} gridColumnGap={[2]} gridRowGap={[2]} px={[2]}>
                {secondPArt.map( item => (
                    <LazyLoadComponent key={"rec" + item.id} >
                        <MovieCard item={item} borderRadius={[0]}/>
                    </LazyLoadComponent>
                ))}
            </Grid>
            <MidPageAd/>

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


const MovieCard = ({ item }) => (
    <FlexBox width="100%" flexDirection="column" minHeight={300} overflow="hidden">
        <NewLink link={`/movie/${item.slug}`} title={`${item.name} (${item.year})`}>
            <Image 
            src={item.poster} 
            title={`${item.name} (${item.year})`} 
            alt={`${item.name} (${item.year})`} 
            position="absolute" 
            top={0} left={0} right={0} minWidth="100%"
            height="auto"
            />
        </NewLink>
        <NewLink link={`/movie/${item.slug}`} title={`${item.name} (${item.year})`}>
            <Text 
                color="light" zIndex={2}
                position="absolute" 
                bottom={"0px"} left={"4px"} 
                fontWeight="bold"
                fontSize={["12px","12px","12px","14px"]}
                width="100%"
                bg={"#1e1e1e"} hoverUnderline
            >
                {`${item.name} (${item.year})`}
            </Text>
        </NewLink>
    </FlexBox>
)

export default withRouter(SearchPage);

