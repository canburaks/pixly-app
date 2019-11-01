import React from "react";
import { useContext, useState, useReducer, useEffect } from 'react';



import ReactGA from 'react-ga';
import { Route, Switch, Redirect, withRouter, useHistory } from "react-router-dom"




import Footer from "./components/Footer"
import { useModal, Modal } from "cbs-react-components";

import { NavBar } from "./styled-components"


import Middle from "./containers/Middle"
import LandingPage from "./auth/LandingPage"
import MainPageQuery from "./main-page/MainPage";

import { AuthForm, ForgetForm } from "./forms/AuthForm"
import ContactForm from "./forms/ContactForm"

import { client, cache } from "./index"
import { useWindowSize,  usePageViews, rgaStart} from "./functions"
//import { ThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components'

import { Box, ScrollTopButton, navbarheight } from "./styled-components"
import themes from './styled-components/theme'
import { Clippy } from './styled-components'
import { GlobalContext } from "./";
import { FacebookProvider } from 'react-facebook';


const App = (props) => {
    const globalstate = useContext(GlobalContext)
    //var cookie = document.cookie;
    //console.log("cookie", cookie)


    useEffect(() => {
        rgaStart()
        //console.log("Google Analytics initialized")
    },[])
    usePageViews()

    return (
    <ThemeProvider theme={themes.default}>
        <FacebookProvider appId="371976677063927">
        <div className="App" theme="palette-1" >
            <NavBar />
            <Clippy />
            <Box minHeight="80vh" mt={navbarheight}>
                <Switch>
                    <Route exact path="/" component={MainPageQuery} />
                    <Route path="/" component={Middle} />
                </Switch>
                
                <Modal isOpen={globalstate.modal} toggle={globalstate.methods.toggleModal}>
                    {globalstate.modalComponent}
                </Modal>
            </Box>
            <ScrollTopButton />
            <Footer />
        </div>
        </FacebookProvider>
    </ThemeProvider>

    );
};




const Store = (history) => {
    const AUTH_TOKEN = localStorage.getItem("AUTH_TOKEN") || null
    const USERNAME = localStorage.getItem("USERNAME") || null
    const screen = useWindowSize()

    const [screenSize, setScreenSize ] = useState(screen)
    const [token, setToken] = useState(AUTH_TOKEN)
    const [username, setUsername] = useState(USERNAME)

    const [points, setPoints] = useState(0)
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false)

    //const [showLoginModal, setLoginModal] = useState(false)
    //const [showSignupModal, setSignupModal] = useState(false)
    const [showModal, setModal] = useState(false)
    const [modalComponent, setModalComponent] = useState(null)

    const { isOpen, toggle } = useModal();
    //console.log("store lcoation: ", url)
    //console.log("actual lcoation: ", location)


    useEffect(() =>{
        if (screen !== screenSize){
            //console.log("screen have changed")
            setScreenSize(screen)
        }
    })

    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
    let connectionType = connection ? connection.effectiveType : null //'slow-2g', '2g', '3g', or '4g'.
    let speed = connectionType ? connectionType === "4g" ? "fast" : "slow" : "fast"
    //console.log("Client Speed", speed)


    const state = {
        screenSize,
        username,
        token,
        points,
        speed,
        modal: showModal,
        modalComponent: modalComponent,
        isLeftPanelOpen: isLeftPanelOpen,
        //loginForm: showLoginModal,
        //signupForm: showSignupModal,

        methods: {
            //updateLoginForm: setLoginModal,
            //updateSignupForm: setSignupModal,
            updateModalComponent: setModalComponent,
            toggleLeftPanel: function () {
                setIsLeftPanelOpen(!isLeftPanelOpen)
            },
            toggleModal: function () {
                setModal(!showModal)
            },
            updatePoints: function (value) {
                if (value !== points) {
                    setPoints(value)
                }
            },


            insertAuthForm: function insertAuthForm(form) {
                //first insert updateform to state
                state.methods.updateModalComponent(() => <AuthForm form={form} />);
                //then opens the form
                state.methods.toggleModal()
            },
            insertContactForm: function insertContactForm() {
                //first insert updateform to state
                state.methods.updateModalComponent(() => <ContactForm  />);
                //then opens the form
                state.methods.toggleModal()
            },
            updateToken: async function (value) {
                if (value !== null) {
                    const localToken = localStorage.getItem("AUTH_TOKEN")
                    if (localToken !== value) {
                        localStorage.setItem("AUTH_TOKEN", value)
                        setToken(value)
                    }
                }
            },
            updateUsername: async function (value) {
                if (value !== null) {
                    const localUsername = localStorage.getItem("USERNAME")
                    if (localUsername !== value) {
                        localStorage.setItem("USERNAME", value)
                        setUsername(value)
                    }
                }
            },
            getUsername: function () {
                if (localStorage.getItem("USERNAME")) return localStorage.getItem("USERNAME")
                else {
                    if (username) return username
                    else return localStorage.getItem("USERNAME")
                }
            },
            logout: async function logout() {
                cache.reset()
                client.resetStore();
                localStorage.removeItem("USERNAME")
                localStorage.removeItem("AUTH_TOKEN")
                localStorage.clear("USERNAME");
                localStorage.clear("AUTH_TOKEN");
                localStorage.removeItem("LISTS");
                setUsername(null);
                setToken(null);
                history.push("/")
            }
        }
    }

    return state
}


export default withRouter(App);