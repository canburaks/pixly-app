/* eslint-disable */
import React from "react";
import { useState, useContext, useMemo, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { rgaPageView, Head, MoviePageAd, MidPageAd } from "../../functions/analytics";


import { useAuthCheck } from "../../functions/hooks";
import { Col } from "react-flexbox-grid";

import { YoutubePlayer } from "cbs-react-components";
import { GlobalContext } from "../../";
import { GridBox, GridItem } from "../../components/GridBox";

import CoverPanel from "../elements/CoverPanel";
import PosterPanel from "../elements/PosterPanel";


import {
	CrewCard,
	MovieSimilarBox,
	PageContainer,
	ContentContainer,
	MovieCoverBox,
	MovieCoverPanel,
	HiddenHeader,
	HeaderMini,
	Grid,
	Card,
	Image,
	ImageCard,
	HiddenSpan,
	HeaderText,Text,
	Span,
	NewLink,
	TextSection,
	MovieRichCardBox
} from "../../styled-components";

import "../pages.css";

const MoviePage = props => {
	//rgaPageView();
	const { movie: item, viewer } = props.item;
	const { cacheUpdate } = props;

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

	const directorFilter = item.crew
		.filter(c => c.job == "D")
		.map(d => Object.assign(d, { character: "Director" }));
	const actorFilter = item.crew.filter(c => c.job == "A");
	const allCrews = [...directorFilter, ...actorFilter];

	// SIMILAR MOVIES
	const similarPlaceholder = item.similars ? item.similars : [];
	//const similarCover = similarPlaceholder.filter(m => m.hasCover===true)
	//const similarNonCover = similarPlaceholder.filter(m => m.hasCover=== false)

	// CONTENT SIMILARS
	const contentSimilarPlaceholder = item.contentSimilars
		? item.contentSimilars
		: [];
	const contentSimilarCover = useMemo(
		() =>
			contentSimilarPlaceholder
				.filter(m => m.movie.hasCover === true)
				.sort((a, b) => b.commonTags.length - a.commonTags.length),
		[]
	);

	//const contentSimilarNonCover = contentSimilarPlaceholder.filter(m => m.movie.hasCover=== false)
	const setkeywords = (name, slug, year, videoNum) => {
		const keywords = [
			name,
			`similar movies of ${name}`,
			`movies like ${name}`,
			slug,
			`best movies of ${year}`
		];
		if (videoNum === 1) keywords.push(`${name} trailer`);
		else if (videoNum > 1) {
			keywords.push(`${name} trailer`);
			keywords.push(`Videos about ${name}`);
		}
		return keywords;
	};
	const keywords = useMemo(() =>
		setkeywords(item.name, item.slug, item.year, item.videos.length)
	);
	const similarnames =
		contentSimilarCover
			.slice(0, 10)
			.map(item => item.movie.name.trim())
			.join(", ") + ".";

	const invtext = `Some of the movies like '${item.name} - ${item.year}' are  ${similarnames}`;
	const vistext = `Some similar movies  of '${item.name} - ${item.year}' are  ${similarnames}`;

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
	//console.log(keywords)
	return (
		<PageContainer className={item.hasCover ? "cover-true" : "cover-false"}>
			<Head
				title={item.seoTitle}
				description={item.seoDescription}
				richdata={item.richdata}
				keywords={keywords ? keywords : item.seoKeywords}
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
			/>

			{/*<!-- Page Container --> */}

			{/* SUMMARY */}
			<ContentContainer zIndex={1} mt={[4]}>
				{item.summary && item.summary.length > 50 && (
					<>
						<HeaderText fontSize={["22px", "22px", "26px", "32px","36px"]} mt={[3]}>{item.name}</HeaderText>
						<Text mt={[2]} fontSize={["14px", "16px", "18px"]}>{item.summary}</Text>
					</>
				)}

				{/*<!--SIMILAR Section--> */}
				{similarPlaceholder.length > 0 && (
					<>
						<HeaderMini mt={[5]} fontSize={["18px", "18px", "22px", "24px","26px"]}>{`Movie Recommendations If You Like ${item.name}`}</HeaderMini>
							<Text mt={[2]} fontSize={["14px", "16px", "18px"]}>
								People who like
								<Span fontWeight="bold" opacity={1}> {item.name} </Span>
								also like and give high ratings below movies. This
								can be a good indicator that if you like '
								{item.name}' probably you will also like these
								movies. We have advanced algorithms and fine tuned
								filtering mechanisms that choose these movies
								wisely. If you have any issues please feel free to
								write us from the bottom part of the page.
							</Text>
							<Text fontSize={["14px", "16px", "18px"]}>{invtext}</Text>
						

						<MovieRichCardBox items={similarPlaceholder} />
						<hr />
					</>
				)}

				
				<MidPageAd />
				{/*<!--CONTENT SIMILAR Section--> */}
				{contentSimilarCover.length > 0 && (
					<>
						<HeaderMini mt={[5]} fontSize={["18px", "18px", "22px", "24px","26px"]}>Similar Movies like {item.name}</HeaderMini>
						<Text mt={[2]} fontSize={["14px", "16px", "18px"]}>
							Those movies have content similarities with{" "}
							<Span fontWeight="bold" opacity={1}> {item.name} </Span>. If
							you like any topic or tag under the below movies,
							you may also be interested them. You can also share
							any topic or tag to add these movies, please feel
							free to contact us. We are passionate about
							improving our recommendation mechanism. Therefore
							any feedback is welcome.
						</Text>
						<Text fontSize={["14px", "16px", "18px"]}>{vistext}</Text>
						<MovieSimilarBox items={contentSimilarCover}  />
						<hr />
					</>
				)}

				{/*<!--APPEARS IN  LIST Section--> */}
				{item.appears.length > 0 && (
					<>
					<TextSection header={"Movie Lists"} text={listsThatInvolveText} />
					<Grid columns={[2,3,3,4]}>
						{item.appears.map((liste, index) => (
							<Card width={"100%"} p={[1]}  height={"100%"} boxShadow="card"  maxWidth={"200px"}>
								<Image
									src={liste.relatedPersons[0].poster} 
									borderRadius={"8px"}
									alt={liste.name + " image"}
									title={liste.name}
								/>
								<NewLink to={`/list/${liste.name}/1`} hoverUnderline>
									<Text fontSize={["xs", "xs", "s"]} fontWeight="bold" >{liste.name}</Text>
								</NewLink>
								<NewLink to={`/person/${liste.relatedPersons[0].name}`} hoverUnderline>
									<Text fontSize={["xs", "xs", "s"]} opacity={0.8} mt={"auto"} >{liste.relatedPersons[0].name}</Text>
								</NewLink>
							</Card>))}
					</Grid>
					</>
				)}



				<MoviePageAd />
				<br/>
				{/*<!--CAST Section--> */}
				{item.crew.length > 0 && (
					<>
					<HeaderMini my={[2]} mt={[5]}>Cast & Crew</HeaderMini>
					<Grid columns={[3,4,4,5,5,6,8]} width={"100%"}>
						{allCrews.map((crew, i) => (
							<CrewCard crew={crew} key={crew.person.name} />
								))}
					</Grid>
					</>
				)}
				
				<br/>

				{/* VIDEO */}
				{hasVideos && window.location.href.includes("pixly") > 0 && 
					<>
					<HeaderMini my={[2]} mt={[5]}>{item.name} Videos</HeaderMini>
					<YoutubePlayer
						videos={item.videos.reverse()}
						title={item.name + " Videos"}
					/>
					</>
				}

			</ContentContainer>
		</PageContainer>
	);
}


export default withRouter(MoviePage);

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