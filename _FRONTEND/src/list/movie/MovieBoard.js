import React from "react";
import { useState, useContext } from "react"
import { withRouter, Link } from "react-router-dom";
import { Query } from "react-apollo";
//import  { useWindowSize } from "../../functions/hooks"
import { MOVIE_BOARD } from "../../functions/query"
import "./MovieList.css"


import { useAuthCheck } from "../../functions/hooks";
import { rgaPageView, Head, MidPageAd } from "../../functions/analytics"

import { GlobalContext } from "../../App";
import { GridBox, GridItem, SpeedyGridBox } from "../../components/GridBox" 
import JoinBanner from "../../components/JoinBanner.js"
import { movieAutoComplete } from "../../functions/grec";




const MovieBoard = (props) => {
    rgaPageView()
    const state = useContext(GlobalContext);
    const authStatus = useAuthCheck();


    //console.log("params", props.match)
    //console.log("Movie-Board", props)


    return (
        <div className="page-container">
            <Head
                description={"Pixly recently added movies"}
                title={`Pixly Movies`}
                canonical={`https://pixly.app/movies/${props.match.params.page}`}
            />
            {!authStatus &&  <JoinBanner />}
            <MovieBoardQuery {...props} />

        </div>

    )
}


const MovieBoardQuery = (props) => {

    const ppi = 12
    const currentPage = parseInt(props.match.params.page)
    const skip = (currentPage - 1) * ppi
    const first = ppi
    rgaPageView()
    return (
        <Query query={MOVIE_BOARD} variables={{ first, skip }} >
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                { window.scrollTo({ top: 0, left: 0, behavior: "smooth" }) }
                const initialMovies = data.listOfRecentMovies
                //console.log("movie-board",data)

                return(
                    <div className="content-container pad-lr-5vw mar-t-4x">
                        <Head
                            title="Up-to-Date - Pixly"
                            description={`Pixly recently added movies page:${currentPage}`}
                            keywords={["Newest movies", "latest movies", "pixly new movies"]}
                        />
                        <SpeedyGridBox movies ={initialMovies} header={"Recently Added"} />
                        
                        <div className="fbox-r jcc aic pag">
                            {currentPage > 1 &&
                                <div className="pag-item click t-bold  t-color-dark t-center click hover-t-underline">
                                    <Link rel="nofollow" to={`/movies/${currentPage - 1}`} >{"< Previous"}</Link>
                                </div>
                            }
                            <div className="pag-item t-bold  t-color-dark t-center t-underline" >
                                {currentPage}
                            </div>

                            <div className="pag-item t-bold  t-color-dark t-center click hover-t-underline">
                                <Link rel="nofollow" to={`/movies/${currentPage + 1}`} > Next ></Link>
                            </div>
                        </div>
                        <MidPageAd />

                    </div>
                )
            }}
        </Query>
    );
}


const Loading = () => (
    <div className="page-container">
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)

export default withRouter(MovieBoard)
