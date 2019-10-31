import React from "react";
import { useEffect, useState} from "react"
import ReactGA from 'react-ga';
import AdSense from 'react-adsense';
import { Helmet } from "react-helmet";
import { production } from "../styled-components"
import { useLocation, } from "react-router-dom";

//console.log("produciton: ", production)

export const Head = React.memo((props) => {
    const titleText = props.title ? props.title :"Pixly - Movie Recommendation and Social Cinema Platform "
    const descriptionText = props.description ? props.description : "Personalized Movie Recommendation, Social Cinema Platform, Movie Discovery, and Cultural Content"
    const url = props.canonical ? props.canonical : "https://pixly.app" + window.location.pathname 
    const image =  props.image ? props.image : "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/pixly-wide-zip.jpg"
    const richdata = props.richdata ? JSON.stringify(JSON.parse(props.richdata)) : null
    const keywordsText = props.keywords 
        ? typeof props.keywords === "string" ?  props.keywords : props.keywords.join(", ")
        : "Pixly, Cinema, Movie, Movie Recommendation, Director's Favourite Films, Similar Movies"
    
    const opengraph = (type, content) => (<meta property={`og:${type}`} content={`${content}`}/>)
    const twitter = (type, content) => (<meta property={`twitter:${type}`} content={`${content}`}/>)
    //Analytics()
    //console.log("can",props.canonical)
    return (
    <Helmet>
        {/*rgaPageView()*/}
        {/* TITLE */}
        <title>{titleText}</title>

        {/* DESCRIPTION */}
        <meta name="description" content={descriptionText} />

        {/* KEYWORDS */}
        <meta name="keywords" content={keywordsText} />


        {/* FACEBOOK */}
        {opengraph("title", titleText)}
        {opengraph("type", "website")}
        {opengraph("sitename", "Pixly")}
        {opengraph("url", url)}
        {opengraph("description", descriptionText)}
        {opengraph("image", image)}

        {/* Twitter */}
        {twitter("title", titleText)}
        {twitter("card", "summary_large_image")}
        {twitter("description", descriptionText)}
        {twitter("image", image)}
        {twitter("url", url)}


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
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname)

        // calculate miliseconds between page navigation
        const passed = timeHandler()
        const navtext = navTextHandler()
        if (navtext) {
            rgaSetNavTime(Math.round(passed),navtext)
        }
    }, [location]);
  }

export function rgaStart(){
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


const rgaSetNavTime = (value, label) => rgaSetTiming("Timing", "navigation", value, label)


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
        const handler = (event) => {
        event.preventDefault();
        const passed = Math.round(timeHandler())
        //console.log("passed",passed)
        rgaSetTiming("Timing", "close/reload", passed,label)
        rgaSetEvent("User", "Close/Reload Timing", passed, label)
      };
  
      window.addEventListener('beforeunload', handler);
  
      return () => window.removeEventListener('beforeunload', handler);
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
export const DirectorPageAd = () => {
    useEffect(() => {
        if (production && window) {
            //console.log("if true");
            //console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    if (!production) return <div className="hidden"></div>
    else return (
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
    if (!production) return <div className="hidden"></div>
    else return (
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
    if (!production) return <div className="hidden"></div>
    else return (
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
    if (!production) return <div className="hidden"></div>
    else return (
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
    if (!production) return <div className="hidden"></div>
    else return (
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
    useEffect(() => {
        if (production && window) {
            console.log("if true");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    }, [window])
    if (!production) return <div className="hidden"></div>
    else return (
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
    if (!production) return <div className="hidden"></div>
    else return (
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