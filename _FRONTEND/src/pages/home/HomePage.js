import React from "react";
import { useState, useContext, useCallback, useMemo} from "react";
import { withRouter } from "react-router-dom";
import { Menu } from 'semantic-ui-react'

import { useAuthCheck, useWindowSize } from "../../functions/hooks";
import { RESEND_REGISTRATION_MAIL } from "../../functions/mutations";
import { Mutation } from 'react-apollo'

import { rgaPageView, Head, HomePageFeedAd,  MidPageAd } from "../../functions/analytics"
import { GlobalContext } from "../../App";
import { GlobeIcon, HomeIcon, SettingsIcon } from "../../assets/f-icons"
//import {UncompletedTask, BackGroundSvg } from "../../assets/illustrations"

//import ProfileUpdateForm from "../../components/forms/ProfileUpdateForm"
import { ProfileInfoForm } from "../../forms/UseForms"


import { MessageBox } from "../../components/MessageBox"
import {ActivationMessage} from "./messages/ActivationMessage"
import { RecommendationsInfo } from "./messages/RecommendationsInfo"
//import { MiniMovieCard } from "../../styled-components"

import "../pages.css"
import { ListCard, DirectorCard, MovieCoverCard, ImageCard, Grid, ElementListContainer, MovieCoverBox } from "../../styled-components"

const UpdateForm = React.memo(({profile, refetch}) => (
    <ProfileInfoForm
        refetch={refetch}
        profile={profile} />
))


const HomePage = (props) => {
    rgaPageView()
    //window.scrollTo({top:-20, left:0, behavior:"smooth"})
    const state = useContext(GlobalContext)
    

    const persona = props.data.persona
    const profile = persona.profile
    const { ratings, bookmarks, followers, followingProfiles:followings, favouriteMovies:likes } = profile;  
    const ratingmovies = useMemo(() => ratings.map(m => m.movie))
    const recommendations = persona.recommendations;
    const recommendationmovies = useMemo(() => recommendations.map(r => r.movie))


    //const screenSize = useWindowSize()
    state.methods.updatePoints(profile.points)
    const authStatus = useAuthCheck()
    const [activeState, setActiveState] = useState({menu:"home", items:recommendationmovies, type:"recommendation"})

    // MENU-ITEM HANDLE
    const homeMenuHandler = () => (activeState.menu !== "home" && setActiveState(() => ({menu:"home", items:recommendationmovies, type:"recommendation"})))

    const bookmarkMenuHandler = () => (activeState.menu !== "bookmarks" && setActiveState(() => ({menu:"bookmarks", items:bookmarks })))
    const ratingMenuHandler = () => (activeState.menu !== "ratings" && setActiveState(() => ({menu:"ratings", items:ratingmovies })))
    const likeMenuHandler = () => (activeState.menu !== "likes" && setActiveState(() => ({menu:"likes", items:likes })))

    const followersMenuHandler = () => (activeState.menu !== "followers" && setActiveState(() => ({menu:"followers", items:followers, type:"profile"})))
    const followingsMenuHandler = () => (activeState.menu !== "followings" && setActiveState(() => ({menu:"followings", items:followings, type:"profile"})))




    const insertModal = useCallback(() =>{
        //first insert updateform to state
        state.methods.updateModalComponent(<UpdateForm profile={profile} refetch={props.refetch} /> );
        //then opens the form
        state.methods.toggleModal()
    },[])

    /*--------------------------------------------------*/



    const ProfileMenuPanel = () => (
        <Menu pointing secondary inverted className="stat home-menu" widths={6} fluid>
            <Menu.Item
                disabled={ratings.length === 0}
                active={activeState.menu === 'home'}
                onClick={homeMenuHandler}
            >
                <HomeIcon className={activeState.menu === "home" ? "active " : ""} onClick={homeMenuHandler} />

            </Menu.Item>
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
        </Menu>
    )
    const RenderElementContainer = React.memo(() => <ElementListContainer items={activeState.items} type={activeState.type} />, [activeState.menu])
/*----------------------------------------------------------------*/
     
    //console.log(recommendationmovies)

    return(
        <div className="page-container home">

            <CoverPanel profile={profile} settingsHandler={insertModal} ProfileMenuPanel={ProfileMenuPanel} />
            <div className="content-container">
                                    
                {profile.cognitoRegistered==true && profile.cognitoVerified==false &&
                    <ActivationMessage 
                        status={profile.cognitoVerified} 
                        header="Inactive Account"
                        text="It looks like you did not activate your account. Please check your mailbox."
                />}

                <HomePageFeedAd />

                {/* IF THERE IS NO RECOMMENDATION*/}
                {!(persona.recommendations.length > 0) && <RecommendationsInfo points={profile.points}  verified={profile.cognitoVerified} />}

                <RenderElementContainer />
                <br />
                <MessageBox
                    header={"Recently Added Movies"}
                    text={"The most recent movies that added. "}
                />
                <MovieCoverBox items={persona.recentMovies} />

            </div>
            {/*edit &&
                <ProfileUpdateForm
                    refetch={props.refetch}
                    setEdit={() => setEdit(false)} edit={edit}
                    profile={profile} />
            */}


        </div>
    )
}

const CoverPanel = React.memo(({profile, settingsHandler, ProfileMenuPanel}) => (
    <div className="cover-panel-small home">
            <div className="avatar-box">
                <img src={profile.avatar} className="avatar"/>
            </div>

            <div className="personal-info-box">
                <h1 className="t-xl mar-t-x" itemProp="name">{profile.name ? profile.name : profile.username}</h1>
                <div className="fbox-r jcfs aic">
                    {profile.name && <p className="t-s op90 mar-r-2x">@{profile.username}</p>}
                    {profile.country && 
                        <div className="fbox-r jcfs aic op80 t-s">
                            <GlobeIcon className="mar-r-x t-xs no-click" />{profile.country[1]}</div>}
                </div>
                {(profile.bio && profile.bio.length > 5) && <p className="t-s op80 mar-t-x">{profile.bio}</p>}
            </div>

            <div className="menu-box">
                <ProfileMenuPanel />
            </div>
            
        <SettingsIcon onClick={settingsHandler} className="home-settings-icon" />
    </div>
))




export default withRouter(React.memo(HomePage))

/*
    const ActiveMenuItems = ({ menu }) => {
        if (menu === "home" && persona.recommendations.length >0 ) return <ElementListContainer items={persona.recommendations} type="cover" />
        else if (menu === "ratings") return <ElementListContainer items={ratingMovies} /> 
        else if (menu === "bookmarks") return <ElementListContainer items={bookmarks} /> 
        else if (menu === "likes") return <ElementListContainer items={favouriteMovies} /> 
        else if (menu === "followers") return <ElementListContainer items={followers}  type="profile" />
        else if (menu === "followings") return <ElementListContainer items={followingProfiles}  type="profile" />

        else return <div></div>
    }
*/