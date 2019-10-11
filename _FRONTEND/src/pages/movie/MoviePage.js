/* eslint-disable */
import React from "react";
import { useState, useContext, useMemo } from "react";
import { withRouter, Link } from "react-router-dom";
import { rgaPageView, Head, MoviePageAd} from "../../functions/analytics"



//import { TagBox, Tag } from "../../components/TagBox"

import { useAuthCheck } from "../../functions/hooks";
import {  Col } from 'react-flexbox-grid';
//import WP from "../../components/VideoPlayer";
//import "cbs-web-components"sfd
import { YoutubePlayer} from "cbs-react-components";
import { GlobalContext } from "../../App";
import { GridBox, GridItem } from "../../components/GridBox" 
//import { SocialMedia } from "../../components/SocialMedia" 

//import TopPanel  from "../elements/TopPanel"
import CoverPanel from "../elements/CoverPanel"
import PosterPanel from "../elements/PosterPanel"
//import { SimilarityCard, Tag } from "../elements/Elements"
import { GlideBox } from "../../components2/Glide.js"

import {  CrewCard,  MovieInfoBox, PageContainer, ContentContainer,
    MovieCoverBox,  MovieCoverPanel
} from "../../styled-components"

import "../pages.css";

const MoviePage = (props) => {
    rgaPageView();
    const { movie: item, viewer } = props.item;
    const { cacheUpdate } = props;
    //console.log("movie page props: ",client)

    //up()

    const authStatus = useAuthCheck()
    const state = useContext(GlobalContext);
    const screenSize = state.screenSize
    const isLargeScreen = screenSize.includes("L")

    //const [ pageBookmark, setPageBookmark ] = useState(item.isBookmarked)
    //const [ pageFav, setPageFav ] = useState(item.isFaved)
    //const [ pageRating, setPageRating ] = useState(item.viewerRating)


    if (viewer && viewer.points){
        state.methods.updatePoints(viewer.points);
    }
    const hasVideos = item.videos && item.videos.length >0 ? true : false

    const directorFilter = item.crew.filter(c => c.job == "D").map(d => Object.assign(d, { character: "Director" }))
    const actorFilter = item.crew.filter(c => c.job == "A")
    const allCrews = [...directorFilter, ...actorFilter]




    // SIMILAR MOVIES
    const similarPlaceholder = item.similars ? item.similars : [];
    const similarCover = similarPlaceholder.filter(m => m.hasCover===true)
    const similarNonCover = similarPlaceholder.filter(m => m.hasCover=== false)

    // CONTENT SIMILARS
    const contentSimilarPlaceholder = item.contentSimilars ? item.contentSimilars : [];
    const contentSimilarCover = useMemo(() => contentSimilarPlaceholder
            .filter(m => m.movie.hasCover===true)
            .sort( (a,b) => b.commonTags.length - a.commonTags.length), [])

    //const contentSimilarNonCover = contentSimilarPlaceholder.filter(m => m.movie.hasCover=== false)


    //console.log(similarCover, similarNonCover)
    //console.log("page status",item.isBookmarked, item.isFaved, item.viewerRating)
    console.log(item.seoShortDescription)

    return (
        <PageContainer 
            className={item.hasCover ? "cover-true" : "cover-false"} 
            >
            <Head
                title={item.seoTitle}
                description={item.seoShortDescription ?  item.seoShortDescription : item.seoDescription}
                richdata={item.richdata}
                keywords={item.seoKeywords}
                image={item.coverPoster ? item.coverPoster : item.poster}
                canonical={`https://pixly.app/movie/${item.slug}/`}
            >
            </Head>

            <MovieCoverPanel 
                blur={20} mb={[3]} 
                width={"100vw"} height={"56vw"} 
                item={item} 
                cacheUpdate={cacheUpdate}
                authStatus={authStatus}
                isLargeScreen={isLargeScreen}
            />

            {/*<!-- Page Container --> */}
            <ContentContainer zIndex={1} mt={[4]}>

                {/*<!--SIMILAR Section--> */}
                {similarCover.length > 0 &&
                <>
                    <h4 className="t-xl t-bold mar-b-2x">PEOPLE ALSO LIKE</h4>
                    <p className="t-m mar-b-2x">
                        People who like 
                        <span className="t-bold"> '{item.name}' </span>
                        also like and give high ratings below movies.
                    </p>
                    <hr/>
                    <MovieCoverBox items={similarPlaceholder} />
                </>
                }

                <MoviePageAd />
                
                {/* SUMMARY */}
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs pad-bt-5x mar-bt-5x" >
                    {item.summary && item.summary.length >50 && 
                    <article className="outer-summary">
                        <h4 className="t-xl t-bold mar-b-2x">Summary</h4>
                        <p >{item.summary}</p>
                    </article>
                        }
                </Col>

                {/*<!--CONTENT SIMILAR Section--> */}
                {contentSimilarCover.length > 0 &&
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-t-4x">
                    <h4 className="t-xl t-bold mar-b-2x">SIMILAR MOVIES</h4>
                    <p className="t-m mar-b-2x">
                        Movies that share some contentfull similarity with <span className="t-bold">'{item.name}'</span> and shared tags are below.
                    </p>
                    <hr/>
                    <MovieInfoBox items={contentSimilarCover} />

                </Col>}


    
                {/*<!--APPEARS IN  LIST Section--> */}
                {item.appears.length > 0 &&
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-bt-5x">
                    <h4 className="t-xl t-bold mar-b-2x">LISTS THAT INVOLVED</h4>
                    <hr/>

                    <GridBox size="m">
                        {item.appears.map((list, index) => (
                            <GridItem 
                                key={list.id + list.slug + index}
                                title={list.name}
                                className={"box-shadow bor-rad-2x shadow"}
                            >
                                <Link rel="nofollow" to={`/list/${list.slug}/1`} >
                                <img alt={`This movie is in the ${list.name}`}
                                    className="bor-rad-2x lazyload"
                                    src={list.relatedPersons[0].poster}
                                />
                            </Link>

                                <p className="t-s t-colorful t-bold">{list.name}</p>
                                <Link to={`/person/${list.relatedPersons[0].id}/${list.relatedPersons[0].slug}`} rel="nofollow">
                                    <p className="t-xs hover-t-underline fl-l mw100 t-color-dark">
                                        {list.relatedPersons[0].name}
                                    </p>
                                </Link>
                            </GridItem>
                        ))}
                    </GridBox>
                </Col>}


                {/* VIDEO */}
                {hasVideos > 0 && 
                    <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-bt-5x">
                        <YoutubePlayer videos={item.videos.reverse()} title={item.name + " Videos"} />
                    </Col>
                        }


                    
                
                {/*<!--CAST Section--> */}
                {item.crew.length > 0 &&
                    <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-bt-5x w100">
                        <h4 className="t-xl t-bold mar-b-2x">CAST</h4>
                        <hr/>
        
                        <GlideBox s={[2]} m={[3]} l={[4]} xl={[5]}  xxl={[7]} xxxl={[10]}>
                            {allCrews.map((crew,i) => <CrewCard  crew={crew} key={crew.person.name} /> )}
                        </GlideBox >
                    </Col>
                }

            </ContentContainer>
        </PageContainer>

    );
}

const TopPanel = React.memo(({item, authStatus, screenSize}) => (item.hasCover 
    ? <CoverPanel item={item}  status={authStatus} screen={screenSize} fav bookmark rating/>
    : <PosterPanel item={item}  status={authStatus} screen={screenSize} fav bookmark rating /> 
))

export default withRouter(React.memo(MoviePage))
