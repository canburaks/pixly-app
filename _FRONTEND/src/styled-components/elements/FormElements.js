import React from "react";
import { useMemo, useState, useCallback } from 'react';
import {  useWindowSize, useValues } from "../../functions" 
import IR  from 'react-input-range'; // Originally InputRange


import { 
    Box, FlexBox, Text, NewLink, TopPanelBackElement, TopPanelCoverElement,
    DirectorLink, DirectorLinks, TagText,
    LikeMutation,BookmarkMutation, RatingMutation, FollowMutation,
    UsersIcon, EyeIcon,UserIcon,ImdbIcon, WatchIcon, SearchIcon,
    Input,InputRange,Label, InputSelect,Datalist, Option
} from "../index"
import "./slider.css"
import "./FormElements.css"

import "react-input-range/lib/css/index.css"
import staticTags from "./tags.json" 

export const FormInput = (props) => (
    <FlexBox flexDirection="column" width={"100%"} px={[2]} mt={[2]}>
        <Label color="dark">{props.name}</Label>
        <Input 
            name={props.name} 
            defaultValue={props.defaultValue}
            type={props.type || "text"}
            placeholder={props.placeholder}
            ref={props.formRef}
            {...props}
        />
        <Text fontSize={["12px"]} color="red" m={0} p={0} minHeight={["12px"]}>{props.error}</Text>
    </FlexBox>
)


export const TagSlider = (props) => {
    const allTags = staticTags.filter(t => t.genreTag===true);
    const [tag, setTag ] = useState("")
    const tagHandler = (e) => setTag(e.target.value)
    
    const tagOptions = allTags.map(tag => tag.name)
    const selectedTagSlug = useMemo(() => {
        var st = allTags.filter(statictag => statictag.name === tag)[0]
        if (st) return st.slug
        else return null 
    },[tag])
    props.dispatcher(selectedTagSlug)

    //console.log("options", tag, selectedTagSlug)
    //console.log(minYear, maxYear, selectedYears)

    props.dispatcher(selectedTagSlug)
    return( 
        <FlexBox boxShadow={"mini"}
            alignItems={"center"} flexDirection="column"
            m={[1]}  py={[3]} px={[3,3,4]}
            width={"100%"}
            flexGrow={1,1,1, 0}
            border="0.5px solid"
            borderColor="rgba(80,80,80, 0.5)"
            borderRadius={"8px"}
            zIndex={10} 
            color="black"
            bg={"rgba(0,0,0,0.2)"}
            {...props}
        >

            <Text textAlign="center" width={"100%"} color="light" fontWeight="bold">Select Genre</Text>
            <InputSelect
                options={tagOptions} 
                selected={tag} 
                onChange={tagHandler} 
                width={["100%"]}  mx={[1]} flexGrow={1}
            />
   

        </FlexBox>
    )
}

export const YearSlider = (props) => {
    const min = props.min || 1970
    const max = props.max || 2020
    const [minYear, setMinYear] = useState(min)
    const [maxYear, setMaxYear] = useState(max)
    const selectedYears = useMemo(() => ({minYear, maxYear}), [minYear, maxYear])
    
    const minYearHandler = useCallback((e) => setMinYear(parseInt(e.target.value)),[minYear])
    const maxYearHandler = useCallback((e) => setMaxYear(parseInt(e.target.value)),[maxYear])

    const minYearOptions = useMemo(() => {
        let options = []
        for (let x=1920; x<maxYear; x++){
            options.push(x)
        }
        return options
    },[maxYear])

    const maxYearOptions = useMemo(() => {
        let options = []
        for (let x=minYear + 1; x<=max; x++){
            options.push(x)
        }
        return options
    },[minYear])

    //console.log("options",minYearOptions, maxYearOptions)
    //console.log(minYear, maxYear, selectedYears)

    props.dispatcher()
    return(
        <FlexBox boxShadow={"mini"}
            alignItems={"center"}
            m={[1]}  p={[1]} py={[3]}
            width={"100%"}
            flexGrow={1,1,1, 0}
            border="0.5px solid"
            borderColor="rgba(80,80,80, 0.5)"
            borderRadius={"8px"}
            zIndex={10} 
            color="black"
            bg={"rgba(0,0,0,0.2)"}
            {...props}
        >
            <WatchIcon title="Release Year" stroke={props.iconColor || "white"}  size={40}/>
            <FlexBox flexWrap="wrap" width={["80%", "80%", "90%", "90%", "94%"]} pb={[3]}>

                <Text textAlign="center" width={"100%"} color="dark" fontWeight="bold">Released Between Years</Text>
                <InputSelect 
                    options={minYearOptions} 
                    selected={minYear} 
                    onChange={minYearHandler} 
                    width={["45%"]}  mx={[1]} flexGrow={1}
                />
                <InputSelect 
                    options={maxYearOptions} 
                    selected={maxYear} 
                    onChange={maxYearHandler} 
                    width={["45%"]} mx={[1]} flexGrow={1}
                />
            </FlexBox>

        </FlexBox>
    )
}

export const RatingSlider = (props) => {
    const rounder = (number) => Math.round(number*10)/10
    const min = props.min || 5.5
    const max = props.max || 10.0
    const [minRating, setMinRating] = useState(min)
    const [maxRating, setMaxRating] = useState(max)
    const selectedRatings = useMemo(() => ({minRating, maxRating }), [minRating, maxRating])
    
    const minRatingHandler = useCallback((e) => setMinRating(parseFloat(e.target.value)),[minRating])
    const maxRatingHandler = useCallback((e) => setMaxRating(parseFloat(e.target.value)),[maxRating])

    const minRatingOptions = useMemo(() => {
        let options = []
        for (let x=3; x<maxRating; x += 0.1){
            options.push(rounder(x))
        }
        return options
    },[maxRating])

    const maxRatingOptions = useMemo(() => {
        let options = []
        for (let x=minRating + 0.1; x<=10; x += 0.1){
            options.push(rounder(x))
        }
        return options
    },[minRating])

    //console.log("options",minRatingOptions, maxRatingOptions)
    //console.log(minRating, maxRating, selectedRatings)
    props.dispatcher()
    
    return(
        <FlexBox boxShadow={"mini"}
            alignItems={"center"}
            m={[1]}  p={[1]} py={[3]}
            width={"100%"}
            flexGrow={1,1,1, 0}
            border="0.5px solid"
            borderColor="rgba(80,80,80, 0.4)"
            borderRadius={"8px"}
            bg={"rgba(0,0,0,0.2)"}
            {...props}
        >
        <ImdbIcon title="IMDb Rating" fill={props.iconColor || "#fac539"}  size="40px !important;" imdb/>
        <FlexBox flexWrap="wrap" width={["80%", "80%", "90%", "90%", "94%"]} pb={[3]}>
            <Text textAlign="center" width={"100%"} color="dark" fontWeight="bold">Min and Max IMDb Rating</Text>
            <InputSelect 
                options={minRatingOptions} 
                selected={minRating} 
                onChange={minRatingHandler} 
                width={["45%"]}  mx={[1]} flexGrow={1}
            />
            <InputSelect 
                options={maxRatingOptions} 
                selected={maxRating} 
                onChange={maxRatingHandler} 
                width={["45%"]}  mx={[1]} flexGrow={1}
            />
        </FlexBox>
    </FlexBox>
    )
}

export const YearSliderYedek = (props) => {
    const min = props.min || 1950
    const max = props.max || 2020
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
            alignItems={"flex-end"}
            m={[1]} pl={[1]} pr={[3,3,3,4]} py={[2]}
            width={"43%"}
            flexGrow={1,1,1, 0}
            border="0.5px solid"
            borderColor="rgba(80,80,80, 0.5)"
            borderRadius={"8px"}
            zIndex={10}
            color="black"
            {...props}
        >
            <WatchIcon title="Release Year" stroke={props.iconColor || "white"}  size={30}/>
            <InputRange
                max={2020}
                min={1920}
                step={1}
                value={selectedYears}
                onChange={changeHandler}

            />
        </FlexBox>
    )
}

export const RatingSliderYedek = (props) => {
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
            {...props}
        >
        <ImdbIcon title="IMDb Rating" fill={props.iconColor || "#fac539"}  size="30px !important;" imdb/>
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

