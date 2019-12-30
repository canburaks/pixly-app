import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"
import { withRouter, Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


import { useWindowSize, useAuthCheck, useClientWidth, useClientHeight, useValues,
    
} from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    SIMILAR_FINDER, LIST_BOARD, MoviePageAd,FeedMobileTopicPageAd
} from "../../functions"

import { GlobalContext } from "../..";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, FlexBox, RegularInput, MovieAutoComplete, SuperBox, CoverLink, TagBox,
    NewLink, Image, SubHeaderText, LinkButton, HeaderMini, Span, Box, Hr, Section,MessageBox,
    PaginationBox
} from "../"
import { useNetworkStatus } from 'react-adaptive-hooks/network';




export const SimilarMovies = (props) => {
    const { movie } = props;
    const location = useLocation();

    //console.log("props", location, props)
    const state = useContext(GlobalContext);
    const speed = state.speed
    ////console.log("data",speed, similarQuantity,  data)

    return (
        <Section className="similar-movies-section" display="flex" flexDirection="column">
            <ContentSimilarSection movie={movie} speed={speed} />

            <RecommendationSection movie={movie} speed={speed} />
        </Section>
    )
}

const ContentSimilarSection = ({num=21, speed="slow"}) => {
    const { slug } = useParams();
    const [ page, setPage ] = useState(1)
    const requestQuantity = speed === "fast" ? num : 8 // if slow network request less movie


	const { loading, error, data } = useQuery(CONTENT_SIMILAR_FINDER, {variables:{
            slug:slug,
            page:page,
            num: requestQuantity
        },
		partialRefetch: true
    });

    const nextPage = useCallback(() => setPage(page + 1), [page])
    const prevPage = useCallback(() => setPage(page - 1), [page])
    //quantity is resulted element number from query
    const haveManyPages = (quantity) => (page === 1 && quantity < requestQuantity ) ? false :true

    if (error) return (
        <FlexBox minHeight={"200px"} justifyContent="center" width="100%">
            We can't show the similar movies rightnow. We are trying to fix it.
        </FlexBox>
    )
    if (loading) return <FlexBox minHeight={"200px"} justifyContent="center"  width="100%"/>
    if (data) return (
        <Section display="flex" flexDirection="column" px={[2]} width="100%" className="content-similar-movies-section">
            {data.listOfContentSimilarMovies && 
                <>
                <MessageBox 
                    header={`Similar Movies like ${data.movie.name.trim()} (${data.movie.year})`}
                    text={
                        `The movies in this part have common topics, tags or sub-genres with ${data.movie.name.trim()}. ` +
                        `These are highly similar movies to ${data.movie.name.trim()} in a manner of only the content elements. `
                    }
                />
                <Grid columns={[2,2,3,3,3,4,6]} py={[4]} px={[2]}>
                    {data.listOfContentSimilarMovies.map( item => (
                        <ContentSimilarMovieCard item={item} key={item.slug + "cs"} />
                    ))}
                </Grid>
                {haveManyPages(data.listOfContentSimilarMovies.length) && <PaginationBox 
                    currentPage={page} 
                    totalPage={data.listOfContentSimilarMovies.length >= requestQuantity ? page + 1 : page} 
                    nextPage={nextPage} prevPage={prevPage} 
                />}
                </>
            }
        </Section>
    )
}

const RecommendationSection = ({num=18, speed="slow"}) => {
    const { slug } = useParams();
    const [ page, setPage ] = useState(1)
    
    // Network sensitive settings
    const requestQuantity = speed === "fast" ? num : 8 // if slow network request less movie
    const networkSensitiveColumns = speed === "fast" ? [1,1,1,2,2,2,2,3,4] : [2,2,3,3,3,4,6]

	const { loading, error, data } = useQuery(RECOMMENDATION_FINDER, {
            variables:{slug:slug,
            page:page, 
            num:requestQuantity
        },
		partialRefetch: true
    });


    const nextPage = useCallback(() => setPage(page + 1), [page])
    const prevPage = useCallback(() => setPage(page - 1), [page])
    //quantity is resulted element number from query
    const haveManyPages = (quantity) => (page === 1 && quantity< requestQuantity ) ? false :true

    if (error) return (
        <FlexBox minHeight={"200px"} justifyContent="center" width="100%">
            We can't show the similar movies rightnow. We are trying to fix it.
        </FlexBox>
    )
    if (loading) return <FlexBox minHeight={"200px"} justifyContent="center"  width="100%"/>
    if (data) return (
        <Section display="flex" flexDirection="column" px={[2]} width="100%" className="content-similar-movies-section">
            {data.listOfSimilarMovies && 
                <>
                <MessageBox 
                    header={`Film Recommendations Based on ${data.movie.name.trim()}`}
                    text={
                        `Our AI-assisted algorithm found that those movies are showing high similarity to ${data.movie.name.trim()}. ` +
                        `The movies like ${data.movie.name.trim()} in this section not only considerthe common content elements, ` + 
                        `but also the personality of people who watch them. ` +
                        `People who like ${data.movie.name.trim()} also like and give high ratings below movies. ` + 
                        `The chance of you will like them are highly probable, if you like ${data.movie.name.trim()}.`
                    }
                />
                <Grid columns={networkSensitiveColumns} py={[4]} px={[2]}>
                    {data.listOfSimilarMovies.map( item => (
                        <MovieRecommendationCard item={item} key={item.slug + "rm"} />
                    ))}
                </Grid>
                {haveManyPages(data.listOfSimilarMovies.length) && <PaginationBox 
                    currentPage={page} 
                    totalPage={data.listOfSimilarMovies.length >= requestQuantity ? page + 1 : page} 
                    nextPage={nextPage} prevPage={prevPage} 
                />}
                </>
            }
        </Section>
    )
}


const ContentSimilarMovieCard = ({ item }) => (
	<SuperBox
		width="100%"
		ratio={1.5}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="content-similar-movie-card"
        title={"Visit " + item.name + ` - ${item.year} Page`} 
	>	
		<NewLink link={`/movie/${item.slug}`} title={item.name} zIndex={0}>
            <Image 
                src={item.poster} 
                alt={`${item.name} (${item.year}) Poster`}
                title={"Visit " + item.name + ` - ${item.year} Page`} 
                position="absolute" top={0} left={0} right={0} bottom={0}
                minWidth="100%"
            />
        </NewLink>
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column"  justifyContent="space-between"
			p={[2]} zIndex={1}
			bg={"rgba(0,0,0, 0.85)"} minHeight={"100px"}
            className="content-similar-movie-card-info"
		>
			<Text fontSize={["14px", "14px", "16px"]}
                fontWeight="bold" 
                color="light" 
                zIndex={1} 
                mb={[2]} 
            >
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.nongenreTags || []} num={4} color={"light"}/>
		</FlexBox>
	</SuperBox>
)

const MovieRecommendationCard = ({ item, speed="slow" }) => (
	<SuperBox
		width="100%"
		ratio={speed === "slow" ? 1.5 : 0.7}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="recommendation-similar-movie-card"
	>	
		<NewLink link={`/movie/${item.slug}`} title={item.name} zIndex={0}>
            <Image 
                src={speed === "slow" ? item.poster : item.coverPoster} 
                alt={`${item.name} (${item.year}) Poster`}
                title={"Visit " + item.name + ` - ${item.year} Page`} 
                position="absolute" top={0} left={0} right={0} bottom={0}
                minWidth="100%"
            />
        </NewLink>
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column" px={[2]} py={[2]}
            className="recommendation-similar-movie-card-info"
			bg={"rgba(0,0,0, 0.85)"} minHeight={"80px"} zIndex={1}
		>
			<Text color="light" fontWeight="bold" mb={[2]}>
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.nongenreTags || []} num={6} color={"light"}/>
		</FlexBox>

	</SuperBox>
)

export const CONTENT_SIMILAR_FINDER = gql`
query similars($slug:String!, $page:Int!, $num:Int){
    listOfContentSimilarMovies(slug:$slug, page:$page, num:$num){
        slug, name, year, poster, coverPoster, nongenreTags
    },
    movie {slug, name, year}
}
`;
export const RECOMMENDATION_FINDER = gql`
query similars($slug:String!, $page:Int!, $num:Int){
    listOfSimilarMovies(slug:$slug, page:$page, num:$num){
        slug, name, year, poster, coverPoster, nongenreTags
    },
    movie {slug, name, year}
}
`;
