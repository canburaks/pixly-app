import React from "react";
import { useContext, useState, useReducer, useEffect } from 'react';



import ReactGA from 'react-ga';
import { Route, Switch, Redirect, withRouter, useHistory,StaticRouter } from "react-router-dom"




import Footer from "./components/Footer"
import { useModal, Modal } from "cbs-react-components";

import { NavBar } from "./styled-components"


import Middle from "./containers/Middle"
import LandingPage from "./auth/LandingPage"
import MainPage from "./main-page/MainPage";
import MainPage2 from "./main-page/MainPage2";

import ExploreQuery from "./list/Explore";

import { AuthForm, ForgetForm } from "./forms/AuthForm"
import ContactForm from "./forms/ContactForm"

import { client, cache } from "./index"
import { useWindowSize,  usePageViews, rgaStart, useAuthCheck, useClientHeight} from "./functions"
//import { ThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components'

import { Box, ScrollTopButton, navbarheight, PageContainer, Image, SignupFormModal, Bot } from "./styled-components"
import themes from './styled-components/theme'
import { Clippy } from './styled-components'
import { GlobalContext } from "./";
import AdBlockDetect from 'react-ad-block-detect';


const App = (props) => {
    const globalstate = useContext(GlobalContext)
    const authStatus = useAuthCheck()
    const MainPageRedirect =() => authStatus ? <Redirect to="/lists-of-films" /> : <MainPage2 />

    useEffect(() => {
        rgaStart()
        //console.log("Google Analytics initialized")
    },[])
    usePageViews()
    const isPathIncludes = (pathname) => window.location.pathname.includes(pathname)

    const checkFooter = () => {
        let blacklist = ["lists-of-films",
            "topic", "list/",  "advance-search",
            "similar-movie-finder", "blog", "movie", "directors", "person"]
        return !blacklist.some(e => window.location.pathname.includes(e))
        
    }
    const haveFooter = checkFooter()
    const offsetfromtop = window.scrollY
    //console.log("canrunads", window.adsbygoogle)
    return (
    <ThemeProvider theme={themes.default}>
        <div className="App" theme="palette-1"  id="app-container">
            <NavBar />
            <Clippy />
            <Box minHeight="90vh" height="auto" >
                <Switch>
                    <Route exact path="/" component={MainPage2} />
                    <Route path="/" component={Middle} />
                </Switch>
                
                <Modal isOpen={globalstate.modal} toggle={globalstate.methods.toggleModal}>
                    {globalstate.modalComponent}
                </Modal>
            </Box>
            {haveFooter && <Footer />}
            <ScrollTopButton type="text"/>
            <Bot />
        </div>
    </ThemeProvider>

    );
};




export default withRouter(App);