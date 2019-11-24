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
	PageContainer,ContentContainer,Loading,
	SuperBox,HiddenText,HiddenHeader,HiddenSubHeader,HeaderText,HeaderMini,Text, SubHeaderText, NewLink,
	LinkButton,CoverLink,CoverCard, BubbleButton, Button,Image, SimpleModal,
	GradientAnimationBox,SignupForm, SignupFormModal, production
} from "../styled-components";


import "./MainPage.css";
import "./dist/css/style.css"

const Sample = () => (
	<div className="hero-figure anime-element">
		<svg className="placeholder" width={528} height={396} viewBox="0 0 528 396">
			<rect width={528} height={396} style={{fill:"transparent"}} />
		</svg>
		<div className="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
		<div className="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
		<div className="hero-figure-box hero-figure-box-03" data-rotation="0deg"></div>
		<div className="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
		<div className="hero-figure-box hero-figure-box-07"></div>
		<div className="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
		<div className="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
	</div>
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
	const herMainText = "Discover Best Movies that Fit Your Cinema Taste."
	const heroHeaderText = "Improve your experience in discovering movies"
	const heroSubheaderText = "Don't waste your time by browsing endless cycles. " + 
		"With our AI-based personalized recommendation systems, we are guiding you through multiple universes " + 
		"of the art of film."
	return (
		<PageContainer>
			<Head
				description={
					"Discover best movies that fit your cinema taste with our AI-based movie recommendations. " + 
					"Find out similar movies, curated movie lists. A Film website. pixly.app"

				}
				title={
					"Pixly App- AI Based Movie Recommendation App, Similar Movies, Film Website"
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

			<div className="body-wrap">
				<main>
					<SuperBox className="container" gradient="blueish" top={95} py={"40px"} width={"100vw"} mx={"0px"}>
						<Box className="hero-inner" mr={[5]}>
							<FlexBox flexDirection="column" zIndex={9}  px={[2,3,3,4,6,6,7]}>
								<HeaderText fontSize={["40px", "40px"]} uncapitalize textShadow="-2px 2px 2px rgba(40, 40, 40, 0.6)" zIndex={8} color="light">{herMainText}</HeaderText>
								<Text my={[2,2,2,3]} fontSize={["18px", "18px"]} fontWeight="bold" color="light">{heroHeaderText}</Text>
								
								<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
								{/*
								*/}
								
								{!authStatus && 
								<FlexBox flexDirection="column" justifyContent="flex-start" alignItems="flex-start">

								<Box  my={[3]}>
									<Button borderRadius={"6px"}   mx={[2]}
										onClick={insertLoginForm} 
										width={"120px"} height={"50px"} 
										color={"light"}
										fontWeight="bold"
	
										hoverShadow="card"
										boxShadow="xs"
										gradient="navy"
									>
										Login
									</Button>
									<BubbleButton px={[2]} mx={[2]}
										onClick={setModalOpen} 
										width={"120px"} height={"50px"}
										color="light" 
										borderRadius="4px" 
										link="/explore" gradient="pinkish"
										fontWeight="bold" hoverBg={"dark"}
										>
										Join
									</BubbleButton>
								</Box>
									{!authStatus  && <Fb.Auth />}
								</FlexBox>

									}
								<FlexBox flexDirection="row" alignItems="flex-start" flexWrap="wrap" width="100%" mt={[3,3,3,4]} justifyContent="flex-start">
									{/*

									*/}
									<LinkButton link="/explore" color="light" bg="dark" borderRadius="4px" mt={[4]}>Let Me Show</LinkButton>

								</FlexBox>
							</FlexBox>
							
							<div className="hero-figure anime-element">
								<svg className="placeholder" width={528} height={396} viewBox="0 0 528 396">
									<rect width={528} height={396} style={{fill:"transparent"}} />
								</svg>
								<div className="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
								<div className="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
								<div className="hero-figure-box hero-figure-box-03" data-rotation="0deg"></div>
								<div className="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
								<div className="hero-figure-box hero-figure-box-05"><MiniMovies /></div>
								<div className="hero-figure-box hero-figure-box-06"><SpaceOddysey /></div>
								<div className="hero-figure-box hero-figure-box-07"></div>
								<div className="hero-figure-box hero-figure-box-08" data-rotation="-22deg"><SkinILive /></div>
								<div className="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
								<div className="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
							</div>
						</Box>
					</SuperBox>

					<section className="features section">
						<div className="container">
							<div className="features-inner section-inner has-bottom-divider">
								<Box className="features-wrap" pt={[5]}>
									<Feature1 onClick={setModalOpen}/>
									<Feature2 />
									<Feature4 onClick={setModalOpen}/>
									<Feature3 />
									<Feature5 />
									<Feature6 />

								</Box>
							</div>
						</div>
					</section>


					<section className="cta section">
						<div className="cta-inner section-inner">
							<HeaderMini textAlign="center" my={[2,3,3,3,3,4]}>Let me Show</HeaderMini>
							<LinkButton link="/explore" color="light" bg="dark" borderRadius="4px" >Explore</LinkButton>
						</div>
					</section>

				</main>
			</div>
					<SuperBox  
						display="flex" flexDirection="column" 
						width={"100vw"} mx={"0px"} py={[5]} px={["5vw", "5vw", "5vw", "8vw"]} 
						gradient="blueish" 
					>
						<HeaderMini color={"light"} my={[3]} fontSize={["22px", "22px", "26px", "30px", "32px"]} textAlign="center">We have just started</HeaderMini>
						<Message />
					</SuperBox>

		</PageContainer>
	);
}, () => true)



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
				<BubbleButton px={[1]} py={[1]}  mt={[3]} 
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
				<LinkButton px={[1]} py={[1]}  mt={[3]} 
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
				<LinkButton px={[1]} py={[1]}  mt={[3]} 
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
				<BubbleButton px={[1]} py={[1]}  mt={[3]} 
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
	<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[2]} textAlign="justify" >
	As Pixly, We have just started. We work passionately to make our business your favorite film website. <br/>
	Our AI algorithm is currently in a beta phase, and we've collect several movie lists and topics to enrich your discovery experience.
	These include films that have won major awards (Grand Prize) from prestigious film festivals like cannes film festival, 
	favorite movies and  lists from some famous directors such as Quentin Tarantino and Stanley Kubrick, and various topicals such as art-house, 
	cyberpunk or based on true story movies. <br/>In addition, we have gather together the best popular movies that are up to date and the upcoming
	cinema works that we are looking forward to. We constantly try to keep our content up to date. Your intellectual support and suggestions are 
	always welcome. Please send us any questions and suggestions in the message box at the bottom of the page or email us at pixly@pixly.app
	</Text>
) 



export default MainPage;

