import React from 'react'
import { useState, useContext  } from "react";

import { Mutation } from 'react-apollo'
//import Tips from "../../components/Tips"
import { print } from "../functions/lib"
import { withRouter } from "react-router-dom"


import { SIGNUP_MUTATION, LOGIN_MUTATION, FORGET_PASSWORD, CONFIRM_FORGET_PASSWORD  } from "../functions/mutations"
import { Modal, useModal } from "cbs-react-components"
import { Input} from "cbs-react-components"
import { GlobalContext } from "../App";
import { emailValidator, passwordValidator, usernameValidator } from "../functions/form"
import { EnvelopeIcon, WarningIcon, InfoIcon, SuccessIcon } from "../assets/f-icons"

import "./AuthForms.css"


export const AuthForm = (props) =>{
    const state = useContext(GlobalContext)
    const { form } = props;
    //console.log("af ", form, props)

    const [ formType, setFormType ] = useState(form)
    //const [values, setValues] = useState({})

    const LoginFormRouted = withRouter(LoginForm)
    const SignupFormRouted = withRouter(SignupForm)
    const ForgetFormRouted = withRouter(ForgetForm)

    const show = state.modal
    if (!show) return <div></div>

    const renderForm = (form) => {
        if (form === "signup") {
            return <SignupFormRouted toggle={state.methods.toggleModal} />
        }
        else if (form === "login") {
            return <LoginFormRouted toggle={state.methods.toggleModal} />
        }
        else if (form === "forget") {
            return <ForgetFormRouted toggle={state.methods.toggleModal} />
        }
    }

    //console.log("form", form, formType)
    //console.log("Main values",values)


    return(
        <div className="form-main-box">
            <div className="auth-menu">
                <div onClick={() => formType!=="login" ?  setFormType("login") : null}  
                    className={formType === "login" ? "auth-menu-item active" : "auth-menu-item"}
                >
                    LOGIN
                </div>
                <div onClick={() => formType!=="signup" ?  setFormType("signup") : null}  
                    className={formType === "signup" ? "auth-menu-item active" : "auth-menu-item"}
                >
                    SIGNUP
                </div>
            </div>

            <div className="form-box">
                {renderForm(formType)}
            </div>

            <div className="action-box">
              
            </div>

            {formType !== "forget"  &&
            <p className="forget-text">
                Don't you remember ?
                <a onClick={() => formType !== "forget" ? setFormType("forget") : null} >
                    {" Recover Password"}
                </a>
            </p>}
        </div>
    )
}


const SignupForm = (props) => {
    const elements = {
        name: "",
        username: "",
        email: "",
        password: "",
        password2: "",
    }
    const state = useContext(GlobalContext)
    const [ values, setValues ] = useState(elements)
    const [ errors, setErrors ] = useState(elements)
    const [loading, setLoading] = useState(false)

    const [ formError, setFormError ] = useState("")


    function updateLocalValues(value) {
        const newValues = { ...values, ...value }
        if (values[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setValues(newValues)
        }
    }

    function updateLocalErrors(value) {
        const newErrors = { ...errors, ...value }
        if (errors[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setErrors(newErrors)
        }
    }

    function formValidation() {
        //Check Empty inputs
        const blankValues = Object.keys(values).filter(key => values[key].length ===0 )
        if (blankValues.length >0 ){
            setFormError(`You didn't fill all places. `)
            return false
        }
        //Check errors on inputs
        const errorMessages = Object.values(errors).filter(em => em.length > 0)
        if ( errorMessages.length > 0 ){
            setFormError(errorMessages[0])
            return false
        }
        //check password match again
        if (values.password !== values.password2){
            setFormError(`Passwords doesn't match`)
            return false
        }
        else{
            setFormError("")
            return true
        }
    }
    function mutationCompleteHandler(data) {
        const result = data.createUser.user.profile;
        localStorage.setItem("AUTH_TOKEN", result.token);
        localStorage.setItem("USERNAME", result.username);
        localStorage.setItem("USER_ID", result.id);
        state.methods.updateToken(result.token)
        state.methods.updateUsername(result.username)
        setLoading(false)

        setTimeout(() => {
            props.history.push(`/${result.username}/dashboard`);
            props.toggle()
        }, 1000)

    }
    function mutationErrorHandler(error) {
        print("mutation error: ", error)
        setLoading(false)
        setFormError(error.message)
    }

    function submitHandler(mutation) {
        const isValid = formValidation()
        if (isValid) {
            //props.dispatchValues(values)
            setLoading(true)
            mutation()
        }
    }

    return(
        <div className="auth-signup-form">
            {/* NAME */}
            <Input
                label={"Name"}
                type="text"
                placeholder={"Your Full Name"}
                getValue={(e) => updateLocalValues({name:e})}
                getError={e => updateLocalErrors({name:e})}
                validation={e => e.length>4}
                validationMessage={"Please enter a valid name"}
            />
            {/* USERNAME */}
            <Input
                label={"username"}
                type="text"
                placeholder={"Your Username"}
                getValue={(e) => updateLocalValues({ username: e })}
                getError={e => updateLocalErrors({ username: e })}
                validation={usernameValidator}
                validationMessage={"Username can only be consist of alphanumeric characters."}
            />

            {/* EMAIL */}
            <Input
                label={"email"}
                type="email"
                placeholder={"John@maildomain.com"}
                getValue={(e) => updateLocalValues({ email: e })}
                getError={e => updateLocalErrors({ email: e })}
                validation={emailValidator}
                validationMessage={"Please enter a valid mail adress."}
            />
            
            {/* PASSWORD */}
            <Input
                label={"password"}
                type="password"
                placeholder={"Password"}
                getValue={(e) => updateLocalValues({ password:e }) }
                getError={e => updateLocalErrors({ password: e })}
                validation={passwordValidator}
                validationMessage={"Password must be 8 alphanumeric-uupercase-lowercase."}
                />
            
            {/* PASSWORD 2 */}
            <Input
                type="password"
                placeholder={"Passwords again"}
                getValue={(e) => updateLocalValues({ password2: e })}
                getError={e => updateLocalErrors({ password2: e })}
                validation={e => values.password === e}
                validationMessage={"Password doesn't match"}
                />
            <p className="form-validation">{formError}</p>

            <Mutation
                mutation={SIGNUP_MUTATION}
                variables={{ ...values }}
                onCompleted={data => mutationCompleteHandler(data)}
                onError={(e) => mutationErrorHandler(e)}
            >
                {mutation => (
                    <button
                        className="btn primary w100 xs"
                        onClick={() => submitHandler(mutation)}
                    >
                        CREATE ACCOUNT
                    </button>
                )}
            </Mutation>

        </div>
    )
}

const LoginForm = (props) => {
    const state = useContext(GlobalContext)
    const [values, setValues] = useState({username:"", password:""})
    const [formError, setFormError] = useState("")
    const [loading, setLoading] = useState(false)


    function updateLocalValues(value) {
        //console.log("update value: ", value)
        const newValues = { ...values, ...value }
        if (values[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setValues(newValues)
        }
    }
    function formValidation() {
        //Check Empty inputs
        const blankValues = Object.keys(values).filter(key => values[key].length === 0)
        if (blankValues.length > 0) {
            setFormError(`You didn't fill all places. `)
            return false
        }
        else{
            setFormError("")
            return true
        }
    }
    function setLocalStorage(data){
        const result = data.tokenAuth.user.profile
        localStorage.setItem("AUTH_TOKEN", result.token);
        localStorage.setItem("USERNAME", result.username);
        localStorage.setItem("USER_ID", result.id);
    }
    async function mutationCompleteHandler(data){
        const result = data.tokenAuth.user.profile
        await setLocalStorage(data)
        setLoading(false)
        await state.methods.updateToken(result.token)
        await state.methods.updateUsername(result.username)
        //rgaSetUser();
        //_client(result);
        setTimeout(() =>{
            props.history.push(`/${result.username}/dashboard`);
            props.toggle();
        },1000)

    }
    function mutationErrorHandler(error){
        print("mutation error: ", error)
        setLoading(false)
        setFormError(error.message)
    }

    function submitHandler(mutation){
        const isValid = formValidation()
        if (isValid){
            //props.dispatchValues(values)
            setLoading(true)
            mutation()
        }
    }

    //props.dispatchValues(values)
    return(
        <div className="auth-login-form">
            <Input
                label={"username"}
                type="text"
                placeholder={"Your Username"}
                getValue={(e) => updateLocalValues({ username: e })}

            />
            <Input
                label={"password"}
                type="password"
                placeholder={"Password"}
                getValue={(e) => updateLocalValues({ password: e } )}
            
            />
            <p className="form-validation">{formError}</p>

            <Mutation
                mutation={LOGIN_MUTATION}
                variables={{ ...values}}
                onCompleted={data => mutationCompleteHandler(data)}
                onError={(error) => mutationErrorHandler(error)}
            >
                {(mutation) => (
                    <button
                        className="btn primary w100 xs"
                        onClick={() => submitHandler(mutation)}
                    >
                        LOGIN
            </button>
                )}
            </Mutation>

        </div>
    )
}



export const ForgetForm = (props) => {
    const [stage, setStage] = useState("one")

    const renderForm = (stage) => {
        if (stage === "one") {
            return <StageOne nextStage={() => setStage("two")} />
        }
        else if (stage === "two") {
            return <StageTwo />
        }
    }


    return (
        <div className="auth-forget-form">
            <p className="auth-menu-item t-center mar-b-4x mar-t-2x no-click">FORGET PASSWORD</p>
            <div className="form-box">
                {renderForm(stage)}
            </div>
        </div>
    )
}


//FORGET FORM SENT MAIL TO USERNAME
const StageOne = ({ nextStage }) => {
    const [result, setResult] = useState(null) // true false error
    const [values, setValues] = useState({ username: "" })
    const [responseMessage, setResponseMessage] = useState("")

    function responseIcon(result){
        if (result === true) return <EnvelopeIcon className="form-response-icon envelope-icon" />
        else if (result === false) return <InfoIcon className="form-response-icon info-icon" />
        else if (result === "error") return <WarningIcon className="form-response-icon warning-icon" />
    }

    function updateLocalValues(value) {
        //console.log("update value: ", value)
        const newValues = { ...values, ...value }
        if (values[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setValues(newValues)
        }
    }

    function formValidation() {
        //Check Empty inputs
        const blankValues = Object.keys(values).filter(key => values[key].length === 0)
        console.log("blank values", blankValues)
        if (blankValues.length > 0) {
            setResponseMessage(`You didn't fill all places. `)
            return false
        }
        else {
            setResponseMessage("")
            return true
        }
    }

    function submitHandler(mutation) {
        const isValid = formValidation()
        if (isValid) mutation()
    }

    const stageOneCompleteHandler = (data) => {
        console.log("Forget Password Stage-1 data", data);
        if (data.forgetPassword.status === true) {
            setResponseMessage("Please check your mailbox.")
            setResult(true)
        }
        if (data.forgetPassword.status === false) {
            setResponseMessage("We can't send you confirmation mail rightnow. Did you take veification mail before?" +
                ". Then click below. Otherwise try later please.")
            setResult(false)
        }
    }


    return (
        <div className="forget-stage pad-t-4x">
            {result === null &&
                <>
                    <Input
                        label={"username"}
                        type="text"
                        placeholder={"Enter Username"}
                        getValue={(e) => updateLocalValues({ username: e })}

                    />
                    
                </>}

            {/* FOR RESPONSE */}
            {responseIcon(result)}
            <p className={result === "error" ? "forget-response error" : "forget-response"}>{responseMessage}</p>

            {result === null &&
            <Mutation
                mutation={FORGET_PASSWORD}
                variables={{ username: values.username }}
                onCompleted={data => stageOneCompleteHandler(data)}
                onError={() => (
                    setResult("error"),
                    setResponseMessage("We are currently can not perform your request. Please try again later")
                )}
            >
                {mutation => (
                    <button
                        className="btn xs primary w100 mar-t-4x"
                        onClick={() => submitHandler(mutation)}
                    >
                        SEND CONFIRMATION MAIL
                        </button>
                )}
            </Mutation>
            }
            {/* NEXT STAGE */}
            {result !== "error" &&
                <button
                    className="btn secondary w100 xs "
                    onClick={nextStage}
                >
                    {result === null
                        ? "I HAVE CODE"
                        : result === true && "VERIFY YOUR CODE"
                    }
                </button>}
        </div>
    )
}

//FORGET FORM CONFIRM VERIFICATION AND CHANGE PASSWORD
const StageTwo = () => {
    const [result, setResult] = useState(null) // true false error
    const [values, setValues] = useState({ username: "", verificationCode: "", newPassword: "", newPassword2: "" })
    const [errors, setErrors] = useState({ username: "", verificationCode: "", newPassword: "", newPassword2: "" })
    const [formError, setFormError] = useState("")
    const [responseMessage, setResponseMessage] = useState("")

    function updateLocalValues(value) {
        //console.log("update value: ", value)
        const newValues = { ...values, ...value }
        if (values[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setValues(newValues)
        }
    }

    function updateLocalErrors(value) {
        const newErrors = { ...errors, ...value }
        if (errors[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setErrors(newErrors)
        }
    }
    function responseIcon(result) {
        if (result === true) return <SuccessIcon className="form-response-icon success-icon" />
        else if (result === false) return <InfoIcon className="form-response-icon info-icon" />
    }
    function formValidation() {
        //Check Empty inputs
        const blankValues = Object.keys(values).filter(key => values[key].length === 0)
        console.log("blank values", blankValues)
        if (blankValues.length > 0) {
            setFormError(`You didn't fill all places. `)
            return false
        }
        //Check errors on inputs
        const errorMessages = Object.values(errors).filter(em => em.length > 0)
        if (errorMessages.length > 0) {
            setFormError(errorMessages[0])
            return false
        }
        //check password match again
        if (values.newPassword !== values.newPassword2) {
            setFormError(`Passwords doesn't match`)
            return false
        }
        else {
            setFormError("")
            return true
        }
    }

    const stageTwoCompleteHandler = (data) => {
        print("Forget Password Stage-2 data", data);
        //dispatchValues(values)
        if (data.changeForgetPassword.status === true) {
            setResponseMessage("You successfully changed your password. You can login now")
            setResult(true)
        }
        if (data.changeForgetPassword.status === false) {
            setResponseMessage("We can't perform your request rightnow. Please try again later")
            setResult(false)
        }
    }
    function submitHandler(mutation) {
        const isValid = formValidation()
        if (isValid) mutation()
    }
    return (
        <div className="forget-stage">
            {result === null &&
                <>
                    <Input
                        label={"code"}
                        type="text"
                        placeholder={"Verification Code"}
                        getValue={(e) => updateLocalValues({ verificationCode: e })}
                    />

                    {/* USERNAME */}
                    <Input
                        label={"username"}
                        type="text"
                        placeholder={"Your Username"}
                        getValue={(e) => updateLocalValues({ username: e })}
                        getError={e => updateLocalErrors({ username: e })}
                    />

                    {/* PASSWORD */}
                    <Input
                        label={"password"}
                        type="password"
                        placeholder={"Password"}
                        getValue={(e) => updateLocalValues({ newPassword: e })}
                        getError={e => updateLocalErrors({ newPassword: e })}
                        validation={passwordValidator}
                        validationMessage={"Password must be 8 alphanumeric-uupercase-lowercase."}
                    />

                    {/* PASSWORD 2 */}
                    <Input
                        label={"Re-Password"}
                        type="password"
                        placeholder={"Passwords again"}
                        getValue={(e) => updateLocalValues({ newPassword2: e })}
                        getError={e => updateLocalErrors({ newPassword2: e })}
                        validation={e => values.newPassword === e}
                        validationMessage={"Password doesn't match"}
                    />

                    {result === null &&
                    <Mutation
                        mutation={CONFIRM_FORGET_PASSWORD}
                        variables={values}
                        onCompleted={data => stageTwoCompleteHandler(data)}
                        onError={() => (
                            setResult("error"),
                            setResponseMessage("We are currently can not perform your request. Please try again later")
                        )}
                    >
                        {mutation => (
                            <button
                                className="btn primary w100 xs"
                                onClick={() => submitHandler(mutation)}
                            >
                                CHANGE PASSWORD
                </button>
                        )}
                    </Mutation>}
                </>}

            {/* FOR RESPONSE */}
            <p className={"forget-response error"}>{formError}</p>
            {responseIcon(result)}
            <p className={result === "error" ? "forget-response error" : "forget-response"}>{responseMessage}</p>

        </div>
    )
}




/*
const FormState = () => {
    const elements = {
        name: "",
        username: "",
        email: "",
        password: "",
        password2: "",
        verificationCode: "",
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
    }
    function update(value) {
        console.log("pre-update elements: ", elements)
        const response = { ...elements, ...value }
        console.log("response", response)
        return response
    }
    return update
}


    // GENERAL ATTRIBUTES
    /*
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    console.log("form: ", form)
    console.log("show" ,show)
    console.log("name: ", name)
    console.log("username: ", username)
    console.log("email: ", email)
    console.log("password: ", password)
    console.log("password2:", password2)

    function dispatchValues(value) {
        const newValues = {  ...value }
        //console.table( newValues)
        //console.log("value",value)
        if (values[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setValues(newValues)
        }
    }

    function dispatchErrors(value) {
        const newErrors = { ...errors, ...value }
        //console.log("new errors", newErrors)
        if (errors[Object.keys(value)[0]] !== Object.values(value)[0]) {
            setErrors(newErrors)
        }
    }


*/
