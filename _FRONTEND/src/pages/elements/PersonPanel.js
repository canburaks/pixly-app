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

import "./PersonPanel.css"

const PersonPanel = (props) =>{
    return(
        <div className="person-poster-panel">
            <img 
                src={props.item.poster} 
                alt={`${props.item.name} poster`} 
                title={`${props.item.name} poster`} 
                className="person-poster"
                />
            <div className="flexible-box">
                <Title text={props.item.name}  />
                {props.person && 
                    props.item.jobs && <p className="t-s t-capitalize t-color-dark t-bold op90">{props.item.jobs.join(", ")}</p>}
                {props.person && 
                    props.personData["place_of_birth"] && <p className="t-xs t-color-dark t-bold op90">Birth Place: {props.personData.place_of_birth}</p>}
                {props.person && 
                    props.personData["birthday"] && <p className="t-xs t-color-dark t-bold op90">Born: {props.personData.birthday}</p>}

                <FollowButton item={props.item} status={props.status} size={32} info />
                <hr />
                <SocialBox item={props.item}  />
            </div>

        </div>
    )
}

export default PersonPanel

