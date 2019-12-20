import React from "react";
import { useContext, useState, useReducer, useEffect, useMemo, useCallback, useRef} from "react";

import { Route, Switch, Link, withRouter } from "react-router-dom";
import { MAIN_PAGE } from "../functions/query";
import { Query } from "react-apollo";
import { useQuery, useApolloClient, useLazyQuery } from "@apollo/react-hooks";

import { rgaPageView, rgaStart, Head, MidPageAd } from "../functions/analytics";
import { useScript } from "../functions/hooks";

import {
	useWindowSize,
	useAuthCheck,
	useClientWidth,
	rgaSetCloseTime,
	useValues
} from "../functions";
import { GlobalContext } from "../";

import JoinBanner from "../components/JoinBanner.js";
import { facebook } from "../functions"


import { GlideBox } from "../components2/Glide.js";
//import { motion, useViewportScroll } from "framer-motion"
import {Box,Span,FlexBox,  MovieCoverBox,DirectorCard,MovieCoverCard,ImageCard,Grid,
	PageContainer,ContentContainer,Loading,Section, 
	SuperBox,HiddenText,HiddenHeader,HiddenSubHeader,HeaderText,HeaderMini,Text, SubHeaderText, NewLink,
	LinkButton,CoverLink,CoverCard, BubbleButton, Button,Image, SimpleModal,
	GradientAnimationBox,SignupForm, SignupFormModal, production, PulseButton,
	ScaleButton, Hr
	
} from "../styled-components";
import {ActionsIcon, CollectionsIcon, RecommendationIcon, SearchIcon, PeopleIcon, RateIcon} from "./icons"

import "./MainPage.css";
import "./dist/css/style.css"



const MainPage = (props) => {
	//rgaPageView()
	//console.log("main-page props: ",props)
	const authStatus = useAuthCheck();

    const state = useContext(GlobalContext)
	const insertLoginForm = useCallback(() => state.methods.insertAuthForm("login"),[])
	//const insertJoinForm = useCallback(() => state.methods.insertAuthForm("signup"),[])
    
	const [isModalOpen, setModalOpen] = useState(false)

	const insertJoinForm = useCallback(() => state.methods.insertAuthForm("signup"),[])
	const closeModal = () => setModalOpen(false)
	rgaSetCloseTime("Landing Page")
	
	//const [isFbLoaded, setFbLoaded] = useState(false)
	//const Fb = facebook()
	//console.log("main", isModalOpen)
	//const listAndTopics = [...topics, ...lists]
	const heroMainText = "Discover Best Movies That Fit Your Cinema Taste"
	const heroHeaderText = "Improve your experience in discovering movies"
	const heroSubheaderText = "Don't waste your time by browsing endless cycles. " + 
		"With our AI-based personalized recommendation systems, we are guiding you through multiple universes " + 
        "of the art of film."
        
    const screenSize = useWindowSize()
    const isSmallScreen = useMemo(() => !screenSize.includes("XL"), [screenSize])
    const responsivePosterUrl = isSmallScreen 
        ? "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-v.jpg"
        : "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-square.jpg"
    
    return (
    <>
        <Head
            description={
                "Discover best movies that fit your cinema taste with our movie recommendation. " + 
                "Find out similar movies, curated movie lists. A Film website. pixly.app"

            }
            title={
                "Pixly - AI Assisted Movie Recommendation, Similar Movies, Film Website"
            }
            keywords={
                "pixly.app ,discover movie, pixly movies, pixly home page, pixly cinema, pixly recommendation, movietowatch, movie suggestions, similar movies, similar movie, ai recommendation, movies like, must seen movies, best movies, awarded movies"
            }
            image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"}
            canonical={`https://pixly.app`}
            twitterdescription={"AI-Based Film Recommendations, Movie Lists, Topics, Popular and Upcoming Movies."}

            >
            <meta name="twitter:card" content="app" />
            <meta
                name="twitter:description"
                content="Personal Movie Recommendation and Social Movie Discovering Platform"
            />
            <meta name="twitter:app:name:iphone" content="Pixly" />
            <meta name="twitter:app:name:ipad" content="Pixly" />
            <meta name="twitter:app:name:googleplay" content="Pixly" />
            <meta property="og:url" content="https://pixly.app" />
            <meta
                property="og:image"
                content="https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/brand/pixly-hare-circle.png"
            />
            <meta
                property="business:contact_data:street_address"
                content="."
            />
            <meta
                property="business:contact_data:locality"
                content="Istanbul"
            />
            <meta
                property="business:contact_data:region"
                content="Europe"
            />
            <meta
                property="business:contact_data:postal_code"
                content="34430"
            />
            <meta
                property="business:contact_data:country_name"
                content="Turkey"
            />
        </Head>

        <PageContainer>
            <SuperBox display="flex" position="relative"
                flexDirection="column" justifyContent="center" alignItems="center"
                top={-75} 
                width={"100%"} 
                position="relative"
                borderBottom="3px solid"
                borderColor="rgba(40,40,40, 0.7)"
            >
			<Image src={responsivePosterUrl} position="absolute" top={0} left={0} width={"100%"} />
                <FlexBox flexDirection="column" zIndex={9}  px={[2,2,3,4]} alignItems="center">
                    <HeaderText 
                        mt={[6,6,6]} mb={[2]}
                        fontSize={["24px","24px","40px", "40px", "44px"]} 
                        textAlign="center"
                        uncapitalize 
                        textShadow="-3px 3px 2px rgba(40, 40, 40, 0.8)" 
                        zIndex={8} 
                        opacity={1}
                        color="light"
                        maxWidth={"600px"}
                    >
                        {heroMainText}
                    </HeaderText>
					<Text mt={[2]}
						mb={[3,3,4]} px={[3,3,4]}
						fontSize={["14px", "14px"]}  
						color="light" maxWidth={"800px"}
						textShadow="-1px 1px 1px rgba(40, 40, 40, 0.8)"
					>
						{heroSubheaderText}
					</Text>
					<Button px={[2]} mx={[4]} my={[3]}
						onClick={setModalOpen} 
						width={"100px"} height={"40px"}
						color="light" 
						borderRadius="4px" 
						gradient="pinkish"
						boxShadow={"card"} 
						fontWeight="bold" hoverBg={"dark"}
						hoverScale={1.1}
						>
						Join
					</Button>
					<Hr/>
					<Section 
						display="flex" flexDirection="column" alignItems="center" 
						position="relative"
						borderRadius={"18px"}
						my={[5]} 
						width={"100%"}
					>
						<HeaderMini fontWeight="bold" 
							color="dark" 
							my={[4]} 
							textAlign="center" 
							color="light"  textShadow="textDark"
							fontSize={["20px","20px","26px", "26px", "30px"]} 
							>
							Let Me Discover First
						</HeaderMini>
						<FlexBox flexWrap="wrap" width={"100%"} alignItems="center">
							<LinkButton px={[3,3,4]} link="/film-lists" color="light" bg="dark" borderRadius="4px" height={"50px"}
								hoverScale hoverBg="#3633CC" boxShadow="card" width={"45%"} 
							>
								Film Lists
							</LinkButton>
							<LinkButton px={[3,3,4]} link="/topics" color="light" bg="dark" borderRadius="4px" height={"50px"}
								hoverScale hoverBg="#3633CC" boxShadow="card" width={"45%"} 
							>
								Topics
							</LinkButton>
							<LinkButton px={[3,3,4]} link="/advance-search" color="light" bg="dark" borderRadius="4px" height={"50px"}
								hoverScale hoverBg="#3633CC" boxShadow="card" width={"45%"} 
							>
								Advance Search
							</LinkButton>
							<LinkButton px={[3,3,4]} link="/advance-search" color="light" bg="dark" borderRadius="4px" height={"50px"}
								hoverScale hoverBg="#3633CC" boxShadow="card" width={"45%"} 
							>
								Similar Movies
							</LinkButton>
						</FlexBox>
					</Section>
                </FlexBox>
            </SuperBox>
			<Section mt={[3]} position="relative" top={-60}>
				<Features />
			</Section>
			<SuperBox  
				display="flex" flexDirection="column" 
				width={"100%"} mx={"0px"} py={[5]} px={["5vw", "5vw", "5vw", "8vw"]} 
				gradient="blueish" 
			>
				<HeaderMini color={"light"} my={[3]} fontSize={["22px", "22px", "26px", "30px", "32px"]} textAlign="center">We have just started</HeaderMini>
				<Message />
			</SuperBox>
			<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
        </PageContainer>
    </>
    );
}

const FeatureText = (props) => (
	<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
		<SubHeaderText mr={[1,1,2]}
			fontSize={["14px", "14px", "14px", "16px"]}
			width={"auto"}
			fontWeight="bold"
		>
			{props.header}
		</SubHeaderText>
		<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>{props.text}</Text>
	</FlexBox>
)



const Features = () => {
	const screenSize = useWindowSize()
	const isLargeScreen = useMemo(() => screenSize.includes("XL"), [screenSize] )

	const flexDirection = isLargeScreen ? "row" : "column"
	const maxWidth = isLargeScreen ? "50%" : "100%"
	//console.log("screen size", screenSize,flexDirection)

	return (
		<FlexBox 
			flexDirection={flexDirection}  flexWrap="wrap"
			px={["5vw", "5vw", ]}
			pt={"20px"} pb={"40px"}
			alignItems="flex-start"
		
		>
				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<RecommendationIcon />
					<FeatureText 
						header={"Personal Movie Recommendations"}
						text={"We will analyze " + 
							"your cinema taste with AI-Based algorithmns after you rated 40 movies " +
							"then we will make very personalized movie " +
							"suggestions every week."}
					/>
				</FlexBox>
				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<SearchIcon />
					<FeatureText 
						header={"Advance Film Search"}
						text={"You can search movies within your favourite genre or subgenre" + 
							" and filter them with IMDb rating or release year."}
					/>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<RateIcon />
					<FeatureText 
						header={"Movie Rating Website"}
						text={"You can rate any movie in order to get good film recommendations or " + 
							" reflect your opinion about this movie. It can also be your public opinion. "}
					/>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<ActionsIcon />
					<FeatureText 
						header={"Watchlist and Likes"}
						text={"Keep and track your personal cinema history " + 
							"by adding movies to watchlist, or liking them. Then You can share movies from there"}
					/>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<CollectionsIcon />
					<FeatureText 
						header={"Curated and Collected Movie Lists"}
						text={"Handpicked and collected lists of movies; " + 
							"director's favorite films, grand prize winners of prestigious " +
							"film festivals. Topics lists like; " + 
							" arthouse, cyberpunk, based on true story, rich dialogues and really good movies."}
					/>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<PeopleIcon />
					<FeatureText 
						header={"Discover People and Share Movie"}
						text={"Find people whose cinema taste is similar " + 
							"to you. See which movies are currently watched " + 
							"by your friends, and also check your cinema taste " +
							"similarity with your friends."}
					/>
			</FlexBox>
			<SubHeaderText></SubHeaderText>
		</FlexBox>
	)
}

const Message = () =>(
	<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[2]} textAlign="justify">
	As Pixly, We have just started. We work passionately to make our business your favorite film website.<br/>
	Our AI algorithm is currently in a beta phase, and we've collect several movie lists and topics to enrich your discovery experience.
	These include films that have won major awards (Grand Prize) from prestigious film festivals like cannes film festival, 
	favorite movies and  lists from some famous directors such as Quentin Tarantino and Stanley Kubrick, and various topicals such as art-house, 
	cyberpunk or based on true story movies. <br/>In addition, we have gather together the best popular movies that are up to date and the upcoming
	cinema works that we are looking forward to. We constantly try to keep our content up to date. Your intellectual support and suggestions are 
	always welcome. Please send us any questions and suggestions in the message box at the bottom of the page or email us at pixly@pixly.app
	</Text>
) 



export default MainPage;

