import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { TOPIC_SEARCH_QUERY } from "../../functions/query"

//import { Query } from "react-apollo";
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'
import JoinBanner from "../../components/JoinBanner.js"
import { useWindowSize, useAuthCheck, isEqualObj, Head} from "../../functions"


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, TextSection
} from "../../styled-components"
import { forEach } from "async";

const topicInfo = (name) => `Pixly topics are kind of collections that are more specific than genre based search.` + 
        `Topic Movies treat specific subjects like ${name}. You can also filter your search based on IMDb ratings or release year of the movies`


const TopicPage = React.memo(({ topic, items, quantity, fetchMore, variables, refetch, page }) =>{
    //console.log("topic ", { topic, items, quantity, fetchMore, variables, refetch, page })

    const [selectedYears, setSelectedYears ] = useState({min:variables.minYear, max:variables.maxYear})
    const [selectedRatings, setSelectedRatings ] = useState({min:variables.minRating, max:variables.maxRating})

    //local functions
    const rounder = useCallback((number) => Math.round(number*10)/10, [])
    const roundedRatings = useCallback((obj) => ({min: rounder(obj.min), max: rounder(obj.max) }) ,[])

    const yearSelectHandler = useCallback((e) => setSelectedYears(e), [])
    const ratingSelectHandler = useCallback((e) => setSelectedRatings(roundedRatings(e)), [])


    const getLazyVariables = useCallback(() => ({page:1, minYear:selectedYears.min, maxYear:selectedYears.max, minRating:selectedRatings.min, maxRating:selectedRatings.max}),[selectedYears, selectedRatings])
    const lazyvariables = getLazyVariables(selectedYears, selectedRatings)


    //console.log("lazy", lazyvariables)

    const nextPage = useCallback(() => refetch({...variables,  page:variables.page + 1}))
    const prevPage = useCallback(() => refetch({...variables,  page:variables.page - 1}))
    
    const topicinfotext = topic.summary ? topic.summary + " " + topicInfo(topic.name) : topicInfo(topic.name)

    const submitHandler = (e) => {
        e.preventDefault()
        if (!isEqualObj(variables, lazyvariables)) refetch({page:1, ...lazyvariables})
    }
    const title = `Pixly Topics: ${topic.name} - Best ${topic.name} Movies`.replace(/\b\w/g, l => l.toUpperCase())

    const description = `Discover ${topic.name} films, filter them with their IMDb rating and release year.` +
                        `Find best movies of ${topic.name}` 

    const keywords = [`Best ${topic.name} films`, `Best ${topic.name} movies`, `${topic.name} like movies`, `${topic.name} cinema`]
    
    return(
        <PageContainer px={[2,3,3,4]}>
            <Head
                title={topic.title || title}
                description={topic.seoShortDescription || description}
                keywords={keywords}
                image={topic.coverPoster ? topic.coverPoster : topic.poster ? topic.poster : null}
                canonical={`https://pixly.app/topic/${topic.slug}`}
            />
            <TextSection 
                headerSize={[24]}
                textSize={[14,16]}
                header={topic.name} 
                text={topicinfotext}
            />

            <Form flexWrap="wrap" onSubmit={submitHandler}>
                <FlexBox id="search-settings-box" 
                    flexDirection={["row", "row"]} 
                    width={["100vw", "100vw", "100vw"]}  
                    minHeight={["80px", "80px", "80px", "100%"]}
                    justifyContent="space-around"
                    flexWrap="wrap"
                    px={[3]}
                    borderBottom="1px solid"
                    borderTop="1px solid"
                >
                    <FlexBox 
                        alignItems={"center"}
                        m={[1]} pl={[0]} pr={[3]} py={[2]}
                        width={"41%"}
                        flexGrow={1,1,1, 0}
                        border="1px solid"
                        borderColor="rgba(80,80,80, 0.0)"
                        borderRadius={"8px"}
                    >
                        <WatchIcon title="Release Year" stroke={"black"}  size={36}/>
                        <InputRange
                            max={2020}
                            min={1900}
                            step={1}
                            value={selectedYears}
                            onChange={yearSelectHandler}
                        />
                    </FlexBox>

                    <FlexBox 
                        alignItems={"center"}
                        m={[1]} pl={[0]} pr={[3]} py={[2]}
                        width={"41%"}
                        flexGrow={1,1,1, 0}
                        border="1px solid"
                        borderColor="rgba(80,80,80, 0.0)"
                        borderRadius={"8px"}
                    >
                        <ImdbIcon title="IMDb Rating" fill="black"  size="36px !important;" imdb/>
                        <InputRange
                            max={10.0}
                            min={1.0}
                            step={0.1}
                            value={selectedRatings}
                            onChange={ratingSelectHandler}
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

            <Box id="search-rresult-box"  
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%", "100%", "100%", "100%", "100%"]} minHeight={["100vw"]}
                    p={[1,2,3]}
                >
                <MovieCoverBox 
                    columns={[2,3,3,3,4,4,6]} 
                    items={items} 
                    fontSize={[12,12,14]}
                    />
                <PaginationBox 
                    currentPage={page} 
                    totalPage={quantity} 
                    nextPage={nextPage} prevPage={prevPage} 
                />

                </Box>
        </PageContainer>
    );
})

const TopicQuery = React.memo(({ match }) =>{
    var { loading, error, data, variables, fetchMore, refetch } = useQuery(TOPIC_SEARCH_QUERY,{
                fetchPolicy: "cache-and-network",
                variables:{
                    page:1, topicSlug:[match.params.slug], 
                    minYear:1950, maxYear:2019,
                    minRating:5.0, maxRating:9.9
                }})

    const fetcher = (newVars) => fetchMore({variables: newVars, updateQuery: (prev, { fetchMoreResult }) => {
                //console.log("fetcher",prev, fetchMoreResult)
                if (!fetchMoreResult) return prev;
                variables = {...variables, ...newVars}
                return Object.assign({}, prev, {
                    complexSearch: {...prev.complexSearch, ...fetchMoreResult.complexSearch}
                });
            }
        })

    if (loading) return <Loading />
    if (data && data.complexSearch){
        console.log("data", data)
        return (
            <TopicPage 
                variables={variables}
                data={data}
                page={variables.page}
                topic={data.complexSearch.topic} 
                items={data.complexSearch.topicResult} 
                quantity={data.complexSearch.quantity} 
                refetch={refetch}

            />
        )
    }
})



export default withRouter(TopicQuery);
