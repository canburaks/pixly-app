import React, { useState, useRef } from "react";
import { withRouter, Link } from "react-router-dom";

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Query } from "react-apollo";
import { COMPLEX_SEARCH } from "../../functions/query"
import BackButton from "../../components/buttons/BackButton"
//import Slider from "../../components/Slider"
//import { Checkbox, Form, List, Dimmer, Loader, Image, Segment, Button, Dropdown, Breadcrumb, Pagination  } from 'semantic-ui-react'
import JoinBanner from "../../components/JoinBanner.js"
import { useWindowSize, useAuthCheck } from "../../functions/hooks"

import InputRange from 'react-input-range';
import {GridBox, GridItem, SpeedyGridBox } from "../../components/GridBox" 
import { MessageBox } from "../../components/MessageBox"

import YearSelect from "./YearSelect"
import RatingSelect from "./RatingSelect"

import "react-input-range/lib/css/index.css"
import "./SearchPage.css"




const AdvanceSearch = (props) =>{
    const authStatus = useAuthCheck();
    const [ queryVariables, setQueryVariables ] = useState({page:1})
    const [ shouldSearch, setShouldSearch ] = useState(false)
    const variableHandler = (e) =>{
        if (e.minRating !== queryVariables.minRating || e.maxRating !== queryVariables.maxRating
            || e.minYear !== queryVariables.minYear || e.maxYear !== queryVariables.maxYear
            || e.keywords !== queryVariables.keywords
            ){
            setQueryVariables({...e,})
            setShouldSearch(true)
        }
    }
    return(
        <div className="page-container">
                {!authStatus && <JoinBanner />}
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
    const [keywords, setKeywords ] = useState("")
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

    const exportHandler = (e) => {
        e.preventDefault()
        props.export({
            keywords:keywords, 
            minYear:selectedYears.min, maxYear:selectedYears.max,
            minRating:selectedRatings.min, maxRating:selectedRatings.max
        })
    }
    
    return(
        <form className="sp-form">
            
            <div className="sp-keyword-box fbox-r jcc aic">
                <input type="text"  className="sp-text-input" value={keywords} onChange={e => setKeywords(e.target.value)} />
            </div>
            
            <div className="sp-option-box">
                <div className="sp-item sp-year fbox-c jcfs aic">
                    <p>Between these years</p>
                    {/*<p className="pad-lr-5x">Movies that are released between these years.</p>*/}
                    <YearSelect export={e => yearSelectHandler(e)}  />
                </div>

                <div className="sp-item sp-rating fbox-c jcfs aic">
                    <p>Between these Imdb Rating</p>
                    {/*<p className="pad-lr-5x">Movies that are rated between these these ratings on IMDb.</p>*/}
                    <RatingSelect export={e => ratingSelectHandler(e)}  />
                </div>

                <div className="sp-action-box">
                    <button className="sp-action" onClick={exportHandler}>Search</button>
                </div>
            </div>

        </form>
    )
}


const SearchQuery = (props) =>{
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

const Loading = () => (
    <div className="page-container">
        {window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)

export default withRouter(AdvanceSearch);