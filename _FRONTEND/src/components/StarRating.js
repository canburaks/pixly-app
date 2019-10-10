import React from 'react'
import { RATING_MUTATION } from "../functions/mutations";
import { useState } from 'react';
import {  Mutation } from "react-apollo";
import ReactStars from 'react-stars'



const StarRating = (props) =>{
    const id = props.id ? props.id : props.item.id
    const rating = props.rating ? props.rating : (props.item ? props.item.viewerRating : null);
    const size = props.size ? props.size : 24;
    const styles = props.styles ? props.styles : { display:"flex", justifyContent:"center", width:"100%", height:"auto", alignItems:"center"};

    const [newRate, setRate] = useState(rating);
    return(

        <Mutation mutation={RATING_MUTATION}
            variables={{ id, rate:parseFloat(newRate)}}
            onCompleted={(data) => setRate(data.rating.movie.viewerRating)}
            >
            {mutation =>(
                <div style={styles}>
                    <ReactStars half
                        className="rating-container"
                        edit={!props.disabled}
                        color1={props.color1 ? props.color1 : "#ffffff"}
                        size={size}
                        value={parseFloat(newRate)}  
                        onChange={async(value) =>(
                            await setRate(value),
                            mutation()
                        )}
                    />
                </div>
            )}
        </Mutation>
    );
}

export default StarRating;
