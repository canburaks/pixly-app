import React, { useState } from "react";
import { Pagination } from 'semantic-ui-react'
import  { print } from "../functions/lib"
import { withRouter } from 'react-router-dom'


const Paginator = (props) =>{
    const { ratio } = props;
    //print("paginator", props)
    const [ activePage , setActivePage ] = useState(props.match.params.page);

    //const change = (e) => props.handlePaginationChange(e,{activePage})
    const styles = {
        marginTop:20,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        paddingBottom:40
    }
/*
    const handlePaginationChange = (e, { activePage }) => {
        setActivePage(activePage)
        const path = props.match.path

        if (props.match.params.id){
            const newPath = `${props.match.params.id}/${activePage}`; 
            props.history.push(path.replace(":id/:page",newPath))
        }
    }
*/
const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage)
    const path = props.match.path
    const urlSplitted = props.match.url.split("/")
    const  newUrl = urlSplitted.slice(0,-1).join("/") + "/" + activePage.toString()
    props.history.push(newUrl)
}
    return (
        <div style={styles}>
            <Pagination inverted className="pagination-item"
                activePage={activePage}
                totalPages={Math.ceil(ratio)}
                onPageChange={handlePaginationChange}
                ellipsisItem={null}
                prevItem={(activePage === "1") ? null : "Previous"}
                nextItem={(activePage === Math.ceil(ratio).toString())
                    ? null : "  Next  "}
            />
        </div>
    );
}

export default withRouter(Paginator);