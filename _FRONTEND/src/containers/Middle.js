/* eslint-disable */
import React, {  useContext  }  from "react";

//import { connect } from "react-redux";
import { Route, Switch, Redirect, withRouter } from "react-router-dom"
import { Query } from "react-apollo";
import { useQuery } from '@apollo/react-hooks';

import { PERSONA, MOVIE, DIRECTOR_PERSON_MIX, PROFILE, LIST_BOARD, LISTE, MOVIE_SEARCH, MOVIE_BOARD, TAG_LIST } from "../functions/query";


//import MovieList from "../list/movie/MovieList";
//import MovieListQuery from "../list/movie/MovieListQuery";

import DirectorList from "../list/director/DirectorList";

//import DiscoverQuery from "../list/filter/DiscoverQuery";
import AdvanceSearch from "../list/advance-search/AdvanceSearch";

//import BarSearchList from "../list/search/BarSearchList";
//import BookmarkList from "../lists/BookmarkList";
//import RatingList from "../lists/RatingList";

import HomePage from "../pages/home/HomePage.js";

//import ProfilePage from "../pages/profile/ProfilePage.js";


//import TopicPage from "../pages/TopicPage.js";
//import ListBoard from "../list/lists/ListBoard";
import Collections from "../list/lists/Collections";

import MovieList from "../list/movie/MovieList";
import MovieBoard from "../list/movie/MovieBoard";
import BarSearch from "../list/search/BarSearch";

//import SearchMovieList from "../list/search/BarSearchList";


import  { print, authCheck } from "../functions/lib"
import  { rgaSetUser } from "../functions/analytics"

import MoviePage from "../pages/movie/MoviePage"
import PersonPage from "../pages/person/PersonPage";
import ProfilePage from "../pages/profil/ProfilePage";
import SearchPage from "../list/search/SearchPage";
import DraftPage from "../pages/DraftPage"

//import MovieQuery from "../pages/movie/MovieQuery.js";
//import MoviePage from "../pages/movie/MoviePage"

import { GlobalContext } from "../App";
//import { client, cache } from "../index"

//const QueryRouter = lazy(() => import("../pages/QueryRouter.js"));

const Loading = () => (
    <div className="page-container">
        {window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)

const Middle = (props) => {
    const state = useContext(GlobalContext)
    //console.log("middle ", props)
    rgaSetUser()
    return (
        <Switch>
            <Route exact path="/draft" component={DraftPage} />

            <Route exact path="/collections" component={CollectionsQuery} />
            {/*
            <Route exact path="/discover" component={DiscoverQuery} />
            <Route exact path="/discover/search" component={DiscoverQuery} />
            <Route exact path="/discover/search/:page" component={DiscoverQuery} />

            <Route exact path="/advance-search" component={AdvanceSearchQuery} />
        */}

            <Route exact path="/advance-search" component={SearchPage} />

            <Route exact path="/list/:slug/:page/" component={MovieListQuery} />


            
            <Route exact path="/directors/:page" component={DirectorList} />

            <Route path={`/user/:username/:menu`} component={UserQuery} />
            <Route exact path={`/user/:username`} component={UserQuery} />

            <Route exact path="/movie/:slug" component={MovieQuery} />
            <Route exact path="/movie/:slug/:text" component={MovieQueryRedirect} />
            {/*
            */}

            <Route exact path="/person/:slug" component={PersonQuery} />

            <Route exact path="/person/:slug/:id" component={PersonQuery} />

            <Route exact path="/movies/:page" component={MovieBoard} />

            <Route exact path="/movies/search/:query/:page" component={BarSearch} />
            {/*
            <Route exact path="/lists/:slug/:page" component={MovieListQuery} />
            <Route exact path="/movie/:id/:slug" component={MovieQuery} />
            <Route exact path="/person/:id/:slug" component={PersonQuery} />
            */}

            <Route exact path={`/${state.methods.getUsername()}/dashboard`} component={HomeQuery} />
            {authCheck() ? <Redirect to={`/${state.methods.getUsername()}/dashboard`} /> : <Redirect to="/" />}
            {/* 
            <Redirect to="/" />
            <Route exact path="/" component={authCheck() ? HomeQuery : Login } />
            */}
            
        </Switch>
    );
};
const HomeQuery = () => {
    const username = localStorage.getItem("USERNAME");
    return (
        <Query query={PERSONA} variables={{ username }}>
            {({ loading, error, data, refetch }) => {
                    if (loading) return <Loading />;
                    if (error) return <div className="gql-error">{JSON.stringify(error.message)}</div>;
                    return <HomePage data={data} refetch={refetch}/>
            }}
        </Query>
    );
};
const MovieQuery = (props) => {
    let shouldReplaceUrl = false
    let identifier = props.match.params.slug;
    const queryVariables = {}
    function is_numeric(str){
        return /^\d+$/.test(str);
    }
    if (is_numeric(identifier) && identifier.length < 6){
        queryVariables.id = identifier
        shouldReplaceUrl = true
    }
    else {
        queryVariables.slug = identifier
    }

    return (
        <Query query={MOVIE} variables={queryVariables} partialRefetch={true}>
            {({ loading, data, error, refetch, client }) => {
                    if (loading) return <Loading />;
                    if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                    if (data.movie && shouldReplaceUrl){
                        props.history.replace(`/movie/${data.movie.slug}`)
                    }
                    const item = data;

                    const movieCacheUpdate = (newData) => {
                        const oldData = client.readQuery({ query: MOVIE, variables:{slug:queryVariables.slug} });
                        const newMovieData = {...oldData.movie, ...newData}
                        oldData.movie = newMovieData;
                        client.writeQuery({ query: MOVIE, variables:{slug:queryVariables.slug}, data: oldData});
                        return null
                    }
                    //console.log("movie query data: ",data)
                    if (item == null || item.length === 0) return <div>{(console.log("zero"), refetch())}</div>
                    return <MoviePage item={item} viewer={data.viewer} cacheUpdate={movieCacheUpdate} />
            }}
        </Query>
    );
}

const MovieQueryRedirect = (props) => {
    let shouldReplace = false
    
    const queryVariables = {}
    const identifier = props.match.params.slug 
    const falseInfo = props.match.params.text
    
    if (identifier && falseInfo!==null){
        shouldReplace = true
        queryVariables.id = parseInt(identifier)
    }
    else queryVariables.slug = identifier
    return (
        <Query query={MOVIE} variables={queryVariables} >
            {({ loading, data, error, refetch }) => {
                    if (loading) return <Loading />;
                    if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                    if (data.movie && shouldReplace){
                        props.history.replace(`/movie/${data.movie.slug}`)
                    }
                    const item = data;
                    console.log("movie query data: ",data)
                    if (item == null || item.length === 0) return <div>{(console.log("zero"), refetch())}</div>
                    return <MoviePage item={item} viewer={data.viewer} />
            }}
        </Query>
    );
}


const PersonQuery = (props) => {
    let isImdbId = false
    const queryVariables = {}
    const slug = props.match.params.slug //slug can be imdb_id
    const id = props.match.params.id  //if id exists use id as slug
    console.log(slug, id)
    //case of-->  /person/nm0001676/
    if (slug.startsWith("nm") && !id){
        isImdbId = true
        queryVariables.id = slug
    }
    //case of --->   /person/nm0001676/nicolas-roeg-14132
    else if (slug.startsWith("nm") && (id && id.length > 5)){
        const trueSlug = id
        return <Redirect to={`/person/${trueSlug}`} />
    }
    else queryVariables.slug = slug

    return (
        <Query query={DIRECTOR_PERSON_MIX} variables={queryVariables} partialRefetch={true}>
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                //console.log(data)
                if (data.directorPersonMix && isImdbId){
                    props.history.replace(`/person/${data.directorPersonMix.slug}`)
                }
                return <PersonPage item={data} parentProps={props} refetch={refetch} />
            }}
        </Query>
    );
}

const UserQuery = (props) => {
    return (
        <Query query={PROFILE} variables={{ username: props.match.params.username }} >
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                return <ProfilePage item={data} parentProps={props} refetch={refetch} />
            }}
        </Query>
    );
}


const CollectionsQuery = (props) => {
    return (
        <Query query={LIST_BOARD} variables={{ admin: true }} partialRefetch={true}  >
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                const item = data[Object.keys(data)[0]];

                return <Collections liste={item} viewer={data[Object.keys(data)[1]]} />
            }}
        </Query>
    );
}


const AdvanceSearchQuery = (props) => {
    return (
        <Query query={TAG_LIST}>
            {({ loading, data, error, refetch }) => {
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                //console.log("data ",data)
                return <AdvanceSearch tags={data.listOfTags} />
            }}
        </Query>
    );
}

const MovieListQuery = (props) => {
    let shouldReplace = false
    function is_numeric(str){
        return /^\d+$/.test(str);
    }
    
    //const currentPage = parseInt(props.match.params.page)
    const queryVariables = { }

    const identifier = props.match.params.slug 

    if (identifier.length < 5 && is_numeric(identifier) ){
        shouldReplace = true
        queryVariables.id = parseInt(identifier)
    }
    else queryVariables.slug = identifier
    //queryVariables.page = parseInt(props.match.params.page)
    return (
        <Query query={LISTE} variables={{page:parseInt(props.match.params.page) ,...queryVariables}} 
            partialRefetch={true} fetchPolicy="cache-and-network">
            {({ loading, data, error, fetchMore }) => {
                //console.log("ml qv: ", {page:parseInt(props.match.params.page) ,...queryVariables})
                if (loading) return <Loading />;
                if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                if (data.liste && shouldReplace){
                    //console.log("data", data.liste.slug)
                    props.history.replace(`/list/${data.liste.slug}/1`)
                }
                //console.log("data-loading-error",data, loading, error)
                const item = data[Object.keys(data)[0]];
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                return <MovieList liste={item} viewer={data[Object.keys(data)[1]]} fetchMore={fetchMore} />
            }}
            </Query>
    );
}

export default withRouter(Middle);


/*
cconst MovieQuery = (props) => {
    let shouldReplaceUrl = false
    let identifier = props.match.params.slug;
    const queryVariables = {}
    function is_numeric(str){
        return /^\d+$/.test(str);
    }
    if (is_numeric(identifier) && identifier.length < 6){
        queryVariables.id = identifier
        shouldReplaceUrl = true
    }
    else {
        queryVariables.slug = identifier
    }
    const { loading, error, data, refetch,updateQuery } = useQuery(MOVIE, {variables: { queryVariables }});
    if (loading) return <Loading />;
    if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
    if (data.movie && shouldReplaceUrl){
        props.history.replace(`/movie/${data.movie.slug}`)
    }
    const item = data;
    
    //console.log("movie query data: ",data)
    if (item == null || item.length === 0) return <div>{(console.log("zero"), refetch())}</div>
    return <MoviePage item={item} viewer={data.viewer} />
    return (
        <Query query={MOVIE} variables={queryVariables} partialRefetch={true}>
            {({ loading, data, error, refetch }) => {
                    if (loading) return <Loading />;
                    if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                    if (data.movie && shouldReplaceUrl){
                        props.history.replace(`/movie/${data.movie.slug}`)
                    }
                    const item = data;
                    
                    //console.log("movie query data: ",data)
                    if (item == null || item.length === 0) return <div>{(console.log("zero"), refetch())}</div>
                    return <MoviePage item={item} viewer={data.viewer} />
            }}
        </Query>
    );
}



const MovieQuery = (props) => {
    let shouldReplaceUrl = false
    let identifier = props.match.params.slug;
    const queryVariables = {}
    function is_numeric(str){
        return /^\d+$/.test(str);
    }
    if (is_numeric(identifier) && identifier.length < 6){
        queryVariables.id = identifier
        shouldReplaceUrl = true
    }
    else {
        queryVariables.slug = identifier
    }
    return (
        <Query query={MOVIE} variables={queryVariables} partialRefetch={true}>
            {({ loading, data, error, refetch }) => {
                    if (loading) return <Loading />;
                    if (error) return <div className="gql-error">{JSON.stringify(error)}</div>;
                    if (data.movie && shouldReplaceUrl){
                        props.history.replace(`/movie/${data.movie.slug}`)
                    }
                    const item = data;
                    
                    //console.log("movie query data: ",data)
                    if (item == null || item.length === 0) return <div>{(console.log("zero"), refetch())}</div>
                    return <MoviePage item={item} viewer={data.viewer} />
            }}
        </Query>
    );
}
*/
