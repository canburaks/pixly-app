import React from "react";
import { useContext, useState, useReducer, useEffect, lazy, Suspense } from 'react';
import { useModal } from "cbs-react-components";
import { AuthForm, ForgetForm } from "../forms/AuthForm"

import { useWindowSize } from "../functions"
import { client, cache } from "../index"



export const Store = () => {
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
            signup: async function mutationCompleteHandler(data) {
                const profile = data.createUser.user.profile;
                localStorage.setItem("AUTH_TOKEN", profile.token);
                localStorage.setItem("USERNAME", profile.username);
                localStorage.setItem("USER_ID", profile.id);
                await state.methods.updateToken(profile.token)
                await state.methods.updateUsername(profile.username)        
                setTimeout(() => {
                    window.location = window.location.origin + `/${profile.username}/dashboard`;
                }, 1000)
                console.log("end of store signup function ", state.token, state.username)
            },
            login: async function(profile){
                console.log("store profile mutation data:", profile)
                localStorage.setItem("AUTH_TOKEN", profile.token);
                localStorage.setItem("USERNAME", profile.username);
                localStorage.setItem("USER_ID", profile.id);
                await state.methods.updateToken(profile.token);
                await state.methods.updateUsername(profile.username);
                setTimeout(() =>{
                    window.location = window.location.origin + `/${profile.username}/dashboard`
                    //history.push(`/${result.username}/dashboard`);
                },1000)
                console.log("end of store login function ",state.token, state.username)
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
                window.location = window.location.origin + "/"
            }
        }
    }

    return state
}
