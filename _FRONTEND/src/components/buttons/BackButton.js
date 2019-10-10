import React from "react";
import { withRouter } from "react-router-dom";

const BackButton = (props) =>(
    <button id={props.id ? props.id : "back-button"} onClick={() => props.history.goBack()}>
        <i className="fas fa-arrow-left back-button-icon"></i> BACK
    </button>
)

export default withRouter(BackButton);