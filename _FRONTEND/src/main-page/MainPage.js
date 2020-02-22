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
	Clippy2
	
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

        <PageContainer >
			
			{/* HERO*/}
			<FlexBox borderBottom="6px solid"   borderColor="rgba(0,0,0,0.7)"
				flexDirection="column" minHeight={[ "400px", "400px", "500px"]}
				alignItems="center" justifyContent="center" boxSizing="border-box"
				zIndex={9}  boxSizing="border-box" px={[2,2,3,4]} 
				height={"100%"} overflow="hidden"
				position="relative"
			>
				<CoverImage ratio={0.56} src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-dark.jpg"} 
					position="absolute"  className="hero-image clip-bottom"
					top={0} left={0} right={0} 
					width={["100vw"]} zIndex={0}
					alt={"Pixly AI Movie Recommendation"} minHeight={[ "410px", "410px", "500px"]}
				/>	

				<HeaderText 
					mt={["80px", "80px", 4,5]} mb={[2]}
					fontSize={["24px","24px","28px", "40px", "44px"]} 
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
				<Text mt={[2]} zIndex={8} 
					mb={[3,3,4]} px={[3,3,4]} textAlign="center"
					fontSize={["14px", "14px", "16px", "16px", "18px"]}  
					color="light" maxWidth={"800px"}
					textShadow="-1px 1px 1px rgba(40, 40, 40, 0.8)"
				>
					{heroSubheaderText}
				</Text>
				{!authStatus && 
					<Button px={[2]} mx={[4]} my={[3]}
						onClick={setModalOpen} 
						width={"200px"} height={"40px"}
						color="light"  zIndex={8} 
						
						gradient="pinkish"
						boxShadow={"card"} 
						fontWeight="bold" hoverBg={"dark"}
						hoverScale={1.1}
						>
						Join
					</Button>}
				<Clippy2 bg="#ffffff" zIndex={8} minWidth="100%" minHeight="200px" ></Clippy2>
			</FlexBox>
			

			{/* EXPLORE*/}
			{false && <FlexBox 
				flexDirection="column" justifyContent="center" 
				borderBottom="6px solid" borderColor="rgba(0,0,0,1)"
				position="relative" boxSizing="border-box"
				overflow="hidden" 
				minHeight="400px" 
				zIndex={6} top={-5}
			>

				<ExploreSection isSmallScreen={isSmallScreen} />
			</FlexBox>}

			{false && !isSmallScreen && <ExploreSection isSmallScreen={isSmallScreen} />}

				{/* QUICK START*/}
				<SuperBox gradient="pinkish" flexDirection="column">
					<SubHeaderText 
						mt={[5]}
						textAlign="center"
						fontWeight="bold"
						fontSize={["24px","24px","28px", "40px", "44px"]} 
						opacity={0.9}
						
					>
						Start Discovering Great Movies
					</SubHeaderText>
					
					<Grid columns={[2,2,2,4]} px={[2]} p={[3]} bg="">
						<QuickStartItem
							header="Popular Movies"
							text="See popular and upcoming movies"
							link="/popular-and-upcoming-movies"
						/>
						<QuickStartItem
							header="Lists of Films"
							text="Collections of great list of films"
							link="/lists-of-films"
						/>
						<QuickStartItem
							header="Similar Movies"
							text="Get movie recommendations based on you like"
							link="/similar-movie-finder"
						/>
						<QuickStartItem
							header="Film Search"
							text="Search movies with advance filtering"
							link=""
						/>
					</Grid>
				</SuperBox>


			<ContentContainer boxSizing="border-box" bg="#f0f5ff">

				{/* FEATURES */}
				<Grid columns={[1,1,1,2,2,3]} px={[2]} py={[4]}>
					<RecommendationFeature onClick={insertJoinForm} authStatus={authStatus} />
					<SimilarMoviesFeature  authStatus={authStatus} />
					<CollectionsFeature  />
					<SocialFeature setModalOpen={setModalOpen} authStatus={authStatus} />
					<AdvanceSearchFeature  />
					<ActionFeatures onClick={insertJoinForm} authStatus={authStatus} />
				</Grid>
			</ContentContainer>

			{true && <SuperBox  
				display="flex" flexDirection="column" alignItems="center"
				width={"100%"} mx={"0px"} py={[5]} px={["5vw", "5vw", "5vw", "8vw"]} 
				gradient="blueish" 
			>
				<CardContainer>
					<MessageFromPixly />
				</CardContainer>
			</SuperBox>}
			<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
        </PageContainer>
    </>
    );
}

const QuickStartItem = ({link, header, text}) => (
	<CardContainer width="100%"  hoverBg="rgba(0,0,0,0.15)" maxWidth="220px">
		<HeaderMini textAlign="center" minWidth="100%" fontSize={["18px","18px", "18px", "20px"]}>
			{header}
		</HeaderMini>
		
				<Text textAlign="center" opacity={0.8} width="100%">{text}</Text>
		
		<CoverLink to={link} title={"Quick Start: " + header} zIndex={1} />
	</CardContainer>
)

const ExploreSection = ({ isSmallScreen }) => (
<Section 
	display="flex" flexDirection="column" alignItems="center" 
	position="relative"
	borderRadius={"18px"}
	
	width={"100%"}
><CardContainer>
		<Text fontWeight="bold" 
			color="dark" 
			my={[3]}
			textAlign="center" 
			color={"light" }
			fontSize={["22px","22px","28px", "30px"]} 
			>
			Let Me Discover First
		</Text>
	<FlexBox justifyContent="center" alignItems="center" >
		<Grid columns={[2]} py={[1]} gridColumnGap={[2,2,2,3]} width="100%" height="auto" px={[2,2,4,5,6]} >
			<LinkButton px={[3,3,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/popular-and-upcoming-movies" textAlign="center"
				color="light" bg="active" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Popular Movies
			</LinkButton>
			<LinkButton px={[3,3,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/lists-of-films" textAlign="center"
				color="light" bg="active" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Lists of Films
			</LinkButton>
			<LinkButton px={[2,2,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/similar-movie-finder" textAlign="center"
				color="light" bg="active" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Similar Movie Finder
			</LinkButton>
			<LinkButton px={[3,3,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/advance-search" textAlign="center"
				color="light" bg="active" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "12px", "14px"]}
			>
				Advance Search
			</LinkButton>

		</Grid>
	</FlexBox>
	</CardContainer>
</Section>
)

const FeatureCard = ({ color, ...props}) => (
	<FlexBox width="100%" maxWidth="100%" height="auto" minHeight="350px" flexDirection="column" alignItems="center" 
		px={[3]} overflow="hidden" pt={[3]} boxShadow="card" borderRadius="6px"
	>
		<AbsoluteImage ratio={350/250}
			src={`https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-cards/${color}.jpg`} 
			zIndex={0}
			alt={"Pixly Features "} 
		/>
		<FlexBox 
			flexDirection="column"  
			position="relative" top={0} bottom={0} left={0} right={0} minHeight={"360px"}
			maxWidth="100%" zIndex={5} 
			justifyContent="flex-start" alignItems="center" 
			overflow="hidden"
		>
			<SubHeaderText my={[2,2,3]}
				fontSize={["18px", "18px", "20px", "22px"]}
				width={"auto"} color="light"
				fontWeight="bold"
			>
				{props.header}
			</SubHeaderText>
			{props.text && <Text textAlign="justify" fontSize={["14px"]} color="light">
				{props.text}
			</Text>}
			{props.children}
		</FlexBox>
	</FlexBox>
)



const RecommendationFeature = ({authStatus, onClick, color="aqua",}) => (
	<FeatureCard color={color}
		header="Personal Movie Recommendations"
		text={"We will analyze " + 
				"your cinema taste with our AI-Based film recommendation engine after you rated 40 movies. " +
				"After then, we will make very personalized movie " +
				"recommendations based on movies you like."}
	>
		{!authStatus && 
			<Button px={[3,3,4]} mt={[4]} 
				hoverBg="rgba(0,0,0,0.4)" translateY 
				textAlign="center"  position="absolute" bottom={0}
				color="light" bg="rgba(0,0,0,0.1)" 
				height={"40px"} width={["90%"]} maxWidth={"300px"} 
				boxShadow="card"
				fontSize={["12px", "14px", "14px"]}
				border={"1px solid"} borderColor="light" 
				borderRadius={"4px"}
			>
				Join Us
			</Button>
		}
	</FeatureCard>
)
const SimilarMoviesFeature = ({color="yesil",}) => (
	<FeatureCard color={color} header="Find Similar Movies" >
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} color="light">
			Let search your movies you like and discover movies that have similar genre, tag, or theme with our 
			<em> similar movie finder</em>.
			Besides, You may also find film recommendations like your favourite film which are suggested by our AI-assisted recommendation engine. 
		</Text>

		<LinkButton px={[3,3,4]} mt={[4]} translateY hoverBg="rgba(0,0,0,0.4)"
			link="/similar-movie-finder" textAlign="center" position="absolute" bottom={0}
			color="light" bg="rgba(0,0,0,0.1)" 
			height={"40px"} width={["90%"]} maxWidth={"300px"} 
			hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
		>
			Find Similar Movies
		</LinkButton>
	</FeatureCard>
)

const CollectionsFeature = ({color="mor",}) => (
	<FeatureCard color={color} header="List Of Films" 
		text={
			"We are also collecting and curating lists of movies that fit your mood such as the favourite films of the " +
			"directors, the grand prize winner films from festivals, and " +
			"topic lists that include the best artworks of its category like "
		}
	>
		<Box fontSize={["12px", "12px", "14px", "14px"]}  opacity={0.9} color="light" maxWidth="100%" overflow="hidden"  display="flex" flexWrap="wrap">

			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Arthouse Movies"} link="/topic/art-house">ArtHouse</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Cyberpunk Movies"} link="/topic/cyberpunk">Cyberpunk</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Controversial Movies"} link="/topic/controversial">Controversial</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Gangster Movies"} link="/topic/gangster-films">Gangster</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Mystery Movies"} link="/topic/mystery">Mystery</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Mystery Movies"} link="/topic/romantic-comedy">Romantic Comedy</NewLink>,&nbsp;
			<NewLink ml={"2px"} mr="4px" follow={true} underline fontWeight="bold" title={"Thought-Provoking Movies"} link="/topic/thought-provoking">Thought-Provoking</NewLink> movies etc.
		</Box>
		<LinkButton px={[3,3,4]} mt={[4]} translateY hoverBg="rgba(0,0,0,0.4)"
				textAlign="center" link="/lists-of-films" position="absolute" bottom={0}
				color="light" bg="rgba(0,0,0,0.1)" 
				height={"40px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				See List of Films
			</LinkButton>
	</FeatureCard>
)

const SocialFeature = ({setModalOpen, color="mor-pembe",}) => (
	<FeatureCard color={color} header="Discover People and Share Movie" >
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} color="light">
			Keep and track your personal cinema history by adding movies to watchlist, or liking them. Then You can share movies from there.
		</Text>
	</FeatureCard>
)

const AdvanceSearchFeature = ({color="kırmızı",}) => (
	<FeatureCard color={color} header="Advance Film Search" >
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} color="light">
			You can search movies within your favourite genre or subgenre and filter them with IMDb rating or release year.
		</Text>
			<LinkButton px={[3,3,4]} mt={[4]} translateY hoverBg="rgba(0,0,0,0.4)"
				textAlign="center" link="/advance-search" position="absolute" bottom={0}
				color="light" bg="rgba(0,0,0,0.1)" 
				height={"40px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Browse Movies
			</LinkButton>
	</FeatureCard>
)



const ActionFeatures = ({setModalOpen, color="sarı"}) => (
	<FeatureCard color={color} header="Watch List, Likes and Movie Rating" >
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} color="light">
			You can save your favourite films. Add films to your watch list that is not watched yet, so you don't have to remember them.
			Rate films, then your friends will see your public opinion. Also, get very personalized film recommendations based on your ratings.   
		</Text>
	</FeatureCard>
)

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

const FeatureAuthPopup = ({ text, popupText, actionOne }) => {
	const state = useContext(GlobalContext)
	const insertform = useCallback(() => state.methods.insertAuthForm("login"),[])
	return (
		<Popup
			Text={
				<FlexBox alignItems="center" >
					<SubHeaderText color="light"
						fontSize={["14px", "14px", "14px", "16px"]}
						width={"auto"} fontWeight="bold"
						underline
					>
						{text}
					</SubHeaderText>
					<KeyIcon 
						width={"16px"} 
						height={"16px"} 
						title="You should login to get personalized recommendations"
					/>
				</FlexBox>
			}
		>
		<FlexBox flexDirection="column" p={[2]} pt={[4]} position="relative">
			<Text position="absolute" top={"5px"} right={"10px"} fontWeight="bold" hoverScale>X</Text>
			<Text>{popupText}</Text>
			<FlexBox width={"auto"} px={[2]}>
				<Button px={[2]} m={[2,2,3]}
					zIndex={3}
					onClick={insertform} 
					width={"120px"} height={"32px"}
					color="light" 
					
					gradient="blueish"
					boxShadow={"card"} 
					fontWeight="bold" hoverBg={"dark"}
					hoverScale={1.1}
					>
					Login
				</Button>
				<Button px={[2]} m={[2,2,3]}
					zIndex={3}
					onClick={actionOne} 
					width={"120px"} height={"32px"}
					color="light" 
					
					gradient="pinkish"
					boxShadow={"card"} 
					fontWeight="bold" hoverBg={"dark"}
					hoverScale={1.1}
					>
					Join
				</Button>
			</FlexBox>
		</FlexBox>
	</Popup>

	)
}





const MessageFromPixly = () => (
	<FlexBox flexDirection="column" px={["5vw", "5vw", "8vw", "10vw"]} alignItems="center">
		<SubHeaderText 
			fontSize={["24px", "28px"]} 
			fontWeight="bold" 
			opacity={0.85} 
			textAlign="center" my={[3]}
		>
			Pixly, Movie Recommendations, and List of Films 
		</SubHeaderText>
		<Text fontSize={["14px", "14px", "16px", "18px"]}  mt={[3]}>
			When making movie suggestions, it is essential to consider the art of cinema, the cinema industry and the complex human nature of the audience. Since we consider these, we want to offer you multiple services reasonably. 
		</Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]}  mt={[3]}>Our AI-assisted algorithmic movie recommendation engine is currently in a beta phase. Besides, content-like movie recommendation services show contentful similars to movies that you choose.  </Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]}  mt={[3]}>We are curating movie lists including the best examples of various genres and categories like Mystery, Gangster, Romantic Comedy, Cyberpunk etc...</Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]}  mt={[3]}>We are also collecting popular film lists around the world, such as the grand prize winner movies of film festivals, director’s favourite movies and other popular list of films.</Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]}  mt={[3]}>We constantly try to keep our content up to date. Your intellectual support and suggestions are always welcome. Please send us questions and suggestions via pixly[et]pixly.app</Text>

	</FlexBox>
)

export default MainPage;
