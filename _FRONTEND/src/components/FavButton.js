/* eslint-disable */
import React from 'react'
import { FAV_MUTATION } from "../functions/mutations";
import { useState } from 'react';
import {  Mutation } from "react-apollo";
import { Icon } from 'semantic-ui-react'

const FavButton = (props) =>{
    const { item, size,  type } = props;
    const styles = props.styles ? props.styles : {float:"left"}
    const [isFaved, setFav] = useState(item.isFaved);
    return(
        <Mutation 
            mutation={FAV_MUTATION} 
            variables={{ id:item.id, type}} 
            onCompleted={(data) => (
                console.log(data),
                setFav(data.fav[type].isFaved)
            )}>
            {   mutation => (
                            <Icon 
                                link onClick={mutation}
                                name="like"
                                size={size ? size : "large"}
                                color={isFaved ? "red" : "grey"}
                                style={styles}    
                                />
                )}
        </Mutation>
    );
}

export default FavButton;