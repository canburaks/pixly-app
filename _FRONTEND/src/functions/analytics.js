import React from "react";
import { useEffect, useState, useMemo } from "react"
import ReactGA from 'react-ga';
import AdSense from 'react-adsense';
import { Helmet } from "react-helmet";
import { production } from "../styled-components"
import { useLocation, } from "react-router-dom";
import { allowedUrls } from "../styled-components/constants"
//console.log("production: ", production)

export const Head = React.memo((props) => {
    const titleText = props.title ? props.title.slice(0,70) :"Pixly - Movie Recommendation and Social Cinema Platform "
    const descriptionText = props.description ? props.description.slice(0,160) : "Personalized Movie Recommendation, Social Cinema Platform, Movie Discovery, and Cultural Content"
    //"Pixly - Discover Best Movies that Fit Your Cinema Taste."
    const url = props.canonical ? props.canonical : "https://pixly.app" + window.location.pathname 
    const image =  props.image ? props.image : "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/pixly-wide-zip.jpg"
    const richdata = props.richdata ? JSON.stringify(JSON.parse(props.richdata)) : null
    const keywordsText = props.keywords 
        ? typeof props.keywords === "string" ?  props.keywords : props.keywords.join(", ")
        : null
    
    const opengraph = (type, content) => (<meta property={`og:${type}`} content={`${content}`}/>)
    const twitter = (type, content) => (<meta property={`twitter:${type}`} content={`${content}`}/>)
    //Analytics()
    //console.log("can",props.canonical)
    //console.log(window.location.pathname)
    const isAllowedUrls = allowedUrls.all.includes(window.location.pathname)
    //console.log("is Allowed:", isAllowedUrls)
    useEffect(() =>{
        if (isAllowedUrls){
            const googlebot = document.getElementById("google-bot")
            googlebot.content = ""
        }
    }, [])
    return (
    <Helmet>
        {/*rgaPageView()*/}
        {/* TITLE */}
        <title>{titleText}</title>

        {/* DESCRIPTION */}
        <meta name="description" content={descriptionText} />
        {!isAllowedUrls && <meta name="googlebot" content="nofollow noindex" />}
        {/* KEYWORDS */}
        {keywordsText && <meta name="keywords" content={keywordsText} />}


        {/* FACEBOOK */}
        <meta property={`og:title`} content={titleText} />
        {opengraph("type", "website")}
        {opengraph("sitename", "Pixly")}
        {opengraph("url", url)}
        {opengraph("description", descriptionText.slice(0,60))}
        {opengraph("image", image)}

        {/* Twitter */}
        {twitter("title", titleText.slice(0,55))}
        {twitter("card", "summary_large_image")}
        {twitter("description", props.twitterdescription || descriptionText.slice(0,125))}
        {twitter("site", "@pixlymovie")}
        {twitter("creator", "@canburaks")}
        <meta name="twitter:app:name:iphone" content="Pixly" />
        <meta name="twitter:app:name:ipad" content="Pixly" />
        <meta name="twitter:app:name:googleplay" content="Pixly" />
        
        {twitter("image", image)}
        {twitter("url", url)}
        <meta property={`fb:app_id`} content={`371976677063927`}/>


        {props.richdata && <script type="application/ld+json">{richdata}</script> }
        {props.canonical && <link rel="canonical" href={props.canonical} />}
        {props.children}
    </Helmet>
    )
}, (p,n) => p.canonical === n.canonical )



export function usePageViews() {
    var timeZero = performance.now()
    const [time, setTime] = useState(timeZero)

    let location = useLocation();
    const [locationZero, setLocationZero] = useState(location)

    function timeHandler(){
        const currentTime = performance.now()
        const passed = currentTime - time
        //console.log("passed", passed)
        setTime(currentTime)
        return passed
    }
    function navTextHandler(){
        if (locationZero.pathname === location.pathname) return null
        var navtext = locationZero.pathname + " --> " + location.pathname
        setLocationZero(location)
        return navtext
    }

    useEffect(() => {
        //console.log("location change: ",location)
        if(production){
            const willSet = {page: location.pathname}
            if (localStorage.getItem("USERNAME")){
                const userIds = localStorage.getItem("USERNAME").split("").map((letter,i) => letter + i*20)
                willSet.userId = userIds.join("")
            }
            ReactGA.set(willSet);
            ReactGA.pageview(location.pathname)

            // calculate miliseconds between page navigation
            const passed = Math.round(timeHandler())
            const navtext = navTextHandler()
            if (navtext) {
                rgaSetNavTime(passed,navtext)
                rgaSetEvent("Nav", navtext, passed, passed.toString())
            }
        }
    }, [location]);
  }

export function rgaStart(){
        if(production){
        //const userId = localStorage.getItem("USERNAME")
        ReactGA.initialize('UA-141617385-1', {
            debug: false,
            testMode: !production,
            gaOptions: { 
                'siteSpeedSampleRate': 50, 
                //'optimizeId': 'GTM-K82HMLS',
                'alwaysSendReferrer': true,
            }
        })
        //if (userId) ReactGA.set({userId})
        }
}


export const rgaPageView = () => {
    if (production){
        const [pathname, setPathname] = useState(null)
        const location = useLocation()
        // Only sent when url changes
        if (location !== pathname){
            //console.log("Analytics path has changed", pathname, location)
            setPathname(location)
            ReactGA.pageview(location)
        }
    }
}

export function rgaSetUser(){
    const userId = localStorage.getItem("USERNAME")
    if (userId){
        ReactGA.set({
            userId
        })
    }
}


const rgaSetNavTime = (value, label) => production ? rgaSetTiming("Timing", "navigation", value, label) :null


export const rgaSetCloseTime = (label) => {
    var timeZero = performance.now()
    const [time, setTime] = useState(timeZero)

    function timeHandler(){
        const currentTime = performance.now()
        const passed = currentTime - time
        //console.log("passed", passed)
        setTime(currentTime)
        return passed
    }

    useEffect(() => {
        if(production){
            const handler = (event) => {
            event.preventDefault();
            const passed = Math.round(timeHandler())
            //console.log("passed",passed)
            rgaSetTiming("Timing", "close/reload", passed,label)
            rgaSetEvent("App Close", passed.toString(), passed, label)
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    
    }
    });
  };
  
export const rgaSetEvent = (category, action, value, label) => {
ReactGA.event({
    category: category,
    action: action,
    label: label,
    value:value
});
};
export const rgaSetTiming = (category, variable, value, label) => {
ReactGA.timing({
    category: category, //'JS Libraries',
    variable: variable, //'load'
    value: value, // in milliseconds
    label: label,//'CDN libs'
    });
};


//--------------ADS------------------------------



// arranged for topic page movies
export const FeedGridItemAd = () => {
    const isProduction = window.location.href.includes("pixly.app")
    useEffect(() => {
        if (isProduction && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [isProduction])
    //if (!production) return <div className="hidden"></div>
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="3012994157"
            data-ad-format="auto"
            data-full-width-responsive="true"
            >
        </ins>
    )
}

// arranged for topic page movies
export const FeedMobileTopicPageAd = () => {
    const isProduction = window.location.href.includes("pixly.app")
    useEffect(() => {
        if (isProduction && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [isProduction])
    //if (!production) return <div className="hidden"></div>
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-format="fluid"
            data-ad-layout-key="-6f+bs+35+1z+37"
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="3449814710"
            >
        </ins>
    )
}
// arranged for topic list and film lists pages
export const FeedMobileCollectionAd = () => {
    const isProduction = window.location.href.includes("pixly.app")
    useEffect(() => {
        if (isProduction && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [isProduction])
    //if (!production) return <div className="hidden"></div>
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-format="fluid"
            data-ad-layout-key="-6f+bs+35+1z+37"
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="3449814710"
            >
        </ins>
    )
}
export const BlogPostAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", textAlign:"center" , minHeight: 90 }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="3189262161">
        </ins>
    )
}


export const DirectorPageAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])

    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-format="fluid"
            data-ad-layout-key="-f9+5v+4m-d8+7b"
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="6693336096">
        </ins>
    )
}

export const ListBoardAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    return (
        <ins className="adsbygoogle"
            style={{display:"block", width:"100%", minHeight:90}}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="2677235312"
            data-ad-format="auto"
            data-full-width-responsive="true"
            >    
        </ins>
    )
}

export const ListBoardAd2 = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    return (
        <ins className="adsbygoogle"
            style={{display:"block", width:"100%", minHeight:90}}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="2232940197"
            data-ad-format="auto"
            data-full-width-responsive="true"
            >    
        </ins>
    )
}

export const MoviePageAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="9217070427"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    )
}
export const MidPageAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-format="fluid"
            data-ad-layout-key="-f7+5u+4t-da+6l"
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="4887631536">
        </ins>
    )
}
export const HomePageFeedAd = () => {
    const isProduction = window.location.href.includes("pixly.app")
    useEffect(() => {
        if (isProduction && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [isProduction])
    //if (!production) return <div className="hidden"></div>
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="5598417282"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    )
}
export const HomePageArchiveAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="3842482482"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    )
}
export const ProfilePageAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    if (!production) return <div className="hidden"></div>
    return (
        <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 90 }}
            data-ad-client="ca-pub-9259748524746137"
            data-ad-slot="2914320299"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    )
}
/*

export const MoviePageAd = () =>{
    useEffect(() =>{
        if(window){
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    },[window])
    if (!production) return <div className="hidden"></div>

    return(
        <AdSense.Google
            style={{ display: "block", width: "100%", minHeight: 150,zIndex:5 }}
            client='ca-pub-9004119910552763'
            data-ad-slot="9217070427"
            slot="9217070427"
            format='auto'
            responsive='true'
        />
        )
    }




export const MoviePageAd2 = () => !production
        ? <div></div>
        : <AdSense.Google
                style={{ display: "block", width:"100%", minHeight:150 }}
                client='ca-pub-9004119910552763'
                data-ad-slot="9217070427"
                format='auto'
                responsive='true'
            />

export const GAS = (props) =>(
    <div style={{width:"100%", minHeight:150 ,marginTop:5, marginBottom:5}}>
        <AdSense.Google
            style="display:block"
            data-ad-client="ca-pub-9259748524746137"
            style={{ display: 'block', width:"100%" }}
            slot={props.slot ? props.slot : "2314360586"}
            format='auto'
            responsive='true'
            style={props.styles}
            classNameName={props.cls}
            />
    </div>
)
export const ContentAd2 = () => (
    <div style={{ width: "100%", minHeight: 150, marginTop: 5, marginBottom: 5 }}>
        <AdSense.Google
            client='ca-pub-9004119910552763'
            style={{ display: 'block' }}
            slot="2520236539"
            format='auto'
            responsive='true'
        />
    </div>
)
/*
slots:
2314360586
3283170782
*/