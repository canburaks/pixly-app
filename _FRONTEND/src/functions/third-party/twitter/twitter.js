import React, { useState, useEffect, useCallback, useMemo, useContext, useRef } from "react";
import { useMutation } from '@apollo/react-hooks';
import { print, useScript, useValues } from "../../../functions"

import {  
	SimpleModal,FlexBox, GradientAnimationBox, Loading, Text,
	SignupForm, Box
} from "../../../styled-components"
import { Timeline as TimelineWidget } from 'react-twitter-widgets'

export const twitter = () => {
	//const [loaded, error] = useScript('https://connect.facebook.net/en_US/sdk.js');
	//const [loaded, setLoaded] = useState(false);
    //const globalstate = useContext(GlobalContext)

    const store = {
        Timeline
    }
    return store
    
}

const Timeline = ({link, ...props}) => {
    const timelinewidth = useValues([280,300,350])
    const timelineheight = useValues([350,350,400, 450])

    const username = link.split("twitter.com/")[(link.split("twitter.com/").length - 1)]

    const styles ={ float:"left", width:timelinewidth}
    return (
        <Box style={styles} {...props}>

            <TimelineWidget
                dataSource={{
                    sourceType: 'profile',
                    screenName: username
                }}
                options={{
                    username:username,
                    width: timelinewidth,
                    height: timelineheight
                }}
                onLoad={() => console.log(' ')}
            />
        </Box>
)}