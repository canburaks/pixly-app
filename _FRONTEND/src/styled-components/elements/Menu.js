import React from "react";
import { useState, useRef,useEffect, useCallback, useMemo } from "react"

import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,MoviePosterBox, CloseIcon,
    MovieCoverBox, DirectorCard, MovieCoverCard, ImageCard, Grid,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox,
    RatingSlider, YearSlider,MoviePosterCard, PlaceHolderCard
} from "../../styled-components"

export const Menu = (props) => (
    <FlexBox width={"100%"} {...props} alignItems="stretch">
        {props.children}
    </FlexBox>
)

export const MenuItem = (props) => {
    const clickHandler = useCallback(() => props.onClick ? props.onClick(props) : null, [props.onClick])
    return (
    <FlexBox 
        justifyContent="center"
        alignItems="flex-end" p={[1,1,2]} pb={0}
        minWidth={"30px"}
        minHeight={"100%"}
        borderBottom={props.active ? "7px solid #3437c7" : "7px solid transparent"} 
        clickable={props.clickable ? props.clickable : true}
        {...props}
        onClick={clickHandler}
    >
        {props.children}
    </FlexBox>
)}


