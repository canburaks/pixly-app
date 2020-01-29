import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

//import { Query } from "react-apollo";
import { COMPLEX_SEARCH,MAIN_PAGE } from "../functions/query"

import { Head, MidPageAd, HomePageFeedAd, rgaSetEvent } from "../functions/analytics"
//import TagSelectStatic from "./TagSelectStatic"
import {  isEqualObj, useWindowSize } from "../functions"

//import "react-input-range/lib/css/index.css"

import { 
    Box, FlexBox,SuperBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,Image,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox,
    CoverImage,MessageBox, NewLink,BookmarkMutation,
    TagSlider,CollectionCard, CoverLink,
    HeaderText,
    SubHeaderText,
    CardContainer,
} from "../styled-components"
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import { useNetworkStatus } from 'react-adaptive-hooks/network';

import { YearSlider, RatingSlider, TagSelect, SearchInputMaterial, LoadingIcon } from "../styled-material"

import Carousel from 'nuka-carousel';



const MoviesPage = (props) => {
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
    //console.log("main", props.data.movies)
    const isSmallScreen = useMemo(() => !screenSize.includes("L"), [screenSize])
    const responsivePosterUrl = isSmallScreen 
        ? "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-v.jpg"
        : "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-dark.jpg"

    const mainpageMovies = props.data.movies.filter(m => (
        ["ford-v-ferrari-2019",
        "portrait-of-a-lady-on-fire-2019","1917-2019",
        "the-irishman-2019", "doctor-sleep-2019"].includes(m.slug)
    ))
    const mainpageTopics = props.data.topics.filter(t => (
        ["mystery","romantic-comedy", "gangster-films", "cyberpunk",
        "art-house", "historical-figures" ].includes(t.slug)
    ))

    //console.log("props", props)
    return(
        <PageContainer  p={[0]} bg="light">
            <Head
                title={"Pixly - Popular and Upcoming Movies and List of Films"}
                description={"The latest and popular movies, list of films and movie collections that includes the best, " + 
                        "films of its theme. Search films by IMDb rating, year and genre"}
                keywords={["Movie Search", "Advance Movie Search", "Search by IMDb Rating", "Movie with Release Year"]}
                canonical={`https://pixly.app/popular-and-upcoming-movies`}
            />


            {false && <FlexBox 
                overflow="hidden" flexDirection="column" 
                position="relative"  
                width={"100%"} 
                borderBottom="8px solid"
                borderColor="rgba(40,40,40, 1)"
                zIndex={1}
            >
                <Carousel autoplay  speed={500} autoplayInterval={3000} swiping>
                    {mainpageMovies.map(movie => (
                        <FlexBox position="relative" width={"100%"} key={movie.slug} >
                            <CoverImage 
                                ratio={0.4}
                                alt={`Popular Films: ${movie.name}`}
                                title={`Popular Films: ${movie.name}`}
                                src={movie.coverPoster}
                                link={`/movie/${movie.slug}`}
                            />
                            <FlexBox position="absolute" left={0} bottom={0} zIndex={0} 
                                width="100%" bg={"rgba(0,0,0,0.4)"} 
                                height={["50px", "60px", "70px"]}
                                justifyContent="center" alignItems="center"
                            >
                                <Text fontSize={["16px","16px","16px", "18px"]}
                                    width="100%" textAlign="left" px="16px"
                                    fontWeight="bold" color="rgba(255,255,255,0.8)" textShadow="textDark"
                                    
                                    >
                                    {movie.name}
                                </Text>
                            </FlexBox>
                        </FlexBox>
                    ))}
                </Carousel>
            </FlexBox>}

            <ContentContainer>
                {/* SEARCH SETTING PANEL*/}
                <CardContainer>
                    <HeaderText textAlign="left">Popular & Upcoming Films  </HeaderText>
                    <Text opacity={0.85}>You can also search movies with respect to release year, genre or the IMDb rating.</Text>
                    <Form flexWrap="wrap" onSubmit={submitHandler} py={[3]} minWidth="100%" mt={[3]} zIndex={1}>
                        <FlexBox flexDirection={["column", "column", "row"]} width={"100%"}>
                            <YearSlider dispatcher={yearDispatcher} showLabel/>
                            <RatingSlider dispatcher={ratingDispatcher} showLabel/>
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
                                    bg="rgba(180,180,180,0.45)"
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
                    <SearchQueryBox lazyvariables={lazyvariables} skip={skip} initialMovies={props.data.movies} />
                
                </CardContainer>
                {/* RESULTS*/}
                
                <HomePageFeedAd />

                {/* COLLECTIONS */}
                <FlexBox width={"100%"} flexDirection="column" px={[2]}>
                    <MessageBox 
                        subheader={"Popular Film Collections"}
                        border={"0px"}
                        borderRadius={6}
                        boxShadow="card"
                        bg="#f1f1f1"
                    >
                        <Text>
                            We are passionately expanding our film collections. We have many great list of films that includes 
                            the best examples of its category like&nbsp;
                            <NewLink title="See the best arthouse movies" fontWeight="bold" follow link={"/topic/art-house"}><em title="See the best arthouse movies">Arthouse</em></NewLink>,&nbsp;
                            <NewLink title="See the best biographical movies" fontWeight="bold" follow link={"/topic/historical-figures"}><em title="See the best biographical movies">Biography</em></NewLink>,&nbsp;
                            <NewLink title="See the best cyberpunk movies" fontWeight="bold" follow link={"/topic/cyberpunk"}><em title="See the best cyberpunk movies">Cyberpunk</em></NewLink>,&nbsp;
                            <NewLink title="See the best gangster and mafia movies" fontWeight="bold" follow link={"/topic/gangster-films"}><em title="See the best gangster and mafia  movies">Gangster</em></NewLink>,&nbsp;
                            <NewLink title="See the best thought-provoking movies" fontWeight="bold" follow link={"/topic/thought-provoking"}><em title="See the best thought-provoking movies">Thought-Provoking</em></NewLink> and&nbsp;
                            <NewLink title="See the best mystery movies" fontWeight="bold" follow link={"/topic/mystery"}><em title="See the best mystery movies">Mystery</em></NewLink> movies.
                            Some of the popular movie collections are below. For more, visit&nbsp;
                            <NewLink link={"/lists-of-films"} underline title="Visit All Movie List Collections" follow>
                                <em title="See List of Film Archive">list of film collections</em>
                            </NewLink>
                            .
                        </Text>
                        <Grid columns={[2,2,3,]} py={[2]} gridColumnGap={[2]}>
                        {mainpageTopics.map( item => (
                            <CoverImage 
                                src={item.coverPoster} key={"rec" + item.slug}  
                                ratio={0.6} hoverShadow="hover"
                                boxShadow="card"
                                link={`/topic/${item.slug}`} 
                                alt={`Popular Topic Film Collection: ${item.name}.`} 
                                title={`Popular Topic Film Collection: ${item.name}.`} 
                            />
                        ))}
                    </Grid>
                    </MessageBox>
                </FlexBox>

                <MidPageAd />
            </ContentContainer>
        </PageContainer>
    );
}

const SearchQueryBox = ({lazyvariables, skip, initialMovies}) => {
    const [page, setPage] = useState(1)
    const skipQuery = (lazyvariables.keywords.length>2 || lazyvariables.tags) ? false : true
    const { loading, data, error } = useQuery(COMPLEX_SEARCH, {variables:{page:page, ...lazyvariables}, skip:skipQuery});
    //console.log("skip",skipQuery)

    //Network Status
    //const { effectiveConnectionType } = useNetworkStatus();
    //let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "slow" : "slow" : "slow"
    const speed = "slow"
    const networkSensitiveColumns = speed === "fast" ? [2,2,2,3,3,4] : [3,3,3,4,4,6]


    const prevPage = useCallback(() => setPage(page - 1), [page])
    const nextPage = useCallback(() => setPage(page + 1), [page])

    if (data===undefined && skipQuery && initialMovies){
        const firstPart = initialMovies.slice(0, 12)
        const secondPArt = initialMovies.slice(12)
        return (
            <FlexBox flexDirection="column" width="100%">
                <Grid columns={networkSensitiveColumns} pb={[4]} gridColumnGap={[1]} gridRowGap={[1]} width="100%">
                    {initialMovies.map( item => (
                        <MovieRecommendationCard item={item} speed={speed} key={"rec" + item.id} />
                    ))}
                </Grid>
            </FlexBox>
        )
    }
    if (loading && data===undefined) return <FlexBox width="100%" justifyContent="center" alignItems="center" position="relative" minHeight="250px"><LoadingIcon text="Searching"/></FlexBox>
    if (data) {
        //console.log("data",data)
        const pageQuantity = data.complexSearch.result.length
        const firstPart = data.complexSearch.result.slice(0, 12)
        const secondPArt = data.complexSearch.result.slice(12)
        return (
            <>
            <Grid columns={networkSensitiveColumns} pb={[4]} gridColumnGap={[1]} gridRowGap={[1]}>
                {firstPart.map( item => (
                    <MovieRecommendationCard item={item} speed={speed} key={"rec" + item.id} />
                ))}
            </Grid>
            <Grid columns={networkSensitiveColumns} py={[4]} gridColumnGap={[1]} gridRowGap={[1]}>
                {secondPArt.map( item => (                    
                        <MovieRecommendationCard item={item} speed={speed} />
                ))}
            </Grid>
            {data.complexSearch.quantity >= 18 &&
                    <PaginationBox mb={[2]}
                        currentPage={data.complexSearch.quantity!==null && page} 
                        totalPage={Math.ceil(data.complexSearch.quantity/18)} 
                        nextPage={nextPage} prevPage={prevPage} 
                    />}
            </>
    )}

    else return <div></div>
}  


const MovieRecommendationCard = ({ item, speed }) => (
	<SuperBox borderRadius={"4px"}
		width="100%"
        src={speed === "fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster} 
		ratio={speed === "slow" ? 1.5 : 0.7}
		boxShadow="card"
        className="recommendation-similar-movie-card"
        title={item.name + `(${item.year})`}
	>	
        <CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0} title={`Visit ${item.name}`}/>
        
        <NewLink link={`/movie/${item.slug}`}>
            <Text position="absolute" bottom={0} left={0} fontSize={["12px", "12px", "14px"]} fontWeight="bold" color="light">
                {item.name} ({item.year})
            </Text>
        </NewLink>

	</SuperBox>
)


const MoviesPageQuery = props => {
	const { loading, error, data } = useQuery(MAIN_PAGE, {
		partialRefetch: true
	});
	if (loading) return <Loading />;
	//console.log("main", data)
	if (error) return <div>{error.message}</div>;
	if (data) return <MoviesPage data={data.mainPage} {...props} />;
};

export default withRouter(MoviesPageQuery);


