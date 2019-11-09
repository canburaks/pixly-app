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
import {Box,Span,FlexBox,MovieCoverBox,DirectorCard,MovieCoverCard,ImageCard,Grid,
	PageContainer,ContentContainer,Loading,
	SuperBox,HiddenText,HiddenHeader,HiddenSubHeader,HeaderText,HeaderMini,Text,NewLink,
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
	const heroHeaderText = "Improve your experience in discovering movies"
	const heroSubheaderText = "Don't waste your time by browsing endless cycles. " + 
		"With our AI-based personalized recommendation systems, we are guiding you through multiple universes " + 
		"of the art of film."
	return (
		<PageContainer>
			<Head
				description={
					"Discover best movies that fit your cinema taste with our AI-based recommendations. " + 
					"Find out similars movies, curated movie lists, and film lovers."

				}
				title={
					"Pixly - AI Based Movie Recommendation App, Social Discovery, Similar Movies"
				}
				keywords={
					"discover movie, pixly movies, pixly home page, pixly cinema, pixly recommendation, movietowatch, movie suggestions, similar movies, similar movie, ai recommendation, movies like, must seen movies, best movies, awarded movies"
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
				<header className="site-header">
					<div className="container">
						<div className="site-header-inner">
							<div className="brand header-brand">
							</div>
						</div>
					</div>
				</header>

				<main>
					<section className="hero">
						<div className="container">
							<div className="hero-inner">
								<FlexBox flexDirection="column" zIndex={10} >
									<HeaderText fontSize={["40px", "40px"]} uncapitalize textShadow="-2px 2px 2px rgba(40, 40, 40, 0.6)">{heroHeaderText}</HeaderText>
									<Text my={[2,2,2,3]} fontSize={["18px", "18px"]} fontWeight="bold">{heroSubheaderText}</Text>
									
									<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
									{/*
									*/}
									
									{!authStatus && 
									<Box  my={[3]}>
										<BubbleButton px={[2]} mx={[2]}
											onClick={setModalOpen} 
											width={"120px"} height={"50px"}
											color="light" 
											borderRadius="4px" 
											link="/explore" gradient="lime"
											fontWeight="bold"
											>
											Join
										</BubbleButton>

										<Button borderRadius={"6px"}   mx={[2]}
											onClick={insertLoginForm} 
											width={"120px"} height={"50px"} 
											bg={"accent1"} color={"light"}
											fontWeight="bold"
											hoverColor={"#3437c7"}
											hoverBg={"white"}
											hoverShadow="card"
											boxShadow="xs"
										>
											Login
										</Button>
									</Box>
										}
									<FlexBox flexDirection="column" alignItems="flex-start" width="100%" mt={[3,3,3,4]}>
										{/*

										*/}
										{!authStatus  && <Fb.Auth />}
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
							</div>
						</div>
					</section>

					<section className="features section">
						<div className="container">
							<div className="features-inner section-inner has-bottom-divider">
								<div className="features-wrap">
									<Feature1 />
									<Feature2 />
									<Feature4 />
									<Feature3 />
									<Feature5 />
									<Feature6 />

								</div>
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

		</PageContainer>
	);
}, () => true)



const MiniMovies = () => <Image info="pixly main page movies collage" src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/movies.jpg"} style={{width:"100%", height:"100%", boxShadow:"-2px 2px 4px 1px rgba(40,40,40, 0.6)"}} />

const SpaceOddysey = () => <Image info="space oddysey mini image" src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/space-oddysey.png"} style={{width:"100%", height:"auto"}} />

const SkinILive = () => <Image info="the skin i live in image" src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/skin.png"} style={{width:"100%", height:"auto"}} />


const Feature1 = () => (
	<div className="feature text-center is-revealing">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-01.svg"} info="Pixly main page Feature 01" />
			</div>
			<HeaderMini>Personal Recommendations - <Span fontSize={["14px"]} fontWeight="bold">BETA</Span></HeaderMini>
			<Text>After rating 40 movies, we can analyze your cinema taste with artifical intelligence then we will make very personalized movie recommendations every week.</Text>
		</div>
	</div>
)
const Feature2 = () => (
	<div className="feature text-center is-revealing">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-02.svg"} info="Pixly main page Feature 01" />
			</div>
			<HeaderMini>Curated Collections</HeaderMini>
			<Text>Handpicked selected lists of movies by Pixly Editors, beside well known collected movie lists all around the world including favorite film lists of directors and festival awarded movies. Special lists that we call topics that find movies that treat specific topics or subjects.</Text>
		</div>
	</div>
)
const Feature3 = () => (
	<div className="feature text-center is-revealing">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-03.svg"} info="Pixly main page Feature 01" />
			</div>
			<HeaderMini>Search & Filter</HeaderMini>
			<Text>Advance Search and Filter mechanism with respect to IMDb rating and release year of movies.</Text>
		</div>
	</div>
)
const Feature4 = () => (
	<div className="feature text-center is-revealing">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-04.svg"} info="Pixly main page Feature 01" />
			</div>
			<HeaderMini>Personal Records</HeaderMini>
			<Text>Keep and track your personal cinema history by adding movies to watchlist, liking them and giving ratings. </Text>
		</div>
	</div>
)
const Feature5 = () => (
	<div className="feature text-center is-revealing">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-05.svg"} info="Pixly main page Feature 01" />
			</div>
			<HeaderMini>Social Discovery</HeaderMini>
			<Text>Find people whose cinema taste is similar to you. See which movies are currently watched by your friends, and also check your cinema taste similarity with your friends. </Text>
		</div>
	</div>
)

const Feature6 = () => (
	<div className="feature text-center is-revealing">
		<div className="feature-inner">
			<div className="feature-icon">
				<Image src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/feature-icon-06.svg"} info="Pixly main page Feature 01" />
			</div>
			<HeaderMini>Filmography & Content</HeaderMini>
			<Text>Filmographies of the directors, actors, and actress'. The favorite film lists of the famous directors that impressed them. Conversations, interviews and movie essays about directors</Text>
		</div>
	</div>
)



export default MainPage;

/*
const MainPageQuery2 = (props) =>{
    const client = useApolloClient();

    const cachedata = client.readQuery({query:MAIN_PAGE})
    const [mainPage, { loading, error, data, refetch }] = useLazyQuery(MAIN_PAGE)

    const [ pageData, setPageData ] = useState(null)

    if (pageData){
        return  <MainPage data={pageData.mainPage} />
    }
    if (pageData === null){
        if (cachedata && cachedata.mainPage){
            console.log("cache data is setting")
            setPageData(cachedata)
        }
        else if (data && data.mainPage){
            console.log("lazy query data is setting")
            setPageData(data)
        }
        
        else if (!cachedata){
            console.log("no data: querying lazily")
            mainPage()
        }
    }
*/
