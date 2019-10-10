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


    console.log(queryVariables)
    //console.log(props)


    return(
        <div className="">

        </div>

    );
}

export default withRouter(AdvanceSearch);