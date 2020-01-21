import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, useParams, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd, HomePageFeedAd, MoviePageAd,
    useValues, useWindowSize, FeedMobileTopicPageAd, useDebounce
} from "../../functions"


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText,Image,CoverImage,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,
    //YearSlider,RatingSlider,
    HtmlBox, HtmlContainer, MessageBox, Hr,
    LargeTopicMovieCard, WhiteMovieCard, HeaderMini, TagBox, SuperBox, CoverLink, NewLink,
    Ul,Li,ImdbRatingIcon, AbsoluteBox,BookmarkMutation
} from "../../styled-components"
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';

import { YearSlider, RatingSlider, TagSelect, SearchInputMaterial } from "../../styled-material"



const FilterPanel = ({ dispatcher, states }) => {
    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})
    
    // IF AUTOFILTER UNCOMMENT IT AND REMOVE BUTTON
    //const debouncedYears = useDebounce(yearData, 500);
    //const debouncedRatings = useDebounce(ratingData, 500);

    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])

    const submitHandler = (e) => {
        e.preventDefault()
        const filterVariables = {...yearData, ...ratingData}
        if (!isEqualObj( states, filterVariables)){
            dispatcher(filterVariables);
        }
    }
    /*
    IN CASE OF AUTO FILTER UNCOMMENT
    useEffect(() =>{
        const filterVariables = {...debouncedYears, ...debouncedRatings}
        console.log("filter panel dispatcer", filterVariables)
        dispatcher(filterVariables)
    })
    */
    return (
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
            <FlexBox width={["100%"]} flexDirection={"column"}>
                <FlexBox width={["100%"]} flexDirection={["column", "column", "column", "row"]}>
                    <YearSlider dispatcher={yearDispatcher}  iconColor="black" />
                    <RatingSlider dispatcher={ratingDispatcher} />
                </FlexBox>

                <Button 
                    type="submit" 
                    display="flex" alignItems="center" justifyContent="center"
                    width="100%" height={"40px"}
                    fontWeight="bold" 
                    color="light" bg="#282828"
                    px={[4,4,5]} borderRadius={"8px"}
                    hoverBg="#181818" boxShadow="card" 
                >
                    <SearchIcon  stroke="white" strokeWidth="3" size={16} position="relative" bottom={0}/>Search
                </Button>
            </FlexBox>

            </FlexBox>
        </Form>
    )
}


const TopicQuery = ({ lazyvariables }) =>{
    const { slug, page=1 } = useParams();
    let history = useHistory();
    const node = useRef(null) // FOR PAGINATION: SCROLL TOP
    const screenSize = useWindowSize()

    const [ filterVariables, setFilterVariables ] = useState({minYear:1950, maxYear:2019, minRating:5.0, maxRating:9.9})


    const { loading, data, error } = useQuery(TOPIC_SEARCH_QUERY,{variables:{
        topicSlug:slug, page,
        minRating:filterVariables.minRating, maxRating:filterVariables.maxRating,
        minYear:filterVariables.minYear, maxYear:filterVariables.maxYear
    },partialRefetch:true})

    // Filter Dispatcher
    const filterDispatcher = useCallback((data) => setFilterVariables(data), [filterVariables])

    // Pagination Handlers
    const nextPage = () => history.push(`/topic/${slug}/${parseInt(page) + 1}`)
    const dynamicSuffix = useMemo(() => parseInt(page)===2 ? "" : `/${parseInt(page) - 1}`,[page])
    const prevPage = () => history.push(`/topic/${slug}${dynamicSuffix}`)



    //Network
    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"
    const networkResponsiveRatio = useMemo(() => speed==="fast" ? 0.7 : 1.5, [speed])
    const networkResponsiveColumn = useMemo(() => speed==="fast" ? [1,1,1,2,2,2,3] : [1,1,2,2,3,3,4], [speed])


    //const firstPart = items.slice(0, 6)
    //const secondPArt = items.slice(6, 12)
    //const thirdPart = items.slice(12, 24)
    //console.log(data, loading)
    if (error) return <div>{error.message}</div>
    if (!data && loading) return <Loading />
    if (data){
        const topic = data.complexSearch.topic
        const items = data.complexSearch.topicResult
        const quantity = data.complexSearch.quantity || 0
        const isOrdered = topic.isOrdered

        console.log(topic, items, quantity, isOrdered, screenSize)

        // Other variables
        const title = "See the details of the " + topic.shortName.toLowerCase() + " movie."
        const columns = isOrdered ? [1] : networkResponsiveColumn

        const MovieCard = (props) => isOrdered ? <OrderedCard {...props} /> : <UnorderedCard {...props} />

        return (
            <PageContainer>
                <Head richdata={topic.richdata}
                    title={topic.seoTitle}
                    description={topic.seoDescription}
                    keywords={topic.keywords}
                    image={topic.coverPoster ? topic.coverPoster : topic.poster ? topic.poster : null}
                    canonical={`https://pixly.app/topic/${topic.slug}`}
                />
            
                {topic.heroPoster &&
                    <Image src={topic.heroPoster} 
                        width="100vw" height="auto" minHeight="100px" position="relative"
                        minHeight={160}
                        alt={topic.name} 
                        title={topic.name} 
                    />}
                
                <ContentContainer minHeight={"150px"} maxWidth={"100%"}
                    flexDirection="column" pb={[4,4]}
                >
                    {/* TOPIC MAIN TEXT & STRUCTURED ARTICLE DATA*/}
                    <SchemaArticle 
                        headerSize={["24px", "26px", "28px", "32px"]}
                        textSize={["14px","16px", "16px", "18px"]}
                        mt={[3]} mb={[0]} py={[0]}
                        header={topic.name}
                        quote={topic.quotes.length > 0 && topic.quotes[0]}
                        description={topic.seoShortDescription}
                        summary={topic.summary}
                        content={topic.content}
                        image={topic.coverPoster}
                        createdAt={topic.createdAt}
                        updatedAt={topic.updatedAt}
                        wiki={topic.wiki}
                    >   
                        <HtmlContainer 
                            my={[3]} 
                            fontSize={["14px","16px", "16px", "18px"]} 
                            html={topic.htmlContent}     
                        />
                    </SchemaArticle>
                    
                    {/* FILTER WITH YEAR AND RATING */}
                    {topic.searchable && <FilterPanel dispatcher={filterDispatcher} states={filterVariables} />}

                    <Hr />
                


                    {/* CONTENT */}
                    <Grid columns={columns} py={[1]} gridColumnGap={[3,3,3,4]} width="100%" height="auto" >
                        {items.slice(0,6).map( item => (
                                <MovieCard key={"rec" + item.id}
                                    item={item}  title={title}
                                    ratio={networkResponsiveRatio} 
                                    speed={speed}
                                />
                        ))}
                    </Grid>
                    <Grid columns={columns} py={[1]} gridColumnGap={[3,3,3,4]} width="100%" height="auto" >
                        {items.slice(6, 12).map( item => (
                                <MovieCard key={"rec" + item.id}
                                    item={item}  title={title}
                                    ratio={networkResponsiveRatio} 
                                    speed={speed}
                                />
                        ))}
                    </Grid>
                    <Grid columns={columns} py={[1]} gridColumnGap={[3,3,3,4]} width="100%" height="auto" >
                        {items.slice(12, 18).map( item => (
                                <MovieCard key={"rec" + item.id}
                                    item={item}  title={title}
                                    ratio={networkResponsiveRatio} 
                                    speed={speed}
                                />
                        ))}
                    </Grid>

                    {/* PAGINATION */}
                    <Box id="search-rresult-box"  ref={node}
                        borderColor="rgba(40,40,40, 0.3)"
                        minWidth={["100%", "100%", "100%", "100%", "100%"]} height={"auto"}
                        p={[1,2,3]}
                    >
                    {quantity > 18 &&
                        <PaginationBox 
                            currentPage={page} 
                            totalPage={Math.ceil(quantity/18)} 
                            nextPage={nextPage} prevPage={prevPage} 
                        />}
                    {topic.references && 
                        <HtmlContainer 
                            my={[5]} 
                            fontSize={["14px","16px", "16px", "18px"]} 
                            html={queryData.topic.references}     
                        />}
                    </Box>
                </ContentContainer>
            </PageContainer>
        )
    }
    else return <div></div>
}

const OrderedCard = ({ item, ratio, speed}) => (
    <FlexBox width="100%" >
        
    </FlexBox>
)


const UnorderedCard = ({ item, speed, ratio, title=null }) => (
        <FlexBox
            width="100%"
            maxWidth={"600px"}
            position="relative"
            boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
            overflow="hidden" 
        >	
        
            <CoverImage 
                src={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                title={"Visit " + item.name}
                alt={`${item.name} poster`} 
                ratio={ratio}  
                link={`/movie/${item.slug}`} 
            />
            <AbsoluteBox top={"20px"} right={"20px"}>
                <ImdbRatingIcon rating={item.imdbRating} />
            </AbsoluteBox>
            <AbsoluteBox top={"20px"} left={"20px"}>
                <BookmarkMutation active={item.isBookmarked} id={item.id}/>
            </AbsoluteBox>
    
            <FlexBox 
                flexDirection="column" justifyContent="space-between"
                px={[2]} pt={[2]} pb={[1]}
                minHeight={"80px"} 
                maxHeight={["50%", "50%", "50%", "45%","35%"]}
                width={"100%"} 
                position="absolute" 
                bottom={0} left={0}
                bg={"rgba(0,0,0, 0.85)"} zIndex={1}
            >
                <HeaderMini fontSize={["14px","14px","14px", "16px"]} 
                    color="light"  
                    pb={[1]}
                >
                    <NewLink 
                        link={`/movie/${item.slug}`} 
                        hoverUnderline 
                        follow={true}
                        title={title ? `${item.name} (${item.year}): ${title} ` : `${item.name} (${item.year})`}
                    >
                        {item.name.trim()}
                    </NewLink>
                    &nbsp;({item.year})
                </HeaderMini>
                <Text fontSize={["12px","12px","14px", "14px"]} 
                    color="rgba(255,255,255, 0.75)" 
                    lineHeight={["14px","14px","16px", "16px"]}
                    maxHeight={"60px"} pb={[1]}
                >
                    {item.summary.length > 120 ? item.summary.slice(0,115) + ".." : item.summary}
                </Text>
                <TagBox tags={item.tags || []}
                    num={6} 
                    color={"rgba(255,255,255, 0.75)"} 
                    fontSize={["10px", "10px", "10px", "10px"]} 
                    flexWrap="nowrap" overflow="hidden"    
                />
            </FlexBox>
        </FlexBox>
)




export default withRouter(TopicQuery);
