import React from "react";
import { useState, useCallback } from "react";
import { withRouter, Link } from "react-router-dom";
import { GridBox, GridItem } from "../components/GridBox" 

const TemplateRaw = ({
    items,
    image="poster",              //key of item
    title="name",       //key of item
    id="id",            //key of item
    size="s",
    cover=true,
    header="",
    history,
    className ="box-shadow bor-rad-2x",
    perPageItems=24,
    linkPrefix="/movie/",
    children,
    ad=null,
    
}) =>{
    const [currentPage, setCurrentPage] = useState(1)
    //console.log("m",movies)
    const totalPageNumber = Math.ceil(items.length / perPageItems)
    const isOverflowed = items.length > perPageItems;

    const willShow = items.slice((currentPage - 1) * perPageItems, currentPage * perPageItems)
    const pagPrev = useCallback(() => (setCurrentPage(currentPage - 1), window.scrollTo({ top: 100, left: 0, behavior: 'smooth' })))
    const pagNext = useCallback(() => (setCurrentPage(currentPage + 1), window.scrollTo({ top: 100, left: 0, behavior: 'smooth' })))

    return (
        <div className="template pad-lr-4x">
            {header.length > 0 && <h4 className="t-xl t-bold mar-b-2x">{header}</h4>}
            <GridBox size={size}>
                {/* GRID */}
                {willShow.map((item) => (
                    <Link rel="nofollow" to={`/movie/${item.slug}`} key={item.id} >
                    <GridItem 
                        cover={cover}
                        title={item[title]}
                        key={item[id]} text={item[title]}
                        className={className}
                        image={image ? item[image] : null}
                        >
                        {children}
                    </GridItem>
                </Link>
                ))}
            </GridBox>
            {ad && ad}
            {/*PAGINATION */}
            {isOverflowed &&
                <div className="fbox-r jcc aic pag">
                    {currentPage > 1 &&
                        <div className="pag-item click t-bold  t-color-dark t-center click hover-t-underline"
                            onClick={pagPrev}>
                            {"< Previous"}
                        </div>
                    }
                    <div className="pag-item t-bold  t-color-dark t-center t-underline" >
                        {currentPage}
                    </div>
                    {(currentPage < totalPageNumber) &&
                        <div className="pag-item t-bold  t-color-dark t-center click hover-t-underline"
                            onClick={pagNext} >
                            Next >
                        </div>
                    }
                </div>
            }
        </div>
    )
}

const ProfileTemplateRaw = ({
    items,
    title = "username",       //key of item
    id = "username",            //key of item
    size = "s",
    header = "",
    history,
    className = "circle",
    perPageItems = 24,
    linkPrefix = "/user/",
    ad=null,
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    //console.log("m",movies)
    const totalPageNumber = Math.ceil(items.length / perPageItems)
    const isOverflowed = items.length > perPageItems;

    const willShow = items.slice((currentPage - 1) * perPageItems, currentPage * perPageItems)
    const pagPrev = () => (setCurrentPage(currentPage - 1), window.scrollTo({ top: 100, left: 0, behavior: 'smooth' }))
    const pagNext = () => (setCurrentPage(currentPage + 1), window.scrollTo({ top: 100, left: 0, behavior: 'smooth' }))
    const go = (id) => history.push(`${linkPrefix}${id}`)

    return (
        <div className="template pad-lr-4x">
            {header.length > 0 && <h4 className="t-l t-bold mar-b-2x">{header}</h4>}
            <GridBox size={size}>
                {/* GRID */}
                {willShow.map((item) => (
                    <GridItem
                        title={item[title]}
                        key={item[id]}
                        className={className}
                    >
                        <img src={item.avatar} title={item.username} alt={item.username} onClick={() => go(item[id])}/>
                        <p className="t-xs">{item.username}</p>
                    </GridItem>
                ))}
            </GridBox>
            {ad && ad}

            {/*PAGINATION */}
            {isOverflowed &&
                <div className="fbox-r jcc aic pag">
                    {currentPage > 1 &&
                        <div className="pag-item click t-bold  t-color-dark t-center click hover-t-underline"
                            onClick={pagPrev}>
                            {"< Previous"}
                        </div>
                    }
                    <div className="pag-item t-bold  t-color-dark t-center t-underline" >
                        {currentPage}
                    </div>
                    {(currentPage < totalPageNumber) &&
                        <div className="pag-item t-bold  t-color-dark t-center click hover-t-underline"
                            onClick={pagNext} >
                            Next >
                        </div>
                    }
                </div>
            }
        </div>
    )
}


export const Template = withRouter(TemplateRaw);
export const MovieTemplate = withRouter(React.memo(TemplateRaw));
export const ProfileTemplate = withRouter(React.memo(ProfileTemplateRaw));