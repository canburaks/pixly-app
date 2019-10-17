import React, { useState, useRef, useCallback, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

//import { Query } from "react-apollo";
import { COMPLEX_SEARCH,TAG_LIST } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'
import JoinBanner from "../../components/JoinBanner.js"
import { Head, MidPageAd } from "../../functions/analytics"
import TagSelect from "./TagSelect"
import { useWindowSize, useAuthCheck} from "../../functions"

//import "react-input-range/lib/css/index.css"

import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox,
    RatingSlider, YearSlider,
} from "../../styled-components"


const Header = () => (
    <Head
        title={"Pixly Search - Search Movies by Genre, Tag, IMDb Rating and Release Year"}
        description={"Pixly Search is a free service that you can search and filter movies with respect to their genres, tags, IMDb Ratings and release date"}
        keywords={["Movie Search", "Advance Movie Search", "Search by IMDb Rating", "Movie with Release Year"]}
        canonical={`https://pixly.app/movie/advance-search`}
    />
)

const SearchPage = (props) =>{

    const [complexSearch, { loading, data, variables }] = useLazyQuery(COMPLEX_SEARCH);
    
    //Variables
    const [page, setPage] = useState(1)
    const [ keywords, setKeywords ] = useState("")
    const [ tags, setTags ] = useState([])
    const [yearData, setYearData ] = useState({minYear:1950, maxYear:2019})
    const [ratingData, setRatingData ] = useState({minRating:5.0, maxRating:9.9})

    


    const [ movies, setMovies ] = useState([])
    const [ message, setMessage ] = useState(null)

    //Error and internal states
    const authStatus = useAuthCheck();
    const [ resultQuantity, setResultQuantity] = useState(null)

    //const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    //const areEqualSize = (newmovies) => (new Set(movies.map(movie => movie.id)).size === new Set([...movies, ...newmovies].map(movie => movie.id)).size )
    const mergeVariables = () => ({page,tags:tags.map(tag=>tag.value), keywords, ...yearData, ...ratingData})

    
    
    
    //handlers
    const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])
    const yearDispatcher = useCallback((data) => setYearData(data), [yearData])
    const ratingDispatcher = useCallback((data) => setRatingData(data), [ratingData])

    const prevPage = useCallback(() => (setPage(page => page - 1), complexSearch({ variables: { ...variables, page: page - 1 } })))
    const nextPage = useCallback(() => (setPage(page => page + 1), complexSearch({ variables: { ...variables, page: page + 1 } })))

    const areEqualSize = (prev, next) => {
        //console.log("asds")
        const oldIds = new Set(prev.map(obj => obj.id));
        const newIds = new Set(next.map(obj => obj.id));
        //console.log("array of object checker:", oldIds, newIds);
        //console.log("array of object checker sizes: ", oldIds.size, newIds.size)
        if (oldIds.size == newIds.size) return true
        else return false
    }

    if (data) {
        if (movies.length === 0 && data.complexSearch && data.complexSearch.result.length !== 0) setMovies(data.complexSearch.result)
        else if (movies && movies.length > 0) {
            //console.log("new result",data.complexSearch.result ,data)
            const areEquals = areEqualSize(movies, data.complexSearch.result)
            //console.log("are equal",areEquals)

            if (!areEquals){
                setMovies(data.complexSearch.result)
                setResultQuantity(data.complexSearch.quantity)
                setMessage(`${data.complexSearch.quantity} ${data.complexSearch.quantity.length > 1 ? "movies" : "movie"} found.`)
                }
        }
    }
    

    const submitHandler = (e) => {
        e.preventDefault()
        if (keywords.length < 3 && tags.length === 0) setMessage("Your should provide search keywords or choose a genre please")
        else {
            complexSearch({variables: {...mergeVariables()} })
            //const newQv = mergeVariables()
            //newQv.tags = tags.map(tag => tag.value)
            //////console.log("final query variables",newQv)
            //complexSearch({variables : newQv})
        } 
    }
    //console.log("qv",variables)
    return(
        <PageContainer>
            <Header />
            <Form flexWrap="wrap" onSubmit={submitHandler}>

                <FlexBox justifyContent="center" id="s-text-input" minWidth="100%" position="relative">
                    <SearchInput type="text"   
                        px={[2,3,4,4,4]}
                        placeholder="Search.."
                        autoFocus
                        value={keywords} 
                        onChange={keywordsHandler} 
                        minHeight="70px"
                        width={"100%"}
                    />
                    <Button type="submit" 
                        position="absolute" 
                        display="flex" justifyContent="center" alignItems="center"
                        right={40} top={12} p={0} 
                        width={50} height={50} 
                        hoverBg={"blue"}
                        borderRadius="50%" 
                        bg="dark"
                    >
                        <SearchIcon  stroke="white" strokeWidth="3" size={30} />
                    </Button>
                </FlexBox>


                <FlexBox id="search-settings-box" 
                    flexDirection={["row", "row"]} 
                    width={["100%", "100%", "100%"]}  
                    minHeight={["80px", "80px", "80px", "100%"]}
                    justifyContent="space-around"
                    flexWrap="wrap"
                    px={[3]} mt={[3,3,3]}
                    borderBottom="1px solid"
                >
                
                <YearSlider dispatcher={yearDispatcher}  />
                <RatingSlider dispatcher={ratingDispatcher} />

                    <FlexBox 
                        flexDirection={["row"]} 
                        alignItems={"flex-start"} 
                        my={[3]} px={[3,3,3, 3]} 
                        width={"100%"}
                        flexGrow={1,1,1, 0}
                    >
                        <TagSelect tags={tags} tagSetter={setTags} />
                    </FlexBox>
                </FlexBox>


                <Box id="search-rresult-box"  
                    borderLeft="2px solid" 
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%"]} minHeight={["60vw"]}
                    p={[1,2,3]}
                >
                    {loading && <Loading />}
                    <Text fontSize={[14,14,16]} minHeight={16} fontWeight={"bold"}>{message}</Text>
                    <MovieCoverBox items={movies} columns={[2,2,3,3,4,4,6]} fontSize={[12,12,14]}/>
                    
                    {resultQuantity > 24 &&
                        <PaginationBox 
                            currentPage={resultQuantity!==null && page} 
                            totalPage={Math.ceil(resultQuantity/24)} 
                            nextPage={nextPage} prevPage={prevPage} 
                        />}
                </Box>
            </Form>
        </PageContainer>
    );
}




export default withRouter(SearchPage);

