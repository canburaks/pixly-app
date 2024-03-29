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
    PostInfoBox,  Dl, Dt, CoverImage, Hr, HeaderText
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
    return(
        <PageContainer>
            <Head
                title={"Pixly Blog - Articles About Movie Recommendation, and Technical Stuff."}
                description={"Pixly App Official Blog Page. Official articles from Pixly Board that is related with " + 
                    "cinema, movie recommendation, and technical stuff."}
                canonical={`https://pixly.app/blog`}
            />
            <HeaderText px={[2,2,3]}>Pixly Blog - Articles About Movie Recommendation, and Technical Stuff</HeaderText>
            <Text px={[4,4,5]} mt={[5]}> 
                Pixly has completed its lifetime. It was the first project and we learned many things in its lifetime. Thanks for your support.<br></br>
                We will continue our web projects on <a class="anchor-color" rel="noopener" target="_blank" href="https://studiowoke.com">Studio Woke ~ Design & Technology & SEO</a><br></br>
                The articles will transferred to <a class="anchor-color" rel="noopener" target="_blank" href="https://cbsofyalioglu.com">Personal Blog About Design and Technology Stuff</a> <br></br>
                At this time, we also thanks <a class="anchor-color" rel="noopener" target="_blank" href="https://la-cuisinette.com">LA-CUISINETTE Organic Foods</a> for their moral supports.          
            </Text>
            <ContentContainer pb={"80px"}>
                {props.posts.map(post => <PostInfoBox post={post} key={post.slug} follow/>)}
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
    //useEffect(() => window.scrollTo({top:0, left:0, behavior:"smooth"}))
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
        {name:"Cyberpunk", slug:"cyberpunk", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/5/cover/cyberpunk-2.jpg"},
        {name:"Rom-Com", slug:"romantic-comedy", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/24/cover/romantic-comedy-movies.jpg"},
        {name:"Mystery", slug:"mystery", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/19/cover/mystery-3.jpg"},
        {name:"Biography", slug:"historical-figures", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/17/cover/historical-figures-2.jpg"},
        {name:"Thought Provoking", slug:"thought-provoking", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/10/cover/thought-provoking-3.jpg"},
        //{name:"Gangster", slug:"gangster-films", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/22/cover/gangster.jpg"},
        {name:"Outbreak", slug:"outbreak-movies", coverPoster:"https://cbs-static.s3.amazonaws.com/static/media/topics/30/cover/virus.jpg"},

        
    ]

    return (
            <FlexBox flexDirection="column" width="100%" my={[4]}>
            <MessageBox mb={[2]} id="movie-page-topic-section"
                header={"The movie lists below might interest you"}
            >
                <Text>
                    Topics are film list collections that include many great examples of its category and curated by us.
                    If you are interested, you can check our <NewLink link={"/lists-of-films"} follow underline title="Film List Collections">movie list collections</NewLink>.
                </Text>
            </MessageBox>
                <Grid columns={[2,2,3]} width={"100%"} mt={[3]}>
                    {topics.map((topic, i) => (
                        <CoverImage  
                            borderRadius={"4px"}
                            boxShadow="card"
                            src={topic.coverPoster}
                            borderRadius={"6px"}
                            ratio={0.55}
                            link={`/topic/${topic.slug}`} follow
                            title={`${topic.name} Movies`}
                            alt={`${topic.name} Film List Image`}
                            key={topic.name} 
                        />
                        ))}
                </Grid>
            </FlexBox>
    )
}

export default withRouter(BlogQuery);
