import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { BLOG_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd,HomePageFeedAd, print} from "../../functions"
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as SocialButtons from 'react-social-sharing'


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,Image,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText, Error,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaPost,MovieRichCardBox,MovieRichCard, Grid,
    YearSlider,RatingSlider,HtmlBox, HtmlContainer, MessageBox, HeaderMini, NewLink
} from "../../styled-components"


const BlogPage = (props) =>{
    //print("blog props", props)
    return(
        <PageContainer>
            <Head
                title={"Pixly Blog - Articles About Cinema, Movie Recommendation, and Technical Stuff."}
                description={"Pixly App Official Blog Page. Official articles from Pixly Board that is related with " + 
                    "cinema, movie recommendation, and technical stuff."}
                canonical={`https://pixly.app/blog`}
            />
            <ContentContainer>
            {props.posts.map(post => <MiniPost post={post} key={post.slug} />)}

            </ContentContainer>
        </PageContainer>
    );
}
const PostPage = (props) =>{
    const post = props.post
    print("blog props", props)
    function createMarkup() {
        return {__html: props.post.text};
      }
    const InnerHtml = () => <div dangerouslySetInnerHTML={createMarkup()} />;
    return(
        <PageContainer>
            <Head
                title={`Pixly Blog - ${post.header}`}
                description={post.summary}
                canonical={`https://pixly.app/blog/${post.slug}`}
            />
            <ContentContainer px={"10vw"}>
                <InnerHtml />
            </ContentContainer>
        </PageContainer>
    );
}

const MiniPost = ({ post }) => (
    <MessageBox header={post.header} text={post.summary}>
        <NewLink to={`/blog/${post.slug}`} color={"accent"} hoverUnderline fontWeight="bold">Show More</NewLink>
    </MessageBox>
)
const BlogQuery = (props) => {
    const { loading, error, data, } = useQuery(BLOG_QUERY)
    //print("blog query props", props)
    if (loading) return <Loading />
    if (error) return <Error />
    if (data){
        //print("blog query data", data)
        const isPostPage = props.match.params.slug ? true : false
        if (isPostPage){
            const post = data.blogPosts.filter(p => p.slug === props.match.params.slug)[0]
            return <PostPage post={post} />
        }
        return <BlogPage posts={data.blogPosts} {...props} />
    }
}

export default withRouter(BlogQuery);
