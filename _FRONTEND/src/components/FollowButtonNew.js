import React from 'react'
import { FOLLOW_MUTATION } from "../functions/mutations";
import { useState } from 'react';
import {  Mutation } from "react-apollo";
import { Button } from 'semantic-ui-react'
import { followObjectFinder } from "../functions/lib"
import  { print } from "../functions/lib"

const FollowButton = (props) =>{
    const { item, object } = props;
    const [follow, setFollow] = useState(item.isFollowed);
    // follow object fot return data for mutation: person, liste, topic
    const followObject =  followObjectFinder(object);
    const queryVariables = () =>{
        if (object.startsWith("u") && item.username){
            return {obj:object, username: item.username}
        } else {
            return { id:item.id, obj:object}
        }
    }

    return(
        <Mutation mutation={FOLLOW_MUTATION} 
            variables={queryVariables()} 
            onCompleted={(data) => (setFollow(data.follow[followObject]["isFollowed"]))}
                >
            {
                mutation => (
                    <button 
                        style={{fontSize:14, border:"1px solid white", textAlign:"center", width:100,  borderRadius:8, backgroundColor:"transparent", color:"white"}}
                        size="tiny"
                        onClick={mutation}
                        className="click color-light pad-2x"
                        title="Follow and get notifications when new media was added to this item."
                        >
                        {follow ? "Following" : "Follow"}
                    </button>
                )
            }
        </Mutation>
    );
};

export default FollowButton;