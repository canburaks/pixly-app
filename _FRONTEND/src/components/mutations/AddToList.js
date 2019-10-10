import React from 'react'
import { useState } from 'react';
import { ADD_MOVIE } from "../../functions/mutations";

import {  Mutation } from "react-apollo";
import { Dropdown} from 'semantic-ui-react'
import { toast } from 'react-toastify';

import CreateListButton from "./CreateListButton";
//import { useLocalStorage } from "../../functions/hooks"

const AddToList = (props) =>{
    const {  item, refetch, lists} = props;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    //const lists = useLocalStorage() local storage lists
    //const [myLists, updateLists] = useLocal()
    //console.log("add to list", myLists)
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
        <div>
        <Mutation mutation={ADD_MOVIE} 
                onCompleted={data =>(infoNotify(data.addMovie.message))} >
            {
                mutation => (
                    <Dropdown icon={ <i className="fas fa-plus"></i>} direction="left" upward scrolling>
                        <Dropdown.Menu className="dropdown-menu" style={{zIndex:20}}>
                            {
                                lists.map(liste =>(
                                    <Dropdown.Item 
                                        className="dropdown-item-regular"
                                        text={<p>{liste.name.length>10 ? liste.name.slice(0,7)+ "..." : liste.name} <span className="dropdown-item-span">{liste.numMovies}</span></p>} 
                                        key={liste.id}
                                        title={liste.name}
                                        onClick={() => mutation({variables:{movieId:item.id, listeId:liste.id}})}
                                        />
                                ))
                            }
                            <Dropdown.Item 
                                className="dropdown-item-bottom"
                                onClick={() => setModalIsOpen(true)}
                                >CreateList

                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>             
                )
            }
        </Mutation>
        {modalIsOpen && <CreateListButton 
            refetch={refetch}
            styles={{name:"plus", size:"large", color:"teal", text:"Create New List"}}
            isOpen={modalIsOpen}
            switcher={() => setModalIsOpen(!modalIsOpen)}
            /> }
    </div>
    );
}

export default AddToList;