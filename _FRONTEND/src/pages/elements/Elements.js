import React from "react";
import { useState } from "react";
import {  Link } from "react-router-dom";
import { FAV_MUTATION, BOOKMARK_MUTATION, FOLLOW_MUTATION } from "../../functions/mutations";
import { Mutation } from "react-apollo";

import { BookmarkIcon, FavIcon, PlusIcon } from "../../assets/f-icons/index"


import "./Elements.css"



export const Title = ({ text, extra="" }) =><h1 className="cbs-title">{text}<span>{extra}</span></h1>

export const Person = ({ person }) => (
    <Link to={`/person/${person.slug}`} rel="nofollow" title={`${person.name}`}>
        <h2 className="cbs-person-name hover-t-underline mar-r-2x">{person.name}</h2>
    </Link>
)

export const PersonBox = ({ directors }) => (
    <div className="cbs-director-box fw">
        {directors.map( (director,i) => (
            i === 0
                ? <Person person={director} key={director + i} />
                :<div key={director + i}>{", "}<Person person={director}  /></div>
        )) }
    </div>
)

export const Tag = ({ tag ,className="" }) => <p className={`cbs-tag ${className}`} >{tag.name}</p>;

export const TagBox = ({ tags, className="" }) => (
    <div className="cbs-tag-box">
        {tags.map((t,i) => <Tag tag={t} key={t + i} className={className} />)}
    </div>
)


export const BookmarkButton = (props) =>{
    let isBookmarked = props.item.isBookmarked || false
    const [active, setActive ] = useState(isBookmarked)
    return (
    <Mutation
        mutation={BOOKMARK_MUTATION}
        variables={{ id: props.item.id }}
        onCompleted={(data) => (setActive(data.bookmark.movie.isBookmarked))}>
        {mutation => (
            <BookmarkIcon 
                styles={{fontSize:props.size ? props.size + 4 : null}} 
                active={active}
                onClick={() => (props.status === true ? mutation() : console.log("please login"))}
                title={props.status === true ? "Add to/Remove from Watchlist" : "Please Login for action."}
            />
        )}
    </Mutation>
    )
}


export const FavButton = (props) =>{
    let isFaved = props.item.isFaved || false
    const [active, setActive ] = useState(isFaved)
    return (
    <Mutation
        mutation={FAV_MUTATION}
        variables={{ id: props.item.id, type: "movie" }}
        onCompleted={(data) => setActive(data.fav["movie"].isFaved)}>
        {mutation => (
            <FavIcon 
                styles={{fontSize:props.size ? props.size + 4 : null}} 
                active={active}  
                onClick={() => (props.status === true ? mutation() : console.log("please login"))}
                title={props.status === true ? "Add to /Remove from Favourites" : "Please Login for action."}
            />
        )}
    </Mutation>
)}

export const FollowButton = (props) =>{
    let isFollowed = props.item.isFollowed || false
    const [active, setActive ] = useState(isFollowed)
    return (
    <Mutation
        mutation={FOLLOW_MUTATION}
        variables={{ id: props.item.id.toString(), obj: "director" }}
        onCompleted={(data) => (console.log("follow mutation data: ", data), setActive(data.follow.person.isFollowed))}>
        {mutation => (
            <div className="fbox-r jcsb aic">
                <PlusIcon 
                    styles={{fontSize:props.size ? props.size + 4 : null, color:active ? "green" : "grey"}} 
                    active={active}  
                    onClick={() => (props.status === true ? mutation() : console.log("please login"))}
                    title={props.status === true 
                        ? active === true 
                            ? `You are following ${props.item.name}.`
                            : `You are NOT following ${props.item.name}.`
                        : "Please login to follow"}
                />
                {props.info && <p className="t-bold mar-l-2x" style={{color:"grey"}}>{active ? " Following": "Not Following"}</p>}
            </div>
        )}
    </Mutation>
)}