import React from "react";
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { 
    Box, Grid, ImageCard,PaginationBox,
    MovieCoverCard, MoviePosterCard,MovieSimilarCard, CrewCard, TagText,
    LikeIcon, BookmarkIcon , FollowIcon, FollowSuccessIcon, UnfollowIcon, FollowSuccessAnimateIcon,
  } from "../index"

import { useDebounce, useHover, useValues, MOVIE,LISTE, useAuthCheck } from "../../functions" 
import ReactStars from 'react-stars'

const mutationchecker = (prevProps, nextProps) => prevProps.id === nextProps.id





export const LikeMutation = (props) => {
    const [fav, { data }] = useMutation(FAV_MUTATION, {onComplete(data){props.cacheUpdate(data.fav.movie)}});
	const authStatus = useAuthCheck()
	//console.log("like mutation data", data)

    const mutation = useCallback(() => fav({ variables:{ id:props.id, type:"movie"}},[props.id]))
    return (
		<LikeIcon
			onClick={authStatus ? mutation : null}
			active={data ? data.fav.movie.isFaved : props.active}
            className={!authStatus && "anonymous"}
            title={!authStatus && "Please Login to Continue"}
		/>
	)
}


export const BookmarkMutation = (props) => {
    const [bookmark, { data }] = useMutation(BOOKMARK_MUTATION, {onComplete(data){props.cacheUpdate(data.bookmark.movie)}} );
	const authStatus = useAuthCheck()
	//console.log("bookmark mutation data", props)
    const mutation = useCallback(() => bookmark({ variables:{ id:props.id } }),[props.id])
    
    return (
		<BookmarkIcon   
            onClick={authStatus ? mutation : null}  
            active={data ? data.bookmark.movie.isBookmarked : props.active}
            className={!authStatus && "anonymous"}
            title={!authStatus && "Please Login to Continue"}
        />
	)
}



export const RatingMutation = (props) => {
	const previousRating = props.item.viewerRating
    const [currentRating, setCurrentRating ] = useState(previousRating)
	const debouncedRating = useDebounce(currentRating, 1000);
	const authStatus = useAuthCheck()
	const client = useApolloClient()

	const [rating, { data }] = useMutation(RATING_MUTATION, {onCompleted(data){onComplete(data)}}  );
	//console.log(window.location.pathname.split("/list/")[1].split("/")[0])

	const movieCacheUpdate = (newData) => {
		//console.log("newData", newData) // newData =>
		//{id: 58559, slug: "the-dark-knight-2008", viewerRating: 4, __typename: "MovieType"}
		
		if (window.location.pathname.includes("/movie/")){
			var oldData = client.readQuery({ query: MOVIE, variables:{slug:props.item.slug} });
			console.log("oldData",oldData)
			const newMovieData = {...oldData.movie, ...newData}
			oldData.movie = newMovieData;
			client.writeQuery({ query: MOVIE, variables:{slug:props.item.slug}, data: oldData});
			return null
		}
		/*
		else if (window.location.pathname.includes("/list/")) {
			//read query params
			const pathname = window.location.pathname.split("/list/")[1]
			const listeslug = pathname.split("/")[0]
			const page = parseInt(pathname.split("/")[1])

			// read from cache
			var oldData = client.readQuery({ query: LISTE, variables:{slug:listeslug, page} });
			console.log("oldListe",oldListe)
			var oldListe = oldData.liste 
			const oldMovie = oldListe.movies.filter(m => m.slug === props.item.slug)[0]
			const oldMoviesWithoutMovie = oldListe.movies.filter(m => m.slug !== props.item.slug)
			if (oldMovie){
				oldMovie.viewerRating = 
			}
			console.log("oldMovie",oldMovie)
			

			const newListe = {...oldListe.movie, ...newData}
			oldListe.movie = newMovieData;
			client.writeQuery({ query: LISTE, variables:{listeslug, page}, data: oldListe});
			return null
		}
		*/
	}

	//console.log("rating mutation", props.viewerRating, currentRating, debouncedRating, data)
    const onComplete = (data) => {
		const response = data.rating.movie.viewerRating
		//console.log("completed response", response)
        if (response !== currentRating) setCurrentRating(response)
		movieCacheUpdate(data.rating.movie)
    }
	const ratingSetter = useCallback((value) => setCurrentRating(value), [currentRating] )
	const ratingSize = useValues([22,24,26,30,34])
	const debouncedMutation = () => rating({ variables:{id:props.item.id, rate:debouncedRating}})
	
	useEffect(() =>{
		//console.log("effect response rating:", responseRating)
		function listener(){
			//console.log("in listener function => ", currentRating, debouncedRating)
			if (props.item.viewerRating !== currentRating && currentRating === debouncedRating){
				//console.log("changed rating detected. Will mutate")
				debouncedMutation({ variables:{id:props.item.id, rate:debouncedRating}})
			}
		}
		listener()
	}, [debouncedRating])

    return (
      <ReactStars half 
          edit={authStatus} 
          color2={"#ffd700"} color1="grey" size={ratingSize} 
          value={currentRating || props.viewerRating} 
          onChange={ratingSetter}
      />
    )
}

export const FollowMutation = (props) => {
    const [active, setActive ] = useState(props.active)
    const [follow, { data }] = useMutation(FOLLOW_MUTATION, {onCompleted(data){ completedCallback(data)}} );

    //console.log("follow mutation data", data, props)
    const mutation = useCallback(() => follow({ variables:{ id:props.id.toString(), obj:"liste" } }),[props.id])
	const completedCallback = (data) => {
		var response = data.follow.liste.isFollowed
		if (active !== response) setActive(response)
	}

	const title = !props.authStatus ?  "Please Login to Continue" : (active ? "Unfollow" : "Follow")
	
	//const Icon = (props) => ((data && data.follow.liste.isFollowed===true) || props.active===true) 
    //    ? <FollowSuccessAnimateIcon {...props}  title={title} />
	//	    : <FollowIcon {...props}  title={title} />

	const Icon = active ? FollowSuccessAnimateIcon : FollowIcon
    return <Icon onClick={props.authStatus ? mutation : null} title={title} className="click" />
}

const BOOKMARK_MUTATION = gql`
  mutation bookmark($id:Int!){
    bookmark(id:$id){
      user{
        profile{
          username
        }
      },
      movie{
        id,
        isBookmarked,
      }
    }
  }
`
const FAV_MUTATION = gql`
  mutation fav($id:Int!, $type:String!){
    fav(id:$id, type:$type){
      user{
        id, username
      },
      video{
        id,
        title,
        isFaved
      },
      movie{
        id, name, isBookmarked, isFaved
      }
    }
  }
`
const FOLLOW_MUTATION = gql`
  mutation follow($id:String, $obj:String!, $username:String){
    follow(id:$id, obj:$obj, username:$username){
      person{
        id, slug, isFollowed
      },
      liste{
		  id, slug, isFollowed
      },
      targetProfile{
        id, username, isFollowed
      }
    }
  }
`
const RATING_MUTATION = gql`
  mutation rating($id:Int!, $rate:Float!, $date:String, $notes:String){
    rating(id:$id, rate:$rate, date:$date, notes:$notes){
      user{
        profile{
          username
        }
      },
      movie{
		id,
		slug,
        viewerRating
      },
      rating{
        rating, notes, date
      }
    }
  }
`

/*

export const RatingMutation2 = (props) => {
	const previousRating = props.viewerRating
    const [currentRating, setCurrentRating ] = useState(previousRating)
	const debouncedRating = useDebounce(currentRating, 1000);


    const [rating, { data }] = useMutation(RATING_MUTATION, {onCompleted(data){onComplete(data)} }  );
	//console.log("rating mutation", props.viewerRating, currentRating, debouncedRating, data)
    const onComplete = (data) => {
		const response = data.rating.movie.viewerRating
		//console.log("completed response", response)
        if (response !== currentRating) setCurrentRating(response)
		props.cacheUpdate(data.rating.movie)
    }
	const ratingSetter = useCallback((value) => setCurrentRating(value), [currentRating] )
	const ratingSize = useValues([22,24,26,30,34])
	const debouncedMutation = useCallback(() => rating({ variables:{id:props.id, rate:debouncedRating}}), [debouncedRating])
	
	useEffect(() =>{
		//console.log("effect response rating:", responseRating)
		function listener(){
			//console.log("in listener function => ", currentRating, debouncedRating)
			if (props.viewerRating !== currentRating && currentRating === debouncedRating){
				//console.log("changed rating detected. Will mutate")
				debouncedMutation({ variables:{id:props.id, rate:debouncedRating}})
			}
		}
		listener()
	}, [debouncedRating])

    return (
      <ReactStars half 
          edit={props.authStatus} 
          color2={"#ffd700"} color1="grey" size={ratingSize} 
          value={currentRating || props.viewerRating} 
          onChange={ratingSetter}
      />
    )
}


export const RatingMutation = ({ item,status, update, disabled=false, client }) => {
    const [currentRating, setCurrentRating ] = useState(item.viewerRating)
	const debouncedRating = useDebounce(status, 1000);


    const [rating, { data }] = useMutation(RATING_MUTATION, {onCompleted(data){onComplete(data)} });

    const onComplete = (data) => {
		const response = data.rating.movie.viewerRating
		//console.log("completed response", response)
        if (response !== status) update(response)
    }
	const ratingSetter = useCallback((value) => update(value), [status] )
	const debouncedMutation = useCallback(() => rating({ variables:{id:item.id, rate:debouncedRating}}), [debouncedRating])

	

    return <ReactStars half edit={!disabled} color2={"#ffd700"} size={24} value={status} onChange={ratingSetter}/>
}

	useEffect(() =>{
		var responseRating = data ? data.rating.movie.viewerRating : null
		//console.log("effect response rating:", responseRating)
		function listener(){
			//console.log("in listener function => ", currentRating, debouncedRating)
			if (item.viewerRating !== status && status === debouncedRating){
				//console.log("changed rating detected. Will mutate")
				rating({ variables:{id:item.id, rate:debouncedRating}})
			}
			else if ( 
				(item.viewerRating === status && status === debouncedRating) && 
				(responseRating && responseRating !== debouncedRating)){
					//console.log("first three is equal, but response rating not. Will mutate")
					rating({ variables:{id:item.id, rate:debouncedRating}})
				}
		}
		listener()
	}, [debouncedRating,status])
*/