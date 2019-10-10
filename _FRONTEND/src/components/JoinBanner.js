import React from "react";
import { useState, useContext } from "react"
import { GlobalContext } from "../App";

import "./JoinBanner.css"

const JoinBanner = (props) => {
    const state = useContext(GlobalContext);

    return (
        <section className="join-banner">
            <div className="front-layer">
                {!props.nocontent && <h2>Join now</h2>}
                {!props.nocontent && 
                    <p className="banner-message">Start a cinematic journey.<br /> Discover new movies through; <br/> AI based recommendation
                        , Our Curated Movie Lists, and Advance Search Functionality.
                    </p>}
                {!props.nobutton &&
                <div>
                    <button
                        className="action action-login pulse"
                        onClick={() => state.methods.insertAuthForm("login")}
                    >
                        LOGIN</button>
                    <button
                        className="action action-signup pulse"
                        onClick={() => state.methods.insertAuthForm("signup")}
                        >
                        JOIN</button>
                </div>}
                {props.children}
            </div>
        </section>
    )
}
export default JoinBanner