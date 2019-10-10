import React from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import "./CircleProgress.css"
//import 'react-circular-progressbar/dist/styles.css';

const CircleProgress = ({value, maxValue, width, textColor, color, fontSize}) =>(
    <div className="zoom-prediction circle-prediction-box" style={{width, height:width}}>
        <CircularProgressbar
            //value={percentage}
            background
            value={value}
            maxValue={maxValue}
            text={`${value}`}
            styles={{
                // Customize the root svg element
                root: {},
                // Customize the path, i.e. the "completed progress"
                path: {
                    // Path color
                    stroke:color || `rgba(56, 185, 84, 1)`,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',
                    // Customize transition animation
                    transition: 'stroke-dashoffset 0.5s ease 0s',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                    // Trail color
                    stroke: '#d6d6d6',
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',
                    // Rotate the trail
                    transform: 'rotate(0.25turn)',
                    transformOrigin: 'center center',
                },
                // Customize the text
                text: {
                    // Text color
                    fill: textColor || `rgba(255, 255, 255, 1)`,
                    // Text size
                    fontSize: fontSize || 22,
                    fontWeight:800,
                },
                // Customize background - only used when the `background` prop is true
                background: {
                    fill: '#000000',
                },
            }}
    />
    </div>

)

export default CircleProgress;