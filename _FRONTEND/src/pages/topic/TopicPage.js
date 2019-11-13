import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd,HomePageFeedAd} from "../../functions"
import { renderToStaticMarkup, renderToString } from 'react-dom/server';


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,
    YearSlider,RatingSlider,HtmlBox, HtmlContainer,
} from "../../styled-components"


const TopicPage = (props) =>{
    const topicSlug = props.match.params.slug 

    const [page, setPage] = useState(1)

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

    const nextPage = () => setPage(page => page + 1)
    const prevPage = () => setPage(page => page - 1)
    
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

    return(
        <PageContainer>
            
            {isReady &&
                <Head
                    richdata={queryData.topic.richdata}
                    title={queryData.topic.seoTitle}
                    description={queryData.topic.seoShortDescription}
                    keywords={queryData.topic.keywords}
                    image={queryData.topic.coverPoster ? queryData.topic.coverPoster : queryData.topic.poster ? queryData.topic.poster : null}
                    canonical={`https://pixly.app/topic/${queryData.topic.slug}`}
                />
            }
            <ContentContainer>
                <FlexBox flexDirection="column" px={[2,3,4]} alignItems="flex-start" minHeight={"150px"}>
                    {isReady &&
                        <SchemaArticle 
                            headerSize={[24, 26, 28, 32]}
                            textSize={[14,16, 16, 18]}
                            mt={[3]} mb={[0]} py={[0]}
                            header={queryData.topic.name}
                            quote={queryData.topic.quotes.length > 0 && queryData.topic.quotes[0]}
                            description={queryData.topic.seoShortDescription}
                            summary={!haveStaticMarkup ? queryData.topic.summary : null}
                            content={!haveStaticMarkup ? queryData.topic.content : null}
                            createdAt={queryData.topic.createdAt}
                            updatedAt={queryData.topic.updatedAt}
                            wiki={queryData.topic.wiki}
                        >   
                            <HtmlContainer my={[3]} fontSize={[14,16, 16, 18]} html={queryData.topic.htmlContent} />
                        </SchemaArticle>}   
                </FlexBox>

                {queryData && queryData.topic.searchable && <Form flexWrap="wrap" onSubmit={submitHandler}>
                    <FlexBox id="search-settings-box" 
                        flexDirection={["row", "row"]} 
                        width={["100%", "100%", "100%"]}  
                        minHeight={["80px", "80px", "80px", "100%"]}
                        justifyContent="space-around"
                        flexWrap="wrap"
                        px={[3]}
                        borderBottom="1px solid"
                        borderTop="1px solid"
                    >

                    <YearSlider dispatcher={yearDispatcher}  />
                    <RatingSlider dispatcher={ratingDispatcher} />


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
                </Form>}

                <Box id="search-rresult-box"  
                        borderColor="rgba(40,40,40, 0.3)"
                        minWidth={["100%", "100%", "100%", "100%", "100%"]} minHeight={["100vw"]}
                        p={[1,2,3]}
                    >
                    <SearchQueryBox 
                        topicSlug={topicSlug} 
                        page={page} 
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

const SearchQueryBox = React.memo(({topicSlug, page, lazyvariables, dispatcher}) =>{
    const variables = lazyvariables ? lazyvariables : {minYear:1950, maxYear:2019, minRating:5.0, maxRating:9.9}
    const { loading, data, } = useQuery(TOPIC_SEARCH_QUERY,{variables:{
        topicSlug, page, ...variables
    },partialRefetch:true})


    //console.log("topic query")


    if (loading) return <Loading />
    if (data && data.complexSearch) {
        const willBeDispatched = {topic:data.complexSearch.topic, quantity:data.complexSearch.quantity}
        const pageQuantity = data.complexSearch.topicResult.length 
        const firstPart = data.complexSearch.topicResult.slice(0, Math.floor(pageQuantity/ 2))
        const secondPArt = data.complexSearch.topicResult.slice(Math.floor(pageQuantity/ 2), 30)
        //console.log("data", firstPart, secondPArt)
        dispatcher(willBeDispatched)
        return (
            <>
            <Grid columns={[1,1,1,2,2,2,2,3,4]} py={[4]}>
                {firstPart.map( item => (
                    <MovieRichCard item={item} key={"rec" + item.id} follow={false} />
                ))}
            </Grid>
            <HomePageFeedAd/>
            <Grid columns={[1,1,1,2,2,2,2,3,4]} py={[4]}>
                {secondPArt.map( item => (
                    <MovieRichCard item={item} key={"rec" + item.id} follow={false} />
                ))}
            </Grid>
            <MidPageAd />
            </>

        )}
}, (p,n) => (isEqualObj(p.lazyvariables,n.lazyvariables) && p.page === n.page) )



export default withRouter(TopicPage);
