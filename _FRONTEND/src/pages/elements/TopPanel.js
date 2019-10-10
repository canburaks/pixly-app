/* eslint-disable */
import React from "react";
import { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { FAV_MUTATION, BOOKMARK_MUTATION } from "../../functions/mutations";
import { Mutation } from "react-apollo";
import { print } from "../../functions/lib"
import { rgaPageView, Head, MoviePageAd} from "../../functions/analytics"
import { useWindowSize } from "../../functions/hooks"


import StarRating from "../../components/StarRating"

import { useAuthCheck } from "../../functions/hooks";
import {  Row, Col } from 'react-flexbox-grid';
//import WP from "../../components/VideoPlayer";
//import "cbs-web-components"sfd
import { YoutubePlayer, TextCollapse} from "cbs-react-components";
import { GlobalContext } from "../../App";
import { GridBox, GridItem } from "../../components/GridBox" 
import { SocialBox } from "../../components/SocialMedia" 
import { Title, Person, PersonBox, TagBox, BookmarkButton, FavButton } from "./Elements"
import { BookmarkIcon, FavIcon } from "../../assets/f-icons/index"
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