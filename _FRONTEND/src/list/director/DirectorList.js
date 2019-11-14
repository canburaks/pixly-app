/* eslint-disable */
import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { GET_DIRECTOR_LIST } from "../../functions/gql"

import { rgaPageView, Head, DirectorPageAd } from "../../functions/analytics"
import { GridBox, GridItem } from "../../components/GridBox" 
import { useAuthCheck } from "../../functions/hooks";
import JoinBanner from "../../components/JoinBanner.js"
//import { MaterialCard } from "../../comp-material/Card"
import { DirectorCard,HiddenHeader, Loading, PageContainer, ContentContainer, HeaderText } from "../../styled-components"


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
                    <PageContainer>
                        <Head
                            description={"Filmographies, Favourite Films of some directors like: " +directorNames.join(", ") }
                            title={"Pixly - Directors Collection"}
                            keywords={`Famous Directors List, ` + directorNames.join(", ") }
                            canonical={`https://pixly.app/directors/1`}
                        />
                        
                        <ContentContainer>
                            <HeaderText>Directors Collection</HeaderText>
                            <DirectorTemplate items={items} history={props.history}/>
                            <DirectorPageAd />
                            {!authStatus &&  <JoinBanner />}

                        </ContentContainer>
                    </PageContainer>
                )
            }
        }
        </Query>
    );
};

export default DirectorList;