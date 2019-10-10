import React from 'react'
import { FOLLOW_MUTATION } from "../../functions/mutations";
import { useState } from 'react';
import {  Mutation } from "react-apollo";
import { followObjectFinder } from "../../functions/lib"
import  { print } from "../../functions/lib"

const Follow = (props) =>{
    const { item, object, username, valueSetter } = props;
    const [follow, setFollow] = useState(item.isFollowed);
    // follow object fot return data for mutation: person, liste, topic
    const followObject =  followObjectFinder(object);
    const queryVariables = () =>{
        if (object.startsWith("u") && username){
            return {obj:object, username}
        } else {
            return { id:item.id, obj:object}
        }
    }

    return(
        <Mutation mutation={FOLLOW_MUTATION} 
            variables={queryVariables()} 
            onCompleted={data => valueSetter(data.follow.targetProfile.isFollowed)}
                >
            {
                mutation => (
                    <div 
                        onClick={() => mutation()} 
                        style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer"}}
                        >
                    {props.children}
                    </div>

                )
            }
        </Mutation>
    );
};

export default Follow;

/*
 <Mutation mutation={FOLLOW_MUTATION}
            variables={queryVariables()}
            onCompleted={(data) => (setFollow(data.follow[followObject]["isFollowed"],
                print("Follow Mutations",data),valueSetter ? valueSetter(data.follow.targetProfile.isFollowed) : null))}
                >
            {
                mutation => (
                    <div
                        onClick={() => mutation()}
                        style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer"}}
                        >
                    {props.children}
                    </div>

                )
            }
        </Mutation>

                    <div 
                        onClick={() => mutation()} 
                        style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center", cursor:"pointer"}} >
                        {follow ? <p style={{color:"green"}}>Following</p> : "Follow"} {
                            follow 
                                ? <i style={{color:"green", marginLeft:10}} className="fas fa-plus"></i>  
                                : <i style={{color:"grey", marginLeft:10}} className="fas fa-plus"></i>}
                    </div>

                    <Button 
                        basic
                        id="new-follow-button"
                        color={follow ? "yellow" : "grey"}
                        size="tiny"
                        onClick={mutation}
                        className="follow-button-new"
                        title="Follow and get notifications when new media was added to this item."
                        >
                        {follow ? "Following" : "Follow"}
                    </Button>
*/