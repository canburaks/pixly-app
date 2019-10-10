import React from "react";
import { useState } from "react";
import { RESEND_REGISTRATION_MAIL, CHECK_VERIFICATION } from "../functions/mutations";
import { Mutation } from 'react-apollo'

import "./MessageBox.css"

export const MessageBox = (props) => (
    <div className="message-box">

        {/* TOP-PART */}
        <div className="top-box">
            <div className="text-box">
                <h2>{props.header}</h2>
                <p>{props.text}</p>
                {props.content}
            </div>
            {props.image &&
                <div className="image-box">
                    {typeof props.image === "string"
                        ? <img src={props.image} alt="Message image" />
                        : props.image
                    }
                </div>}
        </div>

        {/* CHILDREN */}
        {props.children &&
            <div className="content-box">
                {props.children}
            </div>}
    </div>
)




