import React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Redirect, useHistory} from "react-router-dom";

import { ApolloProvider } from 'react-apollo'
import { ApolloClient, ApolloLink } from 'apollo-boost'
import {setContext} from "apollo-link-context"

import { createHttpLink } from 'apollo-link-http'
import { createUploadLink }  from 'apollo-upload-client'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from "apollo-link-error";

import { authError } from "./functions/form"
import './App.css';
//import "./styles/scss/main.scss";
import fetch from 'unfetch';


import { hydrate, render } from "react-dom";
import "core-js";
import { development, production } from "./styled-components"
import { Store } from "./store/store"
import { rgaStart , usePageViews} from "./functions"
import * as Sentry from '@sentry/browser';

//import { GET_DIRECTOR_LIST } from "./functions/gql"

//import "slick-carousel/slick/slick.css";
//import "slick-carousel/slick/slick-theme.css";
//import "../node_modules/tachyons/css/tachyons.min.css";

//import './App.scss';


//import "./modernscale.css"


const UriSwitcher = (uriType) =>{
    if(uriType===1) return 'https://pixly.app/graphql'
    else if(uriType===2) return 'https://127.0.0.1:8000/graphql/'
    //local https
    //else if(uriType===3)return 'https://localhost:8000/graphql/'
}
//try comment delete it later
const uri = UriSwitcher(1)// 1-Remote / 2-Local / 3- Local-upload

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors){
        graphQLErrors.map(({ message, locations, path }) =>{
            authError(message);
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        })}      
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("AUTH_TOKEN")
    return { headers: { ...headers, authorization: token ? `JWT ${token}` : `Bearer ${token}` } };
})



const httpLink = createHttpLink({
    uri , fetch:fetch,
})

const uploadLink = createUploadLink({
    uri , fetch:fetch
})

const link = authLink.concat(uploadLink)



/*---------------------------------*/
// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__APOLLO_STORE__;
//console.log("before delete", window.__APOLLO_STORE__)
delete window.__APOLLO_STORE__;

//console.log("index preloaded state :", preloadedState)
export const cache = new InMemoryCache().restore(preloadedState)
//
//// Allow the passed state to be garbage-collected
//

export const client = new ApolloClient({
    initialState:production ? cache : new InMemoryCache(),
    ssrMode:production,
    //cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink,  link]),
    ssrForceFetchDelay: 100,
    cache: cache,
})
// Tell react-snap how to save state


//window.__APOLLO_STORE__ =  client.extract()
window.snapSaveState = () => ({
  "__APOLLO_STORE__": client.extract()
});
//delete window.__APOLLO_STORE__;

/*----------------------------------------------------------------*/

/*----------------------------------------------------------------*/

export const GlobalContext = React.createContext();
export const SocialContext = React.createContext();

const whyDidYouRender = require('@welldone-software/why-did-you-render');
whyDidYouRender(React);

const Pixly = (props) =>{
    Sentry.init({ dsn: 'https://a7e21dc56a4c4ab5a8d48edc194bb5f2@sentry.io/1865994',
    release: 'my-project-name@2.3.12'

});
    //let history = useHistory();
    const state = Store()
    rgaStart()

//    useEffect(() => {
//        rgaStart()
//        //console.log("Google Analytics initialized")
//    },[])
    return (
    <ApolloProvider client={client}>
            <BrowserRouter>
                <GlobalContext.Provider value={state}>
                    <App renderType={props.renderType} />
                </GlobalContext.Provider>
            </BrowserRouter>
    </ApolloProvider>
)}

const rootElement = document.getElementById("root");



if (development){
    ReactDOM.render(<Pixly />, rootElement)
}
else{
    if (rootElement.hasChildNodes()) {
        ReactDOM.hydrate(<Pixly />, rootElement);
    } else {
        render(<Pixly />, rootElement);
    }
    
}
/*
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA


/*


ReactDOM.render(
    <Provider store={store} >
    <BrowserRouter>
        <ApolloProvider client={client}>
                <App />
                <ToastContainer />
        </ApolloProvider>
    </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)
*/