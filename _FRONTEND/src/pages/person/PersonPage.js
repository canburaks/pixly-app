import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";

import { useAuthCheck,  useWindowSize, ScrollInto } from "../../functions";
import { rgaPageView, Head, DirectorPageAd } from "../../functions/analytics"



import { YoutubePlayer, TextCollapse } from "cbs-react-components";
import { GlobalContext } from "../../";

import {  Col, Row } from 'react-flexbox-grid';

import CoverPanel from "../elements/CoverPanel"
import PersonPanel from "../elements/PersonPanel"
import { twitter } from "../../functions/third-party/twitter/twitter"
import "../pages.css"


import {  Box, MovieCoverBox, PageContainer, ContentContainer, HeaderText, HeaderMini, SubHeaderText, Text, FlexBox } from "../../styled-components"

//import "cbs-web-components";



const PersonPage = (props) => {
    const item  = props.item[Object.keys(props.item)[0]]

    const activeVideoParse = () =>{
        if (item.videos && item.videos.length > 0 && props.location.hash.length > 0 ){
            const videoId = parseInt(props.location.hash.split("#")[1])
            if (videoId) return item.videos.filter(v => v.id === videoId)[0]
        }
        return null
    }
    const initialActive = activeVideoParse()
    const [activeVideo, setActiveVideo] = useState(initialActive)
    const authStatus = useAuthCheck()
    //rgaPageView();
    //print("person page", props)
    //const [follow, setFollow] = useState(item.isFollowed);
    
    const state = useContext(GlobalContext);
    if (props.item.viewer){
        state.methods.updatePoints(props.item.viewer.points)
    }
    
    const hasVideos = item.videos && item.videos.length > 0 ? true : false

    const videoHeaderText = useMemo(() => {
        if (hasVideos){
            var text = `${item.name} Videos`
            const videoEssayNum = item.videos.filter(v => v.tags.includes("video-essay")).length 
            const interviewNum = item.videos.filter(v => v.tags.includes("interview")).length 
            const conversationNum = item.videos.filter(v => v.tags.includes("interview")).length
            if (videoEssayNum > 0){
                text += ", Video Essays"
            }  
            if (interviewNum > 0){
                text += ", Interviews"
            }  
            if (conversationNum > 0){
                text += ", Conversations"
            }  
            return text
        }
        return ""
    },[item.slug])

    //console.log(item)

    const screenSize = useWindowSize()
    const textLimit = screenSize === "S" 
                        ? 300
                        : screenSize === "M"
                            ? 400
                            : 500

    const sortedMovies = item.movies.sort((a, b) => (a.year - b.year)).reverse()
    const sortedMoviesCover = sortedMovies.filter(r => r.coverPoster !== "" && r.coverPoster !== null)
    //.filter(m => (!m.name.startsWith("Zodiac") && !m.name.startsWith("Panic") ))

    const sortedMoviesPoster = sortedMovies.filter(r => r.coverPoster === "" || r.coverPoster === null);
    


    const personData = JSON.parse(item.filteredData)
    

    //console.log("data", personData)
    //const posterWillShow = item.coverPoster ? item.coverPoster.replace(/^https:\/\//i, 'http://') : item.poster.replace(/^https:\/\//i, 'http://');


    const styles = {
        contCon: { paddingBottom:50, paddingLeft:40, paddingRight:40 }
    }

    //console.log("rdf",item.richdata)
    const Twitter = twitter()
    //console.log(directorKeywords(item))
    const TopPanel = () =>  item.hasCover 
        ? <CoverPanel 
            item={item} 
            status={authStatus} 
            personData={personData} follow person
        />
        : <PersonPanel 
            item={item}  
            status={authStatus} 
            screen={screenSize} personData={personData} follow person 
        /> 

    // IF hash url, scroll to video player
    useEffect(()=>{
        if (item.videos && item.videos.length > 0 && props.location.hash.length > 0){
            const vp = document.getElementById("video-player-box")
            if (vp){
                window.scrollTo(0, vp.offsetTop) 
            }}
        if (props.location.hash){
            ScrollInto(props.location.hash.slice(1))
        }
    },[])
    const hasTwitter = useMemo(() => (item.twitter && item.twitter.length > 5) ? true : false,[])
    const BioElement = useMemo(() => hasTwitter 
        ? () => <PersonBioWithTwitter item={item}/> 
        : () =>  <PersonBio name={item.name} bio={item.bio} />, [hasTwitter])
    return(
        <PageContainer>
            <Head
                title={item.seoTitle}
                description={item.seoDescription ?  item.seoDescription : item.seoShortDescription}
                richdata={item.richdata}
                keywords={item.seoKeywords}
                image={item.coverPoster ? item.coverPoster : item.poster}
                canonical={`https://pixly.app/person/${item.slug}`}
            />
            <ContentContainer 
                style={styles.contCon} 
            >
                <TopPanel />

                <BioElement />

                <Row className="fbox-r jcc">

                    {item.bio && item.bio.length >50 &&
                    <Col xs={12} md={12} lg={12} 
                        className="fbox-c aifs jcfs pad-bt-5x" 
                        >
                        

                    </Col>}

        
                </Row>
                {item.videos && item.videos.length > 0 && 
                    <FlexBox width={"100%"} height="auto" id="director-page-videos" flexDirection="column" mt={[4]}>
                        <SubHeaderText fontWeight="bold" my={[2]}>{videoHeaderText}</SubHeaderText>
                        <YoutubePlayer videos={item.videos} title={`${item.name} Videos`}/>
                    </FlexBox>
                    }
                    
                <DirectorPageAd />

                <SubHeaderText id="director-page-filmography">{item.name + " Movies (Filmography)"}</SubHeaderText>
                <MovieCoverBox items={sortedMovies} follow={true} />

                

                {item.relatedLists && item.relatedLists.length>0 &&
                <Box my={[1]} id="director-page-list">
                    {item.relatedLists.map(list =>(
                        <Box key={list.id} my={[2]}>
                            <Link to={`/list/${list.slug}/1`} rel="nofollow">
                                <h4 className="t-xl t-bold mar-b-2x t-color-dark hover-t-underline" title={"See List"}>{list.name}</h4>
                            </Link>
                            <MovieCoverBox items={list.movies} />
                        </Box>
                    ))}
                </Box>}
                {hasTwitter && <Twitter.Timeline name={item.name} link={item.twitter} />}
            </ContentContainer>
        </PageContainer>

    );
}
const PersonBio = ({name, bio}) => (
    <>
        <SubHeaderText width="100%">{name + " Biography"}</SubHeaderText>
        <Text>{bio}</Text>
    </>
)

const PersonBioWithTwitter = ({item}) => {
    const Twitter = twitter()
    return (
        <>
            <Box>

            <Twitter.Timeline name={item.name} link={item.twitter} />
            <SubHeaderText>{item.name + " Biography"}</SubHeaderText>
            <br/>
            {item.bio}
            </Box>

        </>

)}

export default withRouter(React.memo(PersonPage));
