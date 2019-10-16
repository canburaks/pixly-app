import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { TOPIC_QUERY } from "../../functions/query"

//import { Query } from "react-apollo";
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'
import JoinBanner from "../../components/JoinBanner.js"
import { useWindowSize, useAuthCheck, isEqualObj} from "../../functions"


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, TextSection
} from "../../styled-components"
import { forEach } from "async";



const TopicPage = (props) =>{
    const topicSlug = [props.match.params.slug]
    const tags = topicSlug //for shorhand

    const [page, setPage] = useState(1)
    const [selectedYears, setSelectedYears ] = useState({min:1950, max:2019})
    const [selectedRatings, setSelectedRatings ] = useState({min:5.0, max:9.9})
    const [ qv, setQv ] = useState({page, tags,minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max})
    //const lazyvariables = {page, tags, minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max}
    

    //local functions
    const rounder = useCallback((number) => Math.round(number*10)/10, [])
    const roundedRatings = useCallback((obj) => ({min: rounder(obj.min), max: rounder(obj.max) }) ,[])
    const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    const getLazyVariables = useCallback(() => ({minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max}))

    var lazyvariables = {}
    //handlers
    //const yearSelectHandler = useCallback((e) => setSelectedYears(e), [])
    //const ratingSelectHandler = useCallback((e) => setSelectedRatings(roundedRatings(e)), [])

    const yearSelectHandler = useCallback((e) => lazyvariables = {...lazyvariables, ...e}, [])
    const ratingSelectHandler = useCallback((e) => lazyvariables = {...lazyvariables, ...roundedRatings(e) }, [])
    console.log("lazy", lazyvariables)


    const nextPage = useCallback(() => (setPage(page => page + 1), setQv({...qv, page:page + 1})),[page])
    const prevPage = useCallback(() => (setPage(page => page - 1), setQv({...qv, page:page - 1})),[page])
    
    const { loading, error, data, variables:prevVariables } = useQuery(TOPIC_QUERY,{variables:qv })


    const submitHandler = (e) => {
        e.preventDefault()
        //const newQv = {page, tags, ...getLazyVariables()}
        const newQv = {page, tags, ...lazyvariables}

        if (!isEqualObj(qv, newQv)) setQv(newQv)
    }
    console.log("topic page", qv)
    return(
        <PageContainer>

            <Form flexWrap="wrap" onSubmit={submitHandler}>
                <FlexBox id="search-settings-box" 
                    flexDirection={["row", "row"]} 
                    width={["100%", "100%", "100%"]}  
                    minHeight={["80px", "80px", "80px", "100%"]}
                    justifyContent="space-around"
                    flexWrap="wrap"
                    px={[3]}
                    borderBottom="1px solid"
                >
                    <FlexBox 
                        alignItems={"center"}
                        m={[1]} pl={[0]} pr={[3]} py={[2]}
                        width={"41%"}
                        flexGrow={1,1,1, 0}
                        border="1px solid"
                        borderColor="rgba(80,80,80, 0.5)"
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
                        borderColor="rgba(80,80,80, 0.5)"
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
                    borderLeft="2px solid" 
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%", "100%", "100%", "100%", "100%"]} minHeight={["100vw"]}
                    p={[1,2,3]}
                >
            {console.log("parent inline")}
            {data &&
                <>
                <TextSection 
                    headerSize={[24]}
                    textSize={[14,16]}
                    header={data.complexSearch.topic.name} 
                    text={data.complexSearch.topic.summary}
                />
                <MovieCoverBox 
                    columns={[2,3,3,3,4,4,6]} 
                    items={data.complexSearch.topicResult} 
                    fontSize={[12,12,14]}
                    />
                <PaginationBox 
                    currentPage={page} 
                    totalPage={data.complexSearch.quantity} 
                    nextPage={nextPage} prevPage={prevPage} 
                />
                </>
            }
                </Box>
        </PageContainer>
    );
}

const SearchQuery = React.memo(({tags, page, minYear, maxYear, minRating, maxRating, quantityHandler}) =>{


    console.log("topic query", loading, data, prevVariables)


    if (loading) return <Loading />
    if (data && data.complexSearch) {
        quantityHandler(data.complexSearch.quantity)
        return (
            <>

            {console.log("inline")}
            </>
        )}
}, (p,n) => isEqualObj(p,n))



export default withRouter(TopicPage);
