import React from 'react'
import { useContext } from "react";
import { withRouter } from "react-router-dom"
import { print, authCheck } from "../functions/lib"

import { rgaPageView, Head } from "../functions/analytics"
import { GlobalContext } from "../App";
import { AuthForm, ForgetForm } from "../forms/AuthForm"
import JoinBanner from "../components/JoinBanner";

import "./LandingPage.css"

const LandingPage = (props) => {
    //if (authCheck()) props.history.push("/")
    rgaPageView();
    const state = useContext(GlobalContext)

    const featureList = [
        {   
            id:1,
            name:"recommendation",
            header:"Recommendation",
            url:"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/features/Recommendation.png",
            text:"Personalized movie recommendations based on your cinema taste."
        },
        {
            id:2,
            name:"video",
            header:"Curated Content",
            url:"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/features/Video.png",
            text:" Various video contents about topics of movies, video essays, interviews with famous directors. "
        },
        {   
            id:3,
            name:"list",
            header:"Lists of Movies",
            url:"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/features/Lists.png",
            text:"Famous Director’s favourite movies lists, Winners of cinema festivals lists, Movies that share common genre lists"
        },
        {
            id:4,
            name:"similarity",
            header:"Similarity Meter",
            url:"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/features/Similarity.png",
            text:"See people that have similar taste with you. Compare your cinema taste with your friends"
        },
        {
            id:5,
            name:"history",
            header:"Personal History",
            url:"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/features/History.png",
            text:"Keep and track your personal cinema history. "
        },
        {
            id:6,
            name:"like",
            header:"Watchlist",
            url:"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/features/Like.png",
            text:"Save your favorite movies. Add movies to watchlist for future options. Check your friends watchlist and favourites,"
        }
    ]
    
	const Brand = () => (
            <svg className="landing-brand" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.624 7.532C8.5 7.532 9.292 7.736 10 8.144C10.708 8.552 11.26 9.116 11.656 9.836C12.064 10.556 12.268 11.378 12.268 12.302C12.268 13.226 12.064 14.054 11.656 14.786C11.26 15.506 10.708 16.07 10 16.478C9.292 16.874 8.5 17.072 7.624 17.072C6.796 17.072 6.046 16.88 5.374 16.496C4.702 16.1 4.18 15.554 3.808 14.858V20.492H2.908V7.604H3.772V9.818C4.144 9.098 4.666 8.54 5.338 8.144C6.022 7.736 6.784 7.532 7.624 7.532ZM7.57 16.262C8.29 16.262 8.938 16.094 9.514 15.758C10.09 15.422 10.54 14.954 10.864 14.354C11.2 13.754 11.368 13.07 11.368 12.302C11.368 11.534 11.2 10.85 10.864 10.25C10.54 9.65 10.09 9.182 9.514 8.846C8.938 8.51 8.29 8.342 7.57 8.342C6.85 8.342 6.202 8.51 5.626 8.846C5.062 9.182 4.612 9.65 4.276 10.25C3.952 10.85 3.79 11.534 3.79 12.302C3.79 13.07 3.952 13.754 4.276 14.354C4.612 14.954 5.062 15.422 5.626 15.758C6.202 16.094 6.85 16.262 7.57 16.262Z" fill="#F0F0F0"/>
                <path d="M14.908 7.604H15.808V17H14.908V7.604ZM15.358 5.318C15.154 5.318 14.98 5.252 14.836 5.12C14.692 4.976 14.62 4.802 14.62 4.598C14.62 4.394 14.692 4.22 14.836 4.076C14.98 3.932 15.154 3.86 15.358 3.86C15.562 3.86 15.736 3.932 15.88 4.076C16.024 4.208 16.096 4.376 16.096 4.58C16.096 4.784 16.024 4.958 15.88 5.102C15.736 5.246 15.562 5.318 15.358 5.318Z" fill="#F0F0F0"/>
                <path d="M25.884 17L22.662 12.806L19.44 17H18.414L22.14 12.158L18.612 7.604H19.638L22.662 11.51L25.686 7.604H26.694L23.166 12.158L26.946 17H25.884Z" fill="#F0F0F0" fillOpacity="0.9"/>
                <path d="M29.908 3.644H30.808V17H29.908V3.644Z" fill="#F0F0F0" fillOpacity="0.75"/>
                <path d="M42.45 7.604L37.626 18.278C37.266 19.106 36.846 19.694 36.366 20.042C35.898 20.39 35.34 20.564 34.692 20.564C34.26 20.564 33.852 20.492 33.468 20.348C33.096 20.204 32.778 19.994 32.514 19.718L32.964 19.034C33.444 19.526 34.026 19.772 34.71 19.772C35.166 19.772 35.556 19.646 35.88 19.394C36.204 19.142 36.504 18.71 36.78 18.098L37.284 16.964L33.054 7.604H34.008L37.77 16.01L41.532 7.604H42.45Z" fill="#F0F0F0" fillOpacity="0.6"/>
            </svg>
	)

    return (
        <div id="landing-page">
            <Head
                canonical={"https://pixly.app/"}
                description={"Pixly Welcome Page"}
            />
            {/*<h1 className="required-header">Pixly - Personal Cinema Assistant</h1>
            <header className="landing-header">
                <img className="header-image"
                    alt="Pixly - Personal Cinema Asisstant Banner"
                    src={"https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/landing-page/pixly-bottom-blue.png"} />
            </header>*/}
                <JoinBanner nocontent nobutton>
                    <div className="j-banner">
                        <Brand />
                        <ul>
                            <li>Personal Cinema Assistant</li>
                            <li>Social Movie Discovery</li>
                            <li>After Movie Journey</li>
                        </ul>
                        <button
                            className="action action-signup pulse"
                            onClick={() => state.methods.insertAuthForm("signup")}
                            >
                            JOIN NOW
                        </button>
                    </div>
                </JoinBanner>

            <section className="features-container">
                {featureList.map(feature =>(
                    <div className="feature-box" key={feature.name}>
                        <img src={feature.url} alt={feature.text} title={feature.text} className="feature-image" />
                        
                        <h2>{feature.header}</h2>
                        <p>{feature.text}</p>
                    </div>
                ))}
            </section>

            <section className="pixly-auth">
                <h2>Join now</h2>
                <p>Start a cinematic journey, discover new movies.</p>
                <div>
                    <button 
                        className="action button primary"
                        onClick={() => state.methods.insertAuthForm("login")}
                    >
                        LOGIN</button>
                    <button 
                        className="action button active"
                        onClick={() => state.methods.insertAuthForm("signup")}
                    >
                        JOIN</button>
                </div>
            </section>

        </div>

    );
};

export default withRouter(LandingPage)