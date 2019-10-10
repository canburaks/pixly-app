import React, { useEffect, useState, useContext } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

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

const SideBar = props => {
    const { username, history, isAuthenticated, logoutDispatcher } = props;
    const authStatus = useAuthCheck()

    const state = useContext(GlobalContext)
    //console.log("nav", state.username)
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
    navbarHider()
    const logOut = () => {
        props.history.push("/")
        //await logoutDispatcher(async () => await sleep(2000));
        logout();
        //return <Redirect to="/" />;

    };


	const Brand = () => (
            <svg width="80" height="35" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.624 7.532C8.5 7.532 9.292 7.736 10 8.144C10.708 8.552 11.26 9.116 11.656 9.836C12.064 10.556 12.268 11.378 12.268 12.302C12.268 13.226 12.064 14.054 11.656 14.786C11.26 15.506 10.708 16.07 10 16.478C9.292 16.874 8.5 17.072 7.624 17.072C6.796 17.072 6.046 16.88 5.374 16.496C4.702 16.1 4.18 15.554 3.808 14.858V20.492H2.908V7.604H3.772V9.818C4.144 9.098 4.666 8.54 5.338 8.144C6.022 7.736 6.784 7.532 7.624 7.532ZM7.57 16.262C8.29 16.262 8.938 16.094 9.514 15.758C10.09 15.422 10.54 14.954 10.864 14.354C11.2 13.754 11.368 13.07 11.368 12.302C11.368 11.534 11.2 10.85 10.864 10.25C10.54 9.65 10.09 9.182 9.514 8.846C8.938 8.51 8.29 8.342 7.57 8.342C6.85 8.342 6.202 8.51 5.626 8.846C5.062 9.182 4.612 9.65 4.276 10.25C3.952 10.85 3.79 11.534 3.79 12.302C3.79 13.07 3.952 13.754 4.276 14.354C4.612 14.954 5.062 15.422 5.626 15.758C6.202 16.094 6.85 16.262 7.57 16.262Z" fill="#F0F0F0"/>
                <path d="M14.908 7.604H15.808V17H14.908V7.604ZM15.358 5.318C15.154 5.318 14.98 5.252 14.836 5.12C14.692 4.976 14.62 4.802 14.62 4.598C14.62 4.394 14.692 4.22 14.836 4.076C14.98 3.932 15.154 3.86 15.358 3.86C15.562 3.86 15.736 3.932 15.88 4.076C16.024 4.208 16.096 4.376 16.096 4.58C16.096 4.784 16.024 4.958 15.88 5.102C15.736 5.246 15.562 5.318 15.358 5.318Z" fill="#F0F0F0"/>
                <path d="M25.884 17L22.662 12.806L19.44 17H18.414L22.14 12.158L18.612 7.604H19.638L22.662 11.51L25.686 7.604H26.694L23.166 12.158L26.946 17H25.884Z" fill="#F0F0F0" fillOpacity="0.9"/>
                <path d="M29.908 3.644H30.808V17H29.908V3.644Z" fill="#F0F0F0" fillOpacity="0.75"/>
                <path d="M42.45 7.604L37.626 18.278C37.266 19.106 36.846 19.694 36.366 20.042C35.898 20.39 35.34 20.564 34.692 20.564C34.26 20.564 33.852 20.492 33.468 20.348C33.096 20.204 32.778 19.994 32.514 19.718L32.964 19.034C33.444 19.526 34.026 19.772 34.71 19.772C35.166 19.772 35.556 19.646 35.88 19.394C36.204 19.142 36.504 18.71 36.78 18.098L37.284 16.964L33.054 7.604H34.008L37.77 16.01L41.532 7.604H42.45Z" fill="#F0F0F0" fillOpacity="0.6"/>
            </svg>
	)

    return (
        <nav id="side-nav">
        </nav>
    );
}
export default withRouter(SideBar)