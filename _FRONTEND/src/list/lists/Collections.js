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
                description={"Pixly collections consist of lists of movies in a variety categories like; " + 
                            "favourite movies of famous directors, festival winner movies such as golden palm awarded movies, " + 
                            "golden bear awarded movies, golden lion awarded movies and alsı topic related movies."
                        }
                title={"Pixly Collections"}
                canonical={`https://pixly.app/collections`}
            />
            {!authStatus && <JoinBanner />}

            <ContentContainer>

                <div className="list-type-header fbox-c pad-bt-4x ">
                    <h2 className="primary-text">
                        Pixly Collections
                    </h2>
                    <p className="t-m t-color-dark">Pixly collections consist of lists of movies. Some of those are
                        curated and selected by us, and some of are collected information with a reference to its origin source.
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