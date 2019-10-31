/* eslint-disable */
import React from "react";
import { useState, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { FAV_MUTATION, BOOKMARK_MUTATION } from "../../functions/mutations";
import { Mutation } from "react-apollo";
import { print } from "../../functions/lib"
import { rgaPageView, Head, MoviePageAd} from "../../functions/analytics"
import { useWindowSize } from "../../functions/hooks"
import { TagBox } from "../../components/TagBox"



import StarRating from "../../components/StarRating"

import { useAuthCheck } from "../../functions/hooks";
import {  Row, Col } from 'react-flexbox-grid';
//import WP from "../../components/VideoPlayer";
//import "cbs-web-components"sfd
import { YoutubePlayer, TextCollapse} from "cbs-react-components";
import "../pages.css";
import { GlobalContext } from "../../";
import { GridBox, GridItem } from "../../components/GridBox" 
import { SocialMedia } from "../../components/SocialMedia" 
import { useApolloClient } from 'apollo-boost'


const MoviePage = (props) => {
    rgaPageView();
    const { movie: item, viewer } = props.item;
    
    const authStatus = useAuthCheck()
    
    const [faved, setFav] = useState(item.isFaved)
    const [bookmarked, setBookmark] = useState(item.isBookmarked)

    const state = useContext(GlobalContext);
    if (viewer && viewer.points){
        state.methods.updatePoints(viewer.points);
    }



    const hasVideos = item.videos && item.videos.length >0 ? true : false
    const screenSize = useWindowSize()
    //const movieData = JSON.parse(item.data)

    //print("movie page: ", item)

    //Make ordered Crew List
    const directorArray = item.crew.filter(c => c.job == "D")
    const directorQuantity = directorArray.length

    const directorFilter = item.crew.filter(c => c.job == "D").map(d => Object.assign(d, { character: "Director" }))
    const actorList = item.crew.filter(c => c.job == "A").forEach(element => {
        directorFilter.push(element)
    });
    const genreTags = item.tags.filter(t => t.tagType==="genre")
    const otherTags = item.tags.filter(t => t.tagType != "genre")

    const similarMovies = item.similars ? item.similars : [];
    const BookmarkIcon = ({active=false}) =>(
        <svg 
            aria-hidden="true" focusable="false" 
            className={active ? "svg-inline--fa fa-bookmark fa-w-12 active f-icon" : "svg-inline--fa fa-bookmark fa-w-12 f-icon" }
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path fill="currentColor" d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"></path>
        </svg>
    )
    const FavIcon = ({active=false})=>(
        <svg 
            aria-hidden="true" focusable="false"
            className={active ? "svg-inline--fa fa-heart fa-w-16 active f-icon" : "svg-inline--fa fa-heart fa-w-16 f-icon" }
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path>
        </svg>
    )
    //console.log("genreTags", genreTags)
    ////console.log(JSON.stringify(item.videos))
    
    const directorObject = () => {
        if (directorQuantity === 1) {
            const d = directorArray[0]

            return (
                <div>
                    <Link key={"da" + d.person.id} to={`/person/${d.person.slug}`}  rel="nofollow">
                        <p className="op90 hover-t-underline movie-director-name" >{d.person.name}</p>
                    </Link>
                </div>)
        }

        else if (directorQuantity === 2) {
            const d1 = directorArray[0]
            const d2 = directorArray[1]
            const letters = d1.person.name.length + d2.person.name.length
            return (
                <div className="fbox-r jcfs aic pos-r">
                    <Link key={"da" + d1.person.id} to={`/person/${d1.person.slug}`} rel="nofollow">
                        <p 
                            className="op90 hover-t-underline movie-director-name" 
                            style={screenSize==="S" ? {fontSize:`calc(90vw / ${letters})`} : null}
                            
                        >{d1.person.name}</p>
                    </Link>
                    {" , "}
                    <Link key={"da" + d2.person.id} to={`/person/${d2.person.slug}`}  rel="nofollow">
                        <p 
                            className="op90 hover-t-underline movie-director-name" 
                            style={screenSize==="S" ? {fontSize:`calc(90vw / ${letters})`} : null}
                            
                        >
                        {d2.person.name} </p>
                    </Link>
                </div>)
        }
    }
    const CoverLeftPanel = () =>(
        <div className="cover-left-panel  fbox-c jcsa aic bor-r-w1 bor-color-semi-light">
            <Mutation
                mutation={BOOKMARK_MUTATION}
                variables={{ id: item.id }}
                onCompleted={(data) => (setBookmark(data.bookmark.movie.isBookmarked))}>
                {mutation => (
                    <div className="click" 
                        onClick={authStatus === true ? mutation : () => state.methods.insertAuthForm("login")}
                        title={authStatus ===true ? "Add to/Remove from Watchlist" : "Please Login for action."}
                    >
                        <BookmarkIcon style={{color:"red"}} active={bookmarked}/>
                    </div>
                )}
            </Mutation>
            <Mutation
                mutation={FAV_MUTATION}
                variables={{ id: item.id, type: "movie" }}
                onCompleted={(data) => setFav(data.fav["movie"].isFaved)}>
                {mutation => (
                    <div className="click" 
                        onClick={authStatus === true ? mutation : () => state.methods.insertAuthForm("login")}
                        title={authStatus ===true ? "Add to /Remove from Favourites" : "Please Login for action."}
                    >
                        <FavIcon active={faved} className="click" />
                    </div>
                )}
            </Mutation>
        </div>
    )

    const CoverPanel = () => (
        <div className={screenSize === "L" ? "cover-container-large movie" : "cover-container-small movie"} >
            <img className={screenSize === "L" ? "cover-image-large lazyload" : "cover-image-small lazyload"} alt={item.name + " poster"}
                title={item.name}
                src={item.coverPoster}
            />

            <div className={screenSize === "L" ? "cover-panel-large fbox-r jcfs ais" : "cover-panel-small fbox-r jcfs ais"}>
                {/* LEFT PANEL*/}
                <CoverLeftPanel />
                {/* MOVIE INFO & DIRECTOR */}
                <section className="cover-info-panel fbox-c jcc aifs ">
                    <header className="mar-b-5x">
                        <h1 className="t-xxl" >{`${item.name}  (${item.year})`}</h1>
                    </header>
                    <div className="fbox-r jcfs aic mar-t-x" >
                        {directorObject()}
                    </div>
                    <div className="asfs">
                        <StarRating id={item.id} rating={item.viewerRating} size={40} disabled={!authStatus} />
                    </div>

                    <div className="tag-box-1 fbox-r fw jcfs aic mar-bt-2x">
                        {genreTags.length > 0 && genreTags.map(t => (
                            <TagBox tag={t} key={t.id} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
    const PosterPanel = () =>(
        <div className="poster-container" >
            <div className="cover-panel-small fbox-r jcfs ais ">
                {/* LEFT PANEL*/}
                <CoverLeftPanel />
                {/* MOVIE INFO & DIRECTOR */}
                <section className="cover-info-panel fbox-c jcc aifs box-shadow-2" >
                    <header>
                        <h1 className="t-xxl" >{item.name}</h1>
                    </header>
                    <div className="fbox-r jcfs aic mar-t-x" >
                        {directorObject()}
                    </div>

                    <div style={{width:"auto", marginTop:10}}>
                        <StarRating id={item.id} rating={item.viewerRating} size={38} disabled={!authStatus} />
                    </div>
                    {/* BOTTOM PART-> TAGS */}
                    <div className="fbox-c jcfs aic w80 mar-t-2x" style={{maxWidth:"80%"}}>
                        {/* TAGS*/}
                        {genreTags.length > 0 &&
                            <div className="fbox-r jcfs aic fw">
                                {genreTags.map(t => (
                                    <TagBox tag={t} key={t.id} size={11} />
                                ))}
                            </div>}
                        <div className="fbox-r jcfs aic w100 pad-bt-4x">
                            {item.homepage && <SocialMedia homepage={item.homepage}size={32}  />}
                            {item.imdb && <SocialMedia imdb={item.imdb} size={32} />}
                            {item.twitter && <SocialMedia twitter={item.twitter} size={32} />}
                            {item.facebook && <SocialMedia facebook={item.facebook} size={32} />}
                            {item.instagram && <SocialMedia instagram={item.instagram} size={32} />}
                        </div>
                    </div>
                    <img src={item.poster}
                        style={{ position: "absolute", right: "5%", top: "10%", bottom: "10%", width: "auto", maxHeight: "80%" }}
                    />
                </section>
            </div>
        </div>
    )
    //window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
        



    return (
        <div 
            className={item.hasCover ? " page-container cover-true" : " page-container cover-false"} 
            >
            <Head
                title={item.seoTitle}
                description={item.seoShortDescription ?  item.seoShortDescription : item.seoDescription}
                richdata={item.richdata}
                keywords={item.seoKeywords}
                image={item.poster}
                canonical={`https://pixly.app/movie/${item.slug}/`}
            >
            </Head>



            {/* COVER CONTAINER*/}
            {(item.hasCover && state.speed === "fast") ? <CoverPanel /> : <PosterPanel />}
      


            {/*<!-- Page Container -->*/}
            <div className="content-container pad-lr-5vw" >

                <Row className="fbox-r jcc">
                    {item.summary && item.summary.length >50 && 
                    
                    <Col xs={12} md={12} lg={12} className="fbox-c jcfs pad-bt-5x pad-lr-2vw" >
                        <h4 className="t-xl t-bold mar-b-2x">Summary</h4>
                        <TextCollapse 
                            size={500}                //default 400
                            className="my-classname"  //className for text element p
                            toggleOpenLabel={"MORE"}  //default "MORE"
                            toggleCloseLabel={"LESS"} //default "LESS"
                        >
                            {item.summary}
                        </TextCollapse>
                    </Col>}
                  
                    

                </Row>

                <MoviePageAd />
                
                {/*<!--CAST Section-->*/}
                {item.crew.length > 0 &&
                    <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-bt-5x">
                        <h4 className="t-xl t-bold mar-b-2x">CAST</h4>
                        <hr/>
                        <GridBox size="m">
                            {directorFilter.slice(0, 6).map((crew, index) => (
                                <Link to={"/person" + `/${crew.person.slug}`} key={crew.person.id + index} key={crew.person.id}
                                    rel="nofollow">
                                    <GridItem
                                        title={crew.person.name}
                                        
                                        className={"box-shadow bor-rad-2x shadow"}
                                        
                                    >
                                        <img  className="bor-rad-2x lazyload mw100"
                                            src={crew.person.poster}
                                            alt={`${crew.person.name} Poster`}
                                        />
                                        <p className="t-s t-color-dark">{crew.person.name}</p>
                                        <p className="t-s t-italic t-color-dark">{crew.job === "A" ? "Acting" : "Director"}</p>
                                    </GridItem>
                                </Link>

                            ))}
                        </GridBox>
                    </Col>
                }

                {/*<!--APPEARS IN  LIST Section-->*/}
                {item.appears.length > 0 &&
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-bt-5x">
                    <h4 className="t-xl t-bold mar-b-2x">LISTS THAT INVOLVED</h4>
                    <hr/>

                    <GridBox size="m">
                        {item.appears.map((list, index) => (
                            <GridItem 
                                key={list.id + " " + index}
                                title={list.name}
                                className={"box-shadow bor-rad-2x shadow"}
                            >
                                <Link to={`/list/${list.slug}/1`}>
                                <img alt={`This movie is in the ${list.name}`}
                                    className="bor-rad-2x lazyload"
                                    src={list.relatedPersons[0].poster}
                                />
                            </Link>

                                <p className="t-s t-colorful t-bold">{list.name}</p>
                                <Link to={`/person/${list.relatedPersons[0].id}/${list.relatedPersons[0].slug}`}>
                                    <p className="t-xs hover-t-underline fl-l mw100 t-color-dark">
                                        {list.relatedPersons[0].name}
                                    </p>
                                </Link>
                            </GridItem>
                        ))}
                    </GridBox>
                </Col>}


                {/*<!--SIMILAR Section-->*/}
                {similarMovies.length > 0 &&
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-bt-5x">

                    <h4 className="t-xl t-bold mar-b-2x">PEOPLE ALSO LIKE</h4>
                    <p className="t-m mar-b-2x">
                        People who like <span className="t-bold">'{item.name}'</span> also like and give high ratings below movies.
                    </p>
                    <hr/>
                    <div className="grid-box small narrow" >
                        <GridBox size="m">
                            {similarMovies.map((movie, i) =>
                                <GridItem 
                                    title={movie.name}
                                    key={movie.id}
                                    className={"box-shadow bor-rad-2x shadow"}
                                >
                                    <Link to={`/movie/${movie.slug}`} key={movie.id + i} rel="nofollow">
                                        <img src={movie.poster} className="bor-rad-2x lazyload mw100" alt={`${movie.name} poster`} />
                                    </Link>
                                    <p className="t-s  t-italic t-color-dark t-bold ">
                                        {movie.name}
                                    </p>
                                </GridItem>

                                
                            )}
                        </GridBox>
    
                    </div>

                </Col>}

                {hasVideos > 0 && 
                <Col xs={12} md={12} lg={12} id="video-player-container" className="pad-bt-5x mar-t-5x pad-lr-2vw">
                        <YoutubePlayer videos={item.videos.reverse()} />
                </Col>}


            </div>

        </div>

    );
}

export default withRouter(MoviePage)
