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
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox
} from "../../styled-components"
import { forEach } from "async";



const TopicPage = (props) =>{
    const topicSlug = props.match.params.slug
    
    //Variables

    const [page, setPage] = useState(1)
    const [selectedYears, setSelectedYears ] = useState({min:1950, max:2019})
    const [selectedRatings, setSelectedRatings ] = useState({min:5.0, max:9.9})
    const [qv, setQv] = useState({page, tags:[topicSlug]})

    
    //const [qv, setQv ] = useState({minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max})


    //local functions
    const rounder = useCallback((number) => Math.round(number*10)/10, [])
    const roundedRatings = useCallback((obj) => ({min: rounder(obj.min), max: rounder(obj.max) }) ,[])
    const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    const params = ["minYear", "maxYear", "minRating", "maxRating", "page"]
    const areEqualVariables = (obj1, obj2) => forEach(param => obj1[param] !== obj2[param])
    
    //handlers
    const yearSelectHandler = useCallback((e) => areEquals(e, selectedYears) ? null : setSelectedYears(e), [])
    const ratingSelectHandler = useCallback((e) => areEquals(e, selectedRatings) ? null : setSelectedRatings(roundedRatings(e)), [])
    const getVariables = () => ({...qv, tags:[topicSlug], minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max})


    const nextPage = useMemo(() => (setPage(page => page + 1), setQv({...qv, page:page + 1})), [page])
    const prevPage = useMemo(() => (setPage(page => page - 1), setQv({...qv, page:page - 1})), [page])

    

    const submitHandler = (e) => {
        e.preventDefault()
        const newQv = getVariables()
        if (!isEqualObj(qv, newQv)) setQv(newQv)
    }
    useEffect(() => {
        const newQv = getVariables()
        if (!isEqualObj(qv, newQv)) setQv(newQv)
    }, [])

    console.log("topic page:", qv, topicSlug)
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
                        m={[1]} px={[3]} py={[2]}
                        width={"40%"}
                        flexGrow={1,1,1, 0}
                        border="1px solid"
                        borderColor="rgba(80,80,80, 0.5)"
                        borderRadius={"8px"}
                    >
                        <WatchIcon title="Release Year" stroke={"black"}  size={40}/>
                        <InputRange
                            max={2020}
                            min={1900}
                            step={1}
                            formatLabel={value => `${value}`}
                            value={selectedYears}
                            onChange={yearSelectHandler}
                        />
                    </FlexBox>

                    <FlexBox 
                        alignItems={"center"}
                        m={[1]} px={[3]} py={[2]}
                        width={"40%"}
                        flexGrow={1,1,1, 0}
                        border="1px solid"
                        borderColor="rgba(80,80,80, 0.5)"
                        borderRadius={"8px"}
                    >
                        <ImdbIcon title="IMDb Rating" fill="black"  size="40px !important;" imdb/>
                        <InputRange
                            max={10.0}
                            min={1.0}
                            step={0.1}
                            formatLabel={value => `${value}`}
                            value={selectedRatings}
                            onChange={ratingSelectHandler}
                        />
                    </FlexBox>
                    <Button type="submit" 
                        display="flex" justifyContent="center" alignItems="center"
                        p={0} width={50} height={50} 
                        hoverBg={"blue"}
                        borderRadius="50%" 
                        bg="dark"
                    >
                        <SearchIcon  stroke="white" strokeWidth="3" size={30} />
                    </Button>
                </FlexBox>
            </Form>

            <Box id="search-rresult-box"  
                    borderLeft="2px solid" 
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%", "100%", "100%", "100%", "100%"]} minHeight={["100vw"]}
                    p={[1,2,3]}
                >

                    <SearchQuery variables={qv} nextPage={nextPage} prevPage={prevPage}  />

                </Box>
        </PageContainer>
    );
}

const SearchQuery = (props) =>{
    const { loading, data, variables } = useQuery(TOPIC_QUERY, {variables:props.variables});


    console.log("topic query",data, props.variables)
    if (loading) return <Loading />
    if (data) return (
        <>
        <MovieCoverBox 
            columns={[2,3,3,3,4,4,6]} 
            items={data.topicResult} 
            fontSize={[12,12,14]}

            />
        <PaginationBox 
            currentPage={props.variables.page} 
            totalPage={Math.ceil(data.topicRuantity/24)} 
            nextPage={props.nextPage} prevPage={props.prevPage} 
        />
        </>
        )
    
        else return <div></div>

}



export default withRouter(TopicPage);
