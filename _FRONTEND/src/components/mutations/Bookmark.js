import React from 'react'
import { BOOKMARK_MUTATION } from "../../functions/mutations";
import {  Mutation } from "react-apollo";
import {  refetchMe } from "../../functions/requests";

const Bookmark = (props) =>{
    const { id,  switcher } = props;

    return(
        <Mutation 
            mutation={BOOKMARK_MUTATION} 
            variables={{ id }} 
            onCompleted={(data) =>(switcher(data.bookmark.movie.isBookmarked)) }>
            {mutation => (
                <div className="mut-container"  
                    onClick={() => mutation(refetchMe)} style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    {props.children}
                </div>

            )}
        </Mutation>
    );
};

export default Bookmark;