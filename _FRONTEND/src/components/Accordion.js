import React, { useState, useRef } from "react";

import "./Accordion.css"
const Accordion = (props) =>{
    const [ active, setActive ] = useState(false)
    return (
    <div onClick={() => setActive(!active)}>
        <button className="accordion">{props.header}</button>
        <div className={active ? "active panel" : "panel"} >
            {active ? props.children : null}
        </div>
    </div>
    )
}

export default Accordion;