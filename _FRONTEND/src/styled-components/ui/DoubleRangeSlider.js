import React from "react";
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {  useWindowSize, useValues } from "../../functions" 


import { 
    Box, FlexBox, Text, NewLink, TopPanelBackElement, TopPanelCoverElement,
    DirectorLink, DirectorLinks, TagText,
    LikeMutation,BookmarkMutation, RatingMutation, FollowMutation,
    UsersIcon, EyeIcon,UserIcon,ImdbIcon, WatchIcon, SearchIcon,
    Input,InputRange,Label
} from "../index"
import "./DoubleRangeSlider.css"


export const DoubleRangeSlider = (props) => {
    const min = props.min || 1950
    const max = props.max || 2020
    const [minYear, setMinYear] = useState(min)
    const [maxYear, setMaxYear] = useState(max)
    const rangeSlider = useRef(null)

    //values to dispatch
    const values = useMemo(() => ({minYear, maxYear}), [minYear, maxYear])

    const minHandler = (e) => setMinYear(e.target.value)
    const maxHandler = (e) => setMaxYear(e.target.value)

    const yearSelectHandler = (e) => setSelectedYears(e)
    const changeHandler0 = (e) => {
        if (props.dispatcher){
            props.dispatcher(values)
        }
    }

    console.log("slider", minYear, maxYear, values)
    


    return(
        <div class="wrapper">
            <div class="container">

                <div class="slider-wrapper">
                <div id="slider-range"></div>

                <div class="range-wrapper">
                    <div class="range"></div>
                    <div class="range-alert">+</div>

                    <div class="gear-wrapper">
                    <div class="gear-large gear-one">
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                    </div>
                    <div class="gear-large gear-two">
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                        <div class="gear-tooth"></div>
                    </div>
                    </div>

                </div>

                <div class="marker marker-0"><sup>$</sup>10,000</div>
                <div class="marker marker-25"><sup>$</sup>35,000</div>
                <div class="marker marker-50"><sup>$</sup>60,000</div>
                <div class="marker marker-75"><sup>$</sup>85,000</div>
                <div class="marker marker-100"><sup>$</sup>110,000+</div>
                </div>

            </div>
        </div>
)
}

/*
    <div className="range-slider">
        <label className="range-slider-label min-label">{minYear}</label>
        <input 
            min={min} max={max} step={1} 
            value={minYear} 
            onChange={minHandler}
            type="range"
        />
        <label className="range-slider-label max-label">{maxYear}</label>
        <input 
            min={min} max={max} step={1} 
            value={maxYear} 
            onChange={maxHandler}
            type="range"
        />
        <svg width="100%" height="24">
            <line x1="4" y1="0" x2="300" y2="0" stroke="#444" strokeWidth="12" strokeDasharray="1 28"></line>
        </svg>
    </div>
*/