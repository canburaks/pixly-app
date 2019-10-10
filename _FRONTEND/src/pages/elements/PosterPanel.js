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
import { SocialBox, SocialMedia } from "../../components/SocialMedia" 
import { Title, Person, PersonBox, TagBox, BookmarkButton, FavButton, FollowButton } from "./Elements"

import "./PosterPanel.css"

const PosterPanel = (props) =>{
    const genres = props.item.tags 
        ? props.item.tags.filter(t => t.genreTag === true || t.subgenreTag === true || t.phenomenalTag === true || t.formTag === true) 
        : null
    return(
        <div className="poster-panel">
            <div className="left-panel" >
                <div className="fav-book-box">
                    {props.follow && <FollowButton item={props.item} status={props.status} /> }
                    {props.fav && <FavButton item={props.item}  status={props.status}/>}
                    {props.bookmark && <BookmarkButton item={props.item}  status={props.status} />}
                </div>                       
                <SocialBox item={props.item}  />
            </div>

            <div className="mid-pane">
                <div className="mid-col-1">
                    <img 
                        src={props.item.poster} 
                        alt={props.item.name} title={props.item.name} 
                        className="poster-panel-image"
                    />
                    <StarRating item={props.item} color1={"#4b55e1"}/>

                    <div className="alias-box mini">
                        <Title text={props.item.name} />
                        {props.item.director && props.item.director.length > 0 && 
                            <PersonBox directors={props.item.director} />}
                            
                        {genres && props.item.tags && <TagBox tags={genres} />}
                    </div>

                </div>
                <div className="mid-col-2">
                    <div className="alias-box large">
                        <Title text={props.item.name} />
                        {props.item.director && props.item.director.length > 0 && 
                            <PersonBox directors={props.item.director} />}
                        <div className="fbox-r jsfs aic">

                            {props.item.imdbRating && 
                                <SocialMedia imdb={props.item.imdb} rating={props.item.imdbRating} 
                                    styles={{color:"rgba(40,40,40, 0.9)"}}
                                />
                                }
                        </div>
                        <p className="movie-summary mar-t-4x">{props.item.summary}</p>
                        {genres && <TagBox tags={genres} />}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PosterPanel

