import React from "react";
import { useState, useContext, useMemo } from "react"
import { Menu } from "semantic-ui-react"
import { Mutation } from "react-apollo";
import { FOLLOW_MUTATION } from "../../functions/mutations";
import { useWindowSize, } from "../../functions/hooks"

import SimilarityPanel from "../../components/SimilarityPanel"
import { rgaPageView, Head, ProfilePageAd } from "../../functions/analytics"
import { useAuthCheck } from "../../functions/hooks";
import { GlobalContext } from "../../App";
import { GlobeIcon, UserCheckIcon, UserPlusIcon } from "../../assets/f-icons"

import "../pages.css"
import { ElementListContainer } from "../../styled-components"



const ProfilePage = (props) => {
    //print(props)
    
    rgaPageView()
    const { item, refetch, parentProps } = props;
    const { profile, viewer } = item;

    const { avatar, bio, name, points, id, username, lists, isSelf, bookmarks,
        ratings, country, favouriteMovies:likes, activities, followers,
        followingLists, followingPersons, followingProfiles:followings } = profile;
    
    const ratingmovies = useMemo(() => ratings.map(m => m.movie))

    const state = useContext(GlobalContext)
    const [activeState, setActiveState] = useState({menu:"ratings", items:ratingmovies, type:"poster"})
    const [follow, setFollow] = useState(profile.isFollowed);
    //const screenSize = useWindowSize()
    const authStatus = useAuthCheck()

    state.methods.updatePoints(item.viewer.points)

    //console.log("Profile Page Item", item)

    // MENU-ITEM HANDLE
    const bookmarkMenuHandler = () => (activeState.menu !== "bookmarks" && setActiveState(() => ({menu:"bookmarks", items:bookmarks })))
    const ratingMenuHandler = () => (activeState.menu !== "ratings" && setActiveState(() => ({menu:"ratings", items:ratingmovies })))
    const likeMenuHandler = () => (activeState.menu !== "likes" && setActiveState(() => ({menu:"likes", items:likes })))

    const followersMenuHandler = () => (activeState.menu !== "followers" && setActiveState(() => ({menu:"followers", items:followers, type:"profile"})))
    const followingsMenuHandler = () => (activeState.menu !== "followings" && setActiveState(() => ({menu:"followings", items:followings, type:"profile"})))


    const ProfileMenuPanel = () => (
        <Menu pointing secondary inverted className="stat home-menu" widths={6} fluid>            
        <Menu.Item
                disabled={ratings.length === 0}
                active={activeState.menu === 'ratings'}
                onClick={ratingMenuHandler}
            >
                <div className="stat click">
                    <span className="label t-xs ">RATINGS</span>
                    <span className="value ">{profile.points}</span>
                </div>
            </Menu.Item>
            <Menu.Item
                disabled={likes.length === 0}
                active={activeState.menu === 'likes'}
                onClick={likeMenuHandler}
            >
                <div className="stat click">
                    <span className="label t-xs ">LIKES</span>
                    <span className="value ">{likes.length}</span>
                </div>
            </Menu.Item>
            <Menu.Item
                disabled={bookmarks.length === 0}
                active={activeState.menu === 'bookmarks'}
                onClick={bookmarkMenuHandler}
            >
                <div className="stat click">
                    <span className="label t-xs ">BOOKMARKS</span>
                    <span className="value ">{bookmarks.length}</span>
                </div>
            </Menu.Item>
            <Menu.Item
                name='followers'
                disabled={followers.length === 0}
                active={activeState.menu === 'followers'}
                onClick={followersMenuHandler}
            >
                <div className="stat click">
                    <span className="label t-xs ">FOLLOWERS</span>
                    <span className="value ">{followers.length}</span>
                </div>
            </Menu.Item>
            <Menu.Item
                name='followings'
                disabled={followings.length === 0}
                active={activeState.menu === 'followings'}
                onClick={followingsMenuHandler}
            >
                <div className="stat click">
                    <span className="label t-xs ">FOLLOWINGS</span>
                    <span className="value ">{followings.length}</span>
                </div>
            </Menu.Item>

            {profile.isSelf===false && 
            <Mutation mutation={FOLLOW_MUTATION} variables={{ obj: "u", username: profile.username }}
                onCompleted={data => setFollow(data.follow.targetProfile.isFollowed)}>
                {mutation => (
                    <Menu.Item
                        name='follow-mutation'
                        className="follow-mut"
                        title={authStatus ? (follow ? "Unfollow" : "Follow") : "Please login to follow list"}
                        disabled={followings.length === 0}
                        onClick={() => (authStatus ? mutation() : null)}
                    >
                        {follow ? <UserCheckIcon  /> : <UserPlusIcon  />}
                    </Menu.Item>
                )}
            </Mutation>
        }


        </Menu>
    )


    const seoName = useMemo(() => item.profile.name ? item.profile.name : item.profile.username)
    const RenderElementContainer = React.memo(() => <ElementListContainer items={activeState.items} type={activeState.type} />, [activeState.menu])

    return (
        <div className="page-container profile">
            {/*<!-- Page Container -->*/}
            {/*<!-- The Grid -->*/}
            <Head
                description={seoName +  "'s Social Cinema Profile; favourite movies, favourite directors, watchlist .. "}
                title={seoName +  " - Pixly"}
                keywords={`${seoName} social media, social cinema profile, watchlist, favourite directors, favourite movies`}
                canonical={`https://pixly.app/user/${item.profile.username}/`}
            >
            </Head>

            <CoverPanel profile={profile} ProfileMenuPanel={ProfileMenuPanel} />

            <div className="content-container pad-lr-4x">
                
                {(authStatus && profile.ratingset && viewer.ratingset && isSelf===false) &&
                     <SimilarityPanel profile1={profile} profile2={viewer} />
                     }

                <RenderElementContainer />

                <ProfilePageAd />
            </div>
        </div>
    );
}

const CoverPanel = React.memo(({profile, ProfileMenuPanel}) => (
    <div className="cover-panel-small home">
        <div className="avatar-box">
            <img src={profile.avatar} className="avatar" />
        </div>

        <div className="personal-info-box">
            <h1 className="t-xl mar-t-x" itemProp="name">{profile.name ? profile.name : profile.username}</h1>
            <div className="fbox-r jcfs aic">
                {profile.name && <p className="t-s op90 mar-r-2x">@{profile.username}</p>}
                {profile.country && <div className="fbox-r jcfs aic op80 t-s"><GlobeIcon className="mar-r-x t-xs no-click" />{profile.country[1]}</div>}
            </div>
            {(profile.bio && profile.bio.length > 5) && <p className="t-s op80 mar-t-x">{profile.bio}</p>}
        </div>
        <div className="menu-box">
            <ProfileMenuPanel />
        </div>
    </div>
))


export default React.memo(ProfilePage);
