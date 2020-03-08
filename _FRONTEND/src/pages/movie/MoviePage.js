/* eslint-disable */
import React, { useCallback } from "react";
import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { withRouter, Link, Redirect, useParams, useLocation } from "react-router-dom";
import {
	rgaPageView, Head, MoviePageAd, MidPageAd, 
	FeedMobileTopicPageAd, HomePageFeedAd 
} from "../../functions/analytics";
import { MOVIE } from "../../functions/query";
import { useQuery } from '@apollo/react-hooks';


import { useAuthCheck } from "../../functions/hooks";
import { Col } from "react-flexbox-grid";
import { ScrollInto, MediaNetAd } from "../../functions";

import { YoutubePlayer } from "cbs-react-components";
import { GlobalContext } from "../../";
import { GridBox, GridItem } from "../../components/GridBox";

import CoverPanel from "../elements/CoverPanel";
import PosterPanel from "../elements/PosterPanel";
import { twitter } from "../../functions/third-party/twitter/twitter"
import { CrewCard, MovieSimilarBox, PageContainer, ContentContainer, MovieCoverBox, MovieCoverPanel,
	HiddenHeader,HeaderMini,Grid,Card,Image,ImageCard,HiddenSpan,RatingMutation,HeaderText,Text,Span,NewLink,TextSection,
	MovieRichCardBox, MovieRichCard, FlexBox, Box, HashLink, YoutubeIcon,InfoIcon,QuotationLeftIcon,
	HtmlContainer, SuperBox, TagBox, AbsoluteBox, CoverLink,CardContainer,HtmlParagraph,
	SimilarMovies, MessageBox, CoverImage, Dl,Dt,Dd, Loading, SubHeaderText, Blockquote,
} from "../../styled-components";

import { ExpansionBox, SimpleDialog } from "../../styled-material"

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import "../pages.css";

const MoviePage = props => {
	//rgaPageView();
	//console.log("props", props)
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


	//console.log(directorFilter)


	//const listsThatInvolveText = useMemo(() => {
	//	if(item.appears.length > 0){
	//		const directornames = item.appears.map(list => list.relatedPersons[0].name).join(", ")
	//		const text = `${item.name} is the favorite movie of ${directornames}. You can check these great film lists that includes ${item.name}`
	//		return text
	//	}
	//	return null
	//},[item.slug] )

	//console.log(item.appears)
	//console.log("page status",item.isBookmarked, item.isFaved, item.viewerRating)
	//console.log(item.seoShortDescription)
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

	const messageBoxTopicHeader = `See Other ${mappedTopicNames} Movies`
	const messageBoxTopicText = `This section shows the topic film collection that includes ${item.name}. ` +
				`It appears in ${item.topics.length}  topic movie ${item.topics.length > 1 ? "collections" : "collections"}. ` + 
				`You will find many great artworks of ${mappedTopicNames} films below.`
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
	//console.log(item.htmlContent, item.header)
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
				Trailer={hasVideos ? () => <TrailerIcon onClick={openVideoHandler} /> : null}
				darken
			/>

			<FlexBox flexDirection="column" justifyContent="center" alignItems="center" mt={[0]} bg="rgba(0,0,0,0.95)">
				<HeaderOneText color="light" my={[3]} />
				{true && <Text fontWeight="bold" fontSize={["14px", "14px", "16px"]} opacity={0.75} mt={[2]} color="light">How much did you like the movie?</Text>}
				<RatingMutation item={item} size={50}/>
			</FlexBox>
			{/*<!-- Page Container --> */}

			<ContentContainer zIndex={1} mt={[4]}>
	            <MediaNetAd />
				{/* Quotation  */}
				{item.reviews.filter(r => r.primary === true).map(r => (
					<Blockquote key={r.text.slice(0,8)} cite={r.referenceLink} 
						opacity={0.9} 
						m={0} mb={[4,4,5]} mx={[4,4,5]}
						px={[2]} py={[2]} 
						
						borderLeft="8px solid"
						borderColor="rgba(0,0,0,0.3)"
						display="flex" flexDirection="column"
						
					>
						<QuotationLeftIcon size="34px" opacity={0.4}/>
						<Text 
							ml={[2,2,3,4,5]} textAlign="center"
							fontSize={["18px"]} 
							fontWeight="bold" 
							opacity={0.9}
						>
							{r.text}
						</Text>
							<HtmlContainer 
								ml={[2,2,3,4,5]} 
								html={r.htmlContent}  
								mt={[3]} 
								style={{p:{fontSize:["12px", "14px"], textAlign:"right", padding:"auto"}}} 

								width="auto"	
								selfAlign="flex-end"
							/>
						<FlexBox justifyContent="flex-end" width="100%" px={[3,4,4,5]}>
						</FlexBox>
					</Blockquote>
				))}

				{/* SUMMARY */}
				<SummaryElement />
				
				{/* OPTIONAL HTML CONTENT*/}
				{item.htmlContent && <HtmlContent movie={item} style={{p:{fontSize:textSize}}} />}

				{/* VIDEO */}
				{hasVideos && 
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
							color="light"
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
								width="100%"
								fontWeight="bold" 
								textAlign="center"
								fontSize={["20px", "20px", "24px", "28px"]}
								hoverUnderline
								color={"#f1f1f1"}
								title={`See the other films of the director of ${item.name} (${item.year}): ${d.person.name}`}
							>
								
								<em>See {d.person.name}</em>'s Other Films
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

				
				<MoviePageAd />

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
						<Grid columns={[1,2,2,2,2,3,4]} width={"100%"} py={[3]} mt={2}>
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
				<MidPageAd />

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

				{true && showAd1 && <HomePageFeedAd/> }

				{/*<!--SIMILAR Section--> */}
				<Box width="100%" ref={nodeSimilarMovies}>
					<SimilarMovies movie={item} />
				</Box>



				{hasVideos && 
					<SimpleDialog
						onClose={closeHandler}
						isOpen={openVideoSection}
					>
                <FlexBox minWidth="90vw" minHeight={["auto", "auto", "70vh"]} maxWidth="100%" overflowX="hidden">
					<YoutubePlayer
						videos={item.videos}
						title={item.name + " Videos"}
					/>
                </FlexBox>
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