import React, { useState, useRef, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Query } from "react-apollo";
import { COMPLEX_TAG_SEARCH } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'

import InputRange from 'react-input-range';
import {GridBox, GridItem, SpeedyGridBox } from "../../components/GridBox" 
import { MessageBox } from "../../components/MessageBox"

import TagSelect from "./TagSelect"
import YearSelect from "./YearSelect"
import RatingSelect from "./RatingSelect"

import "react-input-range/lib/css/index.css"
import "./AdvanceSearch.css"




const AdvanceSearch = (props) =>{
    const [ queryVariables, setQueryVariables ] = useState({page:1})
    const [ shouldSearch, setShouldSearch ] = useState(false)
    const variableHandler = (e) =>{
        if (e.minRating !== queryVariables.minRating || e.maxRating !== queryVariables.maxRating
            || e.minYear !== queryVariables.minYear || e.maxYear !== queryVariables.maxYear
            || e.tags !== queryVariables.tags
            ){
            setQueryVariables({page:1, ...e,})
            setShouldSearch(true)
        }
    }
    //console.log("qv",props)
    
    return(
        <div className="page-container">
                <div className="search-menu-container">
                    <SelectPanel {...props} export={e => variableHandler(e)} />      
                </div>
                <div className="search-query-container">
                    {shouldSearch && <SearchQuery variables={queryVariables} shouldSearch={shouldSearch} />}
                </div>
        </div>
    );
}

const SelectPanel = (props) =>{
    const [selectedTags, setSelectedTags ] = useState([])
    const [selectedYears, setSelectedYears ] = useState({min:1980, max:2019})
    const [selectedRatings, setSelectedRatings ] = useState({min:8.0, max:10.0})

    const yearSelectHandler = (e) =>{
        if (e.min !== selectedYears.min || e.max !== selectedYears.max){
            setSelectedYears(e)
        }
    }
    const ratingSelectHandler = (e) =>{
        if (e.min !== selectedRatings.min || e.max !== selectedRatings.max){
            setSelectedRatings(e)
        }
    }

    const exportHandler = () => {
        props.export({
            tags:selectedTags, 
            minYear:selectedYears.min, maxYear:selectedYears.max,
            minRating:selectedRatings.min, maxRating:selectedRatings.max
        })
    }
    
    const phenomenalTags = useMemo(() =>  props.tags.filter(t => t.phenomenalTag === true))
    //console.log("phenomenal ",phenomenalTags)
    return(
        <div className="search-menu-box">
            {/*
            */}
            <div className="search-menu-option tag-select">
                <h4>Tag</h4>
                <p className="pad-lr-5x">Search movies which includes any of the below tags.</p>
                <TagSelect tags={phenomenalTags} export={e => setSelectedTags(e)} />
            </div>
            
            <div className="search-menu-option year-select">
                <h4>Year</h4>
                 {/*<p className="pad-lr-5x">Movies that are released between these years.</p>*/}
                <YearSelect export={e => yearSelectHandler(e)} />
            </div>

            <div className="search-menu-option rating-select">
                <h4>Imdb Rating</h4>
                {/*<p className="pad-lr-5x">Movies that are rated between these these ratings on IMDb.</p>*/}
                <RatingSelect export={e => ratingSelectHandler(e)} />
            </div>

            <div className="search-menu-button-box">
                <button className="search-menu-button" onClick={exportHandler}>Search</button>
            </div>
        </div>
    )
}


const SearchQuery = (props) =>{
    const [currentPage, setCurrentPage] = useState(1)
    const qv = props.variables
    qv.page = currentPage
    //console.log("qv", qv)

    return (
    <Query query={COMPLEX_TAG_SEARCH} variables={{page:currentPage, ...qv}}>
    {({data, loading, error})=>{
        if (loading) return <Loading />
        if (error) return <div>{error.message}</div>
        const result = data.complexSearch.result;
        const quantity = data.complexSearch.quantity
        console.log("response", result, quantity)
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

const Loading = () => (
    <div className="page-container">
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)

export default withRouter(AdvanceSearch);