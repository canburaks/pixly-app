/* eslint-disable */
import React, { useState } from 'react'
import { Card, Menu } from 'semantic-ui-react'
import { withRouter, Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { GET_DIRECTOR_LIST } from "../../functions/gql"

import { rgaPageView, Head, DirectorPageAd } from "../../functions/analytics"
import { Helmet } from "react-helmet";
import { GridBox, GridItem } from "../../components/GridBox" 
import { useAuthCheck } from "../../functions/hooks";
import JoinBanner from "../../components/JoinBanner.js"
//import { MaterialCard } from "../../comp-material/Card"
import { DirectorCard,HiddenHeader } from "../../styled-components"

const Loading = () => (
    <div className="page-container">
        <div className="loading-container">
            <img src={"https://s3.eu-west-2.amazonaws.com/cbs-static/static/images/loading.svg"} />
        </div>
    </div>
)

const collage = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/directors-collage.jpg"
const styles = {marginTop:10 }


const DirectorList = (props) =>{
    const authStatus = useAuthCheck()
    const DirectorTemplate = (props) => {
        const go = (id) => props.history.push(`/person/${id}`)
        //console.log(client)

        return (
            <div className="recent-template fbox-c jcfs aifs w100 pad-lr-4x template">
                <GridBox size="m">
                    {/* GRID */}
                    {props.items.map((person) => <DirectorCard item={person} key={person.id} hoverShadow/>)}
                </GridBox>
            </div>
        )
    }
    
    return(
        <Query query={GET_DIRECTOR_LIST} >
        {
            ({loading, data}) => {
                if (loading) return <Loading />;
                //window.__APOLLO_STATE__ = JSON.stringify(client.extract());
                const items =  data[Object.keys(data)[0]];
                const directorNames = items.sort((a,b) => (a.lenMovies-b.lenMovies))
                    .reverse().slice(0,9).map(d => d.name)

                window.scrollTo(0, 0)
                return(
                    <div className="page-container fbox-c jcfs aic">
                        <Helmet
                            description={"Filmographies, Favourite Films of some directors like: " +directorNames.join(", ") }
                            title={"Directors Collection - Pixly"}
                            keywords={`Famous Directors List, ` + directorNames.join(", ") }
                            canonical={`https://pixly.app/directors/1`}
                        />
                        {!authStatus &&  <JoinBanner />}
                        
                        <div className="content-container pad-lr-5vw">
                        <HiddenHeader>Directors Collection</HiddenHeader>
                            <DirectorTemplate items={items} history={props.history}/>
                            <DirectorPageAd />
                            
                        </div>
                    </div>
                )
            }
        }
        </Query>
    );
};

export default DirectorList;