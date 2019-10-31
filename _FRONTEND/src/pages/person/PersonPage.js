import React, { useState, useEffect, useRef, useContext } from "react";
import { withRouter, Link } from "react-router-dom";

import { useAuthCheck,  useWindowSize } from "../../functions/hooks";
import { rgaPageView, Head, DirectorPageAd } from "../../functions/analytics"



import { YoutubePlayer, TextCollapse } from "cbs-react-components";
import { GlobalContext } from "../../";

import {  Col, Row } from 'react-flexbox-grid';

import CoverPanel from "../elements/CoverPanel"
import PersonPanel from "../elements/PersonPanel"
import "../pages.css"


import {  Box, MovieCoverBox, PageContainer, ContentContainer } from "../../styled-components"

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
    })

    return(
        <PageContainer>
            <Head
                title={item.seoTitle}
                description={item.seoShortDescription ?  item.seoShortDescription : item.seoDescription}
                richdata={item.richdata}
                keywords={item.seoKeywords}
                image={item.coverPoster ? item.coverPoster : item.poster}
                canonical={`https://pixly.app/person/${item.slug}`}
            />
            <ContentContainer 
                style={styles.contCon} 
            >
                <TopPanel />
                <Row className="fbox-r jcc">

                    {item.bio && item.bio.length >50 &&
                    <Col xs={12} md={12} lg={12} 
                        className="fbox-c aifs jcfs pad-bt-5x" 
                        >
                        <article>
                            <h4 className="t-xl t-bold mar-b-2x">BIOGRAPHY</h4>
                                <TextCollapse 
                                    size={textLimit}                //default 400
                                    className="my-classname"  //className for text element p
                                    toggleOpenLabel={"MORE"}  //default "MORE"
                                    toggleCloseLabel={"LESS"} //default "LESS"
                                    >
                                    {item.bio}
                                </TextCollapse>
                        </article>
                    </Col>}

        
                </Row>
                {item.videos && item.videos.length > 0 && 
                    activeVideo 
                        ? <YoutubePlayer activeVideo={activeVideo}  videos={item.videos} title={`${item.name} Videos`}/>
                        : <YoutubePlayer videos={item.videos} title={`${item.name} Videos`}/>
                    }
                    
                <DirectorPageAd />


                <h4 className="t-xl t-bold mar-b-2x t-color-dark">FILMOGRAPHY</h4>
                <MovieCoverBox items={sortedMovies} />

                

                {item.relatedLists && item.relatedLists.length>0 &&
                <Box my={[1]}>
                    {item.relatedLists.map(list =>(
                        <Box key={list.id} my={[2]}>
                            <Link to={`/list/${list.slug}/1`} rel="nofollow">
                                <h4 className="t-xl t-bold mar-b-2x t-color-dark hover-t-underline" title={"See List"}>{list.name}</h4>
                            </Link>
                            <MovieCoverBox items={list.movies} />
                        </Box>
                    ))}
                </Box>}

            </ContentContainer>
        </PageContainer>

    );
}

export default withRouter(React.memo(PersonPage));
