/* eslint-disable */
import React, { useCallback } from "react";
import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { withRouter, Link, Redirect, useParams, useLocation } from "react-router-dom";
import {
	rgaPageView, Head, MoviePageAd, MidPageAd, 
	FeedMobileTopicPageAd, HomePageFeedAd, BannerAd 
} from "../../functions/analytics";
import { MOVIE } from "../../functions/query";
import { useQuery } from '@apollo/react-hooks';


import { useAuthCheck, useValues } from "../../functions/hooks";
import { Col } from "react-flexbox-grid";
import { ScrollInto } from "../../functions";

import { YoutubePlayer } from "cbs-react-components";
import { GlobalContext } from "../../";
import { GridBox, GridItem } from "../../components/GridBox";

import CoverPanel from "../elements/CoverPanel";
import PosterPanel from "../elements/PosterPanel";
import { twitter } from "../../functions/third-party/twitter/twitter"
import { CrewCard, MovieSimilarBox, PageContainer, ContentContainer, MovieCoverBox, MovieCoverPanel,
	HiddenHeader,HeaderMini,Grid,Card,Image,ImageCard,HiddenSpan,RatingMutation,HeaderText,Text,Span,NewLink,TextSection,
	MovieRichCardBox, MovieRichCard, FlexBox, Box, HashLink, YoutubeIcon,InfoIcon,QuotationLeftIcon,
	HtmlContainer, SuperBox, TagBox, AbsoluteBox, CoverLink,CardContainer,HtmlParagraph, Button,
	SimilarMovies, MessageBox, CoverImage, Dl,Dt,Dd, Loading, SubHeaderText, Blockquote, Iframe,
	OuterLink
} from "../../styled-components";

import { ExpansionBox, SimpleDialog } from "../../styled-material"

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import "../pages.css";

const MoviePage = props => {
	//rgaPageView();
	//console.log("props", props)
	const _wwidth = window.innerWidth - 20
	const ytPlayerWidth = useValues([_wwidth, _wwidth, 420, 560, 640]) 

	const { movie: item, viewer } = props.item;
	const { cacheUpdate } = props;
	const { hash } = useLocation()
	const [openVideoSection, setVideoSection] = useState(hash.includes("movie-page-video-header"))
	const openVideoHandler = () => setVideoSection(true)
	const closeHandler = () => setVideoSection(false)

    const nodeSimilarMovies = useRef(null)
    const nodeVideoSection = useRef(null)
	
	//up()
	
	const authStatus = useAuthCheck();
	const state = useContext(GlobalContext);
	const screenSize = state.screenSize;
	const isLargeScreen = screenSize.includes("L");

	//check any collection, if not open crew panel
	const haveAnyCollection = (item.groups.length > 0 || item.topics.length > 0)
	//const [isCrewPanelOpen, setCrewPanel] = useState(!haveAnyCollection);
	//const crewPanelHandler = useCallback(() => setCrewPanel(!isCrewPanelOpen),[isCrewPanelOpen])
	//const [ pageBookmark, setPageBookmark ] = useState(item.isBookmarked)
	//const [ pageFav, setPageFav ] = useState(item.isFaved)
	//const [ pageRating, setPageRating ] = useState(item.viewerRating)

	if (viewer && viewer.points) {
		state.methods.updatePoints(viewer.points);
	}

	const hasVideos = item.videos && item.videos.length > 0 ? true : false;
	const haveTrailer = item.videoTags.includes("trailer")
	const haveNonTrailer = item.videoTags.filter(t => t !== "trailer").length > 0

	const trailerVideo = useMemo(() => {
		if (item.videos && item.videos.length > 0){
			const trs = item.videos.filter(v => v.tags.includes("trailer"))
			const trailer = [...trs, ...item.videos][0]
			trailer.link = trailer.link.replace("watch?v=", "embed/");
			trailer.width = parseInt(ytPlayerWidth)
			trailer.height = parseInt(ytPlayerWidth * 0.5625)
			return trailer
		}
		return false
	},[item.slug])

	const Trailer = React.memo(() => <Iframe 
			frameBorder="0"
			width={trailerVideo.width} height={trailerVideo.height}
			src={trailerVideo.link} 
		/>,() => item.slug === item.slug)

	const videoText = haveTrailer 
		? haveNonTrailer
			? `${item.name} (${item.year}) Trailer and Videos`
			: `${item.name} (${item.year}) Trailer`
		: `${item.name} (${item.year}) Videos`

	//console.log(item)

	const directorFilter = item.crew
		.filter(c => c.job == "D")
		.map(d => Object.assign(d, { character: "Director" }));
	const actorFilter = item.crew.filter(c => c.job == "A");
	const allCrews = [...directorFilter, ...actorFilter];

	const headerOneText = useMemo(() => item.header 
		? item.header
		: ((item.inPageGroups && item.inPageGroups.length > 0) || (item.topics && item.topics.length > 0))
			? `Similar Movies like ${item.name} (${item.year})`
			: `${item.name} (${item.year})`
	)

		
    const hasTwitter = useMemo(() => (item.twitter && item.twitter.length > 5) ? true : false,[])
    const SummaryElement = useMemo(() => hasTwitter 
        ? () => <MovieSummaryWithTwitter item={item} /> 
        : () =>  <MovieSummary name={item.name} summary={item.summary}  year={item.year} />, [hasTwitter])
 
	const HeaderOneText = (props) => (
		<HeaderText fontSize={["22px", "22px", "26px", "28px","30px"]} mt={[3]} px={[2,2,3,]} opacity={0.85} textAlign="center" uncapitalize {...props}>
			{headerOneText}
		</HeaderText>
	)

	const isMobile = window.innerWidth < 480;

	// TOPIC SECTION TEXTS
	const topicShortNames = item.topics.map(t => t.shortName)
	var mappedTopicNames = topicShortNames.length > 2 ? topicShortNames.join(", ") :topicShortNames.join(" and ")

	const messageBoxTopicHeader = `See ${mappedTopicNames} Movies`
	const messageBoxTopicText2 = `This section shows the topic film collection that includes ${item.name}. ` +
				`It appears in ${item.topics.length}  topic movie ${item.topics.length > 1 ? "collections" : "collections"}. ` + 
				`Discover ${mappedTopicNames} movies like ${item.name}.`
	const messageBoxTopicText = `"${item.name}" is also appear in below movie lists. See ${mappedTopicNames} lists of films.`
	const textSize = ["14px", "16px", "18px"]

	//const group
	const showDirectorBanner = (directorFilter.length >0 && directorFilter.length < 3)
	const showMovieGroup = item.groupItems && item.groupItems.length > 0
	const showTopics = item.topics && item.topics.length > 0
	const showAd1 = [showDirectorBanner, showMovieGroup, showTopics].filter(c => c ===true ).length >1
	
	const showVideos = item.videos && item.videos.length > 0
	const showDirectorFavourite = item.appears && item.appears.length > 0
	const showHtmlContent = item.htmlContent && item.htmlContent.length >10



    useEffect(()=>{
        if (hash){
			var hashId = props.location.hash.slice(1) 
			if (hashId === "similar-movies" && nodeSimilarMovies.current){
				nodeSimilarMovies.current.scrollIntoView({behavior: "smooth"})
			}
			else if (hashId === "movie-page-video-header" && nodeVideoSection.current){
				nodeVideoSection.current.scrollIntoView({behavior: "smooth"})
			}
			//ScrollInto()
		}
		else (window.scrollTo({left:0, top:0, behavior:"smooth"}))
	},[])
	//console.log(item)
	return (
		<PageContainer className={item.hasCover ? "cover-true" : "cover-false"}>
			<Head
				title={item.seoTitle}
				description={item.seoDescription}
				richdata={item.richdata}
				image={item.coverPoster ? item.coverPoster : item.poster}
				canonical={`https://pixly.app/movie/${item.slug}`}
			/>
			<MovieCoverPanel
				blur={20}
				mb={[3]}
				width={"100vw"}
				height={"56vw"}
				item={item}
				cacheUpdate={cacheUpdate}
				authStatus={authStatus}
				isLargeScreen={isLargeScreen}
				darken
			>
				<FlexBox>
				{item.videos.length > 0 && 
					<Button px={[2]}
						onClick={openVideoHandler} 
						width={"120px"} height={"auto"}
						color="light" fontSize={["12px", "12px"]} fontWeight="bold"  
						zIndex={18} 
						border="2px solid" borderColor="light"
						borderRadius={"6px"}
						
						bg="transparent"
						boxShadow={"card"} 
						hoverColor={"#3D33CC"} hoverBorderColor="#3D33CC"
						>
						PLAY TRAILER
					</Button>
				}
				{item.freeWatchLink &&
					<OuterLink href={item.freeWatchLink} title="You can watch the movie legally and free of charge at this address">
						<Button px={[2]}
							minWidth={"120px"} height={"auto"}
							color="light" fontSize={["12px", "12px"]} fontWeight="bold"  
							zIndex={18} 
							border="2px solid" borderColor="light"
							borderRadius={"6px"}
							
							bg="transparent"
							boxShadow={"card"} 
							hoverColor={"#3D33CC"} hoverBorderColor="#3D33CC"
							>
							FULL MOVIE LINK
						</Button>
					</OuterLink>
				}
				</FlexBox>
			</MovieCoverPanel>


			<FlexBox flexDirection="column" justifyContent="center" alignItems="center" mt={[0]} bg="rgba(0,0,0,0.95)">
				{true && <Text fontWeight="bold" fontSize={["14px", "14px", "16px"]} opacity={0.75} mt={[3]} position="relative" bottom={-16} color="light">How much did you like the movie?</Text>}
				<RatingMutation item={item} size={50}/>
			</FlexBox>
			<BannerAd />
			{/*<!-- Page Container --> */}

			<ContentContainer zIndex={1} pt={[4]}>

				<FlexBox flexDirection="column" justifyContent="center" alignItems="center" mb={[4]} >
					<HeaderOneText  mt={[3]} fontSize={["26px", "26px", "30px","34px", "38px"]}/>
					<TagBox 
						tags={item.tags.filter(tag => (tag.genreTag === true || tag.subgenreTag === true))} 
						fontSize={["12px", "12px", "14px"]} 
						color="dark"
					/>
				</FlexBox>

				{/* Quotation  */}
				{item.reviews.filter(r => r.primary === true).map(r => (
					<Blockquote key={r.text.slice(0,8)} 
						cite={r.referenceLink} 
						className="movie-blockquote"
						display="flex" flexDirection="column"
						m={0} mb={[4,4,5]}
						p={[3,3,4]}
						width="100%"
						borderRadius="6px"
						boxShadow="card"
						
					>
						<QuotationLeftIcon size="34px"  color="black" />
						<Text 
							ml={[2,2,3,4,5]} textAlign="center" pr={[2]}
							fontSize={["18px", "18px", "20px"]} 
							fontWeight="bold" 
							opacity={0.9} color="dark"
						>
							{r.text}
						</Text>
							<HtmlContainer 
								ml={[2,2,3,4,5]} 
								html={r.htmlContent}  
								mt={[3]} 
								style={{p:{fontSize:["12px","12px", "14px", "16px"], textAlign:"right", padding:"auto", color:"", fontWeight:"bold"}}} 

								width="auto"	
								selfAlign="flex-end"
							/>
					</Blockquote>
				))}

				{/* SUMMARY */}
				<SummaryElement />
				
				{/* OPTIONAL HTML CONTENT*/}
				{item.htmlContent && <HtmlContent movie={item} style={{p:{fontSize:textSize}}} />}

				{/* VIDEO */}
				{item.videos.length > 1 &&
					<Box ref={nodeVideoSection}  >
						<ExpansionBox header={videoText}>
								<LazyLoadComponent>
									<YoutubePlayer
										videos={item.videos}
										title={item.name + " Videos"}
									/>
								</LazyLoadComponent>
						</ExpansionBox>
					</Box>
				}

				{/* VISIT THE DIRECTOR'S OTHER MOVIES */}
				{showDirectorBanner &&
					directorFilter.map((d,i) => (
						<FlexBox key={"director-of-movie" + i} 
							width={"100%"} height="100px" 
							alignItems="center" 
							px={[3]} mt={[4]}
							className="other-films-of-director"
							borderRadius="6px"
							boxShadow="card"
						>
							<CoverLink link={`/person/${d.person.slug}#director-page-filmography`} 
								zIndex={0} 

							/>
							<NewLink link={`/person/${d.person.slug}`} zIndex={1}>
								<Image 
									src={d.person.poster}  
									alt={`The poster of the director of ${item.name}: ${d.person.name}`}
									title={`Visit ${d.person.name} page`}
									width={"80px"} height={"80px"} borderRadius="100%"
									boxShadow="card" 
								/>
							</NewLink>
							<NewLink follow zIndex={1}
								link={`/person/${d.person.slug}#director-page-filmography`} 
								ml={[3,3,4]}
								fontWeight="bold" 
								textAlign="center"
								fontSize={["20px", "20px", "24px", "28px"]}
								hoverUnderline opacity={0.85}
								color={"dark"}
								title={`See the other films of the director of ${item.name} (${item.year}): ${d.person.name}`}
							>
								
								Director's Other Films
							</NewLink>
						</FlexBox>
					))
				}

				{/*<!--CAST Section--> */}
				{item.crew.length > 0 && 
				<ExpansionBox id=""
					isOpen={true}
					header={`${item.name} (${item.year}) Cast & Crew`}
					text={!item.castSummary && (item.crew.length > 4 
						? `Director, Actors and Actresses of ${item.name} (${item.year})` 
						: null)
						}
				>
					<HtmlContainer html={item.castSummary} width="100%" />
					<br/>
					<Grid columns={[3,3,4,4,5,5,6]} width={"100%"}>
						{allCrews.map((crew, i) => (
							<CrewCard crew={crew} key={i + crew.person.name} translateY/>
								))}
					</Grid>
				</ExpansionBox>}

				

				{/* FILM IN-PAGE GROUPS */}
				{item.inPageGroups.map((gi, i) => <MovieGroup groupItem={gi} key={item.slug + "group-items" + i} /> )}

				{/*<!--TOPICS Section--> */}
				{item.topics.length > 0 && (
					<>
					<MessageBox mb={[2]} id="movie-page-topic-section"
						miniheader={messageBoxTopicHeader}
						text={messageBoxTopicText}
						border={"0px"}
						borderRadius={6}
						boxShadow="card"
						bg="#f1f1f1"
					>
						<Grid columns={[1,2,2,2,2,3,3,3,4]} width={"100%"} py={[3]} mt={2}>
							{item.topics.map((topic, i) => (
								<CoverImage follow={true}
									boxShadow="card" hoverShadow translateY
									src={topic.coverPoster} borderRadius={6}
									ratio={0.55}
									link={`/topic/${topic.slug}`} follow={item.isImportantPage ? true : undefined}
									title={`${topic.shortName} Movies`}
									alt={`${topic.shortName} Movies: ${item.name}`}
									key={topic.name + i} 
								/>
								))}
						</Grid>
					</MessageBox>
					</>
				)}

				{/*<!--GROUPS  Section--> */}
				{item.groups.length > 0 && (
					<CardContainer>
						<HeaderMini>The Other Film Groups</HeaderMini>
						<Text opacity={0.85}>{item.name} ({item.year}) is also in below film {item.groups.length>1 ? "groups" : "group"}. Maybe you would like to check it out?</Text>
						<Grid columns={[1,2,2,2,2,3,4]} width={"100%"} py={[3]} mt={2}>
							{item.groups.map((group, i) => (
								<CoverImage follow={true}
									boxShadow="card" hoverShadow translateY
									src={group.coverPoster} borderRadius={6}
									ratio={0.55}
									link={`/tag/${group.slug}`} follow={true}
									title={group.header}
									alt={group.header}
									key={group.slug} 
								/>
								))}
						</Grid>
					</CardContainer>
				)}
				{/*<!--LIST Section--> */}
				{item.appears.length > 0 && (
					<CardContainer>
						<SubHeaderText fontWeight="bold">Film {item.appears.length >1 ? "Lists" : "List"}</SubHeaderText>
						<Text opacity={0.85}><em>The Film {item.appears.length >1 ? "lists" : "list"}  that includes {item.name}</em></Text>
						<Grid columns={[1,2,2,2,2,3,4]} width={"100%"} py={[3]} mt={2}>
							{item.appears.map((list, i) => (
								<CoverImage
									boxShadow="card" hoverShadow translateY
									src={list.coverPoster} borderRadius={6}
									ratio={0.40}
									link={`/list/${list.slug}/1`} follow={item.isImportantPage ? true : undefined}
									title={`${list.name}`}
									alt={`${list.name}`}
									key={list.name + i} 
								/>
								))}
						</Grid>
					</CardContainer>
				)}

				<MoviePageAd />

				{/*<!--SIMILAR Section--> */}
				<Box width="100%" ref={nodeSimilarMovies}>
					<SimilarMovies movie={item} />
				</Box>



				{hasVideos && 
					<SimpleDialog
						onClose={closeHandler}
						isOpen={openVideoSection}
					>
						<Trailer />
					</SimpleDialog>}

			</ContentContainer>
		</PageContainer>
	);
}


const MovieGroup = ({groupItem}) => (
	<CardContainer>
		<SubHeaderText opacity={0.95} fontWeight="bold">{groupItem.group.header}</SubHeaderText>
		<HtmlParagraph html={groupItem.htmlContent} opacity={0.95}/>
		<Grid columns={groupItem.group.posterType==="p" ?[2,3,4,4,5,6] : [1,2,2,3,3,4]} width={"100%"} py={[3]} mt={2}>
			{groupItem.group.items.map(item => (
					<FlexBox width={"100%"} height="auto" key={item.movie.slug}>
						<CoverImage follow={true}
							key={`${item.movie.slug} + "group-i"`} 
							title={`${item.movie.name} (${item.movie.year})`}
							src={item.poster} borderRadius="6px"
							boxShadow="card" hoverShadow translateY
							link={`/movie/${item.movie.slug}`} 
							ratio={groupItem.group.posterType==="p" ? 1.5 : 0.6} 
						/>
						<Text 
							position="absolute" left={"8px"} bottom={"4px"}
							color="light" fontSize="10px" fontWeight="bold"
						>{item.movie.name}
						</Text>
					</FlexBox>
			))}
		</Grid>
	</CardContainer>
)

const HtmlContent = ({ movie, ...props }) => (
	<CardContainer>
        {movie.widePoster && 
			<Image 
				src={movie.widePoster} 
				alt={movie.name + " shots"} title={movie.name + " shots"} 
				width={"100%"} height="auto" minHeight="50px" maxHeight="450px"
				my={[3]}    
			/>}
		<FlexBox alignItems="center">
			<InfoIcon opacity={0.85} mt={"8px"} />
			<HeaderMini 
				opacity={0.8} 
				fontWeight="bold" 
				pt={0} 
				ml={[2]}
			>
				{movie.name.trim()} Wiki
			</HeaderMini>
		</FlexBox>
        <HtmlContainer my={[3]} html={movie.htmlContent} {...props}/>
	</CardContainer>
)



const MovieSummary = ({name, header, summary, year}) => (
    <CardContainer>
		<SubHeaderText opacity={0.8} fontWeight="bold">Synopsis</SubHeaderText>
		<Text mt={[2]} fontSize={["14px", "16px", "18px"]} opacity={0.85}>{summary}</Text>
    </CardContainer>
)

const MovieSummaryWithTwitter = ({item, header}) => {
	const Twitter = twitter()
    return (
        <>
            <Box boxShadow="card" bg="#f1f1f1" p={[3]} mt={[3]} px={[3]} borderRadius={6}>
				<Twitter.Timeline name={item.name} link={item.twitter} mr={[3,3,3,4]} mb={[3,3,3,4]} />
				<SubHeaderText opacity={0.8} fontWeight="bold">Synopsis</SubHeaderText>
				<br/>
				{item.summary}
            </Box>
        </>

)}

const MovieQuery = (props) => {
	const { slug } = props
	const { loading, error, data, client, refetch } = useQuery(MOVIE, { variables:{slug:slug}, partialRefetch:true})
	const movieCacheUpdate = (newData) => {
        const oldData = client.readQuery({ query: MOVIE, variables:{slug:slug} });
        const newMovieData = {...oldData.movie, ...newData}
        oldData.movie = newMovieData;
        client.writeQuery({ query: MOVIE, variables:{slug:queryVariables.slug}, data: oldData});
        return null
	}
	//console.log(data)
    if (loading) return <Loading />
    if (error) return <Error>{console.log("error",error.message)}</Error>
    if (data) {
        return <MoviePage item={data} viewer={data.viewer} cacheUpdate={movieCacheUpdate} {...props}/>
    }
}

const TrailerIcon = ({onClick}) => (
	<Box 
		display="flex"
		title={"See Trailer"}
		position="absolute"
		left={"45%"}
		width={"10%"}
		top={"45%"}
		height={"45%"}
		onClick={onClick}
	>
		<YoutubeIcon size={[40,40,50,60]} hoverScale />
	</Box>
)

export default withRouter(MovieQuery);


/*

const TrailerIcon0 = () => (
	<HashLink 
		display="flex"
		to={`#movie-page-video-header`}
		title={"See Video Section"}
		position="absolute"
		left={"45%"}
		width={"10%"}
		top={"45%"}
		height={"45%"}
	>
		<YoutubeIcon size={[40,40,50,60]} hoverScale boxShadow={"0 1px 1px 1px rgba(0,0,0, 0.35)"}/>
	</HashLink>
)

const TopPanel = React.memo(({ item, authStatus, screenSize }) =>
	item.hasCover ? (
		<CoverPanel
			item={item}
			status={authStatus}
			screen={screenSize}
			fav
			bookmark
			rating
		/>
	) : (
		<PosterPanel
			item={item}
			status={authStatus}
			screen={screenSize}
			fav
			bookmark
			rating
		/>
	)
);

*/