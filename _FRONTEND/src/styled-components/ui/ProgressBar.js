import React from "react";

import {  styled } from "../"
import { themeGet } from '@styled-system/theme-get'

import { 
    Box,SuperBox, GridBox, FlexBox, BlurBox, Text, HeaderText, NewLink, Paragraph,
    TagText,Menu, MenuItem, Image,Stats,
    PlaceIcon, HomeIcon, SettingsIcon, FollowMutation
} from "../index"


export const ProgressBar = (props) => {
    const { 
        percentValue,
        spectrum,
        max=100,
        progressColor = "#4CAF50",
    } = props;

    //props edit
    const value = percentValue
    const barColor = spectrum ? hslValue(spectrum.start, spectrum.stop, value / max, spectrum.transparency) : progressColor
    //Dimensions


    function hslValue(start, stop, ratio, transparency = 1) {
        return `hsla(${(start + (stop - start) * ratio)}, 100%, 50%, ${transparency})`
    }

    return(
        <FlexBox 
            justifyContent="center" alignItems="center" 
            width={"100%"} 
            bg={barColor} 
            title={props.message}
            {...props} 
        >
            <Text 
                color={props.color || "light"} 
                fontWeight="bold" 
                fontSize={props.fontSize || "16px"}
                textShadow="textDark"
            >
                {percentValue + "%"}
            </Text>
        </FlexBox>
    )
}