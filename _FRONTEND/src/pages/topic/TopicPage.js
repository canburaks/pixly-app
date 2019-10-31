import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd} from "../../functions"


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,
    YearSlider,RatingSlider,
} from "../../styled-components"


const TopicPage = (props) =>{
    const topicSlug = props.match.params.slug 

    const [page, setPage] = useState(1)

    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})

    const [lazyvariables,setLazyVariables] = useState(null)
    const [queryData, setQueryData] = useState(null)

    
    //handlers
    const dataDispatcher = useCallback((data) => (queryData===null || queryData===undefined) && setQueryData(data), [queryData])
    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])

    const nextPage = () => setPage(page => page + 1)
    const prevPage = () => setPage(page => page - 1)
    
    if ( lazyvariables === null) setLazyVariables({...yearData, ...ratingData})

    //console.log("yearData",yearData)
    //console.log("ratingData",ratingData)
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
            {queryData && queryData.topic &&
                <Head
                    title={queryData.topic.seoTitle}
                    description={queryData.topic.seoShortDescription}
                    keywords={queryData.topic.keywords}
                    image={queryData.topic.coverPoster ? queryData.topic.coverPoster : queryData.topic.poster ? queryData.topic.poster : null}
                    canonical={`https://pixly.app/topic/${queryData.topic.slug}`}
                />
            }

            <FlexBox flexDirection="column" px={[2,3,4]} alignItems="flex-start" minHeight={"150px"}>
                {queryData && queryData.topic &&
                    <SchemaArticle 
                        headerSize={[24, 26, 28, 32, 36]}
                        textSize={[14,16]}
                        mt={[3]} mb={[0]} py={[0]}
                        header={queryData.topic.name}
                        quote={queryData.topic.quotes.length > 0 && queryData.topic.quotes[0]}
                        summary={queryData.topic.summary}
                        content={queryData.topic.content}
                        createdAt={queryData.topic.createdAt}
                        updatedAt={queryData.topic.updatedAt}
                        wiki={queryData.topic.wiki}
                    />}   
            </FlexBox>

            <Form flexWrap="wrap" onSubmit={submitHandler}>
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
            </Form>

            <Box id="search-rresult-box"  
                    borderLeft="2px solid" 
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
        </PageContainer>
    );
}

const SearchQueryBox = React.memo(({topicSlug, page, lazyvariables, dispatcher}) =>{

    const { loading, data, } = useQuery(TOPIC_SEARCH_QUERY,{variables:{
        topicSlug, page, ...lazyvariables
    }})


    //console.log("topic query")


    if (loading) return <Loading />
    if (data && data.complexSearch) {
        const willBeDispatched = {topic:data.complexSearch.topic, quantity:data.complexSearch.quantity}
        //console.log("data", data, willBeDispatched)
        dispatcher(willBeDispatched)
        return (
            <>
            <MovieRichCardBox items={data.complexSearch.topicResult}  />
            <MidPageAd />
            </>

        )}
}, (p,n) => (isEqualObj(p.lazyvariables,n.lazyvariables) && p.page === n.page) )



export default withRouter(TopicPage);
