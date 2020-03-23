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
	useWindowWidth,
	useValues, useHover,
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
	TriangeClip, SinusWave, Ul, Li
	
} from "../styled-components";
import {ActionsIcon, CollectionsIcon, RecommendationIcon, SearchIcon, PeopleIcon, RateIcon, SimilarFinderIcon} from "./icons"
import { MailIcon, StarIcon, LightningIcon, MrsIcon,ListIcon, SrIcon, BmIcon, FinderIcon} from "./assets/index"

import "./MainPage.css";
import "./dist/css/style.css"
import "./assets/style.css"


const MainPage = (props) => {
	//rgaPageView()
	//console.log("main-page props: ",props)
	const authStatus = useAuthCheck();
	const windowWidth = useWindowWidth()

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
	//console.log("main",windowWidth)
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
	
	var simulateClick = function () {
		//console.log("elem", elem)
		if (window.location.href.includes("pixly.app") || true){
			console.log("asd")
			try {
				setTimeout(function(){
					var elem = document.getElementById("sumo-form")
					elem.click()
					}, 5000);
				} catch(e){
					console.log("sumo err")
			}
		}
	};

	const enableSumoForm = () => {
		setTimeout(function(){
			var elem = document.getElementById("sumo-form")
			if (elem) elem.click()
		},10000)
		
	}

	useEffect(()=>{
		document.addEventListener('DOMContentLoaded', enableSumoForm)
		return () => document.removeEventListener("DOMContentLoaded", enableSumoForm)
	},[window.location.href])

	return (
    <>
        <Head
            description={
                "Discover good movies and lists of films. Get movie recommendations based on you like. " + 
                "See directors' list, movie's cast, simiar movie finder. " + 
				"Cyberpunk, gangster, biography... movies"
            }
            title={
                "Pixly - Movie Recommendations & Find Similar Movies & Lists of Films"
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
			
	        {window.location.href.includes("pixly.app") &&
				<script async>
				{`(function(s,u,m,o,j,v){j=u.createElement(m);v=u.getElementsByTagName(m)[0];j.async=1;j.src=o;j.dataset.sumoSiteId='a1a48287ffc6dcad869b7bb151d8241fc424f1f09c9d47658d236795a9bd8e8f';v.parentNode.insertBefore(j,v)})(window,document,'script','//load.sumo.com/');`}
				</script>
			}

        </Head>

        <PageContainer bg="#E5E5E5">
			
			{/* HERO*/}
			<FlexBox
				flexDirection="column" minHeight={[ "400px", "400px", "500px"]}
				alignItems="center" justifyContent="center" boxSizing="border-box"
				zIndex={9}  boxSizing="border-box"
				px={[2,2,3,4]} 
				height={"100%"} overflow="hidden"
				position="relative"
			>
				<CoverImage ratio={0.56} src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/lalaland-dark.jpg"} 
					position="absolute"  className="hero-image"
					top={0} left={0} right={0} 
					width={["100vw"]} zIndex={0}
					alt={"Pixly AI Movie Recommendation"} minHeight={[ "410px", "410px", "500px"]}
				/>
				<Box 
					position="absolute" bg={"rgba(0,0,0,0.4)"}
					top={0} left={0} right={0} 
					width={["100vw"]} zIndex={0}
					alt={"Pixly AI Movie Recommendation"} minHeight={[ "410px", "410px", "500px"]}
				/>

				<HeaderText 
					mt={["50px", "50px", 4,5]} mb={[4]}
					fontSize={["28px","28px","34px", "40px", "44px"]} 
					textAlign="center"
					uncapitalize 
					textShadow="-1px 1px 2px rgba(40, 40, 40, 0.8)" 
					zIndex={8} 
					opacity={1}
					color="light"
					maxWidth={"600px"}
				>
					Discover Best Movies <br/>
					That Fit Your Cinema Taste
				</HeaderText>
				<Text mt={[2]} zIndex={8} 
					mb={[3,3,4]} px={[3,3,4]} textAlign="center"
					fontSize={["14px", "14px", "16px", "16px", "18px"]}  
					color="light" maxWidth={"900px"}
					textShadow="-1px 1px 1px rgba(40, 40, 40, 0.8)"
				>
					{heroSubheaderText}
				</Text>
				{!authStatus && 
					<Button px={[2]} mx={[4]} my={[3]}
						onClick={setModalOpen} 
						width={"200px"} height={"50px"}
						color="light" fontSize={["18px"]} fontWeight="bold"  
						zIndex={18} 
						border="3px solid" borderColor="light"
						borderRadius={"6px"}
						
						bg="transparent"
						boxShadow={"card"} 
						hoverColor={"#f42c04"} hoverBorderColor="#f42c04"
						hoverScale={1.01}
						>
						JOIN
					</Button>}
			</FlexBox>


			<ContentContainer boxSizing="border-box" bg="#E5E5E5" my={[4]}  px={"5vw", "5vw", "5vw", "8vw"}>

				{/* PERSONAL RECOMMENDATIONS */}
				<FlexBox flexDirection="column" width="100%" 
					justifyContent="center" 
					alignItems="center" 
					alignSelf="center" boxShadow="blurry"
					my={[3]} p={[3,3,4]}
				>
					<SubHeaderText fontSize={["22px", "22px", "28px"]} 
						fontWeight="bold" alignItems="center" 
						textAlign="center" width="100%"
						my={2}
					>
						Personal Movie Recommendations
					</SubHeaderText>

					<Text fontSize={["14px"]} fontSize="bold" opacity={0.8} textAlign="center" pb={[4]}>
						We will recommend you good movies considering your taste. 
						In order to get personal movie recommendations, 
						join us by creating an account. 
						After you rate 40 movies, give us some time to analyze. 
						Then, Our AI-assisted algorithms will find and recommend good movies weekly.
					</Text>
					<HeaderMini fontSize={["22px", "22px"]} opacity={0.8} mt={[4]} position="relative" bottom={"-8px"}>How to get personalized recommendations?</HeaderMini>
					<Ul width="100%"  position="relative" ml={0}
						className="svg-progressbar" display="flex" 
						flexDirection={["column", "column","column", "row"]} 
						alignItems={["center", "center","center", "flex-start"]}
						justifyContent="flex-start"
					>
						<Hr 
							className="green-arrow" boxShadow="0 4px 4px rgba(0,0,0,0.25)" 
							position="absolute" 
							top={"34px"} left={"15%"} width={"65%"} 
							zIndex={0}  m={0} 
							display={["none", "none", "none","flex"]}
						/>

						<Li display="flex" flexDirection="column" alignItems="center" width={["90%", "85%", "80%", "32%"]} zIndex={1} mt={[5,5,5,1]} >
							<MailIcon />
							<Text mt={[1]} fontWeight="bold" textAlign="center" fontSize={["16px"]}  mt={[2,2,2,4]}>JOIN US</Text>
							<Text pr={[2]} textAlign="self" fontSize={["14px", "14px"]}>You can use our services effectively by creating an account. <strong className="anchor-color" onClick={setModalOpen}>It's free.</strong> </Text>
						</Li>
						<Li display="flex" flexDirection="column" alignItems="center" width={["90%", "85%", "80%", "32%"]} zIndex={1} mt={[5,5,5,1]} >
							<StarIcon />
							<Text mt={[1]} fontWeight="bold" textAlign="center" fontSize={["16px"]} mt={[2,2,2,4]}>SCORE MOVIES</Text>
							<Text pr={[2]} textAlign="self" fontSize={["14px", "14px"]}>Rate at least 40 movies so we can recognize your cinema taste. After than, give us some time to analyze.</Text>
						</Li>
						<Li display="flex" flexDirection="column" alignItems="center" width={["90%", "85%", "80%", "32%"]} zIndex={1} mt={[5,5,5,1]} >
							<LightningIcon />
							<Text mt={[1]} fontWeight="bold" textAlign="center" fontSize={["16px"]} mt={[2,2,2,4]}>GET RECOMMENDATIONS</Text>
							<Text pr={[2]} textAlign="self" fontSize={["14px", "14px"]}>We will find the movies you like based on your ratings with AI-boosted technologies and recommend them to you weekly.</Text>
						</Li>
					</Ul>
				</FlexBox>



	
			{/* FEATURES */}
				<Grid columns={[1,1,1,2,2,2,2,2,4]} py={[4]} mt={3}>
					<CardContainer p={[3,3,4]} alignItems="center" bg="transparent"  zIndex={1} boxShadow="blurry">
						<FlexBox>
							<MrsIcon />
							<FlexBox width={"100%"} flexDirection="column" pl={[2]}>
								<SubHeaderText 
									fontSize={["16px", "16px", "16px", "18px"]} 
									fontWeight="bold" alignItems="center" pb={[2]} textAlign="center"
								>
									Movie Recommendations
								</SubHeaderText>
								<Text fontSize={["14px", "14px","14px", "16px"]}>
									After you rate 40 movies, give us some time to analyze. 
									Then, Our AI-assisted algorithms will find and make <strong><em>very personal movie recommendations</em></strong>.
								</Text>
								{!authStatus && 
									<Button px={[2]} mx={[0]} my={[3]}
										zIndex={18} 
										onClick={setModalOpen} 

										width={"200px"} height={"35px"}
										color="light" fontSize={["14px"]} fontWeight="bold"  
										border="3px solid" borderColor="#1eaa6e"
										borderRadius={"6px"} hoverScale={1.001}
										bg="#1eaa6e" boxShadow={"card"} 
										
									>
										Create Account
									</Button>
									}
							</FlexBox>
						</FlexBox>
					</CardContainer>

					<CardContainer p={[3,3,4]} alignItems="center" bg="transparent"  zIndex={1} boxShadow="blurry">
						<FlexBox height="100%">
							<FinderIcon />
							<FlexBox width={"100%"} flexDirection="column" pl={[2]} height="100%">
								<SubHeaderText 
									fontSize={["18px"]} 
									fontWeight="bold" alignItems="center" pb={[2]} textAlign="center"
								>
									Similar Movie Finder
								</SubHeaderText>
								<Text fontSize={["14px", "14px","14px", "16px"]}>
									Discover movies that are similar to your favorite movies, both algorithmically and contextually.
								</Text>
								<FlexBox justifyContent="center" alignItems="center"
									width={"200px"} height={"35px"} mt={[4]}
									border="3px solid" borderColor="rgba(61, 51, 204, 0.8)"
									borderRadius={"6px"}
									bg="transparent" boxShadow={"card"} 
									hoverColor={"#f42c04"} hoverBorderColor="#f42c04"
									hoverScale={1.001}
								>
									<NewLink to="/similar-movie-finder" className="valign-middle"
											color="rgba(61, 51, 204, 0.8)" fontSize={["14px"]} fontWeight="bold"  
											textAlign="center" width="100%"
									>
										Find Similar Movies
									</NewLink>
								</FlexBox>
							</FlexBox>
						</FlexBox>
					</CardContainer>

					<CardContainer p={[3,3,4]} alignItems="center" bg="transparent"  zIndex={1} boxShadow="blurry">
						<FlexBox>
							<SrIcon />
							<FlexBox width={"100%"} flexDirection="column" pl={[2]}>
								<SubHeaderText 
									fontSize={["18px"]} 
									fontWeight="bold" alignItems="center" pb={[2]} textAlign="center"
								>
									Advance Film Search
								</SubHeaderText>
								<Text fontSize={["14px", "14px","14px", "16px"]}>
									You can search movies within your favourite genre or subgenre and filter them with IMDb rating or release year.
								</Text>
								<FlexBox justifyContent="center" alignItems="center"
									width={"200px"} height={"35px"} my={[3]}
									border="3px solid" borderColor="rgba(61, 51, 204, 0.8)"
									borderRadius={"6px"}
									bg="transparent" boxShadow={"card"} 
									hoverColor={"#f42c04"} hoverBorderColor="#f42c04"
									hoverScale={1.001}
								>
									<NewLink to="/advance-search" className="valign-middle"
											color="rgba(61, 51, 204, 0.8)" fontSize={["14px"]} fontWeight="bold"  
											textAlign="center" width="100%"
									>
										Search Films
									</NewLink>
								</FlexBox>
							</FlexBox>
						</FlexBox>
					</CardContainer>

					<CardContainer  p={[3,3,4]} alignItems="center" bg="transparent"  zIndex={1} boxShadow="blurry">
						<FlexBox>
							<BmIcon />
							<FlexBox width={"100%"} flexDirection="column" pl={[2]}>
								<SubHeaderText 
									fontSize={["18px"]} 
									fontWeight="bold" alignItems="center" pb={[2]} textAlign="center"
								>
									Personal Cinema History
								</SubHeaderText>
								<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px","14px", "16px"]}>
									Besides recommendations, Pixly is a movie rating website. Keep and track your favorite films and watchlist in one platform.
								</Text>
								{!authStatus && 
									<Button px={[2]} mx={[0]} my={[3]}
										zIndex={18} hoverScale={1.001}
										onClick={setModalOpen} 

										width={"200px"} height={"35px"}
										color="rgba(61, 51, 204, 0.8)" fontSize={["14px"]} fontWeight="bold"  
										border="3px solid" borderColor="rgba(61, 51, 204, 0.8)"
										borderRadius={"6px"}
										bg="transparent" boxShadow={"card"} 
										hoverColor={"#f42c04"} hoverBorderColor="#f42c04"
									>
										Join Us
									</Button>
									}
							</FlexBox>
						</FlexBox>
					</CardContainer>
				</Grid>

			
				<CardContainer  p={[4]}  width={"100%"} mb={[5]} bg="transparent" boxShadow="blurry">
					<FlexBox>
						<ListIcon />
						<FlexBox width={"100%"} flexDirection="column" pl={[2]}>
							<SubHeaderText
								fontSize={["18px"]} fontWeight="bold" 
								alignItems="center" pb={[2]} textAlign="center"
							>
								Curated Lists of Films
							</SubHeaderText>
							<Text fontSize={["14px", "14px","14px", "16px"]}>
								We are passionately expanding our movie lists. Besides categorical film lists, 
								we have many collected popular collections. <NewLink underline to="/lists-of-films">See other movie lists</NewLink>
							</Text>
							<FlexBox justifyContent="center" alignItems="center"
								width={"200px"} height={"35px"} my={[3]}
								border="3px solid" borderColor="rgba(61, 51, 204, 0.8)"
								borderRadius={"6px"}
								bg="transparent" boxShadow={"card"} 
								hoverColor={"#f42c04"} hoverBorderColor="#f42c04"
								hoverScale={1.001}
							>
								<NewLink to="/lists-of-films" className="valign-middle"
										color="rgba(61, 51, 204, 0.8)" fontSize={["14px"]} fontWeight="bold"  
										textAlign="center" width="100%"
								>
									Visit Movie Lists
								</NewLink>
							</FlexBox>
						</FlexBox>
					</FlexBox>

					<Grid columns={[2,2,4]} py={[2]} gridColumnGap={[2]} mt={[3]}>
						{[{name:"Cyberpunk", slug:"cyberpunk", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/5/cover/cyberpunk-2.jpg"},
							{name:"Outbreak", slug:"outbreak-movies", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/30/cover/virus.jpg"},
							{name:"Mystery", slug:"mystery", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/19/cover/mystery-3.jpg"},
							{name:"Rom-Com", slug:"romantic-comedy", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/24/cover/romantic-comedy-movies.jpg"},
							{name:"Biography", slug:"historical-figures", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/17/cover/historical-figures-2.jpg"},
							{name:"Thought Provoking", slug:"thought-provoking", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/10/cover/thought-provoking-3.jpg"},
							//{name:"Anorexia and Bulimia", slug:"eating-disorder-movies", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/31/cover/card.jpg"},
							{name:"Gangster", slug:"gangster-films", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/22/cover/best-gangster-movies.jpg"},
							{name:"BDSM", slug:"bdsm-movies", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/27/cover/bdsm.jpg"},

						].map( item => (
							<CoverImage 
								src={item.coverPoster} key={"rec" + item.slug}  
								ratio={0.6} hoverShadow="hover" borderRadius="8px"
								boxShadow="card"
								link={`/topic/${item.slug}`} 
								alt={`${item.name} Movies.`} 
								title={`Popular Topic Film Collection: ${item.name} Movies.`} 
							/>
						))}
					</Grid>

				</CardContainer>
			</ContentContainer>

			{true && <SuperBox  
				display="flex" flexDirection="column" alignItems="center"
				width={"100%"} mx={"0px"} py={[5]} px={["5vw", "5vw", "5vw", "8vw"]} 
				gradient="blueish" 
			>
				<MessageFromPixly />
			</SuperBox>}
			<SignupFormModal isOpen={isModalOpen} closeModal={closeModal}  />
			<a data-sumome-listbuilder-id="7d4ae060-1439-43a2-ad77-f45a30d154d7" className="hidden" id="sumo-form">Click Here</a>

        </PageContainer>
    </>
    );
}

const PersonalRecommendations = ({ screenSize }) => {
	const isSmallScreen = screenSize.includes("S")
	const poster = isSmallScreen
			? "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/personal-rec-steps-vertical.png"
			: "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/personal-rec-steps.png"

	return (
	<FlexBox justifyContent="center" alignItems="center">
		<Image 
			src={poster}
			alt="Join us and get personalized movie recommendations"
			title="Join us and get personalized movie recommendations"
			width="100%" maxWidth={"900px"}
			height="auto"
		/>
	</FlexBox>
)}

const FeatureContainer = ({header, text, gradientClass}) => {
const [hoverRef, isHovered] = useHover();
return (
	<CardContainer p={[4]} alignItems="center" bg={!isHovered && "#ffffff"} zIndex={1}>
		<SubHeaderText 
			fontSize={["16px", "16px", "16px", "18px"]} 
			fontWeight="bold" alignItems="center" pb={[2]} 
			textAlign="center"
		>
			{header}
		</SubHeaderText>
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px","14px", "16px"]}>
			{text}
		</Text>
	</CardContainer>

	)
}


const ExploreSection = ({ isSmallScreen }) => (
<Section 
	display="flex" flexDirection="column" alignItems="center" 
	position="relative"
	borderRadius={"18px"}
	
	width={"100%"}
>
		<Text fontWeight="bold" 
			color="dark" 
			my={[3]}
			textAlign="center" 
			fontSize={["22px","22px","28px", "30px"]} 
			>
			Let Me Discover First
		</Text>
	<FlexBox justifyContent="center" alignItems="center" >
		<Grid columns={[2]} py={[1]} gridColumnGap={[2,2,2,3]} width="100%" height="auto" px={[2,2,4,5,6]} >
			<LinkButton px={[3,3,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/popular-and-upcoming-movies" textAlign="center"
				bg="rgba(0,0,0,0.1)" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Popular Movies
			</LinkButton>
			<LinkButton px={[3,3,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/lists-of-films" textAlign="center"
				bg="rgba(0,0,0,0.1)" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Lists of Films
			</LinkButton>
			<LinkButton px={[2,2,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/similar-movie-finder" textAlign="center"
				bg="rgba(0,0,0,0.1)" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "14px", "14px"]}
			>
				Similar Movie Finder
			</LinkButton>
			<LinkButton px={[3,3,4]} m={[2]} translateY hoverBg="rgba(0,0,0,0.4)"
				link="/advance-search" textAlign="center"
				bg="rgba(0,0,0,0.1)" borderRadius="4px" 
				height={"50px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="card" fontSize={["12px", "12px", "14px"]}
			>
				Advance Search
			</LinkButton>

		</Grid>
	</FlexBox>
</Section>
)

const FeatureCard = ({ color, ...props}) => (
	<CardContainer width="100%" maxWidth="100%" height="auto" minHeight="250px" flexDirection="column" alignItems="center" 
		px={[3,3,3,4]} overflow="hidden" pt={[3]} boxShadow="card" borderRadius="6px"
	>
		<FlexBox 
			flexDirection="column"  
			position="relative" top={0} bottom={0} left={0} right={0} minHeight={"360px"}
			maxWidth="100%" zIndex={5} 
			justifyContent="flex-start" alignItems="center" 
			overflow="hidden"
		>
			<SubHeaderText my={[2,2,3]}
				fontSize={["18px", "18px", "20px", "22px"]}
				width={"auto"} textAlign="center"
				fontWeight="bold"
			>
				{props.header}
			</SubHeaderText>
			{props.text && <Text textAlign="justify" fontSize={["14px"]} textAlign="center">
				{props.text}
			</Text>}
			{props.children}
		</FlexBox>
	</CardContainer>
)
const FeatureCard0 = ({ color, ...props}) => (
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
		text={"After you rate 40 movies, give us some time to analyze. Then, Our AI-assisted algorithms will find and recommend good movies weekly."}
	>
		{!authStatus && 
			<Button px={[2]} mx={[4]} my={[2]}
				onClick={onClick} 
				width={"200px"} height={"40px"}
				color="light"  zIndex={8} 
				
				gradient="pinkish"
				boxShadow={"card"} 
				fontWeight="bold"
				hoverScale={1.1}
			>
				Join Us
			</Button>
		}
	</FeatureCard>
)
const SimilarMoviesFeature = ({color="yesil",}) => (
	<FeatureCard color={color} header="Find Similar Movies" 
		text="Discover movies that are similar to your favorite movies, both algorithmically and contextually."
	>

		<LinkButton px={[3,3,4]} translateY
			link="/similar-movie-finder" textAlign="center" 
			bg="rgba(0,0,0,0.7)" color="#ffffff"
			height={"40px"} width={["90%"]} maxWidth={"300px"}
			hoverScale boxShadow="0 4px 12px 1px rgba(0,0,0, 0.15)" fontSize={["12px", "14px", "14px"]}
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
		<Box fontSize={["12px", "12px", "14px", "14px"]}  opacity={0.9}  maxWidth="100%" overflow="hidden"  display="flex" flexWrap="wrap">

			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Arthouse Movies"} link="/topic/art-house">ArtHouse</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Cyberpunk Movies"} link="/topic/cyberpunk">Cyberpunk</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Controversial Movies"} link="/topic/controversial">Controversial</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Gangster Movies"} link="/topic/gangster-films">Gangster</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Mystery Movies"} link="/topic/mystery">Mystery</NewLink>,&nbsp;
			<NewLink ml={"2px"} follow={true} underline fontWeight="bold" title={"Mystery Movies"} link="/topic/romantic-comedy">Romantic Comedy</NewLink>,&nbsp;
			<NewLink ml={"2px"} mr="4px" follow={true} underline fontWeight="bold" title={"Thought-Provoking Movies"} link="/topic/thought-provoking">Thought-Provoking</NewLink> movies etc.
		</Box>
		<LinkButton px={[3,3,4]} translateY
				textAlign="center" link="/lists-of-films" 
				bg="rgba(0,0,0,0.7)" borderColor="#ffffff"
				height={"40px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="0 4px 12px 1px rgba(0,0,0, 0.15)" fontSize={["12px", "14px", "14px"]}
			>
				See List of Films
			</LinkButton>
	</FeatureCard>
)

const SocialFeature = ({setModalOpen, color="mor-pembe",}) => (
	<FeatureCard color={color} header="Discover People and Share Movie" >
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} >
			Keep and track your personal cinema history by adding movies to watchlist, or liking them. Then You can share movies from there.
		</Text>
	</FeatureCard>
)

const AdvanceSearchFeature = ({color="kırmızı",}) => (
	<FeatureCard color={color} header="Advance Film Search" >
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} >
			You can search movies within your favourite genre or subgenre and filter them with IMDb rating or release year.
		</Text>
			<LinkButton px={[3,3,4]} translateY
				textAlign="center" link="/advance-search" 
				bg="rgba(0,0,0,0.7)" color="#ffffff"
				height={"40px"} width={["90%"]} maxWidth={"300px"} 
				hoverScale boxShadow="0 4px 12px 1px rgba(0,0,0, 0.15)" fontSize={["12px", "14px", "14px"]}
			>
				Browse Movies
			</LinkButton>
	</FeatureCard>
)



const ActionFeatures = ({setModalOpen, color="sarı"}) => (
	<CardContainer >
		<SubHeaderText>Ratings, Favorites, Watchlis</SubHeaderText>
		<Text mr={[1,1,2]} textAlign="center" fontSize={["14px", "14px", "14px", "14px"]} >
			Besides recommendations, Pixly is a movie rating website. Keep your favorite films and watch list in one platform.
		</Text>
	</CardContainer>
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





const Message = () =>(
	<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[2]} textAlign="justify">
	As Pixly, We have just started. We work passionately to make our business your favorite film website.
	<br/>
	Our AI algorithm is currently in a beta phase, and we've collect several lists of movies and topic collections to enrich your discovery experience.
	These include films that have won major awards (Grand Prize) from prestigious film festivals like Cannes Film Festival, 
	favorite lists of movies from the famous directors such as Quentin Tarantino and Stanley Kubrick. 
	<br/>
	Also, you will find topic list that have the best artworks of aforomentioned category such as art-house films, 
	cyberpunk movies, films that are based on true stories or video games.
	<br/>
	In addition, we have gather together the best popular movies that are up to date and the upcoming
	cinema works that we are looking forward to. We constantly try to keep our content up to date. Your intellectual support and suggestions are 
	always welcome. Please send us any questions and suggestions in the message box at the bottom of the page or email us at <em>pixly@pixly.app</em>
	</Text>
) 

const MessageFromPixly = () => (
	<FlexBox flexDirection="column" px={["5vw", "5vw", "8vw", "10vw"]} alignItems="center">
		<SubHeaderText 
			fontSize={["24px", "28px"]} 
			fontWeight="bold" 
			opacity={0.85} color={"light"}
			textAlign="center" my={[3]}
		>
			Pixly, Movie Recommendations, and List of Films 
		</SubHeaderText>
		<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[3]}>
			When making movie suggestions, it is essential to consider the art of cinema, the cinema industry and the complex human nature of the audience. Since we consider these, we want to offer you multiple services reasonably. 
		</Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[3]}>Our AI-assisted algorithmic movie recommendation engine is currently in a beta phase. Besides, content-like movie recommendation services show contentful similars to movies that you choose.  </Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[3]}>We are curating movie lists including the best examples of various genres and categories like Mystery, Gangster, Romantic Comedy, Cyberpunk etc...</Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[3]}>We are also collecting popular film lists around the world, such as the grand prize winner movies of film festivals, director’s favourite movies and other popular list of films.</Text>
		<Text fontSize={["14px", "14px", "16px", "18px"]} color={"light"} mt={[3]}>We constantly try to keep our content up to date. Your intellectual support and suggestions are always welcome. Please send us questions and suggestions via pixly[et]pixly.app</Text>

	</FlexBox>
)

export default MainPage;



const Features = ({ setModalOpen }) => {
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
					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<FeatureAuthPopup 
							actionOne={setModalOpen} 
							text={"Personal Movie Recommendations"} 
							popupText="In order to get personalized recommendations please login."
						/>
						<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>
							{"We will analyze " + 
							"your cinema taste with our AI-Based film recommendation engine after you rated 40 movies. " +
							"After then, we will make very personalized movie " +
							"recommendations based on movies you like."}
						</Text>
					</FlexBox>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<SearchIcon />
					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<SubHeaderText mr={[1,1,2]}
							fontSize={["14px", "14px", "14px", "16px"]}
							width={"auto"}
							fontWeight="bold"
						>
							<NewLink underline link="/advance-search">Advance Film Search
								<LinkIcon size={16} position="relative" bottom={-6} hoverScale/>
							</NewLink>
						</SubHeaderText>
						<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>
							You can search movies within your favourite genre or subgenre&nbsp;
							and filter them with IMDb rating or release year.
						</Text>
					</FlexBox>
				</FlexBox>



				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<RateIcon />
					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<FeatureAuthPopup 
							actionOne={setModalOpen} 
							text={"Movie Rating Website"} 
							popupText="Create a profile then start to rate films according to your taste."
						/>
						<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>
						{"You can rate any movie in order to get good film recommendations or " + 
							" reflect your opinion about this movie. It can also be your public opinion. "}
						</Text>
					</FlexBox>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<SimilarFinderIcon />
					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<SubHeaderText mr={[1,1,2]}
							fontSize={["14px", "14px", "14px", "16px"]}
							width={"auto"}
							fontWeight="bold"
						>
							<NewLink link="/similar-movie-finder" follow={true} >Find Similar Movies
								<LinkIcon size={16} position="relative" bottom={-6} hoverScale/>
							</NewLink>
						</SubHeaderText>
						<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>
							Let search your movies you like and discover movies that have similar genre, tag, or theme with our 
							<em> similar movie finder</em>.
							Besides, You may also find film recommendations like your favourite film which are suggested by our AI-assisted recommendation engine. 
						</Text>
					</FlexBox>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<ActionsIcon />
					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<FeatureAuthPopup 
							actionOne={setModalOpen} 
							text={"Watch List and Likes"} 
							popupText="You can save your favourite films, and add movies to your watch list that is not watched yet."
						/>
						<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>
						{"Keep and track your personal cinema history " + 
							"by adding movies to watchlist, or liking them. Then You can share movies from there."}
						</Text>
					</FlexBox>
				</FlexBox>


				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<CollectionsIcon />

					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<SubHeaderText mr={[1,1,2]}
							fontSize={["14px", "14px", "14px", "16px"]}
							width={"auto"}
							fontWeight="bold"
						>
							<NewLink underline link="/lists-of-films" follow={true} color="light">Curated and Collected Lists Of Films
								<LinkIcon size={16} position="relative" bottom={-6} hoverScale/>
							</NewLink>
						</SubHeaderText>
						<Text mr={[1,1,2]}  fontSize={["14px", "14px", "14px", "14px"]} color="light" opacity={0.9}>
							We are also collecting and curating lists of movies that fit your mood or cinema taste such as the favourite list of films of the famous
							directors, the grand prize winner movies of the prestigious film festivals. Also, there are
							topic lists that include the best artworks of its category such as&nbsp;
							<NewLink ml={[1]} follow={true} underline fontWeight="bold" title={"Arthouse Movies"} link="/topic/art-house">Arthouse</NewLink>,&nbsp;
							<NewLink ml={[1]} follow={true} underline fontWeight="bold" title={"Cyberpunk Movies"} link="/topic/cyberpunk">Cyberpunk</NewLink>,&nbsp;
							<NewLink ml={[1]} follow={true} underline fontWeight="bold" title={"Controversial Movies"} link="/topic/controversial">Controversial</NewLink>,&nbsp;
							<NewLink ml={[1]} follow={true} underline fontWeight="bold" title={"Gangster Movies"} link="/topic/gangster-films">Gangster</NewLink>,&nbsp;
							<NewLink ml={[1]} follow={true} underline fontWeight="bold" title={"Mystery Movies"} link="/topic/mystery">Mystery</NewLink> and&nbsp;
							<NewLink ml={[1]} follow={true} underline fontWeight="bold" title={"Thought-Provoking Movies"} link="/topic/thought-provoking">Thought-Provoking</NewLink> movies etc.
						</Text>
					</FlexBox>
				</FlexBox>

				<FlexBox mt={[4]} maxWidth={maxWidth}>
					<PeopleIcon />
					<FlexBox flexDirection="column" px={[1,1,2,3]} maxWidth={600}>
						<FeatureAuthPopup 
							actionOne={setModalOpen} 
							text={"Discover People and Share Movie"} 
							popupText="Create a profile to see other users. After then, you can discover people and compare your cinema taste with them"
						/>
						<Text mr={[1,1,2]} textAlign="justify" fontSize={["14px", "14px", "14px", "14px"]}>
						{"Keep and track your personal cinema history " + 
							"by adding movies to watchlist, or liking them. Then You can share movies from there."}
						</Text>
					</FlexBox>
				</FlexBox>
			<SubHeaderText></SubHeaderText>
		</FlexBox>
	)
}
