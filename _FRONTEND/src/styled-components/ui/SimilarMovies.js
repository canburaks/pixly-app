import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect, useRef } from "react"
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
    PaginationBox, Dl,Dt,Dd, Em
} from "../"
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { Plus } from 'css-spinners-react'
import { LazyLoadComponent } from 'react-lazy-load-image-component';




export const SimilarMovies = (props) => {

    //console.log("props", location, props)
    const state = useContext(GlobalContext);
    ////console.log("data",speed, similarQuantity,  data)
    
    
    const ResponsiveAd3 = window.innerWidth < 480 ? FeedMobileTopicPageAd : MidPageAd
    return (
        <Section 
            className="similar-movies-section" 
            display="flex" flexDirection="column"
            id="similar-movies" pt={50}
        >
            <RecommendationSection  />
            

            <ContentSimilarSection  />
            
        </Section>
    )
}

const ContentSimilarSection = (props) => {
    const { slug } = useParams();
    const node = useRef(null)

    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"

    const [ page, setPage ] = useState(1)
    const requestQuantity = speed === "fast" ? (window.innerWidth > 600 ? 18 : 12) : 12 // if slow network request less movie


	const { loading, error, data } = useQuery(CONTENT_SIMILAR_FINDER, {variables:{
            slug:slug,
            page:page,
            num: requestQuantity
        },
        onCompleted:() => onCompleted(),
		partialRefetch: true
    });

    const nextPage = useCallback(() => setPage(page + 1), [page])
    const prevPage = useCallback(() => setPage(page - 1), [page])
    //quantity is resulted element number from query
    const haveManyPages = (quantity) => (page === 1 && quantity < requestQuantity ) ? false :true
    const isDocumentary = (nongenreTags) => nongenreTags.includes("documentary")

    const ResponsiveAd1 = window.innerWidth < 480 ? FeedMobileTopicPageAd : HomePageFeedAd

    const onCompleted = () => {
        //console.log(1)
        if(page > 1 && node.current){
            node.current.scrollIntoView({behavior: "smooth"});
        }
    }

    
    function commonGenres(filmTags, similarsMovieList){
        var commons = new Set()
        similarsMovieList.map(m => {
            m.tagNames.map(t => {
                if (filmTags.includes(t)){
                    commons.add(t)
                }
            })
        })
        const uniques =  Array.from(commons)
        if (uniques.length > 0){
            const tagtext =  uniques.slice(0,5).join(", ")
            return `The most common genres you will find below are ${tagtext}.`

        }
        return ""
    }

    if (error) return (<div></div>)
    if (loading) return <FlexBox minHeight={"200px"} justifyContent="center"  width="100%"><Plus id="plus-loader-container" /></FlexBox>
    if (data) return (
        <Section display="flex" flexDirection="column" px={[2]} width="100%" id="cso-section" className="content-similar-movies-section" ref={node}>
            {data.listOfContentSimilarMovies && data.listOfContentSimilarMovies.length > 0 &&
                <>
                    <MessageBox 
                        subheader={`${isDocumentary(data.movie.nongenreTags) ? "Documentaries and Films" : "Movies" } like ${data.movie.name.trim()} (${data.movie.year})`}
                        text={data.movie.contentSimilarsSummary ? data.movie.contentSimilarsSummary :
                            `The movies that show resemblance to ${data.movie.name.trim()} movie in a way of content: common topics/tags/sub-genres with ` +
                            `${commonGenres(data.movie.tagNames, data.listOfContentSimilarMovies)}`
                        }
						border={"0px"}
						borderRadius={6}
						boxShadow="card"
						bg="#f1f1f1"
                    >
                    <Grid columns={[2,2,3,3,3,3,3,4,6]} py={[4]} >
                        {data.listOfContentSimilarMovies.map( item => (
                                <ContentSimilarMovieCard item={item} key={item.slug + "cs"}/>
                        ))}
                    </Grid>
                    </MessageBox>
                {haveManyPages(data.listOfContentSimilarMovies.length) && 
                    <PaginationBox 
                        currentPage={page} 
                        totalPage={data.listOfContentSimilarMovies.length >= requestQuantity ? page + 1 : page} 
                        nextPage={nextPage} prevPage={prevPage} 
                    />}
                </>
            }
        </Section>
    )
}

const RecommendationSection = ({num=19}) => {
    const { slug } = useParams();
    const [ page, setPage ] = useState(1)
    const node = useRef(null)
    //Network
    const { effectiveConnectionType } = useNetworkStatus();
    let speed = effectiveConnectionType ? effectiveConnectionType === "4g" ? "fast" : "slow" : "slow"
    
    
    // Network sensitive settings
    const requestQuantity = speed === "fast" ? (window.innerWidth > 600 ? 12 : 8) : 8 // if slow network request less movie
    const networkSensitiveColumns = speed === "fast" ? [1,1,2,2,2,2,3,4] : [2,2,3,3,3,4,6]

	const { loading, error, data } = useQuery(RECOMMENDATION_FINDER, {
            variables:{slug:slug,
            page:page, 
            num:requestQuantity
        },
        onCompleted:() => onCompleted(),
		partialRefetch: true
    });
    //console.log(loading, error, data)

    const nextPage = useCallback(() => setPage(page + 1), [page])
    const prevPage = useCallback(() => setPage(page - 1), [page])
    //quantity is resulted element number from query
    const haveManyPages = (quantity) => (page === 1 && quantity< requestQuantity ) ? false :true

    const onCompleted = () => {
        //console.log(1)
        if(page > 1 && node.current){
            node.current.scrollIntoView({behavior: "smooth"});
        }
    }

    const ResponsiveAd2 = window.innerWidth < 480 ? FeedMobileTopicPageAd : MoviePageAd
    if (error) return (
        <div></div>
    )
    if (loading) return <FlexBox minHeight={"200px"} justifyContent="center"  width="100%"><Plus id="plus-loader-container" /></FlexBox>
    if (data){
        const RecommendationHeader = () => (
            <SubHeaderText 
                fontSize={["20px", "20px", "24px", "28px"]} 
                fontWeight="bold" opacity={0.85}
            >
                Algorithmic Film Recommendations <br/>Based on {data.movie.name.trim()} {data.movie.year}
            </SubHeaderText>
        )
        return (
        <Section 
            display="flex" flexDirection="column" 
            px={[2]} 
            width="100%" 
            id="rm-section"
            className="content-similar-movies-section"
        >
            {data.listOfSimilarMovies && data.listOfSimilarMovies.length > 0 &&
                <>
                    <MessageBox 
                        Subheader={RecommendationHeader}
                        text={
                            `Our AI-assisted algorithm found that those movies are showing high similarity to ${data.movie.name.trim()}. ` +
                            `The films in this section not only consider the common content elements, ` + 
                            `but also the personal interest of people who watch them. `
                        }
						border={"0px"}
						borderRadius={6}
						boxShadow="card"
						bg="#f1f1f1"
                    >
                    <Grid columns={networkSensitiveColumns} py={[4]} >
                        {data.listOfSimilarMovies.map( item => (
                            <MovieRecommendationCard item={item} key={item.slug + "rm"} speed={speed}/>
                        ))}
                    </Grid>
                    </MessageBox>
                {haveManyPages(data.listOfSimilarMovies.length) && <PaginationBox 
                    currentPage={page} 
                    totalPage={data.listOfSimilarMovies.length >= requestQuantity ? page + 1 : page} 
                    nextPage={nextPage} prevPage={prevPage} 
                />}
                </>
            }
        </Section>
    )}
}


const ContentSimilarMovieCard = ({ item }) => (
	<SuperBox borderRadius={"4px"}
		width="100%"
		ratio={1.5}
		boxShadow="card"
        className="content-similar-movie-card"
        title={"Visit " + item.name + ` - ${item.year} Page`} 
	>	
		<NewLink 
            link={`/movie/${item.slug}`} 
            title={item.name} 
            zIndex={0} 
        >
            <Image 
                src={item.poster} 
                info={`${item.name} (${item.year}): ${item.summary.slice(0,120)}...`}
                alt={`${item.name} (${item.year}): ${item.summary.slice(0,120)}...`}
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
			<Text fontSize={["12px", "12px", "14px", "16px"]}
                fontWeight="bold" lineHeight={["16px", "16px", "18px"]}
                color="light" 
                zIndex={1} 
                mb={[2]} 
            >
                    <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			<TagBox tags={item.tagNames || []} num={4} color={"light"}/>
		</FlexBox>
	</SuperBox>
)

const MovieRecommendationCard = ({ item, speed }) => (
	<SuperBox borderRadius={"4px"}
		width="100%"
        src={speed === "fast" ? (item.coverPoster ? item.coverPoster : item.poster) : item.poster} 
		ratio={speed === "slow" ? 1.5 : 0.7}
		boxShadow="card"
        className="recommendation-similar-movie-card"
	>	
        <CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0} title={`Visit ${item.name}`}/>
		<FlexBox 
			position="absolute" 
			bottom={0} left={0}
			width={"100%"} height={"auto"}
			flexDirection="column" px={[2]} py={[2]}
            className="recommendation-similar-movie-card-info"
			bg={"rgba(0,0,0, 0.85)"} minHeight={"80px"} zIndex={1}
		>
			<Text color="light" fontWeight="bold" mb={[2]} lineHeight={["16px", "16px", "18px"]}>
                <NewLink link={`/movie/${item.slug}`} hoverUnderline>{item.name} ({item.year})</NewLink>
            </Text>
			    <TagBox tags={item.nongenreTags || []} num={4} color={"light"}/>
		</FlexBox>

	</SuperBox>
)

const CONTENT_SIMILAR_FINDER = gql`
query similars($slug:String!, $page:Int!, $num:Int){
    listOfContentSimilarMovies(slug:$slug, page:$page, num:$num){
        slug, name, year,summary, poster, coverPoster, nongenreTags, tagNames,
    },
    movie(slug:$slug){id, slug, name, year, nongenreTags, tagNames, contentSimilarsSummary}
}
`;
const RECOMMENDATION_FINDER = gql`
query similars($slug:String!, $page:Int!, $num:Int){
    listOfSimilarMovies(slug:$slug, page:$page, num:$num){
        slug, name, year, poster, coverPoster, nongenreTags, tagNames
    },
    movie(slug:$slug){id, slug, name, year, nongenreTags, tagNames}
}
`;
