import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";

import { Query } from "react-apollo";
import { useWindowSize, useAuthCheck } from "../../functions/hooks"
import { DISCOVERY_LISTS } from "../../functions/query"

import { rgaPageView, GAS, Head, ContentAd, ContentAd2 } from "../../functions/analytics"
import DiscoverPage from "./DiscoverPage"
import AdvanceSearch from "./AdvanceSearch"

import  "./DiscoverPage.css"



const Loading = () => (
    <div className="page-container">
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)



const DiscoverQuery = (props) => {
    const item = props.liste
    rgaPageView()
    const authStatus = useAuthCheck();

/*
    const [year, setYear] = useState(null)
    const [minYear, setMinYear] = useState(null)
    const [maxYear, setMaxYear] = useState(null)
    const [minRating, setMinRating] = useState(null)
    const [maxRating, setMaxRating] = useState(null)
    const [ first, setFirst ] = useState(props.match.params.page*50)
    const [ skip, setSkip ] = useState((props.match.params.page - 1) * 50)

    const [rangeYear, setRangeYear] = useState(true)    
    const [willQuery, setWillQuery] = useState(true)
    const screenSize = useWindowSize()
*/
    return(
        <Query query={DISCOVERY_LISTS} >
            {({loading, error, data})=>{
                if (loading) return <Loading />;
                if (error) return <div>{error.message}</div>
                if (data && props.location.pathname.startsWith("/discover/search")){
                    return <AdvanceSearch tags={data.listOfTags} />
                }
                return <DiscoverPage lists={data.discoveryLists} />
            }}
        </Query>
    )
}

export default withRouter(DiscoverQuery);