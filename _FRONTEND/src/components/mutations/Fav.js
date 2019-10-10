/* eslint-disable */
import React from 'react'
import { FAV_MUTATION } from "../../functions/mutations";
import {  Mutation } from "react-apollo";
import {  refetchMe } from "../../functions/requests";

/*
!!!!   Default type is movie, declare video if object is a video
*/
const Fav = (props) =>{
    const { id, switcher, type="movie" } = props;
    return(
        <Mutation 
            mutation={FAV_MUTATION} 
            variables={{ id, type}} 
            onCompleted={(data) => switcher(data.fav[type].isFaved) }>
            {mutation => (
                <div className="mut-container" 
                    onClick={() => mutation(refetchMe)}  style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                    {props.children}
                </div>

            )}
        </Mutation>
    );
}

export default Fav;