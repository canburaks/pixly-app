import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Query } from "react-apollo";
import { ADVANCE_FILTER, DISCOVERY_LISTS } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
import { Checkbox, Form,  List, Loader, Button } from 'semantic-ui-react'
import Paginator from "../../components/Paginator"

import InputRange from 'react-input-range';

import "react-input-range/lib/css/index.css"
import "./AdvanceSearch.css"




const AdvanceSearch = (props) => {

    const [imdbFilter, setImdbFilter] = useState(false)
    const [imdbFilterValues, setImdbFilterValues] = useState({ min: 4, max: 9 })

    const [yearFilter, setYearFilter] = useState(false)
    const [yearFilterValues, setYearFilterValues] = useState({ min: 1980, max: 2010 })

    const [specificYearFilter, setSpecificYearFilter] = useState(false)
    const [specificYear, setSpecificYear] = useState(2015)

    const [basedOnFilter, setBasedOnFilter] = useState(false)
    const [basedOn, setBasedOn] = useState(null)

    const [tagMovieIdList, setTagMovieIdList] = useState([])
    const [tagCustomIdList, setTagCustomIdList] = useState([])

    const [search, setSearch] = useState(false)
    const [result, setResult] = useState([])


    const range = (start, stop, step = 1) =>
        Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
    const yearList = range(1920, 2020, 1).reverse().map(y => ({ key: y, value: y, text: y }))
    const handleYearSelect = (e, { value }) => setSpecificYear(value)

    //Based On Tags
    const baseTags = props.tags.filter(t => t.type === "base")
    const basesOnTags = baseTags.map((bt) => ({ key: bt.movielensId, value: bt.movielensId, text: bt.name.split("on ")[1] }))

    const handleBaseTagSelect = (e, { value }) => {
        const otherTagsIds = basesOnTags.filter(bt => bt.value !== value).map(t => t.value);
        const cleanMovieIdList = tagMovieIdList.filter(id => !otherTagsIds.includes(id));
        cleanMovieIdList.push(value);
        setBasedOn(value);
        setTagMovieIdList(cleanMovieIdList);
    }



    function qV() {
        var variableDict = { first: 100, skip: 0 };
        if (imdbFilter === true) {
            variableDict.minRating = imdbFilterValues.min
            variableDict.maxRating = imdbFilterValues.max
        }
        if (yearFilter === true) {
            variableDict.minYear = yearFilterValues.min
            variableDict.maxYear = yearFilterValues.max
        }
        if (specificYearFilter === true) {
            variableDict.year = specificYear
        }
        if (basedOnFilter === true && basedOn !== null) {
            variableDict.movielensIds = tagMovieIdList
        }
        return variableDict
    }
    const queryVariables = qV();


    const InfoMessage = () => {
        if (imdbFilter === false && yearFilter === false && specificYearFilter === false && basedOnFilter === false) {
            return <p className="">You can change search criteria from left panel. </p>
        } else {
            return (
                <List bulleted>
                    {imdbFilter === true &&
                        <List.Item><p>{"Movies have IMDb rating between;  "}<span className="text-bold">{`${(Math.round(imdbFilterValues.min * 10) / 10)} - ${(Math.round(imdbFilterValues.max * 10) / 10)}`}</span></p></List.Item>}
                    {yearFilter === true &&
                        <List.Item><p>{`Movies released in years between ${yearFilterValues.min} - ${yearFilterValues.max}`}</p></List.Item>}
                    {specificYearFilter === true &&
                        <List.Item><p>{`Movies released in  ${specificYear}`}</p></List.Item>}
                    {(basedOnFilter === true && basedOn !== null) &&
                        <List.Item><p className="text-capital">{`${baseTags.filter(t => t.movielensId === basedOn)[0].name}`}</p></List.Item>
                    }
                </List>
            )
        }
    }

    //console.log(search, imdbFilter, yearFilter, specificYearFilter)
    console.log("props tags", props.tags)
    //console.log("baseOn",basedOn)
    //console.log("baseOnFilter", basedOnFilter)

    //console.log("baseTags", baseTags.filter(t => t.movielensId === basedOn)[0])
    return (
        <Row>
            {/* LEFT PANEL */}
            <Col xs={12} sm={4} md={4} lg={3} className="column left-column fbox fc jcfs">
                <BackButton />

                <div className="mrt30">
                    <h5 className="text-bold text-center op80 mrb20">SEARCH CRITERIA</h5>

                    {/* IMDB RATING  */}
                    <div className="filter-container fbox fc jcfs">
                        <div className="filter-label fbox fr jcfs">
                            <Checkbox className="check-box" label='IMDB RATING' onChange={() => setImdbFilter(!imdbFilter)} />
                        </div>
                        {imdbFilter &&
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
                        }
                    </div>

                    {/* YEAR RANGE   */}
                    <div className="filter-container fbox fc jcfs">
                        <div className="filter-label fbox fr jcfs">
                            <Checkbox className="check-box" disabled={specificYearFilter}
                                label='RANGE OF YEAR'
                                onChange={() => setYearFilter(!yearFilter)}
                            />
                        </div>
                        {yearFilter &&
                            <InputRange
                                draggableTrack
                                disabled={!yearFilter}
                                minValue={1900}
                                maxValue={2020}
                                step={5}
                                value={yearFilterValues}
                                onChange={value => setYearFilterValues(value)}
                            />
                        }
                    </div>

                    {/* SPECIFIC YEAR */}
                    <div className="filter-container fbox fc jcfs">
                        <div className="filter-label fbox fr jcfs">
                            <Checkbox className="check-box" disabled={yearFilter}
                                label='YEAR'
                                onChange={() => setSpecificYearFilter(!specificYearFilter)}
                            />
                        </div>
                        {specificYearFilter &&
                            <Form.Select
                                fluid size="mini"
                                options={yearList}
                                placeholder='Year'
                                onChange={handleYearSelect}
                                value={specificYear}
                            />
                        }
                    </div>

                    {/* BASED ON */}
                    <div className="filter-container fbox fc jcfs">
                        <div className="filter-label fbox fr jcfs">
                            <Checkbox className="check-box"
                                label='BASED ON'
                                onChange={() => setBasedOnFilter(!basedOnFilter)}
                            />
                        </div>
                        {basedOnFilter &&
                            <Form.Select size="mini"
                                fluid
                                options={basesOnTags}
                                onChange={handleBaseTagSelect}
                                value={basedOn}
                            />
                        }
                    </div>

                    <Button primary
                        className="advance-search-button"
                        onClick={() => setSearch(true)}
                        disabled={(imdbFilter === false && yearFilter === false && specificYearFilter === false && basedOn === null)}
                    >
                        SEARCH
                    </Button>
                </div>

            </Col>

            {/* RIGHT PANEL */}
            <Col xs={12} sm={8} md={8} lg={9} className="right-column  fbox fc jcfs">
                <div className="right-top fbox fc jcfs w100">
                    <h6 className="text-bold text-uppercase">Advance Movie Search</h6>
                    {InfoMessage()}
                </div>

                {search === true &&
                    <Query
                        variables={queryVariables}
                        query={ADVANCE_FILTER}
                        onCompleted={(d) => {
                            const movies = d.filterPage;
                            setResult(movies);
                            setSearch(false)
                        }}
                        skip={!search}
                    >
                        {({ data, loading, error, refetch }) => {
                            if (loading) return <Loader />;
                            if (error) return <div>{error.message}</div>
                            console.log("data", data)
                            return (
                                <div className="">

                                </div>
                            )
                        }}
                    </Query>}

                <div className="result-container pr fbox fr fw jcfs aic">
                    {result.length > 0 && result.map(movie => (
                        <div className="card-box br5 mr-bt20" key={movie.id} itemProp="itemListElement" itemScope itemType="http://schema.org/Movie">
                            <Link to={`/movie/${movie.slug}`} title={movie.name} rel="nofollow">
                                <img
                                    src={movie.poster} itemProp="image" alt={`${movie.name} Poster`}
                                    className="card-image hover-border br5" />
                            </Link>
                            <p className="card-primary-text tac" itemProp="name">{movie.name}</p>
                        </div>))
                    }
                </div>

            </Col>
        </Row>
    );
}

export default withRouter(AdvanceSearch);