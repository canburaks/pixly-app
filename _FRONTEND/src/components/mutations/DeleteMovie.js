import React,  { useState }  from 'react'
import { REMOVE_MOVIE } from "../../functions/mutations";
import {  Mutation } from "react-apollo";

import  { print } from "../../functions/lib"
import  { refetchList } from "../../functions/requests"



const DeleteMovie = (props) =>{
    const { mutVariables, refMutation } = props;
    //const [myLists,updateLists] = useLocalStorage("LISTS");

    const [error, setError] = useState("");
    const styles = {
        position:"absolute",
        right:-10,
        top:-10,
        zIndex:25,

    }
    return (
        <Mutation
        mutation={REMOVE_MOVIE} 
        variables={mutVariables}
        onError={ error =>  (setError(error.message.split("GraphQL error:")[1]))}
            >
            {
                (mutation) => (
                <div className="mut-container" 
                    style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}
                    onClick={() => mutation(refetchList(mutVariables.listeId))}>
                    {props.children}
                </div>

                )
            }
        </Mutation>
    );
};
export default DeleteMovie;

                    {/*<Icon link
                        size="huge"
                        style={styles}
                        name="remove circle"
                        color="red"
                        onClick={() => mutation(refMutation)}
                    />*/}