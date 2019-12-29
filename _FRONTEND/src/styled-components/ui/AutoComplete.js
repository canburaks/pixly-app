import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useAuthCheck, useValues, useDebounce, AUTOCOMPLETE_MOVIE, isEqualObj,
    AUTOCOMPLETE_MOVIE_ONLY_HAVE_SIMILARS
 } from "../../functions";
import { movieAutoCompleteQuery } from "../../functions/requests"
import {  SearchBox} from "cbs-react-components"
import { compose,typography, color, space, shadow, layout, border, background, flexbox, position, system } from 'styled-system'
import {  styled } from "../"
import { lighten } from 'polished'


import { movieAutoComplete } from "../../functions/grec";
import { GlobalContext } from "../../";
import { AuthForm, ForgetForm } from "../../forms/AuthForm"
import { development } from "../../index"

import { 
    UnderlineEffect, NewLink,Box, HomeDropdown, ProfileDropdown,
    Text, Paragraph, NavBarBox,
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    FlexBox, ListBox,SuperBox, AbsoluteBox, 
    CoverLink,Input, HiddenText, 
    TextSection, HeaderMini, LinkButton,
    BookmarkMutation, RatingMutation,TagBox,
    ImdbRatingIcon, YearClockIcon, ProfileIcon, LogoutIcon,
    HomeIcon,ListIcon,SearchIcon,
    LogoutMutation,SearchQueryBox,RegularInput,
    navbarheight,SpinnerFade

} from "../"
import { Plus, Wobblebar } from 'css-spinners-react'

import "./AutoComplete.css"

export const MovieAutoComplete = ({dispatch, ...props }) => {
    function variableSetter(term){
        return {search:term}
    }
    return (
        <AutoCompleteInput 
            query={AUTOCOMPLETE_MOVIE_ONLY_HAVE_SIMILARS} 
            variableSetter={variableSetter} 
            dispatch={dispatch} {...props} 
        />
    )
}



export const AutoCompleteInput = ({ query, variableSetter, dispatch, min=3, ...props }) => {
    const [search, setSearch ] = useState("")
    const searchSetter = (e) => setSearch(e.target.value)

    const [queryResult, setQueryResult ] = useState([])
    const debouncedValue = useDebounce(search, 500)

    const [queryFunction, {data, loading}] = useLazyQuery(query);
    
    //When data arrives
    if (data && Object.keys(data).length > 0 && data[Object.keys(data)[0]]){
        //console.log("iiin-data", data)
        const results = data[Object.keys(data)[0]]
        if (queryResult===null || !isEqualObj(results, queryResult)){
            setQueryResult(results)
        }
    }
    //console.log("asd", variableSetter("asd"))



    //Make request if passes the requirements
    useEffect(() => {
        const vars = variableSetter(debouncedValue)
        //console.log("vars", vars)
        if (debouncedValue.length > min){
            queryFunction({variables:vars})
        }
        if (search.length < min && queryResult.length > 0){
            dispatch([])
        }
    },[debouncedValue])

    //dispatch the queryResult
    useEffect(() => {
        var oldResult = []
        if (queryResult.length > 0 && !isEqualObj(oldResult, queryResult)){
            dispatch(queryResult)
        }
        //if chars removed than clear the movies
        if (queryResult.length === 0 && oldResult.length > 0){
            dispatch(queryResult)
        }
        },[queryResult])

    return (
            <SearchAutoInputBox id="autoComplete"
                width={["60%"]}
                display="flex"
                hoverWidth={"80%"}
                maxWidth={"500px"} minWidth={"250px"}
                height={45} 
                mb={[3,3,4]}
            >
                {!loading 
                    ?<SearchIcon 
                        size={24}  stroke={"rgba(0,0,0, 0.7)"}
                        position="absolute" left={"8px"} top={(45-(24 + 12))/2} alignSelf="center"
                        zIndex={1}
                    />
                    :<Plus id="plus-loader-absolute" />
                }
                <SearchAutoInput
                    height={"100%"}
                    fontSize={["16px","16px", "22px"]} 
                    borderRadius={"160px"}
                    tabIndex="1" 
                    onChange={searchSetter}
                    {...props}
                />
            </SearchAutoInputBox>
    )
}

export const SearchAutoInput = styled("input")`
    background: ${lighten(0.01, `rgba(255, 255, 255, 0.9)`)};
    position:relative;
    width:100%;
    font-weight: bold;
    font-style: italic;
    color:${props => props.color ? props.color : "rgba(0,0,0, 0.7)"};
    caret-color: ${props => props.color ? props.color : "rgba(0,0,0, 0.7)"};
    letter-spacing: 1.2px;
    -webkit-appearance: none;
    outline: none;
	transition: all 0.4s ease;
	-webkit-transition: all -webkit-transform 0.4s ease;
    border:0px solid;
    box-sizing:border-box;
    box-shadow: 0px 2px 6px rgba(6, 28, 63, 0.1);
    padding:4px 4px;
    padding-left: 16px;
    text-align:center;
    margin:0;
    :hover {
        background: ${lighten(0.4, `rgba(255, 255,255, 1)`)};
        text-align:center;
        padding-left: 0;

    }
    :focus {
        background: ${lighten(0.95, `rgba(255, 255,255, 1)`)};
        text-align:center;
        padding-left: 0;
        color:rgba(0,0,0, 0.85);

        width:100%;
        ::placeholder {
            display:none;
            color:transparent;
            border-color:white;
            font-weight:bold
        }
    }
    ::placeholder {
        color: rgba(180,180,180, 0,9);
    }
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
    ${typography}

`
export const SearchAutoInputBox = styled("div")`
    width:100%;
    display:flex;
    position:relative;
    font-weight: bold;
    font-style: italic;
    border:0px solid;
    box-sizing:border-box;
	transition: all 0.4s ease;
	-webkit-transition: all -webkit-transform 0.4s ease;
    :hover {
        transform:scale(1.1);
        width:${props => props.hoverWidth && props.hoverWidth};
        max-width:500px;
    }
    :focus {
        transform:scale(1.1);
        width:${props => props.hoverWidth && props.hoverWidth};
        max-width:500px;
    }
    ${color}
    ${space}
    ${shadow}
    ${layout}
    ${background}
    ${border}
    ${flexbox}
    ${position}
    ${typography}

`

// It is working , I leave it as a backup
/*
export const MovieAutoComplete2 = ({dispatch, min=3, ...props }) => {
    const [search, setSearch ] = useState("")
    const [queryResult, setQueryResult ] = useState(null)
    const debouncedValue = useDebounce(search, 1000)

    const [searchMovie, {data, loading}] = useLazyQuery(AUTOCOMPLETE_MOVIE);
    

    if (data && data.searchMovie){
        //console.log("iiin-data", data)
        const results = data.searchMovie
        if (queryResult===null || !isEqualObj(results, queryResult)){
            setQueryResult(results)
        }
    }

    useEffect(() => {
        searchMovie({variables:{search:debouncedValue}})
    },[debouncedValue])

    useEffect(() => {
        if (queryResult !== null && queryResult !== undefined){
            dispatch(queryResult)
        }
    })

    const searchSetter = (e) => setSearch(e.target.value)
    console.log("debounce", debouncedValue)
    return (
        <input 
            id="autoComplete" 
            tabIndex="1" 
            onChange={searchSetter}
            {...props}
        />
    )
}



// This is the bacup of clone package implementation
export const AutoCompleteInput = ({ query, variableSetter, dispatch, min=3, ...props }) => {
    const [search, setSearch ] = useState("")
    const searchSetter = (e) => setSearch(e.target.value)

    const [queryResult, setQueryResult ] = useState([])
    const debouncedValue = useDebounce(search, 1000)

    const [queryFunction, {data, loading}] = useLazyQuery(query);
    
    //When data arrives
    if (data && Object.keys(data).length > 0 && data[Object.keys(data)[0]]){
        //console.log("iiin-data", data)
        const results = data[Object.keys(data)[0]]
        if (queryResult===null || !isEqualObj(results, queryResult)){
            setQueryResult(results)
        }
    }
    //console.log("asd", variableSetter("asd"))



    //Make request if passes the requirements
    useEffect(() => {
        const vars = variableSetter(debouncedValue)
        //console.log("vars", vars)
        if (debouncedValue.length > min){
            queryFunction({variables:vars})
        }
        if (debouncedValue.length < min && queryResult.length > 0){
            setQueryResult([])
        }
    },[debouncedValue])

    //dispatch the queryResult
    useEffect(() => {
        var oldResult = []
        if (queryResult.length > 0 && !isEqualObj(oldResult, queryResult)){
            dispatch(queryResult)
        }
    },[queryResult])

    return (
            <input
                id="autoComplete" 
                tabIndex="1" 
                onChange={searchSetter}
                {...props}
            />
    )
}


*/