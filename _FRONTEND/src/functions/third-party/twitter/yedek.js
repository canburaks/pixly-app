import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from "react";
import { useMutation } from '@apollo/react-hooks';
import { print, useScript, useValues } from "../../../functions"

import {  
	SimpleModal,FlexBox, GradientAnimationBox, Loading, Text,
	SignupForm
} from "../../../styled-components"

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
    const tref = useRef()
    const client = window.twttr
    const username = link.split("twitter.com/")[(link.split("twitter.com/").length - 1)]
    console.log(username)

    useEffect(() => {
            client.widgets.createTimeline(
                {
                    sourceType: 'profile',
                    screenName: username
                },
                tref,
                {
                    width: '450',
                    height: '700',
                    related: 'twitterdev,twitterapi'
                }).then(function (el) {
                    console.log('Embedded a timeline.')
                });
        
    })

    console.log(window.twttr)
    return (
    <a  ref={tref}
        className="twitter-timeline" 
        data-width={timelinewidth}
        data-height={timelineheight} 
        data-theme="light" 
        rel="nofollow"
        href={`${link}?ref_src=http://localhost:8080/`}
        target="_blank"
    >
        Tweets by {name}
    </a>
)}