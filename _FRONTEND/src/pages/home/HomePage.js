import React from "react";
import { useState, useContext, useCallback, useMemo} from "react";
import { withRouter } from "react-router-dom";

import { useAuthCheck, useWindowSize } from "../../functions/hooks";
import { RESEND_REGISTRATION_MAIL } from "../../functions/mutations";
import { Mutation } from 'react-apollo'

import { rgaPageView, Head, HomePageFeedAd, print,FeedMobileCollectionAd, MidPageAd } from "../../functions"
import { GlobalContext } from "../../";
import { GlobeIcon, HomeIcon, SettingsIcon } from "../../assets/f-icons"
//import {UncompletedTask, BackGroundSvg } from "../../assets/illustrations"

//import ProfileUpdateForm from "../../components/forms/ProfileUpdateForm"
import { ProfileInfoForm } from "../../forms/UseForms"


//import { MessageBox } from "../../components/MessageBox"
import {ActivationMessage} from "./messages/ActivationMessage"
import { RecommendationsInfo } from "./messages/RecommendationsInfo"
//import { MiniMovieCard } from "../../styled-components"

import "../pages.css"

import { 
    ListCard, DirectorCard, CoverCard , HeaderMini, FlexBox, MovieCoverCard, Stats,
    ImageCard, Grid, ElementListContainer, MovieCoverBox,
    Menu, MenuItem, PageContainer, ContentContainer,
    ProfileCoverPanel,PlaceIcon, MessageBox,NewestCollectionCard
} from "../../styled-components"

const UpdateForm = React.memo(({profile, refetch}) => (
    <ProfileInfoForm
        refetch={refetch}
        profile={profile} />
))


const HomePage = (props) => {
    //rgaPageView()
    //window.scrollTo({top:-20, left:0, behavior:"smooth"})
    const globalstate = useContext(GlobalContext)
    

    const persona = props.data.persona
    const profile = persona.profile
    const { ratings, bookmarks, followers, followingProfiles:followings, favouriteMovies:likes } = profile;  
    const ratingmovies = useMemo(() => ratings.map(m => m.movie))
    const recommendationmovies = useMemo(() => persona.recommendations.map(r => r.movie))

    globalstate.methods.updatePoints(profile.points)

    //const screenSize = useWindowSize()
    const [state, setState ] = useState("home")
    
    const stateHandler = useCallback((menu) => setState(menu.name), [state])

    const renderitems = useMemo(() => {
        switch (state){
            case "home":
                return {items:recommendationmovies, type:"recommendation"}
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

    //console.log(likes, followings)
    //console.log("home page: ",state, renderitems)

    const insertModal = useCallback(() =>{
        //first insert updateform to state
        globalstate.methods.updateModalComponent(<UpdateForm profile={profile} refetch={props.refetch} /> );
        //then opens the form
        globalstate.methods.toggleModal()
    },[])

    /*--------------------------------------------------*/



    const RenderElementContainer = React.memo(() => <ElementListContainer items={renderitems.items} type={renderitems.type} />, [state])
/*----------------------------------------------------------------*/
     
    //console.log(recommendationmovies)
    //const newestfilms = persona.newestLists.forEach(l => l.link=`/list/${l.slug}`)
    //<CoverPanel profile={profile} settingsHandler={insertModal} ProfileMenuPanel={ProfileMenuPanel} />
    const newestcollections = [ ...persona.newestLists, ...persona.newestTopics ]
    const isMobile = window.innerWidth < 480;
    const ResponsiveAd1 = isMobile ? FeedMobileCollectionAd : HomePageFeedAd
    const ResponsiveAd2 = isMobile ? FeedMobileCollectionAd : MidPageAd
    print("homepage", persona)
    return(
        <PageContainer>
            <ProfileCoverPanel 
                profile={profile} 
                state={state} 
                onClick={stateHandler} 
                onClickSettings={insertModal} 
            />

            <ContentContainer>
                {profile.cognitoRegistered==true && profile.cognitoVerified==false &&
                    <ActivationMessage 
                        status={profile.cognitoVerified} 
                        header="Inactive Account"
                        text="It looks like you did not activate your account. Please check your mailbox."
                />}

                {/* IF THERE IS NO RECOMMENDATION*/}
                {!(persona.recommendations.length > 0) && 
                    <RecommendationsInfo points={profile.points}  
                        verified={profile.cognitoVerified}  
                    />}

                {/* IF THERE ARE LESS THAN 40 POINTS */}
                {profile.points < 40 &&
                    <>
                    <MessageBox header={"Low Points"} text={"You can start to give rating by looking the popular film list below"} />
                    <Grid columns={[1,1, 2, 2,2,2,3]} py={[4]}>
                        {persona.starterLists.map(list => (
                            <CoverCard follow={true}
                                key={list.slug}
                                notext
                                ratio={0.41}
                                item={list}
                                link={"/list/" + list.slug + "/1"}
                            />
                        ))}
                    </Grid>
                    </>
                }

                {/* Recommendation Header */}
                {persona.recommendations.length > 0 && state==="home" &&
                    <MessageBox
                        header={"Your Weekly Recommendations"}
                        text={"Your very personal weekly film recommendations. "}
                    />}
                <RenderElementContainer />
                <ResponsiveAd1 />


                {/* Newest Collections*/}
                <MessageBox
                        header={"The Newest Film Lists and Topics"}
                        text={""}
                    />
                <Grid columns={[2, 2, 2, 2,2,4]} py={[4]}>
                    {newestcollections.map(c => (
                        <NewestCollectionCard 
                            link={c.link}
                            coverPoster={c.coverPoster}
                            key={c.slug}
                        />
                    ))}
                </Grid>
                <ResponsiveAd2 />
                <br />

                <MessageBox
                    header={"Recently Added Movies"}
                    text={"The most recent movies that added. "}
                />
                <MovieCoverBox items={persona.recentMovies} />

            </ContentContainer>
        </PageContainer>
    )
}




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