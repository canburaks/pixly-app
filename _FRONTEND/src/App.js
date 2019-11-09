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
import ExploreQuery from "./list/Explore";

import { AuthForm, ForgetForm } from "./forms/AuthForm"
import ContactForm from "./forms/ContactForm"

import { client, cache } from "./index"
import { useWindowSize,  usePageViews, rgaStart, useAuthCheck} from "./functions"
//import { ThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components'

import { Box, ScrollTopButton, navbarheight, PageContainer, Image } from "./styled-components"
import themes from './styled-components/theme'
import { Clippy } from './styled-components'
import { GlobalContext } from "./";
import { FacebookProvider } from 'react-facebook';


const App = (props) => {
    const globalstate = useContext(GlobalContext)
    //var cookie = document.cookie;
    //console.log("cookie", cookie)
    const authStatus = useAuthCheck()
    const MainPageRedirect =() => authStatus ? <Redirect to="/explore" /> : <MainPage />

    useEffect(() => {
        rgaStart()
        //console.log("Google Analytics initialized")
    },[])
    usePageViews()

    return (
    <ThemeProvider theme={themes.default}>
        <div className="App" theme="palette-1"  id="app-container">
            <NavBar />
            <Clippy />
            <Box minHeight="80vh" mt={navbarheight}>
                <Switch>
                    <Route exact path="/" component={MainPageRedirect} />
                    <Route path="/" component={Middle} />
                </Switch>
                
                <Modal isOpen={globalstate.modal} toggle={globalstate.methods.toggleModal}>
                    {globalstate.modalComponent}
                </Modal>
            </Box>
            <ScrollTopButton />
            <Footer />
        </div>
    </ThemeProvider>

    );
};




export default withRouter(App);