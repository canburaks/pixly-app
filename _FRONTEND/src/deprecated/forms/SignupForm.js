import React, { useState } from 'react'
import { connect } from "react-redux";
import { Mutation } from 'react-apollo'
import Tips from "../../components/Tips"
import { print } from "../../functions/lib"
import {  withRouter } from "react-router-dom"


import { SIGNUP_MUTATION,  } from "../../functions/mutations"

import { emailValidator, passwordValidator } from "../../functions/form"

import { rgaPageView, rgaSetUser } from "../../functions/analytics"
import { Button, Checkbox, Form, Input, Header } from 'semantic-ui-react'
import { XIcon } from "../../assets/f-icons"

//const bg2 = require("../assets/bg-2.jpg")
//const bgAdress = "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/bg2.jpg"

const SignupForm = (props) => {
    const { show, handleClose, formSwitcher } = props; 
    rgaPageView()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")

    const [email, setEmail] = useState("")
    const [emailInfo, setEmailInfo] = useState("")

    const [password, setPassword] = useState("")
    const [passwordInfo, setPasswordInfo] = useState("")

    const [rePassword, setRePassword] = useState("")
    const [passwordMatchInfo, setPasswordMatchInfo] = useState("")

    const [error, setError] = useState("")
    if (!show) return <div></div>


    const _confirm = data => {
        const result = data.createUser.user.profile;
        localStorage.setItem("AUTH_TOKEN", result.token);
        localStorage.setItem("USERNAME", result.username);
        localStorage.setItem("USER_ID", result.id);

        rgaSetUser();
        _client(result);
        props.history.push(`/`);
        handleClose()
    }
    const _client = async (result) => {
        const token = result.token;
        const profile = result;
        await props.loginDispatcher(token);
        await props.clientDispatcher(profile);
    }

    const emailTip = (text) => {
        if (text==="") return ""
        else if (emailValidator(text)) return "OK"
        return "Enter a valid email adress!"
    }
    const passwordValidityTip = (text) => {
        if (text==="") return ""
        else if (passwordValidator(text)) return "OK"
        return "Password must be minimum 8 characters, Uppercase and Lowercase."
    }
    const passwordMatchTip = (text) => {
        if (text==="") return ""
        else if (text===password) return ""
        return "- Passwords doesn't match."
    }

    function finalCheck(){
        if (emailTip(email) === "OK" && passwordValidityTip(password) === "OK" && rePassword === password) return true
        return false
    }
    const handleSubmit = (e, mut) => {
        e.preventDefault();
        mut()
    }
    const modalClassName = show ? "form-modal form-signup-modal fbox-c jcfs aic" : "hidden form-modal form-signup-modal fbox-c jcfs aic"
    return (
        <div className={modalClassName} id="signup-form-modal">
            <Mutation
                mutation={SIGNUP_MUTATION}
                variables={{ password, username, email, name }}
                onCompleted={data => (print("signup::Mutation", data), _confirm(data))}
                onError={(e) => setError(e.message)}
            >
                {mutation => (
                    <Form className="signup-form" onSubmit={e => handleSubmit(e, mutation)}>
                        <h4 className="text-bold mar-t-5x">SIGN UP</h4>

                        <Form.Field required>
                            <label className="form-label">Name</label>
                            <Input fluid
                                className="ui form-input"
                                placeholder='Full Name' type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field required>
                            <label className="form-label">Username</label>
                            <Input fluid
                                className="ui form-input"
                                placeholder='Your username' type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field required>
                            <label className="form-label">Email <span className="field-validation">{emailTip(email)}</span></label>
                            <Input fluid
                                className="ui form-input"
                                placeholder='Mail adress' type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Field>

                        <Form.Field required>
                            <label className="form-label">Password </label><span className="field-validation">{passwordValidityTip(password)}{" "}{passwordMatchTip(rePassword)}</span>
                            <Input fluid
                                className="ui form-input"
                                placeholder='Pass..' type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field required>
                            <Input fluid
                                className="ui form-input"
                                placeholder='Password again' type="password"
                                required
                                value={rePassword}
                                onChange={e => setRePassword(e.target.value)}
                            />
                        </Form.Field>
                        <p className="form-error form-signup-error" >{error}</p>

                        <button type="submit" disabled={!finalCheck()} id="signup-button"
                            className="f6 no-underline grow dib v-mid bg-blue white ba b--blue ph3 pv2 mb3"
                            >
                            Register
                        </button>
                        <div className="bottom-box fbox-c jcfs aic">
                            <p className="redirect-signup">
                                Already have an account?
                                        <span className="redirect-link" onClick={formSwitcher}>
                                    {" LOGIN"}
                                </span>
                            </p>
                        </div>
                        <XIcon className="modal-close-icon" onClick={handleClose} />
                    </Form>
                )}
            </Mutation>
        </div>
    );
};





const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginDispatcher: (token) => dispatch({
            type: "LOGIN_SUCCESSFUL",
            token: token
        }),
        clientDispatcher: (profile) => dispatch({
            type: "CLIENT_UPDATE",
            lenBookmarks: profile.lenBookmarks,
            points: profile.points
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignupForm));

/*
<div className={modalClassName} id="signup-form-modal">
            <Mutation
                mutation={SIGNUP_MUTATION}
                variables={{ password, username, email, name }}
                onCompleted={data => (print("signup::Mutation", data), _confirm(data))}
                onError={() => setError("This username is not valid. Please choose another.")}
            >
                {mutation => (
                    <div className="signup-box  pr fbox-c jcfs aic">
                        <h4 className="form-name">SIGNUP</h4>
                        <hr />

                        <div className="input-box ">

                            <div className="form-row fbox-r jcsb aic">
                                <label htmlFor={props.place ? "signup-name" + props.place : "singup-name"} className="form-label">
                                    <p>Name</p>
                                </label>
                                <input placeholder="Full Name" autoComplete="nope"
                                    className="form-input" type="text" id={props.place ? "signup-name" + props.place : "singup-name"}
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-row fbox-r jcsb aic">
                                <label htmlFor={props.place ? "signup-uname" + props.place : "signup-uname"} className="form-label">
                                    <p>Username</p>
                                </label>
                                <input placeholder="Username" autoComplete="nope"
                                    className="form-input" type="text" id={props.place ? "signup-uname" + props.place : "signup-uname"}
                                    required
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="form-row fbox-r jcsb aic">
                                <label htmlFor={props.place ? "signup-mail" + props.place : "signup-mail" } className="form-label">
                                    <p>Email</p>
                                </label>
                                <input placeholder="Email adress" autoComplete={false}
                                    className="form-input" type="email" id={props.place ? "signup-mail" + props.place : "signup-mail" }
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="field-validation">{emailTip(email)}</p>

                            <div className="form-row fbox-r jcsb aic">
                                <label htmlFor={props.place ? "signup-pass" + props.place : "signup-pass" } className="form-label">
                                    <p>Password</p>
                                </label>
                                <input placeholder="Password"
                                    className="form-input" type="password" id={props.place ? "signup-pass" + props.place : "signup-pass" }
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <p className="field-validation">{passwordValidityTip(password)}</p>

                            <div className="form-row fbox-r jcsb aic">
                                <label htmlFor={props.place ? "signup-re-pass" + props.place : "signup-re-pass"} className="form-label">
                                    <p>Re-Password</p>
                                </label>
                                <input placeholder="Password"
                                    className="form-input" type="password" id={props.place ? "signup-re-pass" + props.place : "signup-re-pass"}
                                    required
                                    value={rePassword}
                                    onChange={e => setRePassword(e.target.value)}
                                />
                            </div>
                            <p className="field-validation">{passwordMatchTip(rePassword)}</p>

                            <div className="bottom-box fbox-c jcfs aic">
                                <p className="form-error form-signup-error" >{error}</p>

                                <button type="button"
                                    onClick={finalCheck() ?  mutation : null}
                                    disabled={!finalCheck()}
                                    className="submit-btn form-submit form-signup-submit"
                                >
                                    Create Account
                                </button>
                                <p className="redirect-signup">
                                    Already have an account? 
                                        <span className="redirect-link" onClick={formSwitcher}>
                                            {" LOGIN"}
                                        </span>
                                </p>
                            </div>
                            <i className="far fa-times-circle" id="modal-close-icon" onClick={handleClose}></i>
                        </div>
                    </div>
                )}
            </Mutation>
        </div>
*/