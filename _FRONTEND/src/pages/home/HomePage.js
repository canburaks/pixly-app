import React from "react";
import { useState, useContext, useCallback, useMemo} from "react";
import { withRouter } from "react-router-dom";

import { useAuthCheck, useWindowSize } from "../../functions/hooks";
import { RESEND_REGISTRATION_MAIL } from "../../functions/mutations";
import { Mutation } from 'react-apollo'

import { 
    rgaPageView, Head, HomePageFeedAd, print,FeedMobileCollectionAd, MidPageAd, BannerAd,
    TopicOrderedListAd, TopicOrderedListAd2
} from "../../functions"
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
    CoverCard , HeaderMini, FlexBox, 
    Grid, ElementListContainer, MovieCoverBox,
    PageContainer, ContentContainer,
    ProfileCoverPanel,NewestCollectionCard,
    Box,  Text, CoverImage,TagBox,
    HtmlContainer, MessageBox,
    SuperBox, CoverLink, NewLink,
    ImdbRatingIcon, YearClockIcon,RightIcon,YoutubeIcon,
    BookmarkMutation, RatingMutation, LikeMutation,
} from "../../styled-components"

import { YearSlider, RatingSlider, TagSelect, SearchInputMaterial, SimpleDialog } from "../../styled-material"
import { YoutubePlayer } from "cbs-react-components";
import { useNetworkStatus } from 'react-adaptive-hooks/network';


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

    //This is original settings modal
    const _insertModal = useCallback(() =>{
        //first insert updateform to state
        globalstate.methods.updateModalComponent(<UpdateForm profile={profile} refetch={props.refetch} /> );
        //then opens the form
        globalstate.methods.toggleModal()
    },[])

    //Route to settings page
    const insertModal = useCallback(() =>{
        //first insert updateform to state
        props.history.push("settings")
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
    //print("homepage", persona)
    return(
        <PageContainer>
            <ProfileCoverPanel 
                profile={profile} 
                state={state} 
                onClick={stateHandler} 
                onClickSettings={insertModal} 
            />
            <BannerAd />
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
                    <MessageBox 
                        header={"Low Points"} 
                        text={"You can start to give rating by looking the popular film list below"} 
                    />
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

                {state==="home" ? <RecommendationsContainer items={persona.recommendations} /> : <RenderElementContainer />}
                
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



const RecommendationsContainer = ({ items }) => {
    //Trailer
    const size = useWindowSize()
    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"

    const [isOpen, setOpen] = useState(false)
    const [videos, setVideos] = useState(null)
    const closeHandler = () => setOpen(false)
    const playHandler = (videos) => (setVideos(videos), setOpen(true))

    const specs = {
        iconSize:size.includes("S") ? 26 :32,
        headerSize:size.includes("S") ? ["18px"] : ["16px","16px","16px","16px","20px", "20px"],
        textSize:size.includes("S") ? ["14px"]   : ["14px"],
        ratioTop:(speed==="slow" && size==="XS") ? 1.5 : 0.6
    }

    return (
        <>
            {items.slice(0,4).map( item => (
                    <WideCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}
            <TopicOrderedListAd />
            {items.slice(4, 8).map( item => (
                    <WideCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}

            <TopicOrderedListAd2 />
            {items.slice(8, 16).map( item => (
                    <WideCard key={"rec" + item.movie.id}
                        item={item}
                        specs={specs}
                        play={playHandler}
                    />
            ))}

            <SimpleDialog
                onClose={closeHandler}
                isOpen={isOpen}
            >
                <FlexBox 
                    minWidth="90vw" minHeight={["auto", "auto", "70vh"]} 
                    maxWidth="100%" 
                    overflowX="hidden"
                >
                    <YoutubePlayer
                        videos={videos}
                    />
                </FlexBox>
            </SimpleDialog>
        </>
    )
}


const WideCard = ({ item, specs, play}) => (
    <FlexBox width="100%" flexDirection={["column", "column","column", "row"]}
        border={"0px"} borderRadius={6}
        boxShadow="card" bg="#f1f1f1"
        my={[3]} overflow="hidden"
        className="ordered-topic-card"
        alignItems="stretch"
        minHeight={"auto"}
    >

        {/* TOP CONTENT*/}
        <FlexBox width="100%" display={["flex", "flex", "flex", "none"]}>
            <CoverImage 
                src={item.movie.coverPoster}
                title={"Visit " + item.movie.name}
                alt={`${item.movie.name} poster`} 
                ratio={specs.ratioTop}  
                link={`/movie/${item.movie.slug}`} 
                follow={true}
            />
            <FlexBox position="absolute" left={"20px"} top={"12px"} flexDirection="column" alignItems="center" width="auto">
                <BookmarkMutation id={item.movie.isBookmarked} active={item.movie.isBookmarked} size={specs.iconSize + 4} />
                <LikeMutation id={item.movie.isBookmarked} active={item.movie.isBookmarked} size={specs.iconSize} mt={[2]} />
            </FlexBox>

            <FlexBox position="absolute" left={"20px"} bottom={"4px"} justifyContent="space-between" alignItems="center">
                <RatingMutation item={item.movie} size={36} />
                {item.movie.videos.length > 0 &&
                    <TrailerIcon 
                        onClick={() => play(item.movie.videos)} 
                        right={"-12px"} bottom={0}
                        width={"40px"} height="40px"
                        zIndex={12} 
                        position="relative"
                        
                    />
                }
            </FlexBox>
        </FlexBox>
        

        {/* HTML CONTENT*/}
        <FlexBox 
            flexDirection="column"
            
            position="relative"
            width={["100%","100%","100%","40vwv","45vw"]}
            height="auto"
            minHeight={["30vw"]}
            px={[3,3,3,2,3,4]} pt={[3,3,3,3,3]} pb={[2]}
        >
            <FlexBox width="100%" position="relative" flexGrow={1} flexDirection="column"  pb={[3]}>
                <NewLink 
                    link={`/movie/${item.movie.slug}`} 
                    title={`See ${item.movie.name} (${item.movie.year}) plot, cast, trailer, similar films and movie recommendations.`}
                    hoverUnderline follow
                    pb={[3,3,3,2,2]}
                    > 
                    <HeaderMini textAlign="left" fontWeight="bold" height="100%"
                        fontSize={specs.headerSize}
                        
                    >
                        {item.header || `${item.movie.name} (${item.movie.year})`}
                    </HeaderMini>
                </NewLink>
                {item.htmlContent 
                    ? <HtmlContainer 
                        html={item.htmlContent} 
                        style={{
                            p:{fontSize:specs.textSize},
                            a:{fontSize:specs.textSize},
                        }} 
                    />
                    : <Text mt={[2]} fontSize={specs.textSize}>
                            {item.movie.summary.length > 450 
                                    ? item.movie.summary.slice(0,450) + "..." 
                                    : item.movie.summary
                                }
                        </Text>
                }

                <TagBox tags={item.movie.tags} color="dark" num={6} mt="auto" />
            </FlexBox>

            {/* HOME BUTTON*/}
            <Box display="flex" position="relative" 
                left={0} bottom={0} 
                height={"auto"} width="100%"
                mt="4px" pb={"2px"} pt="4px" borderTop="1px solid" borderColor="rgba(0,0,0,0.25)"
                justifyContent="space-between" alignItems="flex-end"
            >
                {false && <NewLink link={`/movie/${item.movie.slug}`} 
                    follow title={`Visit ${item.movie.name} (${item.movie.year})'`} 
                >
                    <Box display="flex" 
                        alignItems="center" hoverColor="#3437c7" 
                        justifyContent="center" fontWeight="bold" 
                        opacity={0.8}
                    >
                        More <RightIcon size={"20px"} />
                    </Box>
                </NewLink>}

                <Box display="flex" title={`${item.movie.name} released in ${item.movie.year} and have ${item.movie.imdbRating} IMDb rating.`}>
                    <YearClockIcon year={item.movie.year} color="dark" fill="#181818" opacity={0.8}  noShadow size={specs.iconSize -4} />
                    {item.movie.imdbRating && 
                        <ImdbRatingIcon 
                            rating={item.movie.imdbRating} color="dark" noShadow 
                             
                        />}
                </Box>
            </Box>
        </FlexBox>

        {/* RIGHT SECTION*/}
        <FlexBox  display={["none", "none", "none", "flex"]}
            flexDirection="column" alignItems="center" 
            width={["40vw","40vw","40vw","50vw","45vw"]}  
            height={["30vw","30vw","30vw",`auto`]}
            boxShadow="4px 4px 12px 4px rgba(0,0,0,0.4)"
            >   

            <SuperBox flexGrow={1} height="auto" minWidth="100%" className="img-supbox"
                src={item.coverPoster || (item.movie && item.movie.coverPoster)}
                alt={`${item.movie.name} poster`} 
                ratio={0.6}  zIndex={0}
            >
                {item.movie.videos.length > 0 &&
                    <TrailerIcon 
                        onClick={() => play(item.movie.videos)} 
                        zIndex={12} 
                        position="relative"
                        left={0} top={0}
                        width={"60px"} height="50px" overflow="hidden"
                        mr={[2,2,3]}

                    />
                }
                <CoverLink link={`/movie/${item.movie.slug}`}  title={item.movie.name}  zIndex={2} follow={true}/>
            </SuperBox>

            {/* NAME PANEL*/}
            {false && <FlexBox width={"100%"} height={"60px"}
                position="relaive"  bg="dark" flexDirection="column" 
                pl={"8px"}
                borderBottom="1px solid" borderColor="rgba(255,255,255,0.3)"
            >   
                <NewLink link={`/movie/${item.movie.slug}`} follow={true}
                    title={`See the details of ${item.movie.name} (${item.movie.year}).`}                        
                >
                    <Text color="light" hoverUnderline fontWeight="bold" fontSize="13px">{item.movie.name} ({item.movie.year})</Text>
                </NewLink>

            {/* ACTOR PANEL*/}
                {false && <FlexBox alignItems="center">
                    {item.persons.map(star => (
                        <NewLink link={`/person/${star.slug}`} key={star.id} follow={true}>
                            <Text color="#f1f1f1" fontSize="12px" mr={"16px"} opacity={0.8} hoverUnderline>{star.name}</Text>
                        </NewLink>
                    ))}
                </FlexBox>}

            </FlexBox>}
            {/* MUTATION PANEL */}
            <FlexBox width={"100%"} height={"50px"} position="relaive" bg="dark" alignItems="center">
                    <BookmarkMutation id={item.movie.id} 
                        active={item.movie.isBookmarked} 
                        size={specs.iconSize } mx={[2]} 
                    />
                    <LikeMutation id={item.movie.id} 
                        active={item.movie.isBookmarked} 
                        size={specs.iconSize - 2} 
                    />
                    <Box display="flex" flexGrow={1}
                        width="100%" height="100%"
                        justifyContent="center" alignItems="center"
                    >
                        <RatingMutation item={item.movie} size={36} />
                    </Box>
                </FlexBox>
        </FlexBox>

    </FlexBox>
)

const TrailerIcon = ({onClick, ...props}) => (
	<FlexBox 
		display="flex"
		to={`#movie-page-video-header`}
		title={"See Video Section"}
		position="absolute"
        alignItems="center"
        justifyContent="center"
		left={"45%"}
		width={"10%"}
		top={"45%"}
		height={"45%"}
        onClick={onClick}
        {...props}
	>
		<YoutubeIcon size={[50,50,50, 35]} hoverScale />
	</FlexBox>
)

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