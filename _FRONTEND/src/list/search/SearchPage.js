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




const SearchPage = (props) =>{

    const [complexSearch, { loading, data, variables }] = useLazyQuery(COMPLEX_SEARCH);
    
    //Variables
    const [ keywords, setKeywords ] = useState("")
    const [ tags, setTags ] = useState([])

    const [selectedYears, setSelectedYears ] = useState({min:1950, max:2019})
    const [selectedRatings, setSelectedRatings ] = useState({min:5.0, max:9.9})
    


    const [ movies, setMovies ] = useState([])
    const [ error, setError ] = useState(null)

    //Error and internal states
    const authStatus = useAuthCheck();
    const [page, setPage] = useState(1)
    const [ resultQuantity, setResultQuantity] = useState(null)

    //local functions
    const rounder = useCallback((number) => Math.round(number*10)/10, [])
    const roundedRatings = useCallback((obj) => ({min: rounder(obj.min), max: rounder(obj.max) }) ,[])
    const areEquals = useCallback((first, second) => (first.min === second.min && first.max === second.max), [])
    const areEqualSize = (newmovies) => (new Set(movies.map(movie => movie.id)).size === new Set([...movies, ...newmovies].map(movie => movie.id)).size )
    const mergeVariables = () => ({page, keywords,minYear:selectedYears.min, maxYear:selectedYears.max,minRating:selectedRatings.min, maxRating:selectedRatings.max})
    const updateFromQueryData = useCallback((data) => (setResultQuantity(data.complexSearch.quantity), setMovies(() => [...movies, ...data.complexSearch.result])), [])
    
    //handlers
    const yearSelectHandler = useCallback((e) => areEquals(e, selectedYears) ? null : setSelectedYears(e), [])
    const ratingSelectHandler = useCallback((e) => areEquals(e, selectedRatings) ? null : setSelectedRatings(roundedRatings(e)), [])
    const keywordsHandler = useCallback((e) => setKeywords(e.target.value), [keywords])

    const prevPage = useCallback(() => (setPage(page => page - 1), complexSearch({ variables: { ...variables, page: page - 1 } })))
    const nextPage = useCallback(() => (setPage(page => page + 1), complexSearch({ variables: { ...variables, page: page + 1 } })))


    if (data) {
        console.log("data", data)
        if (!areEqualSize(data.complexSearch.result)){
            //console.log("not equal size; state will be updated");
            //const allmovies = [...movies, ... data.complexSearch.result]
            //const uniqueMovieIds = new Set([...movies, ... data.complexSearch.result].map(movie => movie.id))
            //const uniqueMovies = []
            //uniqueMovieIds.forEach(id => {
            //    const firstPaired = allmovies.filter(movie => movie.id === id)[0]
            //    uniqueMovies.push(firstPaired)
            //})
            //setMovies(uniqueMovies)
            setMovies(data.complexSearch.result)
        }
        if (resultQuantity !==  data.complexSearch.quantity) setResultQuantity(data.complexSearch.quantity)
        }
    


    const submitHandler = (e) => {
        e.preventDefault()
        if (keywords.length < 3 && tags.length === 0) setError("Your Search is too short")
        else {
            const newQv = mergeVariables()
            newQv.tags = tags.map(tag => tag.value)
            //console.log("final query variables",newQv)
            complexSearch({variables : newQv})
        } 
    }
    console.log("qv",variables)
    return(
        <PageContainer>

            <Form flexWrap="wrap" onSubmit={submitHandler}>

                <FlexBox justifyContent="center" id="s-text-input" minWidth="100%">
                    <SearchInput type="text"   
                        px={[2,3,4,4,4]}
                        placeholder="Search.."
                        autoFocus
                        value={keywords} 
                        onChange={keywordsHandler} 
                        minHeight="60px"
                        width={"100%"}
                        error={error}
                    />
                </FlexBox>


                <FlexBox id="search-settings-box" 
                    flexDirection={["row", "row"]} 
                    width={["100%", "100%", "100%"]}  
                    minHeight={["80px", "80px", "80px", "100%"]}
                    flexWrap="wrap"
                    px={[3]}
                    borderBottom="1px solid"
                >
                    <FlexBox 
                        flexDirection={["column", "column", "column"]} 
                        alignItems={"flex-start"} 
                        my={[3]} px={[3,3,3, 3]} 
                        width={"49%"}
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
                        my={[3]} px={[3,3,3, 3]} 
                        width={"49%"}
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

                    <FlexBox 
                        flexDirection={["row"]} 
                        alignItems={"flex-start"} 
                        my={[3]} px={[3,3,3, 3]} 
                        width={"100%"}
                        flexGrow={1,1,1, 0}
                    >
                        <TagSelect tags={tags} tagSetter={setTags} />
                        <SearchButton type="submit" alignSelf="center" width={["70px", "70px", "70px", "80px"]} maxWidth="40%">Search</SearchButton>
                    </FlexBox>
                </FlexBox>


                <Box id="search-rresult-box"  
                    borderLeft="2px solid" 
                    borderColor="rgba(40,40,40, 0.3)"
                    minWidth={["100%", "100%", "100%", "69%", "74%"]} minHeight={["100vw"]}
                    p={[1,2,3]}
                >
                    {loading && <Loading />}
                    <MovieCoverBox items={movies} columns={[2,3,3,3,4,4,6]} fontSize={[12,12,14]}/>
                    <PaginationBox 
                        currentPage={resultQuantity!==null && page} 
                        totalPage={Math.ceil(resultQuantity/24)} 
                        nextPage={nextPage} prevPage={prevPage} 
                    />
                </Box>
            </Form>
        </PageContainer>
    );
}




export default withRouter(SearchPage);

/*

const SearchQuery = ({ qv }) =>{
    console.log("Search Query", qv)
    const [ movies, setMovies ] = useState([])
    const [complexSearch, { loading, data }] = useLazyQuery(COMPLEX_SEARCH);
    if (qv.query === true) complexSearch({ variables: qv})

    if (loading) return <Loading />;
    if (data && data.complexSearch ){
        console.log("query",data);
        setMovies(() => [...movies, ...data.complexSearch.keywordResult]);
    }
    return(
        <SearchButton type="submit" alignSelf="center" width={["40px", "50px", "50px", "80px"]}>Search</SearchButton>
    )
}


const SearchQuery2 = (props) =>{
    const [currentPage, setCurrentPage] = useState(1)
    const qv = props.variables
    //console.log("qv", qv)

    return (
    <Query query={COMPLEX_SEARCH} variables={{page:currentPage, ...qv}}>
    {({data, loading, error})=>{
        if (loading) return <Loading />
        if (error) return <div>{error.message}</div>
        const result = data.complexSearch.keywordResult;
        const quantity = data.complexSearch.quantity
        const ppi = 24;


        //console.log("query: ",data, result, quantity)
        return (
            <section className="content-container search-result-container fbox-fc jcfs aifs">
                <h4 className="t-xl t-bold mar-b-2x"> found: {quantity} movies </h4>
                <SpeedyGridBox movies ={result} />

                {quantity > ppi &&
                    <div className="fbox-r jcc aic pag mar-t-5x">
                        {currentPage > 1 &&
                            <div className="pag-item click t-bold  t-color-dark t-center click hover-t-underline" onClick={() => setCurrentPage(currentPage - 1)}>
                               {"< Previous"}
                            </div>
                        }
                        <div className="pag-item t-bold  t-color-dark t-center t-underline" >
                            {currentPage}
                        </div>

                        <div className="pag-item t-bold  t-color-dark t-center click hover-t-underline" onClick={() => setCurrentPage(currentPage + 1)}>
                            Next >
                        </div>
                    </div>}
            </section>
        )}}
    </Query>
    )
}

        <PageContainer>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gridGap="10px">

                {!authStatus && <JoinBanner />}
                <Box></Box>
                <div className="search-menu-container">
                    <SelectPanel {...props} export={e => variableHandler(e)} />      
                </div>
                <div className="search-query-container">
                    {shouldSearch && <SearchQuery variables={queryVariables} shouldSearch={shouldSearch} />}
                </div>
            </Box>
        </PageContainer>
*/