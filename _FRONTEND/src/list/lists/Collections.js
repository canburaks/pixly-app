import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"
import { withRouter, Link } from "react-router-dom";

import MosaicPoster from "../../components/MosaicPoster"

import { useWindowSize, useAuthCheck, useClientWidth,  } from "../../functions/hooks"
import { authCheck, print } from "../../functions/lib"
import {  Row, Col } from 'react-flexbox-grid';
import { rgaPageView, Head, ListBoardAd, ListBoardAd2  } from "../../functions/analytics"
import { Menu, Segment } from 'semantic-ui-react'
import { GridBox, GridItem } from "../../components/GridBox" 

import "./Collections.css"
import { GlobalContext } from "../../App";
import JoinBanner from "../../components/JoinBanner.js"

import { GlideCarousel, GlideBox } from "../../components2/Glide.js"
import { ListCard, PageContainer, ContentContainer, Grid, ListCoverBox } from "../../styled-components"

const ListBoard = (props) => {
    const item = props.liste
    rgaPageView()
    const authStatus = useAuthCheck();
    const state = useContext(GlobalContext);
    
    if (props.viewer){
        state.methods.updatePoints(props.viewer.points)
    }
    const directorsFavourite = useMemo(() => item.filter( l => l.listType==="df"))
    const festivalWinners = useMemo(() => item.filter(l => l.listType === "fw"))
    //const genreRelated = item.filter(l => l.listType === "gr")
    const otherLists = useMemo(() => item.filter(l => l.listType === "ms"))


    const firstPart = [...otherLists, ...festivalWinners]
    const secondPart = directorsFavourite
    
    return (
        <PageContainer>
            <Head
                title={"Pixly Collections"}
                description={"Collections of movie lists; Cannes, Berlin, Venice Film festival winner films. " + 
                            "Favorite film lists of Quentin Tarantino, David Fincher, Stanley Kubrick and Nuri Bilge Ceylan. " + 
                            "Curated film lists, Imdb 250 list, Pixly selected Movies "
                        }
                canonical={`https://pixly.app/collections/`}
            />
            {!authStatus && <JoinBanner />}

            <ContentContainer>

                <div className="list-type-header fbox-c pad-bt-4x ">
                    <h2 className="primary-text">
                        Pixly Collections
                    </h2>
                    <p className="t-m t-color-dark">
                        Pixly collections is a collected and curated lists of movies. 
                        Pixly Selections is edited and curated by us. If you are wondering what are the favorite films of famous directors, you will find it in there. 
                        You can also find movies that are awarded by very prestigious film festivals like Cannes, Berlin and Venice. 
                        We are still collecting and improving our database for you. 
                        If you have any suggestions to add or in any case, please feel free to write it from the bottom part of the page.
                    </p>
                    <hr />
                </div>

                <ListCoverBox columns={[1,1,2,2,2,3,3]} ratio={0.41} items={firstPart} text={false} />

                <ListBoardAd />

                <ListCoverBox items={secondPart} />
                    
            </ContentContainer>
        </PageContainer>

    );
};

export default withRouter(ListBoard);

/*


                    <GridBox size="xl">
                        {festivalWinners.map(list => (
                            <Link to={`/list/${list.slug}/1`} rel="nofollow" key={list.slug}>
                            <GridItem 
                                key={list.id}
                                className="box-shadow bor-rad-2x shadow mosaic-items ms-list"
                                id={list.id}
                            >
                                {list.coverPoster
                                
                                ? <img className="ms-list-cover bor-rad-2x" src={list.coverPoster} 
                                    alt={list.name + " image"} 
                                    title={list.name + " image"}
                                    style={{height:msListWidth * 0.42}} 
                                    />
                                : <MosaicPoster item={list} parentClientWidth={mosaicWidth} />
                            }
                                <div className="mar-t-x pad-x mar-bt-2x">
                                    <p className="t-color-dark" style={{fontWeight:600}}>{list.name}</p>
                                    <p className="t-m t-color-dark" >{list.seoShortDescription}</p>
                                </div>
                            </GridItem>
                            </Link>
                            ))}
                    </GridBox>
*/