import React from "react";
import { useState, useContext, useCallback } from "react"
import { withRouter } from "react-router-dom";



import { useAuthCheck } from "../../functions/hooks";
import {   Head, MidPageAd } from "../../functions/analytics"

import { GlobalContext } from "../../";

import {  
    MovieCoverBox, ProfileCircleBox, PageContainer,
    ContentContainer, PaginationBox, ListCoverPanel,
    TextSection,HiddenHeader, MovieRichCardBox,
    MovieRichCard, Grid
} from "../../styled-components"



const Loading = () => (
    <div className="page-container">
        <div className="loading-container fbox-c jcc aic">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} style={{width:"100", height:"100%"}} />
        </div>
    </div>
)


const MovieList = (props) => {
    //console.log("props",props.liste.isFollowed)
    const liste = props.liste
    const isFollowed = liste ? liste.isFollowed : null

    //const [liste, setListe ] = useState({id:"null",name:null, summary:"", isFollowed:false, followers:[] })
    const [follow, setFollow] = useState(isFollowed);
    const authStatus = useAuthCheck()
    const state = useContext(GlobalContext);

    const nextPage = useCallback(() => props.history.push(`/list/${listSlug}/${currentPage + 1}`),[currentPage, listSlug] )
    const prevPage = useCallback(() => props.history.push(`/list/${listSlug}/${currentPage - 1}`),[currentPage, listSlug] )

    //const screenSize = useWindowSize();
    const screenSize = state.screenSize;
    const listSlug = props.match.params.slug
    //console.log("movie query params", props.match.params)
    const ppi = 20
    const currentPage = parseInt(props.match.params.page)
    const isLargeScreen = screenSize.includes("L")

    return(
        <PageContainer>
            <Head
                description={liste.seoShortDescription ?  liste.seoShortDescription : liste.seoDescription}
                title={liste.seoTitle}
                richdata={liste.richdata}
                keywords={liste.seoKeywords}
                image={liste.coverPoster 
                        ? liste.coverPoster 
                        : liste.listType === "df" && liste.relatedPersons.length > 0 
                            ? liste.relatedPersons.poster
                            : null}
                canonical={`https://pixly.app${window.location.pathname}`}
            />

            <ListCoverPanel 
                blur={20} mb={[3]} 
                width={"100vw"} height={"56vw"} 
                item={liste}  
                authStatus={authStatus}
                screenSize={screenSize}
                isLargeScreen={isLargeScreen}
            />
            
            <ContentContainer>
                <HiddenHeader>{liste.name}</HiddenHeader>
                <TextSection 
                    header={liste.name} text={liste.summary} 
                    headerSize="xl" textSize="m" 
                    display={screenSize.includes("L") ? "none" : null}
                    />

                <MovieRichCardBox items={liste.movies} />
                    
                <MidPageAd />
                
                
                {liste.numMovies > ppi && 
                <PaginationBox 
                    currentPage={currentPage} 
                    nextPage={nextPage} 
                    prevPage={prevPage} 
                    totalPage={liste.numMovies} 
                    />}
                

                {/* FOLLOWERS PANEL*/}
                {liste.followers.length > 0 &&
                    <div className="fbox-c jcfs pad-lr-5x w100">
                        <h6>Followers</h6>
                        <hr />
                        <div className="w100 fbox-r jcfs aic mar-bt-3x" >

                        <ProfileCircleBox  items={liste.followers} columns={[4,6,8,10,12]} />

                        </div>
                    </div>}


                {/* REFERENCE */}
                {liste.referenceLink &&
                    <p className="t-italic t-xs op80 mar-t-x w100 mar-t-4x">
                        source:
                        <a className="hover-bor-b t-color-dark op80" 
                            target="_blank" rel="noopener"  href={liste.referenceLink}>{liste.referenceLink}</a>
                    </p>}
            </ContentContainer>

        </PageContainer>
    )
}


export default withRouter(MovieList)



/*
const MovieListQuery = (props) => {
    const listId = props.match.params.id
    //console.log("movie query params", props.match.params)
    const ppi = 20
    const currentPage = parseInt(props.match.params.page)
    const skip = (currentPage - 1) * ppi
    const first = ppi
    //console.log(first, skip)
    rgaPageView()
    return (
        <Query 
            query={LISTE} 
            variables={{ id: listId, first, skip }} 
            onCompleted={(data) => (props.setList(data[Object.keys(data)[0]]), props.setFollow(data[Object.keys(data)[0]].isFollowed) )}
            >
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                const item = data[Object.keys(data)[0]];
                const itemsCover = item.movies.filter(m => m.hasCover)
                const itemsPoster = item.movies.filter(m => !m.hasCover)
                //console.log("list item",data)
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                return (
                    <div>
                        <MidPageAd />
                        <SpeedyGridBox movies ={item.movies} />



                        {item.numMovies > ppi &&
                            <div className="fbox-r jcc aic pag mar-t-5x">
                                {currentPage > 1 &&
                                    <div className="pag-item click t-bold  t-color-dark t-center click hover-t-underline">
                                        <Link to={`/list/${listId}/${currentPage - 1}`}>{"< Previous"}</Link>
                                    </div>
                                }
                                <div className="pag-item t-bold  t-color-dark t-center t-underline" >
                                    {currentPage}
                                </div>

                                <div className="pag-item t-bold  t-color-dark t-center click hover-t-underline">
                                    <Link to={`/list/${listId}/${currentPage + 1}`} > Next ></Link>
                                </div>
                            </div>}
                        

                    </div>
                )
            }}
        </Query>
    );
}
<GridBox size="l">
    {itemsCover.map((movie) => (
        <Link to={`/movie/${movie.id}`} key={movie.id}>
            <GridItem cover
                title={movie.name + " " + movie.year}

                className="box-shadow bor-rad-2x shadow"
                image={movie.coverPoster}
                text={movie.name}
            >
            </GridItem>
        </Link>
    ))}
</GridBox>
<GridBox size="m">
    {itemsPoster.map((movie) => (
        <Link to={`/movie/${movie.id}`} key={movie.id}>
            <GridItem cover
                title={movie.name + " " + movie.year}

                className="box-shadow bor-rad-2x shadow"
                image={movie.poster}
                text={movie.name}
            >
            </GridItem>
        </Link>
    ))}
    </GridBox>
                            

    const sortedList = liste.movies.sort((a,b) => (a.year - b.year))

    const moviesSortedByYear = yearAscending ? sortedList : sortedList.reverse()
    const movieCover = moviesSortedByYear.filter(m => m.coverPoster !== "" && m.coverPoster !== null)
    const moviePoster = moviesSortedByYear.filter(m => m.coverPoster === null || m.coverPoster === "")
    const styles = { paddingBottom: "calc(100% * 0.95)" }

    const SlowSpeedRender = () =>(
        <div className="grid-container poster">
            {moviesSortedByYear.map(movie => (
                <div
                    className="grid-item bor-rad-2x" key={movie.id} itemProp="itemListElement"
                    itemScope itemType="http://schema.org/Movie"
                >
                    <Link to={`/movie/${movie.id}`} title={movie.name}>
                        <img
                            src={movie.poster}
                            itemProp="image" alt={`${movie.name} Poster`}
                            title={`${movie.name} Poster`}
                            alt={`${movie.name} poster`}
                            className="grid-image hover-shadow hover-border bor-rad-2x lazyload" />
                    </Link>
                    <div className="w100 fbox-c jcfs aic">
                        <StarRating
                            id={movie.id}
                            rating={movie.viewerRating}
                            size={22}
                            disabled={!authStatus}
                        />
                        <p className="t-s" itemProp="name">{movie.name}</p>
                    </div>
                </div>
            ))}
        </div>
    )
    const FastSpeedRender = () =>(
        <div>
            <div className="grid-container cover">
                {movieCover.map(movie => (
                    <div className="grid-item bor-rad-2x mr-bt20 hover-p" key={movie.id} itemProp="itemListElement"
                        style={styles}
                        itemScope itemType="http://schema.org/Movie">
                        <Link to={`/movie/${movie.id}`} title={movie.name}>
                            <img
                                src={movie.coverPoster}
                                itemProp="image" alt={`${movie.name} Poster`}
                                title={`${movie.name} (${movie.year})`}
                                alt={`${movie.name} cover poster`}
                                className="grid-image hover-shadow hover-border bor-rad-2x lazyload" />
                        </Link>
                        <div className="w100 fbox-c jcfs aic">
                            <StarRating
                                id={movie.id}
                                rating={movie.viewerRating}
                                size={24}
                                disabled={!authStatus}
                            />
                            <p className="t-s" itemProp="name">{movie.name}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid-container poster">
                {moviePoster.map(movie => (
                    <div className="grid-item bor-rad-2x" key={movie.id} itemProp="itemListElement" itemScope itemType="http://schema.org/Movie">
                        <Link to={`/movie/${movie.id}`} title={movie.name}>
                            <img
                                src={movie.poster}
                                itemProp="image" alt={`${movie.name} Poster`}
                                title={`${movie.name} Poster`}
                                alt={`${movie.name} poster`}
                                className="grid-image hover-shadow hover-border bor-rad-2x lazyload" />
                        </Link>
                        <div className="w100 fbox-c jcfs aic">
                            <StarRating
                                id={movie.id}
                                rating={movie.viewerRating}
                                size={22}
                                disabled={!authStatus}
                            />
                            <p className="t-s" itemProp="name">{movie.name}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )


    return(
        <div className="page-container">
            <Head
                description={liste.summary.length > 5 ? `${liste.summary}` : null}
                title={`${liste.name}`}
            />

            <div className="ml-cover-container">
<div className="ml-cover-panel fbox-r jcfs ais">
    <CoverLeftPanel />

    <section className="ml-cover-info-panel fbox-c jcsa aifs" itemScope itemType="http://schema.org/ItemList  http://schema.org/CreativeWork">
        <header>
            <h1 className="t-xxl" itemProp="name">{liste.name}</h1>
        </header>
        {liste.summary.length < 400 && <p className="t-s">{liste.summary}</p>}
        {liste.referenceLink && <p className="t-italic t-xs op80">source: <a className="hover-bor-b" target="_blank" rel="noopener" rel="https://pixly.app" href={liste.referenceLink}>{liste.referenceLink}</a></p>}
    </section>
</div>
            </div >


    <div className="content-container pad-lr-5vw">
        <GridBox size="xl">
            {movieCover.map(movie => (
                <Link to={`/movie/${movie.id}`} key={movie.id}>
                    <GridItem cover
                        className="box-shadow bor-rad-2x shadow"
                        title={movie.name}
                        image={movie.coverPoster}
                        text={movie.name}
                    />
                </Link>
            ))}
        </GridBox>
        <GridBox size="m">
            {moviePoster.map(movie => (
                <Link to={`/movie/${movie.id}`} key={movie.id}>
                    <GridItem cover
                        className="box-shadow bor-rad-2x shadow"
                        title={movie.name}
                        image={movie.poster}
                        text={movie.name}
                    />
                </Link>
            ))}
        </GridBox>

        <div className="mar-lr-5x">
        </div>

        {isOverflowed &&
            <Paginator
                ratio={liste.numMovies / offset}
            />}

        {liste.followers.length > 0 &&
            <div className="fbox-c jcfs pad-lr-5x">
                <h6>Followers</h6>
                <hr />
                <div className="w100 fbox-r jcfs aic mar-bt-3x" >
                    {liste.followers.map(profile => (
                        <Link to={`/user/${profile.username}`} key={"listfollower" + profile.username}>
                            <div title={profile.username}
                                className="bor-rad-circle"
                                style={{
                                    overflow: "hidden", height: 40, width: 40,
                                    backgroundImage: `url(${profile.avatar})`, backgroundPosition: "center",
                                    backgroundSize: "cover"
                                }}
                            >
                            </div>
                        </Link>
                    ))}
                </div>
            </div>}

    </div>
        </div >
    )
*/