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
	useClientHeight,
	rgaSetCloseTime,
	useValues
} from "../functions";
import { GlobalContext } from "../";

import JoinBanner from "../components/JoinBanner.js";
import { facebook } from "../functions"


//import { motion, useViewportScroll } from "framer-motion"
import {Box,Span,FlexBox,  MovieCoverBox,DirectorCard,MovieCoverCard,ImageCard,Grid,
	PageContainer,ContentContainer,Loading,Section, 
	SuperBox,HiddenText,HiddenHeader,HiddenSubHeader,HeaderText,HeaderMini,Text, SubHeaderText, NewLink,
	LinkButton,CoverLink,CoverCard, BubbleButton, Button,Image, SimpleModal,
	GradientAnimationBox,SignupForm, SignupFormModal, production, PulseButton,
	ScaleButton, Hr, Popup,KeyIcon,LinkIcon, CoverImage, AbsoluteImage, CardContainer,
	TriangeClip
	
} from "../styled-components";
import {ActionsIcon, CollectionsIcon, RecommendationIcon, SearchIcon, PeopleIcon, RateIcon, SimilarFinderIcon} from "./icons"

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
	//const heroimageheight = useClientHeight("hero-image")
	//console.log(heroimageheight)

	const insertJoinForm = useCallback(() => state.methods.insertAuthForm("signup"),[])
	const closeModal = () => setModalOpen(false)
	rgaSetCloseTime("Landing Page")
	
	//const [isFbLoaded, setFbLoaded] = useState(false)
	//const Fb = facebook()
	//console.log("main", isModalOpen)
	//const listAndTopics = [...topics, ...lists]
	const heroMainText = "Discover Best Movies That Fit Your Cinema Taste"
	const heroHeaderText = "Improve your experience in discovering movies"
	const heroSubheaderText = "With our AI-based personalized movie recommendation system, we are guiding you through multiple universes of the art of film."
        
    const screenSize = useWindowSize()
    const isSmallScreen = useMemo(() => !screenSize.includes("L"), [screenSize])
    const responsivePosterUrl = isSmallScreen 
        ? "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-v+5.jpg"
        : "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-dark.jpg"
	const lovesimonposter= "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/love-simon-1280x650.jpg"
	
	const featurecolor = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-cards/aqua.jpg" // aqua, kırmızı, mor, mor-pembe, sarı, yesil
	
	function Clip(props) {
		return (
		  <svg
			width={1441}
			height={201}
			viewBox="0 0 1441 201"
			fill="none"
			{...props}
		  >
			<path d="M.26.5l1440 200H.26V.5z" fill="#C4C4C4" />
		  </svg>
		)
	  }
	  
	return (
    <>
        <Head
            description={
                "We provide personalized AI-assisted movie recommendations, " + 
                "great lists of films, similar movie finder, advance film search, and great film recommendations."

            }
            title={
                "Pixly - Good Movie Recommendations & List of Films & Similar Movies"
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
                property="og:image"
                content="https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/brand/pixly-hare-circle.png"
            />
        </Head>

        <PageContainer bg="#FAFCFF">
			
			{/* HERO*/}
			<FlexBox 
				flexDirection="column" minHeight={[ "400px", "400px", "500px"]}
				height={"100%"} overflow="hidden"
				position="relative"
				zIndex={0} 
			>
				<FlexBox px={[3,3,4,5]} width={"100%"}
					top={[4,4,5,5,6]}
					alignItems="center" justifyContent="center"
					flexDirection="column"
				>
					<Span 
						fontFamily="header" fontWeight="bold"
						fontSize={["24px","24px","28px", "40px", "44px"]} 
						textAlign="center"
						uncapitalize 
						textShadow="-3px 3px 2px rgba(40, 40, 40, 0.8)" 
						zIndex={8} 
						opacity={1}
						color="light"
						maxWidth={"800px"}
					>
						{heroMainText}
					</Span>
					<Span  zIndex={8} 
						textAlign="center" mt={[3]}
						fontSize={["14px", "14px", "16px", "16px", "18px"]}  
						color="light" maxWidth={"800px"}
						textShadow="-1px 1px 1px rgba(40, 40, 40, 0.8)"
					>
						{heroSubheaderText}
					</Span>
				</FlexBox>
				<CoverImage 
					ratio={0.56} 
					src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-dark.jpg"} 
					position="absolute"
					top={0} left={0} right={0} 
					width={["100vw"]} 
					zIndex={0}
					alt={"Pixly AI Movie Recommendation"} 
					minHeight={[ "410px", "410px", "500px"]}
				/>	
				<TriangeClip />
			</FlexBox>


			{/* MAIN */}
			<FlexBox bg="#FAFCFF" width="100%" minHeight="500px" flexWrap="wrap" >

				{/* H1 and Illustration */}
				<FlexBox flexDirection="column" justifyContent="center" alignItems="center" width="100%" px={"10vw"}>
					<HeaderText fontSize={["22px","22px","36px","50px","70px"]} textAlign="center">
						Movie Recommendations<br/>
						Similar Movie Finder<br/>
						Advance Search<br/>
						Lists of Films<br/>
					</HeaderText>
				</FlexBox>



				{/* PERSONAL MOVIE RECOMMMENDATIONS*/}
				<FlexBox 
					flexDirection="column" alignItems="center" 
					justifyContent="center" alignItems="center"
					px={"5vw"} mt={6} mb={5}
				>
					<SubHeaderText  fontWeight="bold">
						Personal Movie Recommendations
					</SubHeaderText>
					<Text fontSize={["14px", "14px", "16px"]}>
						We will recommend you good movies considering your taste.
						In order to get personal movie recommendations,
						join us by creating an account. After you rate 40 movies, 
						give us some time to analyze. 
						Then, Our AI-assisted algorithms will find and recommend good movies weekly.
					</Text>
				</FlexBox>
			</FlexBox>
			
			<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
        </PageContainer>
    </>
    );
}


export default MainPage;


/*

					<CardContainer  ml={"5vw"} maxWidth={"700px"}>
						<HeaderText 
							fontSize={["22px","22px","28px","32px","40px"]} 
						>
							Personal Movie Recommendations<br/>
							Similar Movie Finder<br/>
							Advance Search<br/>
							Lists of Films<br/>
						</HeaderText>
					<Image position="absolute"
						right={"5vw"}
						bottom={0}
						src="https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/Delivery+1.png"
						width={["30vw"]} height={"30vw"} opacity={0.7}
						alt="Pixly - Movie Recommendations"
					/>
					</CardContainer>
*/