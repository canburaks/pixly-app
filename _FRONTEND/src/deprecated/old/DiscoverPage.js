import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import AnimakitExpander from 'animakit-expander';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Breadcrumb } from 'semantic-ui-react'
import ListSideBar from "../../components/ListSideBar"
import BigMosaicPoster from "../../components/BigMosaicPoster"


const DiscoverPage = (props) =>{
    const { lists } = props;
    window.scrollTo(0, 0);

    const [visibleSideBar, setVisibleSideBar] = useState(false)
    const [SideBarItem, setSideBarItem] = useState([])

    const [showDirectors, setShowDirectors] = useState(false)
    const [showFestivals, setShowFestivals] = useState(false)
    const directorLists = lists.filter(l => l.listType==="DF")
    const uniqueDirectors = [...new Set(lists.map(l => l.relatedPersons[0]))].filter(ud => ud !== undefined && ud !== null)
    const postersDirectors = uniqueDirectors.map(d => d.poster)
    

    function clickHandler(liste){
        setSideBarItem(liste);
        setVisibleSideBar(!visibleSideBar);
    }
    
    const festivalLists = lists.filter(l => l.listType === "FW")
    //console.log("Unique Directors", uniqueDirectors)
    //console.log("FW", festivalLists)
    console.log("Discover Page", props)


    const DirectorComponent = () =>(
        <div className="directorfm-component color-delicate fbox-c jcfs aic pos-r">
            <h2 className="primary-text directorfm-header mar-bt-5x t-bold t-uppercase">Favourite Movies of Famous Directors</h2>
            <button onClick={() => setShowDirectors(!showDirectors)} className={showDirectors ? "noncolour show-button mar-bt-3x" : "colour show-button mar-bt-3x"}>
                {!showDirectors ? "SHOW DIRECTORS" : "HIDE DIRECTORS"}
            </button>
            <Row>
                <Col xs={12} md={12} lg={12}>
                <AnimakitExpander expanded={showDirectors} duration={1000}>
                    <hr/>
                    <div className="fbox-r fw jcsa aic pos-r">
                    {directorLists.map(d =>(
                        <SingleDirector d={d} key={d.id + "asde"}/>
                        ))}
                    </div>
                </AnimakitExpander>
                </Col>
            </Row>
        </div>
    )

    const FestivalComponent = () => (
        <div className="festival-component fbox-c jcfs aic pos-r">
            <h2 className="primary-text festival-header mar-bt-5x t-bold t-uppercase">Let's Deep Dive In Film Festivals</h2>
            <Row>
                <Col xs={12} md={12} lg={12}>
                    <hr />
                    <div className="fbox-r jcfs aic pos-r">
                        {festivalLists.map(f => (
                            <SingleFestival f={f} key={f.id + "asdasd"}/>
                            ))}
                    </div>
                </Col>
            </Row>
        </div>
    )
    const SearchComponent = () => (
        <div className="search-component color-delicate fbox-c jcfs aic pos-r">
            <h2 className="t-bold search-header mar-bt-5x t-bold t-uppercase">Start Searching Movies</h2>
            <Link to={{pathname:"/discover/search/1", state:{prevPath:props.history.location.pathname}}}>
                <button className={showFestivals ? "noncolour show-button mar-bt-3x" : "colour show-button mar-bt-3x"}>
                    ADVANCED SEARCH
                </button>
            </Link>
        </div>
    )
    const BreadcrumbSection = () => (
        <Breadcrumb>
            <Breadcrumb.Section >Discover</Breadcrumb.Section>
            <Breadcrumb.Divider />
        </Breadcrumb>
    )
    const SingleDirector = ({ d }) => {
        return (
            <Col xs={6} md={4} lg={4} className="single-item-grid">
                <Link to={`/lists/${d.id}/1`}>
                    <div className="directorfm-list-component fbox-r jcc aic br5 w100 pos-r zin-1  hover-shadow" key={d.id + "lst"}
                        style={{ backgroundImage: `url(${d.relatedPersons[0].coverPoster})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
                    >
                        <div className="transparent-layer zin-2"></div>
                        <div className="zin-5 h100">
                            <p key="list" className="primary-text flip-text zin-5 h100">{d.name}</p>
                        </div>
                    </div>
                </Link>
            </Col>

        )
    }
    const SingleFestival = ({ f }) => {
        const [key, setKey] = useState("poster")
        return (
            <Col xs={12} md={4} lg={4} className="single-item-grid" onClick={() => clickHandler(f)}>
                    <div className="festival-list-component fbox-c jcfs aic br5 w100" key={f.id + "lst"}>
                        <img key="poster" src={f.poster} className="festival-list-component-poster" />
                        <p key="fname" className="festival-name">{f.name}</p>
                    </div>
                <Link to={`/lists/${f.id}/1`}>
                </Link>
            </Col>

        )
    }

    return(
        <div className="page-container pad20">
            <ListSideBar 
                visible={visibleSideBar} 
                close={() => setVisibleSideBar(false)} 
                content={<BigMosaicPoster data={SideBarItem.imagesAll} column={5} />}
                linkName={`Go to ${SideBarItem.name} List `}
                link={`/lists/${SideBarItem.id}/1`}
            >
                <BreadcrumbSection />

                <FestivalComponent />
                <DirectorComponent />
                <SearchComponent />        
            </ListSideBar>
        </div>
    );
};






export default withRouter(DiscoverPage);