import React from "react";
import { MessageBox } from "../../../components/MessageBox"
import { ProgressBar } from "cbs-react-components"

export const RecommendationsInfo = (props) => (
    <MessageBox
        image={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/figma/pie-chart.png"}
        header={"Pixly Recommendations"}
        text={"Every week we will recommend movies to you based on your ratings"}
    >
        <div style={{width:"100%"}}>            
            <ProgressBar
                value={props.points}                          //required
                max={40}                           //default 100
                height={30}                         //default 30(px)
                fontSize={16}                       //default 16(px)
                borderRadius={4}                    //default 4(px)
                backgroundColor={"white"}           //default white
                progressColor={"#4CAF50"}           //default #4CAF50
                textColor={"white"}                 //default white
                                          //options-> percent,onlyvalue nolabel 
                spectrum={{ start: 40, stop: 100, tranparency: 1 }} //default none
            />
            <br />
            <h4 className="t-bold">How does Weekly recommendation work ?</h4>
            <p>
                Weekly recommendation is based on collaborative filtering method.
                In order to make a good recommendation, 
                at least you should have 40 points (ratings). 
                When your points grow, recommendations that you take will be better
                <br/>
                In every 7 days, we will recommend new movies that were release from past to present.
            </p>
            <br />
            <ul>
                {props.points < 40
                ?<li>Currently you have 
                    <span className="t-bold"> {props.points} </span> 
                     points. You need at least 
                    <span className="t-bold"> {40 - props.points} </span> points.
                </li>
                :<li>Currently you have 
                    <span className="t-bold"> {props.points} </span> 
                     points. Every 20 points we will rescan movies based on your improved cinema taste.
                </li>
                }
                
                {!props.verified && <li>You should also activate your account by following the link that we sent.</li>}
            </ul>

        </div>

    </MessageBox>
)

