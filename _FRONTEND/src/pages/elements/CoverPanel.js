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
import { Title, Person, PersonBox, TagBox, BookmarkButton, FavButton, FollowButton } from "./Elements"

import "./CoverPanel.css"

const CoverPanel = (props) =>{
    const genres =props.item.tags 
        ? props.item.tags.filter(t => t.genreTag === true || t.subgenreTag === true || t.phenomenalTag === true || t.formTag === true) 
        : null
    return(
        <div className="top-panel-box">
            <div className="top-panel-inner" style={{backgroundImage:`url(${props.item.coverPoster})`}} >
                
                <div className="left-panel">
                    <div className="fav-book-box">
                        {props.follow && <FollowButton item={props.item} status={props.status} /> }
                        {props.fav && <FavButton item={props.item}  status={props.status}/>}
                        {props.bookmark && <BookmarkButton item={props.item}  status={props.status} />}
                    </div>                       
                    <SocialBox item={props.item}  rating={props.item.imdbRating} />

                </div>

                <div className="middle-panel fw">
                    <div className="fbox-c jcfs aifs" style={{flexGrow:1}}>
                        <Title text={props.item.name} />
                            {/* PERSON */}
                           {props.person && 
                                props.item.jobs && <p className="t-s t-capitalize cover-text t-bold op90">{props.item.jobs.join(", ")}</p>}
                            {props.person && 
                                props.personData["place_of_birth"] && <p className="t-xs cover-text t-bold op90">Birth Place: {props.personData.place_of_birth}</p>}
                            {props.person && 
                                props.personData["birthday"] && <p className="t-xs cover-text t-bold op90">Born: {props.personData.birthday}</p>}
                            {/* MOVIE */}
                            {props.item.director && props.item.director.length > 0 && 
                            <PersonBox directors={props.item.director} />}
                            {genres && <TagBox  tags={genres} className="tag-shadow"/>}
                    </div>
                    <div className="fbox-r jcfs aic">
                        {props.rating && <StarRating item={props.item}/>}
                    </div>
                </div>  
            </div>

        </div>
    )
}
export default CoverPanel

/*

const CoverPanel = (props) =>{
    const genres = props.item.tags.filter(tag => tag.tagType === "genre")
    const iconSize = props.screen === "L" ? 36 : 24
    return(
        <div className="top-panel-box cover box-shadow">
            <div className="cbs-inner-cover" style={{backgroundImage:`url(${props.item.coverPoster})`}} >
                <div className="alias-box">
                    <Title text={props.item.name} extra={` (${props.item.year})`} />
                    {props.item.director && props.item.director.length > 0 && 
                        <PersonBox directors={props.item.director} />}
                        
                   
                    <div className="fbox-r jcsb aic w100">

                        <div className="fbox-r jcfs aic">
                            <StarRating size={iconSize} item={props.item}/>
                        </div>
                        <SocialBox item={props.item}  />
                    </div>

                    {/*genres && genres.length > 0 && <TagBox tags={genres} /> 
                </div>
            </div>
            <div className="fav-book-box">
                <FavButton item={props.item}  status={props.status}/>
                <BookmarkButton item={props.item}  status={props.status} />
            </div>
        </div>
    )
}
*/