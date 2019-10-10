import React, { useState, useEffect, useRef, ReactDOM } from 'react'
import { Route, Switch, Redirect, withRouter } from "react-router-dom"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import AnimakitRotator from 'animakit-rotator';


const AuthForm = ({ show, handleClose}) =>{

    const [showLoginModal, setLoginModal] = useState(reactor.authModal)
    const [showSignupModal, setSignupModal] = useState(false)


    const formSwitcher = () => {
        if (showLoginModal !== showSignupModal) {
            setLoginModal(!showLoginModal);
            setSignupModal(!showSignupModal);
        }
    }
    return(
        <>
            <LoginForm
                show={showLoginModal}
                handleClose={() => setLoginModal(!showLoginModal)}
                formSwitcher={formSwitcher}
            />
            <SignupForm
                show={showSignupModal}
                handleClose={() => setSignupModal(!showSignupModal)}
                formSwitcher={formSwitcher}
            />
        </>
    )
}

export default AuthForm;