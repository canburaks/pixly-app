import React, { useState, useRef,useEffect, useCallback, useMemo } from "react";
import { withRouter } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { BLOG_QUERY } from "../../functions/query"


import { isEqualObj, Head, MidPageAd,MoviePageAd, print, useAuthCheck} from "../../functions"
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as SocialButtons from 'react-social-sharing'


import { 
    Box, FlexBox, Text,Input,SearchInput, Form,Loading, Button,Image,
    ImdbIcon, WatchIcon, SearchIcon,SubHeaderText, Error,
    PageContainer, ContentContainer, InputRange, SearchButton, PaginationBox, 
    TextSection,SchemaPost,MovieRichCardBox,MovieRichCard, Grid,
    YearSlider,RatingSlider,HtmlBox, HtmlContainer, MessageBox, HeaderMini, NewLink,
    PostInfoBox,  Dl, Dt, CoverImage, Hr
} from "../../styled-components"



const BlogQuery = (props) => {
    const { loading, error, data, } = useQuery(BLOG_QUERY, {partialRefetch:true})
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
            <ContentContainer pb={"80px"}>
            {props.posts.map(post => <PostInfoBox post={post} key={post.slug} />)}

            </ContentContainer>
        </PageContainer>
    );
}

const MiniPost = ({ post }) => (
    <MessageBox header={post.header} text={post.summary}>
        <NewLink to={`/blog/${post.slug}`} color={"accent"} hoverUnderline fontWeight="bold">Show More</NewLink>
    </MessageBox>
)
const PostPage = (props) =>{
    const authCheck = useAuthCheck()
    const post = props.post
    //print("blog props", props)
    //function createMarkup() {
    //    return {__html: props.post.text};
    //  }
    //const InnerHtml = () => <div dangerouslySetInnerHTML={createMarkup()} />;
    return(
        <PageContainer>
            <Head
                title={`Pixly Blog - ${post.header}`}
                description={post.summary}
                canonical={`https://pixly.app/blog/${post.slug}`}
            />
            <ContentContainer  pb={40} px={["5vw", "5vw", "8vw", "10vw", "15vw"]} maxWidth={"100%"}  overFlowX={"hidden"}>
                <NewLink link={"/blog"} position="absolute" top={"10px"} left={"16px"} underline>&lt; Back to Blog Page</NewLink>
                <SchemaPost post={post}/>

                <TopicLinkList />
                <MoviePageAd />
    
            </ContentContainer>

        </PageContainer>
    );
}

const TopicLinkList = (props) => {
    const topics = [
        {name:"Cyberpunk", slug:"cyberpunk", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/5/cover/cyberpunk.jpg"},
        {name:"Thought Provoking", slug:"thought-provoking", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/10/cover/thought-provoking.jpg"},
        {name:"Mystery", slug:"mystery", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/19/cover/mystery.jpg"}
    ]

    return (
            <FlexBox flexDirection="column" width="100%" my={[4]}>
            <MessageBox mb={[2]} id="movie-page-topic-section"
                header={"The movie lists below might interest you"}
                text={
                    "Topics are film list collections that include many great examples of its category and curated by us."
                }
            />
                <Grid columns={[1,2,2,3,3,3,4]} width={"100%"} mt={[3]}>
                    {topics.map((topic, i) => (
                        <CoverImage  
                            borderRadius={"4px"}
                            boxShadow="card"
                            src={topic.coverPoster}
                            ratio={0.55}
                            link={`/topic/${topic.slug}`} follow
                            title={`Visit ${topic.name} Movies`}
                            alt={`${topic.name} Film List Image`}
                            key={topic.name} 
                        />
                        ))}
                </Grid>
            </FlexBox>
    )
}

export default withRouter(BlogQuery);
