import React, { useState, useRef } from "react";
import { withRouter, Link } from "react-router-dom";

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Query } from "react-apollo";
import { ADVANCE_FILTER, DISCOVERY_LISTS } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'

import InputRange from 'react-input-range';

import "react-input-range/lib/css/index.css"
import "./AdvanceSearch.css"


const queryString = require('query-string');


const AdvanceSearch = (props) =>{
    const resultRef = useRef(null);
    const parsedParams = queryString.parse(props.location.search);

    const [imdbFilter, setImdbFilter] = useState(false)
    const [imdbFilterValues, setImdbFilterValues] = useState({ min:6.0, max:9.0 })

    const [yearFilter, setYearFilter] = useState(false)
    const [yearFilterValues, setYearFilterValues] = useState({ min: 1980, max: 2010 })

    const [specificYearFilter, setSpecificYearFilter] = useState(false)
    const [specificYear, setSpecificYear] = useState(null)


    const [basedOnTagIds, setBasedOnTagIds] = useState([])
    const [categoryTagIds, setCategoryTagIds] = useState([])
    const [festivalTagIds, setFestivalTagIds] = useState([])

    // TO SERVER
    const [tagMovieIdList, setTagMovieIdList] = useState([])
    const [tagCustomIdList, setTagCustomIdList] = useState([])


    const [search, setSearch] = useState(false)
    const [result, setResult] = useState([])
    const [resultQuantity, setResultQuantity] = useState(null)

    // Range of Years
    const range = (start, stop, step = 1) =>
        Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
    const yearList = range(1920, 2020,1).reverse().map(y => ({key:y, value:y, text:y}))
    const handleYearSelect = (e, { value }) => setSpecificYear(value)

    //Based On Tags
    const baseTags = props.tags.filter(t => t.type === "base")
    const basedOnOptions = baseTags.map((bt) => ({ key: bt.movielensId, value: bt.movielensId, text: bt.name.split("on ")[1] }))
    const handleBaseTagSelect = (e, { value }) => setBasedOnTagIds(value)

    //Categorical Tags
    const categoryTags = props.tags.filter(t => t.type === "genre")
    const categoryOptions = categoryTags.map((bt) => ({ key: bt.movielensId, value: bt.movielensId, text: bt.name }))
    const handleCategoryTagSelect = (e,{value})=> setCategoryTagIds(value)
    
    //Festival Award Tags
    const festivalTags = props.tags.filter(t => t.type === "award")
    const festivalOptions = festivalTags.map((bt) => ({ key: bt.customId, value: bt.customId, text: bt.name}))
    const handleFestivalTagSelect = (e, { value }) => setFestivalTagIds(value)






    function qV(){
        const page = parsedParams.page ? parseInt(parsedParams.page) : 1;
        const first = 50;
        const skip = (page - 1) * first;
        const query = parsedParams.query === "true";
        var variableDict = { page, first, skip, query};
        if (imdbFilter===true){
            variableDict.minRating = imdbFilterValues.min
            variableDict.maxRating = imdbFilterValues.max
        }
        if (yearFilter === true) {
            variableDict.minYear = yearFilterValues.min
            variableDict.maxYear = yearFilterValues.max
        }
        if (specificYearFilter===true && typeof specificYear === "number") {
            variableDict.year = specificYear
        }
        if (basedOnTagIds.length>0 || categoryTagIds.length>0) {
            variableDict.tagMovielensIds = basedOnTagIds.concat(categoryTagIds)
        }
        if (festivalTagIds.length > 0) {
            variableDict.tagCustomIds = festivalTagIds
        }
        return variableDict
    }
    const queryVariables = qV();

    const searchHandler = () => {
        const qs = queryString.stringify(queryVariables)
        props.history.push(`/discover/search?${qs}`);
        setSearch(true)
    }
    const handlePaginationChange = (e,{activePage}) => {
        const newParams = { ...parsedParams, page: activePage}
        const qs = queryString.stringify(newParams)
        props.history.push(`/discover/search?${qs}`);
        setSearch(true)
    }


    const BreadcrumbSection = () => (
        <Breadcrumb>
            <Breadcrumb.Section link onClick={() => props.history.push("/discover/")}>Discover</Breadcrumb.Section>
            <Breadcrumb.Divider />
            <Breadcrumb.Section >Advance Search</Breadcrumb.Section>
        </Breadcrumb>
    )
    console.log(queryVariables)
    //console.log(props)


    return(
        <div className="">
            <BreadcrumbSection />

            <Row className="advance-search-panel pr bor-rad-2x">

                {/* FILTER PANEL  */}
                <Col xs={12} sm={4} md={3} lg={3} className="advance-search-sub-panel  fbox-c jcfs  pr">
                    <div className="panel-header bor-color-light">
                        <h4 className="text-uppercase  mar-l-x">FILTER</h4>
                    </div>

                    {/* IMDB RATING  */}
                    <p className="text-uppercase  text-underline mar-l-x mar-t-3x">RATING</p>
                    <p className="t-s pad-lr-x" > - Filter movies with IMDb Rating.</p>
                    <div className="filter-container w100 ">

                        <InputRange id="double"
                            draggableTrack
                            disabled={!imdbFilter}
                            minValue={0}
                            maxValue={10}
                            step={0.1}
                            formatLabel={value => Math.round(value * 10) / 10}
                            value={imdbFilterValues}
                            onChange={value => setImdbFilterValues(value)}
                        />
                        <div className="filter-label fbox-r jcfs">
                            <Checkbox toggle className="check-box" label='IMDb' onChange={() => setImdbFilter(!imdbFilter)} />
                        </div>
                    </div>
                    <p className="text-uppercase  text-underline mar-l-x mar-t-3x">YEAR</p>
                    <p className="t-s pad-lr-x" > - Either choose a year or set a range of years.</p>

                    {/* YEAR RANGE   */}
                    <div className="filter-container w100 mar-t-3x" style={{}}>

                        <InputRange
                            draggableTrack
                            disabled={!yearFilter}
                            minValue={1900}
                            maxValue={2020}
                            step={5}
                            value={yearFilterValues}
                            onChange={value => setYearFilterValues(value)}
                        />
                        <div className="filter-label fbox-r jcfs"
                            title={!specificYearFilter
                                ? "Movies released between these years"
                                : "You can either use range of years or single year"}>
                            <Checkbox toggle className="check-box" disabled={specificYearFilter}
                                label='Between years'
                                onChange={() => setYearFilter(!yearFilter)}
                            />
                        </div>
                    </div>

                    {/* SPECIFIC YEAR */}
                    <div className="filter-container w100"
                        title={typeof specificYear === "number"
                            ? "Movies released in this year"
                            : "You can either use range of years or single year. "}>


                        <Dropdown
                            placeholder='Select a year'
                            clearable
                            fluid
                            search
                            selection
                            options={yearList}
                            onChange={handleYearSelect}
                            disabled={!specificYearFilter}
                        />
                        <div className="filter-label fbox-r jcfs mar-t-x">
                            <Checkbox className="check-box" toggle
                                disabled={yearFilter}
                                label='Year'
                                onChange={() => setSpecificYearFilter(!specificYearFilter)}
                            />
                        </div>
                    </div>
                </Col>
                
                
                <Col xs={12} sm={8} md={9} lg={9} className="advance-search-sub-panel color-delicate fbox-r fw jcfs aifs pos-r bor-tr-rad-2x bor-br-rad-2x">
                    <div className="panel-header w100  bor-color-light">
                        <h4 className="text-uppercase ">CONTENT</h4>
                    </div>
                    
                    
                    <div className="filter-container w50" >
                            <p className="t-color-white" >Categories <span className="footnote">(Drama, Crime, Mystery etc..)</span></p>
                        <Dropdown  
                            fluid multiple selection 
                            placeholder='Can choose multiple' 
                            options={categoryOptions}
                            onChange={handleCategoryTagSelect}
                        />
                    </div>

                    {/* BASED ON*/}
                    <div className="filter-container w50">
                        <p className="t-color-white" >Based on <span className="footnote">(True Story, Book etc..)</span></p>

                        <Dropdown
                            placeholder='Based on '
                            fluid multiple selection
                            options={basedOnOptions}
                            onChange={handleBaseTagSelect}
                        />
                    </div>



                    {/* FESTIVAL*/}
                    <div  className="filter-container w50">
                            <p className="t-color-white" >Festivals <span className="footnote">(Cannes, Venice etc..)</span></p>

                        <Dropdown
                            placeholder='Festival Award'
                            fluid multiple selection
                            options={festivalOptions}
                            onChange={handleFestivalTagSelect}
                        />
                    </div>

                    <div className="filter-container w100">
                        <Button primary
                            className="advance-search-button"
                            onClick={searchHandler}
                            disabled={(
                                imdbFilter === false && yearFilter === false && typeof specificYearFilter === false &&
                                basedOnTagIds.length === 0 && categoryTagIds.length === 0 && festivalTagIds.length === 0
                            )}>
                            SEARCH
                        </Button>
                    </div>
                </Col>

            </Row>

            {/*QUERY RESULT PANEL */}
            <div  className="mar-5x pr fbox-r fw jcfs aic " ref={resultRef}>
                {resultQuantity>0 && <p className="text-uppercase  w100">{resultQuantity} movies found.</p>}
                
                <div className="grid-container cover">
                    {resultQuantity > 0 && result.filter(r => r.coverPoster!=="" && r.coverPoster !== null).map(movie => (
                        <div className="grid-item bor-rad-2x" key={movie.id} itemProp="itemListElement" itemScope itemType="http://schema.org/Movie">
                            <Link to={`/movie/${movie.slug}`} title={movie.name} rel="nofollow">
                                <img
                                    src={movie.coverPoster} itemProp="image" alt={`${movie.name} Poster`}
                                    className="grid-image hover-border hover-shadow bor-rad-2x" />
                            </Link>
                            <p className="text-center" itemProp="name">{movie.name}</p>
                        </div>))
                    }
                </div>

                <div className="grid-container poster">
                    {resultQuantity > 0 && result.filter(r => r.coverPoster === "" || r.coverPoster === null).map(movie => (
                        <div className="grid-item bor-rad-2x" key={movie.id} itemProp="itemListElement" itemScope itemType="http://schema.org/Movie">
                            <Link to={`/movie/${movie.slug}`} title={movie.name} rel="nofollow">
                                <img
                                    src={movie.poster} itemProp="image" alt={`${movie.name} Poster`}
                                    className="grid-image hover-border hover-shadow bor-rad-2x" />
                            </Link>
                            <p className="text-center" itemProp="name">{movie.name}</p>
                        </div>))
                    }
                </div>

                {resultQuantity > parsedParams.first
                    && 
                    <div className="fbox-r jcc aic mar-bt-5x w100">
                        <Pagination inverted className="pagination-item"
                            activePage={parsedParams.page}
                            totalPages={Math.ceil(resultQuantity / parsedParams.first)}
                            onPageChange={handlePaginationChange}
                            ellipsisItem={null}
                            prevItem={(parsedParams.page === "1") ? null : "Previous"}
                            nextItem={(parsedParams.page === Math.ceil(resultQuantity / parsedParams.first).toString())
                                ? null : "  Next  "}
                        />
                    </div>}
            </div>

            {(search === true) && 
                <Query
                    variables={queryVariables}
                    query={ADVANCE_FILTER}
                    onCompleted={(d) => {
                        const movies = d.filterPage.advanceQueryResult;
                        setResult(movies);
                        setResultQuantity(d.filterPage.quantity)
                        window.scrollTo({ behavior: 'smooth', top: resultRef.current.offsetTop -50 });
                        setSearch(false);
                    }}
                >
                    {({ data, loading, error, refetch }) => {
                        if (loading) return <Loader />;
                        if (error) return <div>{error}</div>
                        console.log("data", data)

                        return (
                            <div className="">

                            </div>
                        )
                    }}
                </Query>}
        </div>

    );
}

export default withRouter(AdvanceSearch);