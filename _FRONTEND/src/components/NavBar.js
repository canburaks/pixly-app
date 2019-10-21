import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
//import { connect } from "react-redux";

import { Mutation } from 'react-apollo'

import { logout } from "../functions/form";
import { LOGOUT_MUTATION } from "../functions/mutations";

import SearchBar from "./forms/Search"
import { print } from "../functions/lib"
import { useAuthCheck } from "../functions/hooks";

import {  SearchBox} from "cbs-react-components"

import "./NavBar.css";

import { movieAutoComplete } from "../functions/grec";
import { GlobalContext } from "../App";
import { AuthForm, ForgetForm } from "../forms/AuthForm"
import { UnderlineEffect, NewLink,Box, HomeDropdown, ProfileDropdown } from "../styled-components"
import { development } from "../index"


const BgTexture = React.memo(() => <div style={{backgroundImage:`url(https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/background/navbar-bg.jpg)`, backgroundSize:"cover", width:"100%", height:60, position:"absolute", top:-2, left:-2, zIndex:-1}}></div>)

const NavBar = props => {
    const { username, history, isAuthenticated, logoutDispatcher } = props;
    const authStatus = useAuthCheck()

    const state = useContext(GlobalContext)
    function navbarHider(){
            var prevScrollpos = window.pageYOffset;
            window.onscroll = function () {
                var currentScrollPos = window.pageYOffset;
                if (prevScrollpos > currentScrollPos) {
                    document.getElementById("new-nav").style.top = "0";
                } else {
                    if (window.scrollY > 120){
                        document.getElementById("new-nav").style.top = "-110px";
                    }
                }
                prevScrollpos = currentScrollPos;
            }
    }
    //navbarHider()
    const logOut = useCallback(() => {
        props.history.push("/")
        //await logoutDispatcher(async () => await sleep(2000));
        logout();
        //return <Redirect to="/" />;
    },[])

	const Brand2 = () => (
        <svg id="brand-svg" width="80" height="35" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.624 7.532C8.5 7.532 9.292 7.736 10 8.144C10.708 8.552 11.26 9.116 11.656 9.836C12.064 10.556 12.268 11.378 12.268 12.302C12.268 13.226 12.064 14.054 11.656 14.786C11.26 15.506 10.708 16.07 10 16.478C9.292 16.874 8.5 17.072 7.624 17.072C6.796 17.072 6.046 16.88 5.374 16.496C4.702 16.1 4.18 15.554 3.808 14.858V20.492H2.908V7.604H3.772V9.818C4.144 9.098 4.666 8.54 5.338 8.144C6.022 7.736 6.784 7.532 7.624 7.532ZM7.57 16.262C8.29 16.262 8.938 16.094 9.514 15.758C10.09 15.422 10.54 14.954 10.864 14.354C11.2 13.754 11.368 13.07 11.368 12.302C11.368 11.534 11.2 10.85 10.864 10.25C10.54 9.65 10.09 9.182 9.514 8.846C8.938 8.51 8.29 8.342 7.57 8.342C6.85 8.342 6.202 8.51 5.626 8.846C5.062 9.182 4.612 9.65 4.276 10.25C3.952 10.85 3.79 11.534 3.79 12.302C3.79 13.07 3.952 13.754 4.276 14.354C4.612 14.954 5.062 15.422 5.626 15.758C6.202 16.094 6.85 16.262 7.57 16.262Z" fill="#F0F0F0"/>
            <path d="M14.908 7.604H15.808V17H14.908V7.604ZM15.358 5.318C15.154 5.318 14.98 5.252 14.836 5.12C14.692 4.976 14.62 4.802 14.62 4.598C14.62 4.394 14.692 4.22 14.836 4.076C14.98 3.932 15.154 3.86 15.358 3.86C15.562 3.86 15.736 3.932 15.88 4.076C16.024 4.208 16.096 4.376 16.096 4.58C16.096 4.784 16.024 4.958 15.88 5.102C15.736 5.246 15.562 5.318 15.358 5.318Z" fill="#F0F0F0"/>
            <path d="M25.884 17L22.662 12.806L19.44 17H18.414L22.14 12.158L18.612 7.604H19.638L22.662 11.51L25.686 7.604H26.694L23.166 12.158L26.946 17H25.884Z" fill="#F0F0F0" fillOpacity="0.9"/>
            <path d="M29.908 3.644H30.808V17H29.908V3.644Z" fill="#F0F0F0" fillOpacity="0.75"/>
            <path d="M42.45 7.604L37.626 18.278C37.266 19.106 36.846 19.694 36.366 20.042C35.898 20.39 35.34 20.564 34.692 20.564C34.26 20.564 33.852 20.492 33.468 20.348C33.096 20.204 32.778 19.994 32.514 19.718L32.964 19.034C33.444 19.526 34.026 19.772 34.71 19.772C35.166 19.772 35.556 19.646 35.88 19.394C36.204 19.142 36.504 18.71 36.78 18.098L37.284 16.964L33.054 7.604H34.008L37.77 16.01L41.532 7.604H42.45Z" fill="#F0F0F0" fillOpacity="0.6"/>
        </svg>
    )

    const Brand = (props) => (
        <svg width={44} height={44} fill="none" {...props}>
        <circle cx={22} cy={22} r={22} fill="url(#prefix__paint0_angular)" />
        <circle cx={22} cy={22} r={20} fill="#000" />
        <path
          d="M10.92 17.52c.79 0 1.504.181 2.144.544.64.352 1.141.853 1.504 1.504.363.65.544 1.392.544 2.224 0 .843-.181 1.59-.544 2.24a3.888 3.888 0 01-1.504 1.52c-.63.352-1.344.528-2.144.528a4.092 4.092 0 01-1.856-.416 3.582 3.582 0 01-1.344-1.248v4.688H6.584v-11.52h1.088v1.664c.341-.555.79-.981 1.344-1.28.565-.299 1.2-.448 1.904-.448zm-.08 7.552c.587 0 1.12-.133 1.6-.4.48-.277.853-.667 1.12-1.168.277-.501.416-1.072.416-1.712 0-.64-.139-1.205-.416-1.696a2.883 2.883 0 00-1.12-1.168 3.14 3.14 0 00-1.6-.416c-.597 0-1.136.139-1.616.416-.47.277-.843.667-1.12 1.168-.267.49-.4 1.056-.4 1.696 0 .64.133 1.21.4 1.712.277.501.65.89 1.12 1.168.48.267 1.019.4 1.616.4zm6.028-7.488h1.136V26h-1.136v-8.416zm.576-1.84a.804.804 0 01-.592-.24.786.786 0 01-.24-.576c0-.213.08-.4.24-.56.16-.16.357-.24.592-.24.234 0 .432.08.592.24.16.15.24.33.24.544 0 .235-.08.432-.24.592a.804.804 0 01-.592.24zM25.964 26l-2.671-3.52L20.605 26h-1.28l3.328-4.32-3.168-4.096h1.28l2.528 3.296 2.528-3.296h1.248L23.9 21.68 27.26 26h-1.296zm2.628-11.872h1.136V26H28.59V14.128zM39.4 17.584l-4.208 9.424c-.341.79-.736 1.35-1.184 1.68-.448.33-.986.496-1.616.496-.405 0-.784-.064-1.136-.192a2.462 2.462 0 01-.912-.576l.528-.848c.427.427.939.64 1.536.64.384 0 .71-.107.976-.32.278-.213.534-.576.768-1.088l.368-.816-3.76-8.4h1.184l3.168 7.152 3.168-7.152h1.12z"
          fill="#fff"
        />
        <defs>
          <radialGradient
            id="prefix__paint0_angular"
            cx={0}
            cy={0}
            r={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0 22 -22 0 22 22)"
          >
            <stop offset={0.104} stopColor="#3437C7" />
            <stop offset={0.24} stopColor="#3D33CC" />
            <stop offset={0.389} stopColor="#5606FF" />
            <stop offset={0.537} stopColor="#4900C0" />
            <stop offset={0.758} stopColor="#3B04AD" />
            <stop offset={0.93} stopColor="#0025A8" />
          </radialGradient>
        </defs>
      </svg>
    )

    const navbartexture = {backgroundImage:`url(https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/background/navbar-bg.jpg)`, backgroundSize:"cover", width:"100%", zIndex:-1}
    const navbarcolor = (window.location.href.includes("/movie/") || window.location.href.includes("/list/"))  ? {opacity:0.3} : {opacity:1, ...navbartexture}
    //console.log("nav", window.screenTop)
    const HiddenLink = () => development && (
        <NewLink id="nav-directors" className="nav-page nav-item" to="/topics" rel="nofollow" >
            <UnderlineEffect rel="nofollow" >Topic</UnderlineEffect>
        </NewLink>
    )

    return (
        <nav id="new-nav">
            <div className="nav-blurbox" style={navbarcolor}/>
            <div className="brand-box nav-left pad-l-4x">
                <NewLink to="/" rel="nofollow" ><Brand /></NewLink>
            </div>
            
            <div className="nav-pages nav-middle">


                <NewLink id="nav-directors" className="nav-page nav-item" to="/directors/1" rel="nofollow" >
                    <UnderlineEffect rel="nofollow" >Directors</UnderlineEffect>
                </NewLink>


                <NewLink id="nav-lists" className="nav-page nav-item" to="/collections" rel="nofollow" >
                    <UnderlineEffect >Collections</UnderlineEffect>
                </NewLink>




                <Link id="nav-advance-search" className="nav-page nav-item" to="/advance-search" rel="nofollow">
                    <UnderlineEffect rel="nofollow">Search</UnderlineEffect>
                </Link>


            </div>
                {authStatus 
                    ?   <Box className="nav-actions nav-right">
                            <HomeDropdown username={state.username} />
                            <ProfileDropdown username={state.username}/>
                        </Box>

                :   <div className="nav-actions nav-right">
                    <SearchBox
                        item={{ image: "poster", text: "name" }}
                        query={movieAutoComplete}
                        className="my-search-box"
                        onClick={(value) => props.history.push(`/movie/${value.slug}`)}
                        onSubmit={data => props.history.push(`/movies/search/${data.input}/1`)}
                        placeholder="search"
                        animate
                    />
                        <a className="actions nav-item login" rel="nofollow" onClick={() => state.methods.insertAuthForm("login")}>Sign In</a>
                    </div>
                }



        </nav>
    );
}
export default withRouter(NavBar)