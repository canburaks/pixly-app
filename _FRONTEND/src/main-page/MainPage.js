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
	ScaleButton
	
} from "../styled-components";
import {ActionsIcon, CollectionsIcon, RecommendationIcon, SearchIcon, PeopleIcon, RateIcon} from "./icons"

import "./MainPage.css";
import "./dist/css/style.css"


const FeatureText = (props) => (
	<FlexBox flexDirection="column" px={[3]} maxWidth={600}>
		<SubHeaderText mr={[2]}
			fontSize={["14px", "14px", "14px", "16px"]}
			width={"auto"}
		>
			{props.header}
		</SubHeaderText>
		<Text mr={[2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>{props.text}</Text>
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

const MainPageImage = () => (
	<Image 
		src="https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"
		info={"Discover Best Movies that Fit Your Cinema Taste"}
		minWidth={"100vw"}
		height={"auto"}
		position="absolute"
		top={0}
		left={0}
	/>
)



const MainPage = React.memo(() => {
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
	

	const Fb = facebook()
	//console.log("main", isModalOpen)
	//const listAndTopics = [...topics, ...lists]
	const heroMainText = "Discover Best Movies that Fit Your Cinema Taste."
	const heroHeaderText = "Improve your experience in discovering movies"
	const heroSubheaderText = "Don't waste your time by browsing endless cycles. " + 
		"With our AI-based personalized recommendation systems, we are guiding you through multiple universes " + 
		"of the art of film."


		return (
		<>
			<Head
				description={
					"Discover best movies that fit your cinema taste with our AI-based movie recommendations. " + 
					"Find out similar movies, curated movie lists.A Film website. pixly.app"

				}
				title={
					"Pixly App- AI Based Movie Recommendations App, Similar Movies, Film Website"
				}
				keywords={
					"pixly.app ,discover movie, pixly movies, pixly home page, pixly cinema, pixly recommendation, movietowatch, movie suggestions, similar movies, similar movie, ai recommendation, movies like, must seen movies, best movies, awarded movies"
				}
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

			<PageContainer >
					<SuperBox 
						src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/main-page-collage.jpg"} 
						top={-75} 
						py={["30px", "30px", "45px", "45px","45px", "90px","120px"]} mx={"0px"} 
						width={"100vw"} 
						position="relative"
						borderBottom="3px solid"
						borderColor="rgba(40,40,40, 0.7)"
						minHeight={"650px"}
					>
						<Box  mr={[5]}>
							<FlexBox flexDirection="column" zIndex={9}  px={[2,3,3,4]}>
								<HeaderText fontSize={["40px", "40px", "48px"]} 
									mt={[5,5]}
									uncapitalize 
									textShadow="-3px 3px 2px rgba(40, 40, 40, 0.8)" 
									zIndex={8} 
									color="light"
									maxWidth={"800px"}
								>
									{heroMainText}
								</HeaderText>


								<Text 
									my={[2,2,2,3]} 
									fontSize={["16px", "16px"]}  
									color="light" maxWidth={"500px"}
									fontWeight="bold"
									textShadow="-1px 1px 1px rgba(40, 40, 40, 0.8)"
								>
									{heroSubheaderText}
								</Text>
								
								<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
								{/*
								*/}
								
								{!authStatus && 
								<FlexBox flexDirection="column" justifyContent="flex-start" alignItems="flex-start">

								<Box  my={[3]} py={[3]}>
									<Button borderRadius={"6px"}   mx={[2]}
										onClick={insertLoginForm} 
										width={"120px"} height={"50px"} 
										color={"light"}
										fontWeight="bold"
										boxShadow="xs"
										gradient="navy"
										hoverScale
									>
										Login
									</Button>
									<Button px={[2]} mx={[2]}
										onClick={setModalOpen} 
										width={"120px"} height={"50px"}
										color="light" 
										borderRadius="4px" 
										gradient="pinkish"
										boxShadow={"card"} 
										fontWeight="bold" hoverBg={"dark"}
										hoverScale={1.1}
										>
										Join
									</Button>
								</Box>
									{!authStatus  && <Fb.Auth />}
								</FlexBox>

									}

							</FlexBox>
							
						</Box>
					</SuperBox>
					<ContentContainer>

					<Section mt={[3]} position="relative" top={-60}>
						<Features />
					</Section>


					<Section 
						display="flex" flexDirection="column" alignItems="center" 
						position="relative" top={-60}
						py={[4]} 
						mb={[4]}
						width={"100%"}
						borderTop="1px solid"
						borderBottom="1px solid"
						borderColor="rgba(80,80,80, 0.4)"
					
					>
							<HeaderMini textAlign="center" my={[2,3]}>Let me Show</HeaderMini>
							<FlexBox>
								<LinkButton link="/film-lists" color="light" bg="dark" borderRadius="4px" height={"50px"}
									hoverScale hoverBg="#3633CC"
								>
									Film Lists
								</LinkButton>
								<LinkButton link="/topics" color="light" bg="dark" borderRadius="4px" height={"50px"}
									hoverScale hoverBg="#3633CC"
								>
									Topics
								</LinkButton>
								<LinkButton link="/advance-search" color="light" bg="dark" borderRadius="4px" height={"50px"}
									hoverScale hoverBg="#3633CC"
								>
									Advance Search
								</LinkButton>

							</FlexBox>
					</Section>

					</ContentContainer>

					<SuperBox  
						display="flex" flexDirection="column" 
						width={"100%"} mx={"0px"} py={[5]} px={["5vw", "5vw", "5vw", "8vw"]} 
						gradient="blueish" 
					>
						<HeaderMini color={"light"} my={[3]} fontSize={["22px", "22px", "26px", "30px", "32px"]} textAlign="center">We have just started</HeaderMini>
						<Message />
					</SuperBox>

		</PageContainer>
	</>
	);
}, () => true)


const PartyImage = (props) => (<Image 
	src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/partying.png"}
	info={"We have just started."}
	{...props}
/>)

const MiniMovies = () => <Image info="pixly main page movies collage" src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/movies.jpg"} style={{width:"100%", height:"100%", boxShadow:"-2px 2px 4px 1px rgba(40,40,40, 0.6)"}} />

const SpaceOddysey = () => <Image info="space oddysey mini image" src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/space-oddysey.png"} style={{width:"100%", height:"auto"}} />

const SkinILive = () => <Image info="the skin i live in image" src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/skin.png"} style={{width:"100%", height:"auto"}} />


const Feature1 = ({onClick}) => (
	<FlexBox className="feature text-center is-revealing" borderBottom="1px solid" borderColor="rgba(0,0,0, 0.3)" minHeight={"450px"} flexDirection="column" justifyContent="space-between">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-01.svg"} info="Pixly main page Feature 01" />
			</div>
			<SubHeaderText fontSize={["18px", "18px", "20px"]}>Personal Recommendations - <Span fontSize={["14px"]} fontWeight="bold">BETA</Span></SubHeaderText>
			<Text>After rating 40 movies, we can analyze your cinema taste with artifical intelligence then we will make very personalized movie recommendations every week.</Text>
		</div>
			<FlexBox justifyContent="center"  mt={"auto"} width={"100%"}>
				<BubbleButton px={[1]} py={[1]}  mt={[4]} 
					width={"150px"} height={"40px"}
					bg="transparent"
					color="dark" 
					borderRadius="4px" 
					border="2px solid"
					borderColor="rgba(40,40,40, 0.8)"
					fontWeight="bold"
					onClick={onClick}
					>
					Join Now
				</BubbleButton>
			</FlexBox>
	</FlexBox>
)
const Feature2 = () => (
	<FlexBox className="feature text-center is-revealing" borderBottom="1px solid" borderColor="rgba(0,0,0, 0.3)" minHeight={"450px"} flexDirection="column" justifyContent="space-between">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-02.svg"} info="Pixly main page Feature 01" />
			</div>
			<SubHeaderText fontSize={["18px", "18px", "20px"]}>Curated and Collected Movie Lists</SubHeaderText>
			<Text>Handpicked selected lists of movies by Pixly Editors, beside well known collected movie lists all around the world including favorite film lists of directors and festival awarded movies. Special lists that we call topics that find movies that treat specific topics or subjects.</Text>

		</div>
			<FlexBox justifyContent="center"  mt={"auto"} width={"100%"}>
				<LinkButton px={[1]} py={[1]}  mt={[4]} 
					width={"150px"} height={"40px"}
					color="dark" 
					borderRadius="4px" 
					border="2px solid"
					borderColor="rgba(40,40,40, 0.8)"
					link="/explore" 
					fontWeight="bold"
					zIndex={0}
					>
					Show Me
				</LinkButton>
			</FlexBox>
	</FlexBox>
)
const Feature3 = () => (
	<FlexBox className="feature text-center is-revealing" borderBottom="1px solid" borderColor="rgba(0,0,0, 0.3)" height={"450px"} flexDirection="column" justifyContent="space-between">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-03.svg"} info="Pixly main page Feature 01" />
			</div>
			<SubHeaderText fontSize={["18px", "18px", "20px"]}>Advance Film Search</SubHeaderText>
			<Text>Advance Search and Filter mechanism with respect to IMDb rating and release year of movies.</Text>
		</div>
			<FlexBox justifyContent="center"  mt={"auto"} width={"100%"}>
				<LinkButton px={[1]} py={[1]}  mt={[4]} 
					width={"150px"} height={"40px"}
					color="dark" 
					borderRadius="4px" 
					border="2px solid"
					borderColor="rgba(40,40,40, 0.8)"
					link="/advance-search" 
					fontWeight="bold"
					zIndex={0}
					>
					Let's Search
				</LinkButton>
			</FlexBox>
	</FlexBox>
)
const Feature4 = ({onClick}) => (
	<FlexBox className="feature text-center is-revealing" borderBottom="1px solid" borderColor="rgba(0,0,0, 0.3)" height={"450px"} flexDirection="column" justifyContent="space-between">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-04.svg"} info="Pixly main page Feature 01" />
			</div>
			<SubHeaderText fontSize={["18px", "18px", "20px"]}>Watchlist, Likes, Ratings</SubHeaderText>
			<Text>Keep and track your personal cinema history by adding movies to watchlist, liking them and giving ratings in one film website. </Text>
		</div>
			<FlexBox justifyContent="center"  mt={"auto"} width={"100%"}>
				<BubbleButton px={[1]} py={[1]}  mt={[4]} 
					width={"150px"} height={"40px"}
					bg="transparent"
					color="dark" 
					borderRadius="4px" 
					border="2px solid"
					borderColor="rgba(40,40,40, 0.8)"
					fontWeight="bold"
					onClick={onClick}
					>
					Join Now
				</BubbleButton>
			</FlexBox>
	</FlexBox>
)
const Feature5 = () => (
	<FlexBox className="feature text-center is-revealing" borderBottom="1px solid" borderColor="rgba(0,0,0, 0.3)" height={"450px"} flexDirection="column" justifyContent="space-between">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-05.svg"} info="Pixly main page Feature 01" />
			</div>
			<SubHeaderText fontSize={["18px", "18px", "20px"]}>Discover People and Share Movies</SubHeaderText>
			<Text>Find people whose cinema taste is similar to you. See which movies are currently watched by your friends, and also check your cinema taste similarity with your friends. </Text>
		</div>
	</FlexBox>
)

const Feature6 = () => (
	<FlexBox className="feature text-center is-revealing" borderBottom="1px solid" borderColor="rgba(0,0,0, 0.3)" height={"450px"} flexDirection="column" justifyContent="space-between">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-06.svg"} info="Pixly main page Feature 01" />
			</div>
			<SubHeaderText fontSize={["18px", "18px", "20px"]}>Filmography & Content</SubHeaderText>
			<Text>Filmographies of the directors, actors, and actress'. The favorite film lists of the famous directors that impressed them. Conversations, interviews and movie essays about directors</Text>
		</div>
	</FlexBox>
)

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

