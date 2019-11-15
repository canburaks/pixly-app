import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { BLOG_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd,HomePageFeedAd, print} from "../../functions"
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as SocialButtons from 'react-social-sharing'


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText, Error,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaArticle,MovieRichCardBox,MovieRichCard, Grid,
    YearSlider,RatingSlider,HtmlBox, HtmlContainer, MessageBox
} from "../../styled-components"


const BlogPage = (props) =>{
    const postSlug = props.match.params.slug 
    print("blog props", props)
    return(
        <PageContainer>
            <Head
                title={"Pixly Blog - Articles About Cinema, Movie Recommendation, and Technical Stuff."}
                description={"Pixly App Official Blog Page. Official articles from Pixly Board that is related with " + 
                    "cinema, movie recommendation, and technical stuff."}
                canonical={`https://pixly.app/blog`}
            />
            <ContentContainer>

            </ContentContainer>
        </PageContainer>
    );
}

const BlogQuery = (props) => {
    const { loading, error, data, } = useQuery(BLOG_QUERY)
    print("blog query props", props)
    if (loading) return <Loading />
    if (error) return <Error />
    if (data){
        print("blog query data", data)
        return <BlogPage posts={data.blogPosts} {...props} />
    }
}

export default withRouter(BlogQuery);
