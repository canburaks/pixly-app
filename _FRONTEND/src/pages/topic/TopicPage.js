import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, useParams, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd,HomePageFeedAd,MoviePageAd,
    useValues, useWindowSize, FeedMobileTopicPageAd
} from "../../functions"

import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as SocialButtons from 'react-social-sharing'


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText,Image,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,
    YearSlider,RatingSlider,HtmlBox, HtmlContainer, MessageBox, Hr,
    LargeTopicMovieCard, WhiteMovieCard, HeaderMini, TagBox, SuperBox, CoverLink, NewLink,
    Ul,Li
} from "../../styled-components"
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';


export const ResponsiveTopicCard = ({ item }) => {
    const screenSize = useWindowSize()
    const isLargeScreen = useMemo(() => screenSize.includes("L"), [screenSize])
    //console.log("isLargeScreen", isLargeScreen)
    return (
        <LargeTopicMovieCard item={item} />
    )
}

const TopicPage = (props) =>{
    let history = useHistory();
    const { slug:topicSlug, page=1 } = useParams();

    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})

    const [lazyvariables,setLazyVariables] = useState(null)
    const [queryData, setQueryData] = useState(null)
    const isReady = useMemo(() => (queryData && queryData.topic) ? true : false, [queryData])
    const haveStaticMarkup = useMemo(
        () => (isReady && queryData.topic.htmlContent && queryData.topic.htmlContent.length > 5)
            ? true 
            : false
    , [isReady])

    
    //handlers
    const dataDispatcher = useCallback((data) => (queryData===null || queryData===undefined) && setQueryData(data), [queryData])
    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])
    const nextPage = () => history.push(`/topic/${topicSlug}/${parseInt(page) + 1}`)
    const prevPage = () => history.push(`/topic/${topicSlug}${
            parseInt(page)===2 ? "" : `/${parseInt(page) - 1}`}`)
    
    if (lazyvariables === null) setLazyVariables({...yearData, ...ratingData})

    //console.log("yearData",yearData)
    //isReady && console.log(queryData)
    //console.log("topic data", queryData)

    const submitHandler = (e) => {
        e.preventDefault()
        const newLazyVars = {...yearData, ...ratingData}
        if (!isEqualObj(lazyvariables, newLazyVars)){
            setLazyVariables(newLazyVars);
            setPage(1);
        }
    }
    // Page Scroll
    useEffect(() => {
        if (page === undefined || parseInt(page)===1){
            window.scrollTo({left:0, top:0, behavior:"smooth"})
        }
        else if (parseInt(page) > 1){
            const resultbox = document.getElementById("search-rresult-box")
            window.scrollTo({left:0, top:resultbox.offsetTop, behavior:"smooth"})
        }
    },[page])
    
    const featuremovies = isReady ? queryData.topic.featureMovies : [];
    return(
        <PageContainer>
            
            {isReady &&
                <Head
                    richdata={queryData.topic.richdata}
                    title={queryData.topic.seoTitle}
                    description={queryData.topic.seoDescription}
                    keywords={queryData.topic.keywords}
                    image={queryData.topic.coverPoster ? queryData.topic.coverPoster : queryData.topic.poster ? queryData.topic.poster : null}
                    canonical={`https://pixly.app/topic/${queryData.topic.slug}`}
                />
            }
            {isReady && queryData.topic.heroPoster && 
                <Image 
                    src={queryData.topic.heroPoster} 
                    width="100vw" height="auto" minHeight="100px"
                    alt={queryData.topic.name} 
                    title={queryData.topic.name} 
                />
                }
            <ContentContainer>

                <FlexBox 
                    flexDirection="column" 
                    px={[2,3,4]} pb={[4,4]}
                    alignItems="flex-start" 
                    minHeight={"150px"} maxWidth={"100%"}
                    >

                    {isReady &&
                        <>
                        <SchemaArticle 
                            headerSize={["24px", "26px", "28px", "32px"]}
                            textSize={["14px","16px", "16px", "18px"]}
                            mt={[3]} mb={[0]} py={[0]}
                            header={queryData.topic.name}
                            quote={queryData.topic.quotes.length > 0 && queryData.topic.quotes[0]}
                            description={queryData.topic.seoShortDescription}
                            summary={!haveStaticMarkup ? queryData.topic.summary : null}
                            content={!haveStaticMarkup ? queryData.topic.content : null}
                            image={queryData.topic.coverPoster}
                            createdAt={queryData.topic.createdAt}
                            updatedAt={queryData.topic.updatedAt}
                            wiki={queryData.topic.wiki}
                        >   
                            <HtmlContainer 
                                my={[3]} 
                                fontSize={["14px","16px", "16px", "18px"]} 
                                html={queryData.topic.htmlContent}     
                            />
                        </SchemaArticle>
                        {isReady && featuremovies.map((fm,i )=> <FeatureMovie movie={fm} key={`feature${i}`} /> )}

                        {/*<FlexBox my={[4,4,4,5]} width={"100%"} overflow="hidden" flexWrap="wrap" className="social-share-box" flexDirection="row">
                            <SocialButtons.Twitter className="social-share" link={"https://pixly.app/" + window.location.pathname} />
                            <SocialButtons.Facebook className="social-share" link={"https://pixly.app/" + window.location.pathname} />
                            <SocialButtons.Linkedin className="social-share" link={"https://pixly.app/" + window.location.pathname} />
                            <SocialButtons.Tumblr className="social-share" link={"https://pixly.app/" + window.location.pathname} />
                            <SocialButtons.Pinterest className="social-share" link={"https://pixly.app/" + window.location.pathname} />
                        </FlexBox> */}
                        </>
                        }   
                </FlexBox>

                {queryData && queryData.topic.searchable && 
                    <Form flexWrap="wrap" onSubmit={submitHandler}>
                        <FlexBox id="search-settings-box" className="topic-page"
                             
                            width={["100%", "100%", "100%"]}  
                            minHeight={["80px", "80px", "80px", "100%"]}
                            justifyContent="space-around"
                            alignItems="center"
                            flexWrap="wrap"
                            px={[3]} mt={[3]}
                            borderBottom="1px solid"
                            borderTop="1px solid"
                        >

                        <FlexBox 
                            width={["80%","80%","80%","90%"]} 
                            flexDirection={["column", "column", "column", "row"]}
                        >
                            <YearSlider 
                                dispatcher={yearDispatcher}  iconColor="black" 
                                width={["100%"]} 
                                />
                            <RatingSlider 
                                dispatcher={ratingDispatcher} iconColor="black"
                                width={["100%"]} 
                                />
                        </FlexBox>


                            <Button type="submit" 
                                display="flex" justifyContent="center" alignItems="center"
                                p={0} width={[30, 35, 40,45]} height={[30, 35, 40,45]} 
                                hoverBg={"blue"}
                                borderRadius="50%" 
                                bg="dark"
                            >
                                <SearchIcon  stroke="white" strokeWidth="3" size={20} />
                            </Button>
                        </FlexBox>
                    </Form>
                    }
                <Hr />
                
                <Box id="search-rresult-box"  
                        borderColor="rgba(40,40,40, 0.3)"
                        minWidth={["100%", "100%", "100%", "100%", "100%"]} height={["100vw"]}
                        p={[1,2,3]}
                    >
                    <SearchQueryBox 
                        topicSlug={topicSlug} 
                        lazyvariables={lazyvariables} 
                        dispatcher={dataDispatcher} 
                    />

                    { queryData && queryData.quantity > 18&&
                    <PaginationBox 
                        currentPage={page} 
                        totalPage={Math.ceil(queryData.quantity/18)} 
                        nextPage={nextPage} prevPage={prevPage} 
                    />}
                </Box>
            </ContentContainer>
        </PageContainer>
    );
}

const SearchQueryBox = React.memo(({topicSlug, lazyvariables, dispatcher}) =>{
    const { slug, page=1 } = useParams();
    const variables = lazyvariables ? lazyvariables : {minYear:1950, maxYear:2019, minRating:5.0, maxRating:9.9}
    const { loading, data, } = useQuery(TOPIC_SEARCH_QUERY,{variables:{
        topicSlug, page, ...variables
    },partialRefetch:true})


    //Network
    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"
    const networkResponsiveRatio = useMemo(() => speed==="fast" ? 0.7 : 1.5)
    const networkResponsiveColumn = useMemo(() => speed==="fast" ? [1,1,1,2,2,2,3] : [2,2,3,3,3,4,4,6])

    if (loading) return <Loading />
    if (data && data.complexSearch) {
        const willBeDispatched = {topic:data.complexSearch.topic, quantity:data.complexSearch.quantity}
        const pageQuantity = data.complexSearch.topicResult.length 
        //const firstPart = data.complexSearch.topicResult.slice(0, Math.floor(pageQuantity/ 2) + 1)
        //const secondPArt = data.complexSearch.topicResult.slice(Math.floor(pageQuantity/ 2) + 1, 30)

        const featuremovieslugs = data.complexSearch.topic.featureMovies.map(fm => fm.slug)
        const renderMovies = data.complexSearch.topicResult.filter(mv => !featuremovieslugs.includes(mv.slug))

        const firstPart = renderMovies.slice(0, 6)
        const secondPArt = renderMovies.slice(6, 12)
        const thirdPart = renderMovies.slice(12, 24)

        const isMobile = window.innerWidth < 480;
        //const ResponsiveAd1 = isMobile ? FeedMobileTopicPageAd : HomePageFeedAd
        //const ResponsiveAd2 = isMobile ? FeedMobileTopicPageAd : MidPageAd
        //const ResponsiveAd3 = isMobile ? FeedMobileTopicPageAd : MoviePageAd

        //console.log("data", firstPart, secondPArt)
        dispatcher(willBeDispatched)
        return (
            <Ul>
                <Grid columns={networkResponsiveColumn} py={[3]} gridColumnGap={[3,3,3,4]} className="asdasd">
                    {firstPart.map( item => (
                            <Li key={"rec" + item.id}>
                            <MovieRecommendationCard 
                                item={item}  
                                ratio={networkResponsiveRatio} 
                                poster={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                            />
                            </Li>
                    ))}
                </Grid>
                <HomePageFeedAd/>
                <Grid columns={networkResponsiveColumn} py={[3]} gridColumnGap={[3,3,3,4]}>
                    {secondPArt.map( item => (
                        <LazyLoadComponent key={"rec" + item.id}>
                            <Li>
                            <MovieRecommendationCard 
                                item={item}  
                                ratio={networkResponsiveRatio} 
                                poster={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                            />
                            </Li>
                        </LazyLoadComponent>
                    ))}
                </Grid>
                <MoviePageAd />
                <Grid columns={networkResponsiveColumn} py={[3]} gridColumnGap={[3,3,3,4]}>
                    {thirdPart.map( item => (
                        <LazyLoadComponent key={"rec" + item.id}>
                            <Li>
                            <MovieRecommendationCard 
                                item={item}  
                                ratio={networkResponsiveRatio} 
                                poster={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                            />
                            </Li>
                        </LazyLoadComponent>
                    ))}
                </Grid>
                <br/>
            </Ul>

        )}
}, (p,n) => (isEqualObj(p.lazyvariables,n.lazyvariables) && p.page === n.page) )



const MovieRecommendationCard = ({ item, poster, ratio }) => (
	<SuperBox
		width="100%"
        src={poster}
        maxWidth={"600px"}
		ratio={ratio}
        position="relative"
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
	>	
        <CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0} title={`Visit ${item.name}`}/>
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column" px={[2]} pt={[2]}
			bg={"rgba(0,0,0, 0.85)"} minHeight={"80px"} zIndex={1}
		>
			<Text color="light" fontWeight="bold">
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.tags || []} num={6} color={"light"}/>
		</FlexBox>

	</SuperBox>
)

const FeatureMovie = ({ movie }) => (
    <FlexBox flexDirection="column" mt={[3,3,4]}>
        <HeaderMini>{movie.name} ({movie.year})</HeaderMini>
        <Image 
            src={movie.widePoster} 
            alt={"The Best Mystery Movies: " + movie.name} title={"The Best Mystery Movies: " + movie.name} 
            width={"100%"} height="auto" minHeight="50px" 
            my={[2]}    
        />
        <HtmlContainer my={[3]} html={movie.htmlContent} />
    </FlexBox>
)


export default withRouter(TopicPage);
