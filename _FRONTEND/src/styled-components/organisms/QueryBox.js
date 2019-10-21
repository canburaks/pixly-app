import React from "react";
import { useState, useRef,useEffect, useCallback, useMemo } from "react"
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { math } from 'polished'

//import { Query } from "react-apollo";
import { COMPLEX_SEARCH } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'
import { Head, MidPageAd, rgaSetEvent } from "../../functions/analytics"
import { useWindowSize, useLocation, useDebounce, isEqualObj, useOnClickOutside, useValues} from "../../functions"

//import "react-input-range/lib/css/index.css"

import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,MoviePosterBox, CloseIcon,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox,
    RatingSlider, YearSlider,MoviePosterCard, PlaceHolderCard
} from "../../styled-components"



export const SearchPanel = (props) =>{

    const [ skip, setSkip ] = useState(true)
    const [ keywords, setKeywords ] = useState("")
    const ref = useRef()
    useOnClickOutside(ref, () => setOpen(false));

    const debouncedkeywords = useDebounce(keywords, 500);
    

    const [ message, setMessage ] = useState(null)

    function keywordChecker(keywords, skip){
        if (keywords.length >= 3 && skip===false) setSkip(true)
        else if (keywords.length < 3 && skip===true) setSkip(false)
    }
    //keywordChecker(keywords, skip)




    const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])
    const keywordsCleaner = useCallback(() => setKeywords(""))

    //console.log("outer keywords", keywords)
    //console.log("outer debounced keywords", debouncedkeywords)
    
    
    function bodychecker(keywords){
        if (keywords.length >2){
            document.body.style.position = 'fixed';
            document.body.style.overflowY = "hidden";
        }
        else {
            document.body.style.position = 'block';
            document.body.style.overflowY = "auto";
        }
    }
    useEffect(() =>{
        //console.log("outer", document.body.style.position, document.body.style.overflowY)
        bodychecker(keywords)
    }, [keywords])

    return(
            <Box width={"100%"}>

                <FlexBox justifyContent="center" id="s-text-input" minWidth="100%" position="relative">
                    <SearchInput type="text"   
                        px={[2,3,4,4,4]}
                        placeholder="Search.."
                        autoFocus
                        value={keywords} 
                        onChange={keywordsHandler} 
                        minHeight="40px"
                        width={"100%"}
                    />
                    {debouncedkeywords.length > 2 && 
                    <Button type="submit" 
                        position="absolute" 
                        display="flex" justifyContent="center" alignItems="center"
                        right={30} top={"8px"} p={0} 
                        width={40} height={40} 
                        onClick={keywordsCleaner}
                        borderRadius="50%" 
                        bg="transparent"
                    >
                        <CloseIcon  stroke="white" strokeWidth="3" size={30} />
                    </Button>}
                </FlexBox>

                {debouncedkeywords.length >2 && 
                    <Box 
                        position="fixed"
                        top={"63px"} left={0}
                        bg={"rgba(40,40,40, 0.7)"}
                        width={"100vw"} height={"calc(100vh - 63px)"}
                        borderLeft="2px solid" 
                        bg="rgba(40,40,40, 0.7)"
                        overflowY="scroll"
                        p={"5vw"}
                    >
                        <SearchQueryBox keywords={debouncedkeywords} cleaner={keywordsCleaner} />
                    </Box>}
            </Box>
    );
}


const SearchQueryBox = React.memo(({keywords, cleaner}) => {
    const [location, setLocation] = useState(window.location.pathname)
    const values = useValues([4,6,8,10,12])
    const { loading, data, error } = useQuery(COMPLEX_SEARCH, {variables:{page:1, keywords, first:(values*6 )- 1} });

    //console.log(loading, error, data)
    const locationhook = useLocation()



    const MoreCard = () => <PlaceHolderCard text="Get More" link={"/advance-search"} state={{keywords}} title="Bring More" />
    //if (loading) return <Loading />
    if (data) {
        
        return (
            <Box  width={"100%"}   position="relative" overflowY="auto">

            <CloseIcon 
                position="absolute" top={"-50px"} right={"20px"}
                stroke="white" strokeWidth="3" size={40} 
                onClick={cleaner} clickable
                zIndex={11}
            />

            <Grid columns={[3,4,5,6,6,6, 8]} pt={[4]} overflowY="scroll" >
                {data.complexSearch.result.map( item => (
                    <MoviePosterCard
                        item={item}
                        key={item.slug}
                        ratio={1.6} 
                        width={"100%"}
                        fontSize="xs"
                        onClick={cleaner}
                    />
                    ))}
                {data.complexSearch.quantity >= 18 && <MoreCard />}
            </Grid>


            </Box>
    )}
    else return <div></div>
})  




