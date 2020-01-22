import React from "react";
import { useMemo, useCallback, useState, useEffect, useContext } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { 
    Box, Grid, ImageCard,PaginationBox,
    MovieCoverCard, MoviePosterCard,MovieSimilarCard, CrewCard, TagText,
	LikeIcon, BookmarkIcon , FollowIcon, FollowSuccessIcon, UnfollowIcon, FollowSuccessAnimateIcon,
	ActionButton, Text
  } from "../index"

import {
	useDebounce, useHover, useValues,useAuthCheck, print,
	MOVIE,LISTE,LOGOUT_MUTATION,SIGNUP_MUTATION,
} from "../../functions" 
import ReactStars from 'react-stars'

const mutationchecker = (prevProps, nextProps) => prevProps.id === nextProps.id
import { GlobalContext } from "../../";
import { FlexBox } from "../atoms";


export const FollowUserMutation = (props) => {
	const [active, setActive ] = useState(props.active)
	const authStatus = useAuthCheck()
    const [follow, { data }] = useMutation(FOLLOW_MUTATION, {onCompleted(data){ completedCallback(data)}} );

	const usermutation = useCallback(() => follow({ variables:{ username:props.username, obj:"user" } }),[props.username])
    //check if following a user or list ?
	const mutation = usermutation

	const completedCallback = (data) => {
		var response = props.id ? data.follow.liste.isFollowed : data.follow.targetProfile.isFollowed
		if (active !== response) setActive(response)
	}

	const title = !authStatus ?  "Please Login to Continue" : (active ? "Unfollow" : "Follow")
	
	//const Icon = (props) => ((data && data.follow.liste.isFollowed===true) || active===true) 
    //    ? <FollowSuccessAnimateIcon {...props}  title={title} />
	//	    : <FollowIcon {...props}  title={title} />
	const Identifier = (props) =>(
		<FlexBox 
			clickable
			border="1px solid" 
			borderRadius="6px"
			borderColor={active ? "rgba(0,255,0, 0.7)" :"rgba(0,0,0, 0.7)" }
			color={active ? "rgba(0,255,0, 0.7)" :"rgba(0,0,0, 0.7)" }
			minWidth={"86px"}
			px={[2]} py={[1]}
			mx={[2]}
			justifyContent="center"
			alignItems="center"
			fontWeight="bold"
			onClick={authStatus ? mutation : null}
			title={title}
			{...props}
		>
		{active ? "Following" : "Follow"}
		</FlexBox>
	)
	return <Identifier />
}

export const SignupMutation = (props) => {
	const globalstate = useContext(GlobalContext)
    const [ authError, setAuthError ] = useState("")

	const [SignupMutation, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
		onCompleted:(data) => mutationSuccessHandler(data),
		onError:(e) => mutationErrorHandler(e)
	});

	//print("mutation props", props)
	//print("mutation data", data)

	const mutationErrorHandler = (e) => {print("mutation error:", e);setAuthError(e.message.split("'")[1]);}
	const mutationSuccessHandler = (response) => {
		//print("mutation response:", response);
		if (response.createUser.success){
			globalstate.methods.signup(response);
		}
}

	useEffect(() => {
		if (props.data && props.data.username && props.data.email){
			SignupMutation({variables:props.data})
		}
	},[props.data])

	return (
		<FlexBox  
				flexDirection="column" justifyContent="center"
				alignItems="center" 
				width="100%" height="auto"				
				{...props}
				>
			<Text color="red" fontSize={["12px"]} minHeight={["12px"]}>{authError}</Text>
            <ActionButton 
                maxWidth={"200px"}
                alignSelf="center" 
                px={[3,3,3,3,4]} mt={[3]}
				type="submit"
                borderRadius={[2]}
                isLoading={loading}
            >
                Register
            </ActionButton>
		</FlexBox>
)}


export const LogoutMutation = (props) => {
	const state = useContext(GlobalContext)
	const [logout, { data, loading, error }] = useMutation(LOGOUT_MUTATION, {onCompleted:(data) => state.methods.logout() });

	const completeHandler = async (data) => state.methods.logout()

	const logoutHandler = () => logout()

	return (
		<Box width={"100%"} height="auto" onClick={logoutHandler} {...props}>
			{props.children}
		</Box>
)}



export const LikeMutation = ({ id,active, cacheUpdate, ...props }) => {
    const [fav, { data }] = useMutation(FAV_MUTATION, {onComplete(data){cacheUpdate(data.fav.movie)}});
	const authStatus = useAuthCheck()
	//console.log("like mutation data", data)

    const mutation = useCallback(() => fav({ variables:{ id:id, type:"movie"}},[id]))
    return (
		<LikeIcon
			onClick={authStatus ? mutation : null}
			active={data ? data.fav.movie.isFaved : active}
            className={!authStatus && "anonymous"}
            title={!authStatus && "Please Login to Continue"}
			{...props}
		/>
	)
}


export const BookmarkMutation = ({ id, size, active, cacheUpdate, ...props }) => {
    const [bookmark, { data }] = useMutation(BOOKMARK_MUTATION, {onComplete(data){cacheUpdate(data.bookmark.movie)}} );
	const authStatus = useAuthCheck()
	//console.log("bookmark mutation data", props)
    const mutation = useCallback(() => bookmark({ variables:{ id:id } }),[id])
    
    return (
		<BookmarkIcon   
            onClick={authStatus ? mutation : null}  
            active={authStatus ? (data ? data.bookmark.movie.isBookmarked : active) : false}
            title={authStatus ? "Add/Remove Watchlist" : "Please Login to Continue"}
			size={size}
			{...props}
        />
	)
}



export const RatingMutation = ({ item, size, viewerRating }) => {
	const previousRating = item.viewerRating
    const [currentRating, setCurrentRating ] = useState(previousRating)
	const debouncedRating = useDebounce(currentRating, 1000);
	const authStatus = useAuthCheck()
	const client = useApolloClient()

	const [rating, { data }] = useMutation(RATING_MUTATION, {onCompleted(data){onComplete(data)}}  );
	//console.log(window.location.pathname.split("/list/")[1].split("/")[0])
	//console.log("asd",props.item.viewerRating)
	const movieCacheUpdate = (newData) => {
		//console.log("newData", newData) // newData =>
		//{id: 58559, slug: "the-dark-knight-2008", viewerRating: 4, __typename: "MovieType"}
		
		if (window.location.pathname.includes("/movie/")){
			var oldData = client.readQuery({ query: MOVIE, variables:{slug:item.slug} });
			const newMovieData = {...oldData.movie, ...newData}
			oldData.movie = newMovieData;
			client.writeQuery({ query: MOVIE, variables:{slug:item.slug}, data: oldData});
			return null
		}
	}

	//console.log("rating mutation", props.viewerRating, currentRating, debouncedRating, data)
    const onComplete = (data) => {
		const response = data.rating.movie.viewerRating
		//console.log("completed response", response)
        if (response !== currentRating) setCurrentRating(response)
		movieCacheUpdate(data.rating.movie)
    }
	const ratingSetter = useCallback((value) => setCurrentRating(value), [currentRating] )
	const ratingSize = useValues([28,32,66,44,46])
	const starSize = size ? size : ratingSize
	const debouncedMutation = () => rating({ variables:{id:item.id, rate:debouncedRating}})
	
	useEffect(() =>{
		//console.log("effect response rating:", responseRating)
		function listener(){
			//console.log("in listener function => ", currentRating, debouncedRating)
			if (item.viewerRating !== currentRating && currentRating === debouncedRating){
				//console.log("changed rating detected. Will mutate")
				debouncedMutation({ variables:{id:item.id, rate:debouncedRating}})
			}
		}
		listener()
	}, [debouncedRating])

    return (
      <ReactStars half 
          edit={authStatus} 
          color2={"#ffd700"} color1="grey" size={starSize} 
          value={authStatus ? (currentRating || viewerRating) : null} 
          onChange={ratingSetter}
      />
    )
}

export const FollowMutation = (props) => {
	const [active, setActive ] = useState(props.active)
	const authStatus = useAuthCheck()
    const [follow, { data }] = useMutation(FOLLOW_MUTATION, {onCompleted(data){ completedCallback(data)}} );

	const listmutation = useCallback(() => follow({ variables:{ id:props.id.toString(), obj:"liste" } }),[props.id])
	const usermutation = useCallback(() => follow({ variables:{ username:props.username, obj:"user" } }),[props.username])
    //check if following a user or list ?
	const mutation = props.username ? usermutation : listmutation

	const completedCallback = (data) => {
		var response = props.id ? data.follow.liste.isFollowed : data.follow.targetProfile.isFollowed
		if (active !== response) setActive(response)
	}

	const title = !authStatus ?  "Please Login to Continue" : (active ? "Unfollow" : "Follow")
	
	//const Icon = (props) => ((data && data.follow.liste.isFollowed===true) || active===true) 
    //    ? <FollowSuccessAnimateIcon {...props}  title={title} />
	//	    : <FollowIcon {...props}  title={title} />

	const Icon = active ? FollowSuccessAnimateIcon : FollowIcon
    return <Icon onClick={authStatus ? mutation : null} title={title} {...props} />
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