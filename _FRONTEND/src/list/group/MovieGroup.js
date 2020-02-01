import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter, useParams, useHistory } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { MOVIE_GROUP } from "../../functions/query"


import { isEqualObj, Head, MidPageAd, HomePageFeedAd, 
    MoviePageAd, FeedMobileCollectionAd,
    TopicArticleAd, TopicOrderedListAd,
    TopicOrderedListAd2,
    useValues, useWindowSize, useWindowWidth, FeedMobileTopicPageAd, useDebounce
} from "../../functions"


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText,Image,CoverImage,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,
    //YearSlider,RatingSlider,
    HtmlBox, HtmlContainer, MessageBox, Hr, HomeIcon,FilmIcon,
    LargeTopicMovieCard, WhiteMovieCard, HeaderMini, TagBox, SuperBox, CoverLink, NewLink,
    Ul,Li,ImdbRatingIcon, AbsoluteBox,ImageBoxBg,YearClockIcon,RightIcon,
    BookmarkMutation, RatingMutation, LikeMutation, StarIcon, 
    CardContainer,HtmlParagraph,HeaderText
} from "../../styled-components"
import { useNetworkStatus } from 'react-adaptive-hooks/network';
import { LazyLoadImage, LazyLoadComponent } from 'react-lazy-load-image-component';

import { YearSlider, RatingSlider, TagSelect, SearchInputMaterial } from "../../styled-material"



const MovieGroupPage = ({ group, ...props }) => {
    console.log("movie-group", group, props)
    return (
        <PageContainer>
            <Head 
                title={group.seoTitle}
                description={group.seoDescription}
                canonical={`https://pixly.app/tag/${group.slug}`}
            />
            <ContentContainer>
                <CardContainer mt={[3]}>
                    <HeaderText mt={0} mb={[2]}>{group.header}</HeaderText>
                    <HtmlContainer html={group.htmlContent} />
                    <Grid columns={group.posterType==="p" ?[2,2,3,4,4,4,5,6] : [1,2,2,3,3,4]} width={"100%"} py={[3]} mt={4}>
                    {group.items.map(item => (
                            <FlexBox width={"100%"} height="auto" 
                                key={item.movie.slug} 
                                overflow="hidden"
                                title={`${item.movie.name} (${item.movie.year})`}
                                translateY boxShadow="card" hoverShadow 
                            >
                                <CoverImage key={`${item.movie.slug} + "group-i"`} 
                                    follow={true}
                                    title={`${item.movie.name} (${item.movie.year})`}
                                    src={item.poster} borderRadius="6px"
                                    link={`/movie/${item.movie.slug}`} 
                                    ratio={group.posterType==="p" ? 1.5 : 0.6} 
                                />
                                <Text width="100%" bg="rgba(0,0,0,0.6)"
                                    position="absolute" left={0} bottom={-2} pl={[2]}
                                    color="light" fontSize="10px" fontWeight="bold"
                                ><NewLink link={`/movie/${item.movie.slug}`} follow={true}>{item.movie.name} ({item.movie.year})</NewLink>
                                </Text>
                            </FlexBox>
                    ))}
                </Grid>
                </CardContainer>
            </ContentContainer>
        </PageContainer>
    )

}

const MovieGroupQuery = ({ lazyvariables }) =>{
    const { slug } = useParams();
    const { loading, data, error } = useQuery(MOVIE_GROUP,{variables:{slug},partialRefetch:true})


    if (error) return <div>{error.message}</div>
    if (!data && loading) return <Loading />
    if (data) return <MovieGroupPage group={data.movieGroup} />
    else return <div></div>
}



export default withRouter(MovieGroupQuery);
