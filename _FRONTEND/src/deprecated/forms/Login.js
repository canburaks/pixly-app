import React, { useState } from 'react'
import { connect } from "react-redux";
import { Mutation } from 'react-apollo'
import Tips from "../components/Tips"
import { print } from "../functions/lib"
import "./Login.css"

import { toast } from 'react-toastify';

import { SIGNUP_MUTATION, LOGIN_MUTATION } from "../functions/mutations"

import { emailValidator, passwordValidator } from "../functions/form"

import { rgaPageView, rgaSetUser } from "../functions/analytics"

//const bg2 = require("../assets/bg-2.jpg")
//const bgAdress = "https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/bg2.jpg"

const Login = (props) => {

    rgaPageView()
    const [login, setLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")

    const _confirm = data => {
        //const { token } = this.state.login ? data.tokenAuth : data.createUser.user.profile
        const result = login ? data.tokenAuth.user.profile : data.createUser.user.profile;
        localStorage.setItem("AUTH_TOKEN", result.token);
        localStorage.setItem("USERNAME", result.username);
        localStorage.setItem("USER_ID", result.id);
        //localStorage.setItem("LISTS", JSON.stringify(result.lists));
        /*client.writeData({
            id:result.username,
            data:{
                myLists:[...result.lists],
                username:result.username
            }
        })}*/
        rgaSetUser();
        _client(result);
        //props.history.push(`/lists/all/1`);
        props.history.push(`/`);

    }
    const _client = async (result) => {
        const token = result.token;
        const profile = result;
        await props.loginDispatcher(token);
        await props.clientDispatcher(profile);
    }
    const emailTip = (text) => {
        if (emailValidator(text)) return "OK"
        return "Enter a valid email adress!"
    }
    const passwordTip = (text) => {
        if (passwordValidator(text)) return "OK"
        return "8 caharacter,alphanumeric."
    }

    const warningNotify = (text) => toast.warn(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        pauseOnHover: true
    })

    return (
        <div>
            <Mutation
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                variables={{ email, password, username }}
                onCompleted={data => (print("Login::Mutation", data), _confirm(data))}
                onError={login
                    ? (() => setError("Please check your username/password"),
                        () => warningNotify("Please check your username/password"))
                    : () => setError("This username is not valid. Please choose another.")
                }>
                {mutation => (
                    <div className="login-main-container">
                        <div className="header-w3l">
                            <h1>{login ? '.' : '.'}</h1>
                        </div>
                        <div className="main-content-agile">
                            <div className="sub-main-w3">
                                <form onSubmit={() => mutation()}>
                                    {!login &&
                                        <Tips
                                            title={emailTip(email)}
                                            trigger="click"
                                            position="right"
                                            disabled={login}
                                        >
                                            <input placeholder="E-mail" value={email}
                                                className="user" type="text"
                                                required
                                                onChange={e => setEmail(e.target.value)}
                                            /></Tips>
                                    }
                                    <br />


                                    <input placeholder="Username"
                                        className="user" type="text"
                                        required
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    /><br />

                                    <Tips
                                        title={passwordTip(password)}
                                        trigger="click"
                                        position="right"
                                        disabled={login}
                                    >
                                        <input placeholder="Password"
                                            className="pass" type="password"
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </Tips>


                                    <br />

                                    <input type="submit"
                                        onClick={e => (e.preventDefault(), mutation())}
                                        disabled={!(login || (emailValidator(email) && passwordValidator(password)))}
                                    />
                                    <p className="error-text" >{error}</p>
                                    <p className="login-boolean"
                                        onClick={() => setLogin(!login)}
                                    >
                                        {login ? 'Need to create an account?' : 'Already have an account?'}
                                    </p>
                                </form>

                            </div>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

