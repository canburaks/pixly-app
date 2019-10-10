import React from 'react';
import "./Spinner.css"

export const Spinner = (props) => (
    <div id="spinner-box" {...props}>
        <div id="bars4">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
)