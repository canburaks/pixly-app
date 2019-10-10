import React  from "react";
import { useState, useContext } from "react"
import { withRouter, Link } from "react-router-dom";

import MosaicPoster from "../../components/MosaicPoster"

import { useWindowSize, useAuthCheck } from "../../functions/hooks"
import { authCheck, print } from "../../functions/lib"
import { Grid, Row, Col } from 'react-flexbox-grid';
import { rgaPageView, Head, ListBoardAd  } from "../../functions/analytics"
import { Menu, Segment } from 'semantic-ui-react'
import { GridBox, GridItem } from "../../components/GridBox" 

import "./ListsBoard.css"
import { GlobalContext } from "../../App";
import JoinBanner from "../../components/JoinBanner.js"




//const collage = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/imdb-collage-s.jpg"
const collage = "https://cbs-static.s3.eu-west-2.amazonaws.com/static/images/background/black-bg.jpg"


const ListBoard = (props) => {
    const item = props.liste
    rgaPageView()
    const authStatus = useAuthCheck();

    const [listType, setListType] = useState("df")
    const state = useContext(GlobalContext);
    const screenSize = useWindowSize()
    
    if (props.viewer){
        state.methods.updatePoints(props.viewer.points)
    }
    const directorsFavourite = item.filter( l => l.listType==="df")
    const festivalWinners = item.filter(l => l.listType === "fw")
    const genreRelated = item.filter(l => l.listType === "gr")
    const otherLists = item.filter(l => l.listType === "ms")

    //console.log(item)

    const ListMosaicTemplate = ({item, clsnm}) => (
        <div  title={item.name}>
            <MosaicPoster item={item} id={item.id} />
            <div className="mar-t-x pad-3x">
                <p className="card-primary-text hover-child-t-color" style={{fontWeight:600}}>{item.name}</p>
                <p className="card-secondary-text" >by <span className="t-bold">pixly</span></p>
            </div>
        </div>
    )
    const ListTypeSelect= (type) =>{
        if(listType!==type){
            setListType(type)
        }
    }

    const SelectedLists = ({type}) =>{
        if (type==="df"){
            return(
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-t-5x">
                    <div className="list-type-header fbox-c pad-bt-4x bor-b-w1 w100">
                        <h6 className="primary-text">
                        DIRECTOR'S FAVOURITE LIST
                        </h6>
                        <p className="t-s">Favourite movies of famous directors.</p>
                    </div>
                    <GridBox size="m">
                    {directorsFavourite.map(list => (
                        <GridItem 
                            key={list.id}
                            className="box-shadow bor-rad-2x shadow"
                            title={list.name}
                            
                        >
                            <Link to={`/list/${list.slug}/1`}>
                                <img className="bor-rad-2x lazyload mw100"
                                    src={list.relatedPersons[0].poster}
                                    />
                            </Link>
                            <Link to={`/list/${list.slug}/1`}>
                                <p className="t-s t-color-dark t-bold">{list.name}</p>
                            </Link>
                            <Link to={`/person/${list.relatedPersons[0].slug}`}>
                                <p className="t-xs t-color-dark t-italic hover-t-underline  t-left">
                                    {list.relatedPersons[0].name}
                                </p>
                            </Link>
                        </GridItem>
                        ))}
                    </GridBox>
                </Col>
            )
        }
        else if (type === "fw") {
            return (
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-t-5x">
                    <div className="list-type-header fbox-c pad-bt-4x bor-b-w1 w100">
                        <h6 className="primary-text">
                            FESTIVAL WINNERS
                        </h6>
                        <p className="t-s">These lists are grouped with specific movie festivals</p>
                    </div>

                    
                    <div className="fbox-r jcfs aic fw list-mosaic-items-container">
                        
                        {festivalWinners.map((ls, i) => (
                            <div className="list-mosaic-item-container" key={"fw" + i + ls.name}>
                                <ListMosaicTemplate item={ls} />
                            </div>
                        ))}
                    </div>
                </Col>
            )
        }
        else if(type === "gr"){
            return(
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs aifs mar-t-5x">
                    <div className="list-type-header fbox-c pad-bt-4x bor-b-w1 w100">
                        <h6 className="primary-text">
                            GENRE LISTS
                        </h6>
                        <p className="t-s">These opinionated lists are grouped with respect to their contents, and are prepared by us. </p>
                    </div>
                    <div className="fbox-r jcfs aic fw list-mosaic-items-container">
                        {genreRelated.map((ls, i) => (
                            <div className="list-mosaic-item-container" key={"gl" + i + ls.name}>
                                <ListMosaicTemplate item={ls} />
                            </div>
                        ))}
                    </div>
                </Col>
            )
        }
        else if( type === "ms"){
            return(
                <Col xs={12} md={12} lg={12} className="fbox-c jcfs mar-t-5x">
                    <div className="list-type-header fbox-c pad-bt-4x bor-b-w1 w100">
                        <h6 className="primary-text">
                            VARIOUS LISTS
                        </h6>
                        <p className="t-s">These lists are formed by well known movies. If you need to rate movies to get recommendation,
                        starting from here can be good point
                        </p>
                    </div>
                    <div className="fbox-r jcfs aic fw">
                        {otherLists.map((ls, i) => (
                            <div className="list-mosaic-item-container" key={i + ls.name} >
                                <ListMosaicTemplate item={ls} key={i + ls.name} />
                            </div>
                        ))}
                    </div>
                </Col>
            )
        }
    }

    return (
        <div className="page-container">
            <Head
                description={"Various movie lists. Favourite movies of famous directors, Festival winner movies and genre related movies."}
                title={"Pixly Collections"}
                canonical={`https://pixly.app/collections`}
            />
            {!authStatus && 
                <JoinBanner >
                   <Menu pointing secondary inverted 
                   style={{margin:0, width: "100%", display: "flex", zIndex: 3, justifyContent: "center", backgroundColor: "rgba(40, 40, 40, 0.0)" }}>
                        <Menu.Item
                            name="Directors"
                            active={listType === 'df'}
                            onClick={() => ListTypeSelect("df")}
                        />

                        <Menu.Item
                            name='Festivals'
                            active={listType === 'fw'}
                            onClick={() => ListTypeSelect("fw")}
                        />
                        <Menu.Item
                            name='Genre'
                            active={listType === 'gr'}
                            onClick={() => ListTypeSelect("gr")}
                        />
                        <Menu.Item
                            name='Miscellaneous'
                            active={listType === 'ms'}
                            onClick={() => ListTypeSelect("ms")}
                        />
                    </Menu>
                </JoinBanner>
            }

            {authStatus && 
                <JoinBanner nobutton nocontent>
                   <Menu pointing secondary inverted style={{margin:0, width: "100%", display: "flex", zIndex: 3, justifyContent: "center", backgroundColor: "transparent", borderColor:"transparent" }}>
                        <Menu.Item
                            name="Directors"
                            active={listType === 'df'}
                            onClick={() => ListTypeSelect("df")}
                        />

                        <Menu.Item
                            name='Festivals'
                            active={listType === 'fw'}
                            onClick={() => ListTypeSelect("fw")}
                        />
                        <Menu.Item
                            name='Genre'
                            active={listType === 'gr'}
                            onClick={() => ListTypeSelect("gr")}
                        />
                        <Menu.Item
                            name='Miscellaneous'
                            active={listType === 'ms'}
                            onClick={() => ListTypeSelect("ms")}
                        />
                    </Menu>
                </JoinBanner>
            }

            <div className="content-container pad-lr-5vw">

                <Row>
                    <SelectedLists type={listType} />
                    <ListBoardAd/>
                    
                </Row>
            </div>
        </div>

    );
};

export default withRouter(ListBoard);


/*

         <div className="collage-box">
                <img className="collage" src={collage} />
                <div className="collage-front">
                    {
                        authStatus
                        ?  <h1 className="header-text pad-t-4x">LISTS</h1>
                        : <div className="anonymous-header">
                            <h1 title="Click and Join"
                                style={{ textDecoration: "none", marginBottom: 10 }}
                                className="click"
                                    onClick={() => state.methods.insertAuthForm("signup")}>
                                <span className="t-xl">JOIN NOW</span>
                            </h1>
                            <ul className="pad-lr-5x">
                                <li className="t-s">Follow Your Favourite Director's best movies </li>
                                <li className="t-s">Follow Festival Winner Movies</li>
                            </ul>
                        </div>
                    }
                    <Menu pointing secondary inverted style={{margin:0, width: "100%", display: "flex", zIndex: 3, justifyContent: "center", backgroundColor: "rgba(40, 40, 40, 0.0)" }}>
                        <Menu.Item
                            name="Directors"
                            active={listType === 'df'}
                            onClick={() => ListTypeSelect("df")}
                        />

                        <Menu.Item
                            name='Festivals'
                            active={listType === 'fw'}
                            onClick={() => ListTypeSelect("fw")}
                        />
                        <Menu.Item
                            name='Genre'
                            active={listType === 'gr'}
                            onClick={() => ListTypeSelect("gr")}
                        />
                        <Menu.Item
                            name='Miscellaneous'
                            active={listType === 'ms'}
                            onClick={() => ListTypeSelect("ms")}
                        />
                    </Menu>
                </div>
                
            </div>
*/