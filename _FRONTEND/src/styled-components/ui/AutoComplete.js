import React, { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useAuthCheck, useValues, useDebounce, AUTOCOMPLETE_MOVIE, isEqualObj,
    AUTOCOMPLETE_MOVIE_ONLY_HAVE_SIMILARS
 } from "../../functions";
import { movieAutoCompleteQuery } from "../../functions/requests"
import {  SearchBox} from "cbs-react-components"


import { movieAutoComplete } from "../../functions/grec";
import { GlobalContext } from "../../";
import { AuthForm, ForgetForm } from "../../forms/AuthForm"
import { development } from "../../index"

import { 
    UnderlineEffect, NewLink,Box, HomeDropdown, ProfileDropdown,
    Text, Paragraph, NavBarBox,SearchInput,
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    FlexBox, ListBox,SuperBox, AbsoluteBox, 
    CoverLink,Input, HiddenText, 
    TextSection, HeaderMini, LinkButton,
    BookmarkMutation, RatingMutation,TagBox,
    ImdbRatingIcon, YearClockIcon, ProfileIcon, LogoutIcon,
    HomeIcon,ListIcon,
    LogoutMutation,SearchQueryBox,RegularInput,
    navbarheight

} from "../"
import "./AutoComplete.css"

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

export const MovieAutoComplete = ({dispatch, ...props }) => {
    function variableSetter(term){
        return {search:term}
    }
    return <AutoCompleteInput query={AUTOCOMPLETE_MOVIE_ONLY_HAVE_SIMILARS} variableSetter={variableSetter} dispatch={dispatch} {...props}  />
}



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
*/