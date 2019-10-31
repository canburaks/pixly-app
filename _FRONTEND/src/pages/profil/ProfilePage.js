import React from "react";
import { useState, useContext, useMemo, useCallback } from "react"

import SimilarityPanel from "../../components/SimilarityPanel"
import { rgaPageView, Head, ProfilePageAd, calculateSimilarity } from "../../functions"
import { useAuthCheck } from "../../functions/hooks";
import { GlobalContext } from "../../App";
import { GlobeIcon, UserCheckIcon, UserPlusIcon } from "../../assets/f-icons"

import "../pages.css"
import { ElementListContainer, ProfileCoverPanel, PageContainer, ContentContainer } from "../../styled-components"



const ProfilePage = (props) => {
    //print(props)
    
    rgaPageView()
    const { item, refetch, parentProps } = props;
    const { profile, viewer } = item;

    const { avatar, bio, name, points, id, username, lists, isSelf, bookmarks,
        ratings, country, favouriteMovies:likes, activities, followers,
        followingLists, followingPersons, followingProfiles:followings } = profile;
    
    const ratingmovies = useMemo(() => ratings.map(m => m.movie))

    const globalstate = useContext(GlobalContext)

    //const screenSize = useWindowSize()
    const authStatus = useAuthCheck()

    authStatus && globalstate.methods.updatePoints(item.viewer.points)
    //const screenSize = useWindowSize()
    const [state, setState ] = useState("ratings")
    
    const stateHandler = useCallback((menu) => setState(menu.name), [state])

    const renderitems = useMemo(() => {
        switch (state){
            case "bookmarks":
                return {items:bookmarks, type:"poster" }
            case "ratings":
                return {items:ratingmovies, type:"poster" }
            case "likes":
                return {items:likes, type:"poster" }
            case "followers":
                return {items:followers, type:"profile"}
            case "followings":
                return {items:followings, type:"profile"}
        }
    }, [state])

    
    const similarity = useMemo(() => (authStatus && profile.ratingset && viewer) ? calculateSimilarity(profile.ratingset, viewer.ratingset) : null,[authStatus, profile.username])

    //console.log("simscore", similarity)

    const seoName = useMemo(() => item.profile.name ? item.profile.name : item.profile.username)
    const RenderElementContainer = React.memo(() => <ElementListContainer items={renderitems.items} type={renderitems.type} />, [state])

    return (
        <PageContainer>
            {/*<!-- Page Container -->*/}
            {/*<!-- The Grid -->*/}
            <Head
                description={seoName +  "'s Social Cinema Profile; favourite movies, favourite directors, watchlist .. "}
                title={seoName +  " - Pixly"}
                keywords={`${seoName} social media, social cinema profile, watchlist, favourite directors, favourite movies`}
                canonical={`https://pixly.app/user/${item.profile.username}`}
            >
            </Head>
            <ProfileCoverPanel 
                profile={profile} 
                state={state} 
                onClick={stateHandler} 
                similarity={similarity}
            />

            <ContentContainer>
                
                { authStatus === true && (profile.ratingset && viewer.ratingset && isSelf===false) &&
                     <SimilarityPanel profile1={profile} profile2={viewer} />
                     }

                <RenderElementContainer />

                <ProfilePageAd />
            </ContentContainer>
        </PageContainer>
    );
}



export default React.memo(ProfilePage);
