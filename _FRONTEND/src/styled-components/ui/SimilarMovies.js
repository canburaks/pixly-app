import React  from "react";
import { useState, useContext, useMemo, useCallback, useEffect } from "react"
import { withRouter, Link, useParams, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';


import { useWindowSize, useAuthCheck, useClientWidth, useClientHeight, useValues,
    
} from "../../functions/hooks"

import { rgaPageView, Head, MidPageAd, HomePageFeedAd,  FeedMobileCollectionAd,
    SIMILAR_FINDER, LIST_BOARD, MoviePageAd,FeedMobileTopicPageAd
} from "../../functions"

import { GlobalContext } from "../..";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard,CollectionCard,
    Loading, HeaderText, Text, FlexBox, RegularInput, MovieAutoComplete, SuperBox, CoverLink, TagBox,
    NewLink, Image, SubHeaderText, LinkButton, HeaderMini, Span, Box, Hr, Section,MessageBox
} from ".."




export const SimilarMovies = (props) => {
    const { data, movie, contentSimilars, recommendations  } = props;
    const similarQuantity = contentSimilars.length + recommendations.length
    console.log("data",similarQuantity,  data)
    return (
        <Section className="similar-movies-section" display="flex" flexDirection="column">
            <SubHeaderText fontSize={["22px","22px","28px", "34px", "40px"]}
                fontWeight="bold"
                mb={[3,3,4]} mt={[4,4,5]}
            >
                Similar Movies Like <em>{movie.name}</em>
            </SubHeaderText>
            <MessageBox 
                header={`Similar Movies like ${movie.name}`}
                text={`${contentSimilars.length} number of movies in this section have common tags with ${movie.name}`}
            />
            {contentSimilars && <MovieContentSimilarCardBox items={contentSimilars.slice(0,12)} />}

                {recommendations && recommendations.length > 0 && 
                    <FlexBox flexDirection="column" px={[2]}>
                        <MessageBox 
                            header={`Film Recommendations`}
                            text={
                                `People who like ${movie.name} also like and give high ratings below movies. ` + 
                                `Our AI-assisted algorithm found that those movies are showing high similarity to ${movie.name}` +
                                `The chance of you will like them are highly probable, if you like the film.`
                            }
                        />
                        <MovieRecommendationBox items={recommendations} />
                    </FlexBox>
                }
        </Section>
    )
}

const MovieRecommendationBox = React.memo((props) => (
    <Grid columns={[1,1,1,2,2,2,2,3,4]} py={[4]}>
        {props.items.map( item => (
            <MovieRecommendationCard item={item} key={"rec" + item.slug}/>
        ))}
    </Grid>
), (p,n) => (p.key ? (p.key === n.key) : (p.items.length === n.items.length)))

const MovieContentSimilarCardBox = React.memo(({ items, columns=[2,2,3,3,3,4,6], ...props }) => (
    <Grid columns={columns} py={[4]} px={[2]}>
        {items.map( item => <ContentSimilarMovieCard item={item} key={item.slug + "cs"} />)}
    </Grid>
), (p,n) => (p.key ? (p.key === n.key) : (p.items.length === n.items.length)))


const ContentSimilarMovieCard = ({ item }) => (
	<SuperBox
		src={item.poster}
		width="100%"
		ratio={1.5}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="content-similar-movie-card"
        title={"Visit " + item.name + ` - ${item.year} Page`} 
	>	

		<CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0} />
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

const MovieRecommendationCard = ({ item }) => (
	<SuperBox
		src={item.coverPoster || item.poster}
		width="100%"
		ratio={0.7}
		boxShadow="0 6px 8px 4px rgba(0,0,0, 0.4)"
        className="recommendation-similar-movie-card"
	>	
        <CoverLink link={`/movie/${item.slug}`} title={item.name} zIndex={0}/>
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

