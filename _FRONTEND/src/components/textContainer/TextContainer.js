import React from "react";
import "./TextContainer.css";


const TextContainer = ({text, length, state, callback}) =>{
    
    if (text.length<5) return <div></div>
    const isOverflowed = text.length>length;
    // Shorten the text if is overflowed
    if(isOverflowed && !state){
        const trimmedText = text.slice(0,length);
        const splittedText = trimmedText.split(".");
        var summaryText = splittedText.slice(0, -1).join(".") + ".";
    }
    else{
        // eslint-disable-next-line 
        var summaryText = text;
    }
    return(
        <div className="text-container-main">
            <div className={state ? "text-text-hidden expanded" : "text-text-hidden" } >{summaryText}</div>
            <div className="text-content-container" >
                <div className="text-text" >{summaryText}</div>
            </div>

            {isOverflowed &&
                <div className="overflow-container">
                    <div className="top-container" >
                    </div>
                    <div className={state ? "bottom-container large" : "bottom-container small"} onClick={() => callback()}>
                        <div className="button-text" >
                            {state ? "Less" : "More"}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TextContainer;