import React from "react";
import { useContext, useState, useReducer, useEffect, lazy, Suspense } from 'react';

//import ErrorBoundary from "./auth/ErrorBoundary";
//import LoginForm from "./auth/forms/LoginForm"
//import SignupForm from "./auth/forms/SignupForm"

import { Route, Switch, Redirect, withRouter } from "react-router-dom"

import { rgaPageView, rgaStart } from "./functions/analytics"
//import { Helmet } from "react-helmet";
import { print, authCheck } from "./functions/lib"

//import NavBar from "./components/NavBar"

import Footer from "./components/Footer"
import { useModal, Modal } from "cbs-react-components";
//import ProfileUpdateForm from "./components/forms/ProfileUpdateForm"

import NavBar from "./components/NavBar"


//import { NavBar, SideBar } from "./components2/navbar/NavBar.js"
import Middle from "./containers/Middle"
import LandingPage from "./auth/LandingPage"
import MainPageQuery from "./main-page/MainPage";

import { AuthForm, ForgetForm } from "./forms/AuthForm"
import ContactForm from "./forms/ContactForm"

import { client, cache } from "./index"
import { useWindowSize, useScrollPosition} from "./functions"
//import { ThemeProvider } from 'styled-components'
import { ThemeProvider } from 'styled-components'

import themes from './styled-components/theme'
import { ScrollTopButton } from "./styled-components"
//import 'semantic-ui-css/semantic.min.css'


//const Middle = lazy(() => import(/* webpackMode: "lazy" */ /* webpackChunkName: "middle" */ "./containers/Middle"))
//const Lp = lazy(() => import(/* webpackMode: "lazy" */ /* webpackChunkName: "middle" */ "./containers/Middle"))
//import MicroModal from 'micromodal';  
//import MiniModal from './components/MiniModal';  

export const GlobalContext = React.createContext();

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

    useEffect(() =>{
        if (screen !== screenSize){
            console.log("screen have changed")
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
            logout: function logout() {
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


const App = (props) => {
    //print("App", props)
    const state = Store(props.history)
    const authStatus = authCheck()
    //console.log("is logged: ", authStatus)

    
    //console.log("App", state)
    //console.log("rendertype ",props.renderType)
    rgaStart()
    return (
    <ThemeProvider theme={themes.default}>
        <div className="App" theme="palette-1" >
            <GlobalContext.Provider value={state}>
                <NavBar />
                <div className="main-content-container">
                    <Switch>
                        <Route exact path="/welcome" component={MainPageQuery} />
                        <Route exact path="/" component={MainPageQuery} />
                        <Route path="/" component={Middle} />
                    </Switch>
                    
                    <Modal isOpen={state.modal} toggle={state.methods.toggleModal}>
                        {state.modalComponent}
                    </Modal>
                </div>
                <ScrollTopButton />
                <Footer />
            </GlobalContext.Provider>
        </div>
    </ThemeProvider>

    );
};


/*
<div className="App" theme="palette-1" >

    <GlobalContext.Provider value={state}>
        <NavBar />
        <div className="main-content-container">
            <Switch>
                <Route exact path="/welcome" component={MainPageQuery} />
                <Route exact path="/" component={MainPageQuery} />
                <Route path="/" component={Middle} />
            </Switch>
            <Modal isOpen={state.modal} toggle={state.methods.toggleModal}>
                {state.modalComponent}
            </Modal>
        </div>
        <Footer />
    </GlobalContext.Provider>
</div>


const isAuthenticated = () =>{
    if (!localStorage.getItem("AUTH_TOKEN") && !window.location.href.includes("login")){
        return <Redirect to="/login" />
    } else if (localStorage.getItem("AUTH_TOKEN") && window.location.href.includes("login")){
        return <Redirect to="/" />
    }
}
const isAuthenticatedPush = (props) => {
    if (!localStorage.getItem("AUTH_TOKEN") && !window.location.href.includes("login")) {
        props.history.push("/login");
        return <Login />
    } else if (localStorage.getItem("AUTH_TOKEN") && window.location.href.includes("login")) {
        props.history.push("/");
        return <Middle />

    }
}
*/
export default withRouter(App);