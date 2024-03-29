import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, useParams, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd,HomePageFeedAd,MoviePageAd,
    useValues, useWindowSize, FeedMobileTopicPageAd
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

const HeroCSSBanner = ({header, subheader}) => (
    <FlexBox width="100%" width={400} bg="#ffcc35" justifyContent="center" alignItems="center">

    </FlexBox>
) 

const TopicPage = (props) =>{
    let history = useHistory();
    const { slug:topicSlug, page=1 } = useParams();

    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})
    const node = useRef(null)

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
        }
    }
    // Page Scroll
    useEffect(() => {
        //if (page === undefined || parseInt(page)===1){
        //    window.scrollTo({left:0, top:0, behavior:"smooth"})
        //}
        if (parseInt(page) > 1 && node && node.current){
            window.scrollTo({left:0, top:node.current.offsetTop, behavior:"smooth"})
        }
    },[page])

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
                    width="100vw" height="auto" minHeight="100px" position="relative"
                    minHeight={160}
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
                            width={["100%"]} 
                            flexDirection={"column"}
                        >
                            <FlexBox 
                                width={["100%"]} 
                                flexDirection={["column", "column", "column", "row"]}
                            >

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
                    }
                <Hr />
                
                <Box id="search-rresult-box"  ref={node}
                        borderColor="rgba(40,40,40, 0.3)"
                        minWidth={["100%", "100%", "100%", "100%", "100%"]} height={["100vw"]}
                        p={[1,2,3]}
                    >
                    <SearchQueryBox 
                        lazyvariables={lazyvariables} 
                        dispatcher={dataDispatcher} 
                    />

                    { queryData && queryData.quantity > 18&&
                    <PaginationBox 
                        currentPage={page} 
                        totalPage={Math.ceil(queryData.quantity/18)} 
                        nextPage={nextPage} prevPage={prevPage} 
                    />}
                {queryData && queryData.topic.references && 
                    <HtmlContainer 
                        my={[5]} 
                        fontSize={["14px","16px", "16px", "18px"]} 
                        html={queryData.topic.references}     
                    />}
                </Box>
            </ContentContainer>
        </PageContainer>
    );
}

const SearchQueryBox = React.memo(({ lazyvariables, dispatcher}) =>{
    const { slug, page=1 } = useParams();
    const variables = lazyvariables ? lazyvariables : {minYear:1950, maxYear:2019, minRating:5.0, maxRating:9.9}
    const { loading, data, } = useQuery(TOPIC_SEARCH_QUERY,{variables:{
        topicSlug:slug, page, ...variables
    },partialRefetch:true})


    //Network
    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"
    const networkResponsiveRatio = useMemo(() => speed==="fast" ? 0.7 : 1.5)
    const networkResponsiveColumn = useMemo(() => speed==="fast" ? [1,1,1,2,2,2,3] : [1,1,2,2,3,3,4])

    if (data && data.complexSearch) {
        const willBeDispatched = {topic:data.complexSearch.topic, quantity:data.complexSearch.quantity}
        
        

        const firstPart = data.complexSearch.topicResult.slice(0, 6)
        const secondPArt = data.complexSearch.topicResult.slice(6, 12)
        const thirdPart = data.complexSearch.topicResult.slice(12, 24)

        //const ResponsiveAd1 = isMobile ? FeedMobileTopicPageAd : HomePageFeedAd
        //const ResponsiveAd2 = isMobile ? FeedMobileTopicPageAd : MidPageAd
        //const ResponsiveAd3 = isMobile ? FeedMobileTopicPageAd : MoviePageAd

        //console.log("data", data.complexSearch)
        
        dispatcher(willBeDispatched)
        return (
                <>
                <Grid columns={networkResponsiveColumn} py={[1]} gridColumnGap={[3,3,3,4]} className="asdasd">
                    {firstPart.map( item => (
                            <MovieRecommendationCard 
                                item={item}  key={"rec" + item.id}
                                ratio={networkResponsiveRatio} 
                                title={"See the details of the " + data.complexSearch.topic.shortName.toLowerCase() + " movie."}
                                poster={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                            />
                    ))}
                </Grid>
                <HomePageFeedAd/>
                <Grid columns={networkResponsiveColumn} py={[1]} gridColumnGap={[3,3,3,4]}>
                    {secondPArt.map( item => (
                        <LazyLoadComponent key={"rec" + item.id}>
                            <MovieRecommendationCard 
                                item={item}  
                                ratio={networkResponsiveRatio} 
                                title={"See the details of the " + data.complexSearch.topic.shortName.toLowerCase() + " movie."}
                                poster={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                            />
                        </LazyLoadComponent>
                    ))}
                </Grid>
                <MoviePageAd />
                <Grid columns={networkResponsiveColumn} py={[1]} gridColumnGap={[3,3,3,4]}>
                    {thirdPart.map( item => (
                        <LazyLoadComponent key={"rec" + item.id}>
                            <MovieRecommendationCard 
                                item={item}  
                                ratio={networkResponsiveRatio} 
                                title={"See the details of the " + data.complexSearch.topic.shortName.toLowerCase() + " movie."}
                                poster={speed==="fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster}
                            />
                        </LazyLoadComponent>
                    ))}
                </Grid>
                <br/>
            </>

        )}
    else return <div></div>
}, (p,n) => (isEqualObj(p.lazyvariables,n.lazyvariables) && p.page === n.page) )


const MovieRecommendationCard = ({ item, poster, ratio, title=null }) => (
	<FlexBox
		width="100%"
        maxWidth={"600px"}
        position="relative"
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        overflow="hidden" 
	>	
        <CoverImage 
            src={poster} title={"Visit " + item.name}
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




export default withRouter(TopicPage);
