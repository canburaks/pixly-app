import React from "react";
import { useState, useContext } from "react"
import { withRouter, Link } from "react-router-dom";
import { Query } from "react-apollo";
//import  { useWindowSize } from "../../functions/hooks"
import { SEARCH } from "../../functions/query"


import { useAuthCheck } from "../../functions/hooks";
import { rgaPageView, Head } from "../../functions/analytics"

import { GlobalContext } from "../../App";
import { GridBox, GridItem, SpeedyGridBox } from "../../components/GridBox"





const MovieSearch = (props) => {
    const state = useContext(GlobalContext);
    const authStatus = useAuthCheck();


    //console.log("params", props.match)
    //console.log("Movie-Board", props)

    const CoverPanel = () => (
        <div className="cover-panel-small home fbox-c jcc">
            <div className="anonymous-header">
                <h1 title="Click and Join"
                    className="click"
                    onClick={() => state.methods.updateSignupForm(true)}>
                    <span className="t-xl">JOIN NOW</span>
                </h1>
                <ul className="pad-lr-5x mar-t-4x">
                    <li className="t-s">Get personalized recommendations</li>
                    <li className="t-s">Advance search</li>
                </ul>
            </div>
        </div>
    )
    console.log(props.match.params.query)
    return (
        <div className="page-container">
            <Head
                canonical={`https://pixly.app/movies/search/${props.match.params.query}/1`}
            />
            {!authStatus && <CoverPanel />}
            <MovieSearchQuery {...props} search={props.match.params.query} />

        </div>

    )
}


const MovieSearchQuery = (props) => {
    const ppi = props.ppi ? props.ppi :20
    const currentPage = parseInt(props.match.params.page)
    const skip = (currentPage - 1) * ppi
    const first = ppi

    const search = props.search


    return (
        <Query query={SEARCH} variables={{search, first, skip }} >
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                console.log("movie-search",data)
                const result = data.search.movies
                const resultCover = result.filter(m => m.hasCover)
                const resultPoster = result.filter(m => !m.hasCover)
                const length = data.search.length

                const totalPageNumber = Math.ceil(length / ppi)
                const isOverflowed = length > ppi;
                return (
                    <div className="content-container pad-lr-5vw mar-t-5x">
                        <Head
                            description={`Pixly search term: ${search}`}
                            title={`Pixly Search: ${search}`}
                        />
                        <SpeedyGridBox movies={result} header={`Search: ${search}`} />
                        {/*
                        <h4 className="t-xl t-bold mar-b-2x">Search: <span className="t-m t-italic t-light">{search}</span></h4>
                        <GridBox size="l">
                            {resultCover.map((movie) => (
                                <Link to={`/movie/${movie.id}`} key={movie.id}  rel="nofollow">
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
                            {resultPoster.map((movie) => (
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
                            </GridBox>*/}
                        {isOverflowed &&
                        <div className="fbox-r jcc aic pag">
                            {currentPage > 1 &&
                                <div className="pag-item click t-bold  t-color-dark t-center click hover-t-underline">
                                    <Link to={`/movies/search/${search}/${currentPage - 1}`}>{"< Previous"}</Link>
                                </div>
                            }
                            <div className="pag-item t-bold  t-color-dark t-center t-underline" >
                                {currentPage}
                            </div>

                            {(currentPage < totalPageNumber) &&
                            <div className="pag-item t-bold  t-color-dark t-center click hover-t-underline">
                                <Link to={`/movies/search/${search}/${currentPage + 1}`} > Next ></Link>
                            </div>}
                        </div>}

                    </div>
                )
            }}
        </Query>
    );
}


const Loading = () => (
    <div className="page-container">
        {window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)

export default withRouter(MovieSearch)
