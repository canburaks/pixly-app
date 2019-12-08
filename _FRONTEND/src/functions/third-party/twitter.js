import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { useMutation } from '@apollo/react-hooks';
import { GlobalContext } from "../../";
import { print, useScript, useValues } from "../"

import {  
	SimpleModal,FlexBox, GradientAnimationBox, Loading, Text,
	SignupForm
} from "../../styled-components"

export const twitter = () => {
	//const [loaded, error] = useScript('https://connect.facebook.net/en_US/sdk.js');
	//const [loaded, setLoaded] = useState(false);
    //const globalstate = useContext(GlobalContext)
    const store = {
        Timeline
    }
    return store
    
}

const Timeline = ({name, link}) => {
    const timelinewidth = useValues([280,320,350])
    const timelineheight = Math.min(window.innerHeight - 200, 400)
    return (
    <a 
        className="twitter-timeline" 
        data-width={timelinewidth}
        data-height={timelineheight} 
        data-theme="light" 
        rel="nofollow"
        href={`${link}?ref_src=pixly.app`}
    >
        Tweets by {name}
    </a>
)}