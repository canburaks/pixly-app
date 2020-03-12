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

    RatingSlider, YearSlider,MoviePosterCard, PlaceHolderCard, Label, Modal
} from "../../styled-components"



export const SearchQueryBox = (props) =>{
    const [ isSearcBarOpen, setOpen ] = useState(false)
    const [ skip, setSkip ] = useState(true)
    const [ keywords, setKeywords ] = useState("")
    const ref = useRef()

    useOnClickOutside(ref, () => setKeywords(""));

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
    //function lockbody(){
    //    document.body.style.position = 'fixed';
    //    document.body.style.overflowY = "hidden";
    //}

    //function unlockbody(){
    //    document.body.style.position = 'block';
    //    document.body.style.scrollBehavior = 'smooth'
    //    document.body.style.overflowY = "auto";
    //}
    
    //useEffect(() => {
    //    if (keywords.length > 2){
    //        lockbody()
    //    }
    //    return () => unlockbody()
    //})

    return(
            <Box width={"auto"} >
                <FlexBox justifyContent="center" id="s-text-input" minWidth="100%" position="relative" ml={[4,4,4,5,5]}>
                    <SearchInput type="text"   
                        placeholder="Search"
                        value={keywords} 
                        onChange={keywordsHandler} 
                        minHeight="40px"
                        maxHeight="40px"
                        width={"100%"}
                        bg={"rgba(20,20,20, 0.4)"}
                        fontWeight="500"
                        focusBg="rgba(20,20,20, 0.2)"

                        maxWidth={["40vw", "40vw", "30vw", "200px"]}
                    />
                    <Label position="absolute" color="transparent" height="1px" width="1px" fontSize="1px">
                        Search
                    </Label>
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
                
                
                    {debouncedkeywords.length >2 && <SearchQueryResult keywords={debouncedkeywords} cleaner={keywordsCleaner} />}
                

                {/*debouncedkeywords.length >2 && 
                    <Box ref={ref}
                        position="fixed"
                        top={"100px"} left={"40px"} right={"40px"}
                        bg={"rgba(40,40,40, 0.7)"}
                        width={"auto"} height={"calc(100vh - 63px)"}
                        borderRadius="16px"
                        border="2px solid" 
                        bg="rgba(40,40,40, 0.7)"
                        overflowY="scroll"
                        p={"15px"}
                    >
                        <SearchQueryResult keywords={debouncedkeywords} cleaner={keywordsCleaner} />
                    </Box>*/}
            </Box>
    );
}


const SearchQueryResult = React.memo(({keywords, cleaner}) => {
    const [location, setLocation] = useState(window.location.pathname)
    const values = useValues([4,,4, 6,8,10])
    const { loading, data, error } = useQuery(COMPLEX_SEARCH, {variables:{page:1, keywords, first:(values*2 )- 1} });

    //console.log(loading, error, data)
    const locationhook = useLocation()


    //useEffect(() =>{
    //    //console.log("outer", document.body.style.position, document.body.style.overflowY)
    //    lockbody()
    //    return () => unlockbody()
    //}, [])


    const MoreCard = () => <PlaceHolderCard text="Get More" link={"/advance-search"} state={{keywords}} title="Bring More" />
    //if (loading) return <Loading />
    if (data) {
        
        return (
            <Modal isOpen={true} header={`search term: ${keywords}`} closeModal={cleaner} zIndex={100}>
                <Grid columns={[3,4,5,6,6,6, 8]}  py={"10px"} px="10px" position="relative" zIndex={100} >
                    {data.complexSearch.result.map( item => (
                        <MoviePosterCard
                            item={item}
                            key={item.slug}
                            ratio={1.6} 
                            width={"100%"}
                            fontSize="xs"
                            onClick={cleaner}
                            zIndex={100}
                        />
                        ))}
                    {data.complexSearch.quantity >= 18 && <MoreCard />}
                </Grid>
            </Modal>
        )}
    else return <div></div>
})  




