import React from 'react'
import { useClientWidth } from "../functions/hooks"
import { Link } from "react-router-dom";
import { print } from "../functions/lib"


const BigMosaicPoster = (props) => {
    // If Array of movies are json string 
    const rawData = props.data
    // Convert to array
    //const dataset = jsonProcess(rawData)
    console.log( "BigMosaic", rawData)

    const clientWidth = useClientWidth("big-mosaic-container") - 12;
    //console.log("width", clientWidth)

    /* Number of image in one row */
    const imagePerRow = props.column ? props.column : 5
    const posterWidth = clientWidth / imagePerRow;
    
    const posterHeight = posterWidth * 1.56

    return (
        <div className="w100 hauto fbox-r jcfs fw" id={"big-mosaic-container"}>
            {
                rawData.map((movie,i) =>(
                    
                        <img key={i}
                            style={{ margin: 0.5, padding: 0, height: posterHeight, width:posterWidth}}
                            className="hover-border-o"
                            src={movie}
                        />
        ))}
        </div>
    )
}

function jsonProcess(input) {
    if (typeof input === "string") {
        return JSON.parse(input);
    }
    else if (typeof input === "object") {
        return input;
    }
}

export default BigMosaicPoster;