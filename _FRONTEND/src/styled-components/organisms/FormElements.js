import React from "react";
import { useMemo, useState, useCallback } from 'react';
import {  useWindowSize, useValues } from "../../functions" 
import IR  from 'react-input-range'; // Originally InputRange


import { 
    Box, FlexBox, Text, NewLink, TopPanelBackElement, TopPanelCoverElement,
    DirectorLink, DirectorLinks, TagText,
    LikeMutation,BookmarkMutation, RatingMutation, FollowMutation,
    UsersIcon, EyeIcon,UserIcon,ImdbIcon, WatchIcon, SearchIcon,
    Input,InputRange,
} from "../index"

export const YearSlider = (props) => {
    const min = props.min || 1950
    const max = props.max || 2019
    const [selectedYears, setSelectedYears ] = useState({min:min, max:max})
    const yearSelectHandler = (e) => setSelectedYears(e)

    const dataConverter = (selectedYears) => ({minYear:selectedYears.min, maxYear:selectedYears.max})
    const changeHandler = (e) => {
        if (props.dispatcher){
            props.dispatcher(dataConverter(e))
        }
        setSelectedYears(e)
    }

    return(
        <FlexBox boxShadow={"mini"}
            alignItems={"center"}
            m={[1]} pl={[1]} pr={[3,3,3,4]} py={[2]}
            width={"43%"}
            flexGrow={1,1,1, 0}
            border="0.5px solid"
            borderColor="rgba(80,80,80, 0.5)"
            borderRadius={"8px"}
        >
            <WatchIcon title="Release Year" stroke={"black"}  size={30}/>
            <InputRange
                max={2020}
                min={1900}
                step={1}
                value={selectedYears}
                onChange={changeHandler}
            />
        </FlexBox>
    )
}

export const RatingSlider = (props) => {
    const min = props.min || 5.0
    const max = props.max || 9.9
    const [selectedRatings, setSelectedRatings ] = useState({min:min, max:max})

    const rounder = (number) => Math.round(number*10)/10

    const dataConverter = (selectedRatings) => ({minRating: rounder(selectedRatings.min), maxRating: rounder(selectedRatings.max) })

    
    const changeHandler = (e) => {
        if (props.dispatcher){
            props.dispatcher(dataConverter(e))
        }
        setSelectedRatings({min:rounder(e.min),max:rounder(e.max)})
    }
    
    return(
        <FlexBox boxShadow={"mini"}
            alignItems={"center"}
            m={[1]} pl={[1]} pr={[3,3,3,4]} py={[2]}
            width={"43%"}
            flexGrow={1,1,1, 0}
            border="0.5px solid"
            borderColor="rgba(80,80,80, 0.4)"
            borderRadius={"8px"}
        >
        <ImdbIcon title="IMDb Rating" fill="black"  size="30px !important;" imdb/>
        <InputRange
            max={10.0}
            min={1.0}
            step={0.1}
            value={selectedRatings}
            onChange={changeHandler}
        />
    </FlexBox>
    )
}