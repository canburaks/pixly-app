import React from "react"
import "./Spinner.css"
import { Text, Paragraph, 
    Image, ImageShim,ImagePlaceholder, //AspectRatioImage, 
    Box, AbsoluteBox, 

} from "../"

export const Spinner = (props) => (
<Box className="loader" id="spinner">{console.log("spinner props", props)}</Box>
)