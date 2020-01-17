/* eslint-disable */
import React from "react";
import { useState, useContext, useMemo, useEffect, useRef } from "react";
import { withRouter, Link, Redirect, useParams } from "react-router-dom";
import {
	rgaPageView, Head, MoviePageAd, MidPageAd, 
	FeedMobileTopicPageAd, HomePageFeedAd 
} from "../../functions/analytics";
import { MOVIE } from "../../functions/query";
import { useQuery } from '@apollo/react-hooks';


import { useAuthCheck } from "../../functions/hooks";
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
	MovieRichCardBox, MovieRichCard, FlexBox, Box, HashLink, YoutubeIcon,
	HtmlContainer, SuperBox, TagBox, AbsoluteBox, CoverLink,
	SimilarMovies, MessageBox, CoverImage, Dl,Dt,Dd, Loading
} from "../../styled-components";

import { LazyLoadComponent } from 'react-lazy-load-image-component';

import "../pages.css";

const MoviePage = props => {
	//rgaPageView();
	//console.log("props", props)
	const { movie: item, viewer } = props.item;
	const { cacheUpdate } = props;
    const nodeSimilarMovies = useRef(null)
    const nodeVideoSection = useRef(null)

	//up()

	const authStatus = useAuthCheck();
	const state = useContext(GlobalContext);
	const screenSize = state.screenSize;
	const isLargeScreen = screenSize.includes("L");

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





	const listsThatInvolveText = useMemo(() => {
		if(item.appears.length > 0){
			const directornames = item.appears.map(list => list.relatedPersons[0].name).join(", ")
			const text = `${item.name} is the favorite movie of ${directornames}. You can check these great film lists that includes ${item.name}`
			return text
		}
		return null
	},[item.slug] )

	//console.log(item.appears, isFavOfDirectors)
	//console.log("page status",item.isBookmarked, item.isFaved, item.viewerRating)
	//console.log(item.seoShortDescription)
    const hasTwitter = useMemo(() => (item.twitter && item.twitter.length > 5) ? true : false,[])
    const SummaryElement = useMemo(() => hasTwitter 
        ? () => <MovieSummaryWithTwitter item={item}/> 
        : () =>  <MovieSummary name={item.name} summary={item.summary} />, [hasTwitter])
 


	const isMobile = window.innerWidth < 480;

	// TOPIC SECTION TEXTS

	const mappedTopicNames = item.topics.map(t => t.shortName).join(", ")
	const messageBoxTopicHeader = `Topic Movie ${item.topics.length > 1 ? "Lists" : "List"}: ${mappedTopicNames}`
	const messageBoxTopicText = `This section shows the topic film collection that includes ${item.name}. ` +
				`It appears in ${item.topics.length}  topic movie ${item.topics.length > 1 ? "collections" : "collections"}. ` + 
				`You will find many great artworks of ${mappedTopicNames} films below.`


    useEffect(()=>{
        if (props.location.hash){
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
				Trailer={hasVideos && TrailerIcon}
				darken
			/>

			<FlexBox flexDirection="column" justifyContent="center" alignItems="center" mt={["30px", "30px", "18px"]}>
				<Text fontWeight="bold" fontSize={["16px", "16px", "18px"]}>How much did you like the movie?</Text>
				<RatingMutation item={item} size={50}/>
			</FlexBox>
			{/*<!-- Page Container --> */}

			{/* SUMMARY */}
			<ContentContainer zIndex={1} mt={[4]}>
				
				<SummaryElement />

				{/* OPTIONAL HTML CONTENT*/}
				{item.htmlContent && <HtmlContent movie={item} />}

				{/*<!--CAST Section--> */}
				{item.crew.length > 0 && (
					<>
					<MessageBox mb={[2]} id="movie-page-header"
						header={`${item.name} Cast & Crew`}
						text={item.crew.length > 4 ? `Here the list of director, actors and actresses of ${item.name} (${item.year}) and their character names.` : null}
					/>
					<Dl>
						<Grid columns={[3,4,4,5,5,6,8]} width={"100%"}>
							{allCrews.map((crew, i) => (
								<CrewCard crew={crew} key={i + crew.person.name} translateY/>
									))}
						</Grid>
					</Dl>
					</>
				)}

				{/*<!--TOPICS Section--> */}
				{item.topics.length > 0 && (
					<>
					<MessageBox mb={[2]} id="movie-page-topic-section"
						header={messageBoxTopicHeader}
						text={messageBoxTopicText}
					/>
					<Dl>
						<Grid columns={[1,2,2,3,3,3,4]} width={"100%"}>
							{item.topics.map((topic, i) => (
								<CoverImage  
									borderRadius={"4px"}
									boxShadow="card"
									hoverShadow="hover" translateY
									src={topic.coverPoster}
									ratio={0.55}
									link={`/topic/${topic.slug}`} follow={item.isImportantPage ? true : undefined}
									title={`${topic.shortName} Movies`}
									alt={`${topic.shortName} Movies: ${item.name}`}
									key={topic.name} 
								/>
								))}
						</Grid>
					</Dl>
					</>
				)}

				{/*<!--SIMILAR Section--> */}
				<Box width="100%" ref={nodeSimilarMovies}>
					<SimilarMovies movie={item} />

				</Box>

				{/*<!--APPEARS IN  LIST Section--> */}
				{item.appears.length > 0 && (
					<>
					<MessageBox mb={[2]} 
						header={`Film Lists`}
						text={listsThatInvolveText}
					/>
					<Grid columns={[2,3,3,4]}>
						{item.appears.map((liste, index) => (
							<Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card"  maxWidth={"200px"} key={liste.slug}>
								<Image
									src={liste.relatedPersons[0].poster} 
									borderRadius={"8px"}
									alt={liste.name + " image"}
									title={liste.name}
								/>
								<NewLink to={`/list/${liste.slug}/1`} hoverUnderline>
									<Text fontSize={["xs", "xs", "s"]} fontWeight="bold" >{liste.name}</Text>
								</NewLink>
								<NewLink to={`/person/${liste.relatedPersons[0].slug}`} hoverUnderline>
									<Text fontSize={["xs", "xs", "s"]} opacity={0.8} mt={"auto"} >{liste.relatedPersons[0].name}</Text>
								</NewLink>
							</Card>))}
					</Grid>
					</>
				)}
				{/* VIDEO */}
				{hasVideos && 
					<>
						<MessageBox mb={[2]} header={videoText} id="movie-page-video-header"/>
						<LazyLoadComponent>
							<YoutubePlayer
								videos={item.videos}
								title={item.name + " Videos"}
							/>
						</LazyLoadComponent>
					</>
				}
			</ContentContainer>
		</PageContainer>
	);
}



const HtmlContent = ({ movie }) => (
    <FlexBox flexDirection="column" mt={[3,3,4]}>
        {movie.widePoster && 
			<Image 
				src={movie.widePoster} 
				alt={movie.name + " shots"} title={movie.name + " shots"} 
				width={"100%"} height="auto" minHeight="50px" maxHeight="450px"
				my={[3]}    
			/>}
        <HtmlContainer my={[3]} html={movie.htmlContent} />
    </FlexBox>
)

const TrailerIcon = () => (
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

const MovieSummary = ({name, summary}) => (
    <>
		<HeaderText fontSize={["22px", "22px", "26px", "32px","36px"]} mt={[3]}>{name}</HeaderText>
		<Text mt={[2]} fontSize={["14px", "16px", "18px"]}>{summary}</Text>
    </>
)

const MovieSummaryWithTwitter = ({item}) => {
    const Twitter = twitter()
    return (
        <>
            <Box>
				<Twitter.Timeline name={item.name} link={item.twitter} mr={[3,3,3,4]} mb={[3,3,3,4]} />
				<HeaderText fontSize={["22px", "22px", "26px", "32px","36px"]} mt={[3]}>{item.name}</HeaderText>
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

export default withRouter(MovieQuery);

/*
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