import React, { useState } from 'react'
import "./InfoBox.css"

const InfoBox = (props) => {
    const { open, switcher } = props;

    return(
        <div>
            {open 
            ?   <div className="infobox-main" onClick={() => switcher(false)} >
                    {props.children}
                </div>

            :   <div></div>}
        </div>

    );
};

export default InfoBox;

/*
<Tips title={predictionWarning()} 
                                    open={loading || (predictionResult==0 && showTip)}
                                    onRequestClose={() => {setShowTip(false)}}
                                    position={"top"}
                                    >
*/