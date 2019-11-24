import React from 'react'
import { useContext }  from "react";
import {  withRouter } from "react-router-dom"
import AOS from 'aos';
import { print, authCheck } from "../functions/lib"

import { rgaPageView, Head } from "../functions/analytics"
import { GlobalContext } from "../";

import 'aos/dist/aos.css'; // You can also use <link> for styles
import "./LandingPage2.css"

import { AuthForm, ForgetForm } from "../forms/AuthForm"


const LandingPage = (props) => {
    if (authCheck()) props.history.push("/")
    rgaPageView();
    const state = useContext(GlobalContext)
    

    AOS.init({
        // Global settings:
        disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
        startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
        initClassName: 'aos-init', // class applied after initialization
        animatedClassName: 'aos-animate', // class applied on animation
        useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
        throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


        // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
        offset: 100, // offset (in px) from the original trigger point
        delay: 200, // values from 0 to 3000, with step 50ms
        duration: 750, // values from 0 to 3000, with step 50ms
        easing: 'linear', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
        anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    });


    document.addEventListener('aos:in', ({ detail }) => {
        //console.log('animated in', detail);
    });

    document.addEventListener('aos:out', ({ detail }) => {
        //console.log('animated out', detail);
    });

    const Feature2 = () => (
        <div className="feature feature-box zin-1 sans-serif pad-bt-5x">
            <div className="zin-10 fbox-c jcfs aic " data-aos="fade-up-left" data-aos-anchor-placement="bottom-bottom">
                <h4 className="feature feature-name">Recommendations</h4>
                <p className="feature feature-text">
                    -  unique movie recommendations based on your cinema taste
                </p>
            </div>
        </div>
    )

    const Feature3 = () => (
        <div className="feature feature-box zin-1 sans-serif pad-bt-5x">
            <div className="zin-10 fbox-c jcfs aic " data-aos="fade-up-right" data-aos-anchor-placement="bottom-bottom">
                <h4 className="feature feature-name">Director Content </h4>
                <p className="feature feature-text">
                    -  favourite film lists of famous directors, videos essays, interviews...
                </p>
                <p className="feature feature-text">
                    -  videos essays, interviews...
                </p>
            </div>
        </div>
    )


    const Feature1 = () => (
        <div className="feature feature-box zin-1 sans-serif pad-bt-5x">
            <div className="zin-10 fbox-c jcfs aic " data-aos="fade-right" data-aos-anchor-placement="bottom-bottom">
                <h4 className="feature feature-name">Cinema Profile</h4>
                <p className="feature feature-text">
                    - keep and track your watchlist, favourite films, and ratings
                </p>
                <p className="feature feature-text">
                    - compare your cinema taste with your friends
                </p>
                <p className="feature feature-text">
                    - discover new movies from people 
                </p>
            </div>
        </div>
    )
    const Feature4 = () => (
        <div className="feature feature-box fbox-c jcfs aic zin-1 sans-serif pad-5x">

        </div>
    )
    const TwitterIcon = () => (
        <div className="icon-box fbox-r jcc t-bold hover-bor-b" title="@pixlymovie">
            <a target="_blank" rel={`https://pixly.app${window.location.pathname}`} href="https://twitter.com/pixlymovie">
                <svg style={{ height: 30, width: 30, color: "var(--color-light)" }}
                    aria-hidden="true" focusable="false" className="f-icon svg-inline--fa fa-twitter fa-w-16"
                    role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                >
                    <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                </svg>
            </a>
        </div>
    )
    


    const insertForgetForm = () => {
        //first insert updateform to state
        state.methods.updateModalComponent(() => <ForgetForm  />);
        //then opens the form
        state.methods.toggleModal()
    }

    return (
        <header className="sans-serif" id="landing-page">
            <Head
                description={
                    "Personal Cinema Assistant. Get Personalized movie recommendations based on your taste. "
                }
                title={"Pixly - Personal Movie Recommendations and After Movie Journey"}
                keywords={["pixly movie", "pixly movies", "pixly app", "Movie recommendation","movie suggestion",
                            "personalized recommendation", "ai movie recommendation", "movie recommendation engine"
                        ]}
            />
            
            <div className="cover bg-left bg-center-l vh100" 
            style={{ backgroundImage: "url(https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/background/Screenshot+from+2019-06-09+02-00-08.jpg)"}}>
                <div className="bg-black-80 pb5 pb6-m pb7-l vh100">

                    <nav className="">
                        <div className="fbox-c jcfs aic pad-bt-5x">
                            <h1 className="brand-text mar-t-5x">
                                pi
                                <span className="brand-sp-1">
                                    x
                                </span>
                                <span className="brand-sp-2">
                                    l
                                    </span>
                                <span className="brand-sp-3">
                                    y
                                    </span>
                            </h1>
                            <p className=" text-center text-uppercase t-color-light t-bold">Personal Cinema Assistant</p>
                            <p className="t-s op90 t-color-light">(We are currently in alpha version)</p>
                            <div className="tc-l mt4 mt5-m  ph3 pad-t-5x mar-t-5x">
                                <a
                                    className="signup-button f6 no-underline grow dib v-mid bg-blue white ba b--blue ph3 pv2 mb3"
                                    onClick={() => state.methods.insertAuthForm("signup") }>
                                    Create Account
                                </a>
                                <span className="dib v-mid ph3 white-70 mb3">or</span>
                                <a className="login-button f6 no-underline grow dib v-mid white ba b--white ph3 pv2 mb3"
                                    onClick={() => state.methods.insertAuthForm("login")}>
                                    Login
                                </a>
                            </div>

                        </div>
                    </nav>

                    <div className="fbox-c jcfs aic w100">
                        <Feature2 />
                        <Feature1 />
                        <Feature3 />
                        
                    </div>

                </div>
            </div>
            {/*<LoginForm
                show={showLoginModal}
                handleClose={() => setLoginModal(!showLoginModal)}
                formSwitcher={formSwitcher}
                place={"navbar"} />
            <SignupForm
                show={showSignupModal}
                handleClose={() => setSignupModal(!showSignupModal)}
                formSwitcher={formSwitcher}
            place={"navbar"} />*/}
        </header>
    );
};

export default withRouter(LandingPage)