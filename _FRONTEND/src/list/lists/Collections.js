import React  from "react";
import { useState, useContext, useMemo, useCallback } from "react"
import { withRouter, Link } from "react-router-dom";


import { useWindowSize, useAuthCheck, useClientWidth, useValues } from "../../functions/hooks"

import { rgaPageView, Head, ListBoardAd, ListBoardAd2  } from "../../functions/analytics"

import { GlobalContext } from "../../App";
import JoinBanner from "../../components/JoinBanner.js"

import {  PageContainer, ContentContainer, Grid, ListCoverBox, HiddenHeader, ImageCard } from "../../styled-components"

const ListBoard = (props) => {
    const item = props.liste
    rgaPageView()
    const authStatus = useAuthCheck();
    const state = useContext(GlobalContext);
    
    if (props.viewer){
        state.methods.updatePoints(props.viewer.points)
    }
    const pixlyselection = useMemo(() => item.filter(l => l.slug === "our-selection")[0])
    const nonpixlyselection = useMemo(() => item.filter(l => l.slug !== "our-selection"))


    const directorsFavourite = useMemo(() => nonpixlyselection.filter( l => l.listType==="df"))
    const festivalWinners = useMemo(() => nonpixlyselection.filter(l => l.listType === "fw"))
    const otherLists = useMemo(() => nonpixlyselection.filter(l => l.listType === "ms"))

    const firstPart = [pixlyselection,...otherLists, ...festivalWinners, ...directorsFavourite]


    const pixlyselectionSize = useValues([0.41, 0.43, 0.3, 0.2, 0.15])

    //console.log(item)
    return (
        <PageContainer>
            <Head
                title={"Pixly Collections"}
                description={"Collections of movie lists; Cannes, Berlin, Venice Film festival winner films. " + 
                            "Favorite film lists of Quentin Tarantino, David Fincher, Stanley Kubrick and Nuri Bilge Ceylan. " + 
                            "Curated film lists, Imdb 250 list, Pixly selected Movies "
                        }
                canonical={`https://pixly.app/collections`}
            />

            <ContentContainer mb={[3,3,3,3,4]}>
            <HiddenHeader>Pixly Collections</HiddenHeader>

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
                
                {/*<ImageCard item={pixlyselection}
                    src={pixlyselection.coverPoster}
                    text={null}
                    key={pixlyselection.slug}
                    link={`/list/${pixlyselection.slug}/1`}
                    hiddentext={pixlyselection.name}
                    ratio={pixlyselectionSize}
                    width={"100%"}
                    boxShadow="card"
                    hoverShadow
                />}
                {/*<ListCoverBox columns={[1]} ratio={0.41} items={pixlyselection} text={false} />*/}


                <ListCoverBox columns={[1,2,2,2,3,3,3,4]} items={firstPart} />

                <ListBoardAd />


            </ContentContainer>
            {!authStatus && <JoinBanner />}
            
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