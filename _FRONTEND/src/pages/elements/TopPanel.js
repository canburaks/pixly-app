/* eslint-disable */
import React from "react";
import { useState, useContext } from "react";

import { useWindowSize } from "../../functions/hooks"

import CoverPanel from "./CoverPanel"
import PosterPanel from "./PosterPanel"



const TopPanel = (props) =>{
    console.log("props",props.item)

    const poster = props.item.poster;
    const cover = props.item.coverPoster;
    const hasCover = props.item.hasCover
    const genres = props.item.tags.filter(t => t.tagType === "genre")
    const screenSize = useWindowSize()
    if (hasCover) return (
        <CoverPanel 
            item={props.item}  
            status={props.status} 
            screen={screenSize}
        />
        
        )
    else return (
        <PosterPanel 
            item={props.item}  
            status={props.status} 
            screen={screenSize}
        /> 
        )
}





export default TopPanel;