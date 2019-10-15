import React, { useState, useRef, useCallback, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

//import { Query } from "react-apollo";
import { COMPLEX_SEARCH,TAG_LIST } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'
import JoinBanner from "../../components/JoinBanner.js"
import TagSelect from "./TagSelect"
import { useWindowSize, useAuthCheck} from "../../functions"

import "react-input-range/lib/css/index.css"
import "./SearchPage.css"

import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox
} from "../../styled-components"




const PreSearch = (props) =>{
    const tagParam = props.match.params.tag
    
    //Variables

    const [page, setPage] = useState(1)
    const [selectedYears, setSelectedYears ] = useState({min:1950, max:2019})
    const [selectedRatings, setSelectedRatings ] = useState({min:5.0, max:9.9})

    
    const [qv, setQv ] = useState({page, tags:[tagParam], minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max})



    //Error and internal states
    const authStatus = useAuthCheck();
    const [ resultQuantity, setResultQuantity] = useState(null)
    const mergeVariables = () => ({page, tags:[tagParam],minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max})

    //local functions
    const rounder = useCallback((number) => Math.round(number*10)/10, [])
    const roundedRatings = useCallback((obj) => ({min: rounder(obj.min), max: rounder(obj.max) }) ,[])
    const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    
    //handlers
    const yearSelectHandler = useCallback((e) => areEquals(e, selectedYears) ? null : setSelectedYears(e), [])
    const ratingSelectHandler = useCallback((e) => areEquals(e, selectedRatings) ? null : setSelectedRatings(roundedRatings(e)), [])




    

    const submitHandler = (e) => {
        e.preventDefault()
        if(tagParam) {
            const newQv = mergeVariables()
            setQv(newQv)
        } 
    }

    return(
        <PageContainer>

            <Form flexWrap="wrap" onSubmit={submitHandler}>



                <FlexBox id="search-settings-box" 
                    flexDirection={["row", "row"]} 
                    width={["100%", "100%", "100%"]}  
                    minHeight={["60px", "60px", "60px", "100%"]}
                    flexWrap="wrap"
                    px={[3]}
                    borderBottom="1px solid"
                >
                    <FlexBox 
                        flexDirection={["column", "column", "column"]} 
                        alignItems={"flex-start"} 
                        my={[3]} px={[2,2,3, 3]} 
                        width={"38%"}
                        flexGrow={1,1,1, 0}
                    >
                        <Text fontSize={[14,16,16,18]} mt={[3,3,3,4]} mb={[2,2, 2,3]} fontWeight="bold">Year</Text>
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
                        flexDirection={["column", "column", "column"]} 
                        alignItems={"flex-start"} 
                        my={[3]} px={[2,2,3, 3]} 
                        width={"38%"}
                        flexGrow={1,1,1, 0}
                    >
                        <Text fontSize={[14,16,16,18]} mt={[3,3,3,4]} mb={[2,2, 2,3]} fontWeight="bold">IMDb</Text>
                        <InputRange
                            max={10.0}
                            min={1.0}
                            step={0.1}
                            formatLabel={value => `${value}`}
                            value={selectedRatings}
                            onChange={ratingSelectHandler}
                        />
                    </FlexBox>
                    <SearchButton type="submit" alignSelf="center" width={["60px", "70px", "70px", "100px"]} maxWidth="25%">Search</SearchButton>
                </FlexBox>


                <Box id="search-rresult-box"  
                    borderLeft="2px solid" 
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%", "100%", "100%", "100%", "100%"]} minHeight={["100vw"]}
                    p={[1,2,3]}
                >

                    <SearchQuery variables={qv}  />

                </Box>
            </Form>
        </PageContainer>
    );
}

const SearchQuery = (props) =>{
    const [page, setPage] = useState(props.variables.page)
    const { loading, data, variables } = useQuery(COMPLEX_SEARCH, {variables:{...props.variables, page}});
    const prevPage = useCallback(() => setPage(page => page - 1))
    const nextPage = useCallback(() => setPage(page => page + 1))

    console.log(data, props.variables)
    if (loading) return <Loading />
    if (data) return (
        <>
        <MovieCoverBox 
            columns={[2,3,3,3,4,4,6]} 
            items={data.complexSearch.result} 
            fontSize={[12,12,14]}

            />
        <PaginationBox 
            currentPage={props.variables.page} 
            totalPage={Math.ceil(data.complexSearch.quantity/24)} 
            nextPage={nextPage} prevPage={prevPage} 
        />
        </>
        )
    
        else return <div></div>

}


export default withRouter(PreSearch);
