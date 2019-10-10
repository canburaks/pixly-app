import React from 'react'
import { useState } from 'react';
import { ADD_MOVIE } from "../functions/mutations";

import {  Mutation } from "react-apollo";
import { Button, Icon, Modal, Dropdown} from 'semantic-ui-react'
import CreateListButton from "./CreateListButton";
import { toast } from 'react-toastify';

const AddMovieButton = (props) =>{
    const { lists, item } = props;

    const infoNotify = (text) =>toast.success(text, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        hideProgressBar: true,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false ,
        pauseOnVisibilityChange:true,
        pauseOnHover:true
    })

    return(
        <Mutation mutation={ADD_MOVIE} onCompleted={data => infoNotify(data.addMovie.message)} >
            {
                mutation => (
                    <Dropdown icon={<Icon name="plus" color="black" size="large" /> }>
                        <Dropdown.Menu>
                            {
                                lists.map(liste =>(
                                    <Dropdown.Item 
                                        text={`${liste.name} (${liste.numMovies})`} 
                                        key={liste.id}
                                        onClick={() => (console.log(item.id, liste.id),
                                            mutation({variables:{movieId:item.id, listeId:liste.id}
                                        })
                                        )}
                                        />
                                ))
                            }
                        <Dropdown.Item>
                                <CreateListButton 
                                    styles={{name:"plus", size:"large", color:"teal", text:"Create New List"}}
                                    />
                                
                                </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>              
                
                )
            }
        </Mutation>
    );
}

export default AddMovieButton;